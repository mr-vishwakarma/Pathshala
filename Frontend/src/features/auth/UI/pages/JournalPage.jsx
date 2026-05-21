import { useCallback, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaPlay, FaPause, FaStop, FaClock, FaFire, FaBookOpen, FaUndo, FaSave } from "react-icons/fa";
import api from "../../../../shared/services/api";

const defaultFormData = {
  topicName: "",
  description: "",
  studyDuration: "",
  difficultyLevel: "Easy",
};

const JournalPage = () => {
  // Timer States
  const [focusTopic, setFocusTopic] = useState("");
  const [duration, setDuration] = useState(20); // default 20 minutes
  const [customDuration, setCustomDuration] = useState("");
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [upNextBreak, setUpNextBreak] = useState(true);

  // Manual Form States
  const [formData, setFormData] = useState(defaultFormData);
  const [loading, setLoading] = useState(false);

  // Focus Stats State
  const [stats, setStats] = useState({
    todayHours: 0,
    todayMinutes: 0,
    yesterdayHours: 0,
    streak: 0,
    dailyGoalHours: 3.0,
  });

  const timerRef = useRef(null);

  // Load Focus Stats
  const loadFocusStats = useCallback(async () => {
    try {
      const response = await api.get("/focus/stats");
      setStats(response.data);
    } catch (error) {
      console.log("Failed to load focus stats", error);
    }
  }, []);

  useEffect(() => {
    loadFocusStats();
  }, [loadFocusStats]);

  // Audio completion sound using Web Audio API
  const playCompletionSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // First high chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.8);

      // Second harmonizing chime shortly after
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        gain2.gain.setValueAtTime(0.2, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
        osc2.start();
        osc2.stop(ctx.currentTime + 1.0);
      }, 150);
    } catch (e) {
      console.log("Web Audio not supported or allowed", e);
    }
  };

  // Timer Tick Mechanism
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused]);

  // Handler for timer completion
  const handleTimerComplete = async () => {
    setIsActive(false);
    playCompletionSound();
    toast.success("Congratulations! You completed your Focus Session!", { duration: 6000 });

    const finalSessionId = currentSessionId;
    setCurrentSessionId(null);

    // Call backend completion route
    if (finalSessionId) {
      try {
        const response = await api.put(`/focus/complete/${finalSessionId}`, {
          description: `Completed focus session on ${focusTopic || "unspecified topic"}.`,
          difficultyLevel: "Medium",
        });
        toast.success("Focus session successfully synced to learning journal!");
        
        // Auto-fill manual form with session details to allow customization or additions
        const decimalHours = parseFloat((duration / 60).toFixed(2));
        setFormData({
          topicName: focusTopic || "Focus Session",
          description: `Successfully focused for ${duration} minutes on ${focusTopic || "unspecified topic"}.`,
          studyDuration: decimalHours,
          difficultyLevel: "Medium",
        });

        loadFocusStats();
      } catch (error) {
        toast.error("Failed to sync completed focus session to database.");
      }
    } else {
      // Offline / fallback pre-fill
      const decimalHours = parseFloat((duration / 60).toFixed(2));
      setFormData({
        topicName: focusTopic || "Focus Session",
        description: `Successfully completed a focus session of ${duration} minutes.`,
        studyDuration: decimalHours,
        difficultyLevel: "Medium",
      });
    }
  };

  // Start Focus Session
  const handleStart = async () => {
    if (!focusTopic.trim()) {
      toast.error("Please enter a focus topic name first!");
      return;
    }

    try {
      const response = await api.post("/focus/start", {
        topicName: focusTopic,
        duration: duration,
      });
      setCurrentSessionId(response.data.session._id);
      setIsActive(true);
      setIsPaused(false);
      toast.success(`Focus session started: ${duration} minutes`);
    } catch (error) {
      console.log(error);
      // Fallback to offline local timer if API fails
      setIsActive(true);
      setIsPaused(false);
      toast.success(`Focus session started locally: ${duration} minutes`);
    }
  };

  // Pause Timer
  const handlePause = () => {
    setIsPaused(true);
    toast.success("Focus timer paused");
  };

  // Resume Timer
  const handleResume = () => {
    setIsPaused(false);
    toast.success("Focus timer resumed");
  };

  // Stop / Reset Timer
  const handleStop = () => {
    if (window.confirm("Are you sure you want to cancel the focus session? Progress won't be saved.")) {
      setIsActive(false);
      setIsPaused(false);
      setCurrentSessionId(null);
      setTimeLeft(duration * 60);
      toast.error("Focus session cancelled");
    }
  };

  // Change Focus Duration Preset
  const handleDurationSelect = (mins) => {
    if (isActive) {
      if (!window.confirm("Changing duration will stop the current session. Proceed?")) {
        return;
      }
    }
    setDuration(mins);
    setCustomDuration("");
    setTimeLeft(mins * 60);
    setIsActive(false);
    setIsPaused(false);
    setCurrentSessionId(null);
  };

  // Handle Custom Duration Submit
  const handleCustomDurationSubmit = (e) => {
    e.preventDefault();
    const mins = parseInt(customDuration);
    if (!mins || mins <= 0 || mins > 180) {
      toast.error("Please enter a valid duration between 1 and 180 minutes.");
      return;
    }
    handleDurationSelect(mins);
  };

  // Handle Manual Form Submission
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const { topicName, description, studyDuration, difficultyLevel } = formData;

    if (!topicName || !description || !studyDuration || !difficultyLevel) {
      toast.error("Please fill in all manual entry fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/journal/add", formData);
      toast.success(response.data.message);
      setFormData(defaultFormData);
      loadFocusStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Formatting remaining seconds into MM:SS
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate circular SVG parameters
  const totalSeconds = duration * 60;
  const percentage = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Daily goal SVG gauge parameter
  const goalMinutes = stats.dailyGoalHours * 60;
  const completedMinutes = stats.todayMinutes || 0;
  const goalPercentage = Math.min((completedMinutes / goalMinutes) * 100, 100);
  const goalRadius = 45;
  const goalCircumference = 2 * Math.PI * goalRadius;
  const goalStrokeDashoffset = goalCircumference - (goalPercentage / 100) * goalCircumference;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--purple)" }}>
          Learning Workspace
        </h1>
        <p className="mt-1 text-xs md:text-sm" style={{ color: "var(--text-secondary)" }}>
          Log manual activities or deep-focus with our responsive Microsoft Focus Session circular clock.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        
        {/* LEFT COLUMN: Pomodoro Focus Clock (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="card p-5 md:p-6 flex flex-col items-center justify-between text-center relative overflow-hidden h-full min-h-[480px]">
            
            {/* Header info */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[rgba(106,76,147,0.15)] text-[var(--purple)]">
                Focus period
              </span>
              {upNextBreak && (
                <span className="text-[10px] sm:text-xs text-[var(--text-secondary)] italic">
                  Up next: 5 min break
                </span>
              )}
            </div>

            {/* Focus Topic Input */}
            <div className="w-full mb-6">
              <input
                type="text"
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                placeholder="What topic are you focusing on?"
                disabled={isActive}
                className="input-field w-full text-center text-sm md:text-base font-semibold"
                style={{
                  border: "1px solid var(--border-color)",
                  background: isActive ? "rgba(0,0,0,0.05)" : "var(--bg-card-hover)",
                  cursor: isActive ? "not-allowed" : "text",
                }}
              />
            </div>

            {/* Circular SVG Timer */}
            <div className="relative flex items-center justify-center w-52 h-52 sm:w-56 sm:h-56 my-2">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background track circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  fill="transparent"
                  stroke="var(--border-color)"
                  strokeWidth="8"
                  className="opacity-40"
                />
                {/* Progress indicator circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  fill="transparent"
                  stroke="var(--purple)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                  style={{
                    filter: isActive && !isPaused ? "drop-shadow(0px 0px 6px var(--purple))" : "none",
                  }}
                />
              </svg>

              {/* Time readout */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1 opacity-70" style={{ color: "var(--text-secondary)" }}>
                  {isPaused ? "Paused" : isActive ? "Focusing" : "Preset"}
                </span>
              </div>
            </div>

            {/* Play/Pause/Stop controls */}
            <div className="flex items-center gap-4 mt-6">
              {!isActive ? (
                <button
                  type="button"
                  onClick={handleStart}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--purple)] text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                  title="Start focus timer"
                >
                  <FaPlay size={16} />
                </button>
              ) : (
                <>
                  {isPaused ? (
                    <button
                      type="button"
                      onClick={handleResume}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--blue)] text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                      title="Resume focus session"
                    >
                      <FaPlay size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePause}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                      title="Pause focus session"
                    >
                      <FaPause size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleStop}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white shadow hover:scale-105 active:scale-95 transition-all duration-200"
                    title="Stop focus session"
                  >
                    <FaStop size={14} />
                  </button>
                </>
              )}
            </div>

            {/* Presets List */}
            <div className="w-full mt-6 pt-4 border-t border-[var(--border-color)]">
              <p className="text-xs mb-2 font-semibold" style={{ color: "var(--text-secondary)" }}>
                Select duration preset
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[10, 20, 25, 50].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleDurationSelect(mins)}
                    disabled={isActive && currentSessionId}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      duration === mins && !customDuration
                        ? "bg-[var(--purple)] text-white shadow"
                        : "bg-[var(--bg-card-hover)] hover:bg-[rgba(106,76,147,0.1)] border border-[var(--border-color)]"
                    }`}
                    style={{
                      color: duration === mins && !customDuration ? "white" : "var(--text-primary)",
                      cursor: isActive && currentSessionId ? "not-allowed" : "pointer",
                      opacity: isActive && currentSessionId ? 0.6 : 1,
                    }}
                  >
                    {mins} min
                  </button>
                ))}
              </div>

              {/* Custom Minutes Input */}
              <form onSubmit={handleCustomDurationSubmit} className="flex items-center gap-2 mt-3 justify-center">
                <input
                  type="number"
                  placeholder="Custom min"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  disabled={isActive}
                  className="input-field px-2.5 py-1 text-xs max-w-[90px] text-center"
                />
                <button
                  type="submit"
                  disabled={isActive}
                  className="btn px-2.5 py-1 text-[10px] uppercase font-bold"
                  style={{
                    background: "rgba(106,76,147,0.1)",
                    color: "var(--purple)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  Set
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Daily Progress Widget + Manual Logger (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Daily progress widget */}
          <div className="card p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            
            {/* Numeric Indicators */}
            <div className="flex-1 w-full space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
                <h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  Daily focus progress
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                  <FaFire className="animate-bounce" />
                  <span>{stats.streak} day streak</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Yesterday
                  </p>
                  <p className="text-2xl font-extrabold mt-1" style={{ color: "var(--text-primary)" }}>
                    {stats.yesterdayHours}h
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                    study logged
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Today Completed
                  </p>
                  <p className="text-2xl font-extrabold mt-1" style={{ color: "var(--purple)" }}>
                    {stats.todayMinutes} min
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                    {stats.todayHours} hours total
                  </p>
                </div>
              </div>
            </div>

            {/* Circular Gauge for Goal */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-[var(--bg-card-hover)] border border-[var(--border-color)] min-w-[140px]">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r={goalRadius}
                    fill="transparent"
                    stroke="var(--border-color)"
                    strokeWidth="6"
                    className="opacity-40"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r={goalRadius}
                    fill="transparent"
                    stroke="#10b981" // vibrant emerald
                    strokeWidth="6"
                    strokeDasharray={goalCircumference}
                    strokeDashoffset={goalStrokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-extrabold" style={{ color: "var(--text-primary)" }}>
                    {stats.todayHours}h
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold opacity-75" style={{ color: "var(--text-secondary)" }}>
                    Goal {stats.dailyGoalHours}h
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-bold text-emerald-500 mt-1.5">
                {Math.round(goalPercentage)}% completed
              </div>
            </div>

          </div>

          {/* Manual Logger Card */}
          <div className="card p-5 md:p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-[var(--border-color)] pb-2.5">
                <h2 className="text-base md:text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <FaBookOpen size={16} className="text-[var(--purple)]" />
                  <span>Add Journal Entry</span>
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-card-hover)] border border-[var(--border-color)] font-semibold text-[var(--text-secondary)]">
                  Manual Logger
                </span>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Topic Name
                  </label>
                  <input
                    type="text"
                    name="topicName"
                    value={formData.topicName}
                    onChange={handleFormChange}
                    placeholder="Enter topic name..."
                    className="input-field text-sm md:text-base w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    What did you learn?
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Describe your learning session, key findings or resources used..."
                    rows="3"
                    className="input-field resize-none text-sm md:text-base w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Study Duration (hours)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="studyDuration"
                      value={formData.studyDuration}
                      onChange={handleFormChange}
                      placeholder="e.g. 0.5 (for 30m), 2"
                      className="input-field text-sm md:text-base w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Difficulty Level
                    </label>
                    <select
                      name="difficultyLevel"
                      value={formData.difficultyLevel}
                      onChange={handleFormChange}
                      className="input-field text-sm md:text-base w-full"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-blue text-sm md:text-base font-bold flex items-center gap-2 px-5"
                  >
                    <FaSave />
                    <span>{loading ? "Saving..." : "Save Log Entry"}</span>
                  </button>
                  {formData.topicName && (
                    <button
                      type="button"
                      onClick={() => setFormData(defaultFormData)}
                      className="btn text-sm font-semibold flex items-center gap-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <FaUndo size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default JournalPage;
