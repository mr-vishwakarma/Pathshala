import { useEffect, useState, useCallback } from "react";
import { FaLayerGroup, FaClock, FaChartLine, FaListUl, FaExpandAlt, FaTimes, FaSearch, FaBookOpen, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import StatsCard from "../components/StatsCard";
import api from "../../../../shared/services/api";
import Modal from "../../../../shared/components/Modal";
import JournalForm from "./journal/JournalForm";
import toast from "react-hot-toast";

const defaultPagination = {
  page: 1,
  limit: 6,
  totalEntries: 0,
  totalPages: 1,
};

const defaultFormData = {
  topicName: "",
  description: "",
  studyDuration: "",
  difficultyLevel: "Easy",
};

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fullscreen overlay states
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayEntries, setOverlayEntries] = useState([]);
  const [overlaySearchText, setOverlaySearchText] = useState("");
  const [overlayDifficulty, setOverlayDifficulty] = useState("");
  const [overlayPage, setOverlayPage] = useState(1);
  const [overlayPagination, setOverlayPagination] = useState(defaultPagination);
  const [overlayLoading, setOverlayLoading] = useState(false);

  // Edit / Delete inside overlay states
  const [entryToEdit, setEntryToEdit] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState(defaultFormData);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch standard dashboard data
  const loadDashboardData = useCallback(() => {
    setLoading(true);
    api
      .get("/dashboard/stats")
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Load entries specifically for the overlay search and filters
  const loadOverlayEntries = useCallback(async (page = overlayPage) => {
    try {
      setOverlayLoading(true);
      const params = new URLSearchParams({
        topic: overlaySearchText,
        page: String(page),
        limit: String(defaultPagination.limit),
      });

      if (overlayDifficulty) {
        params.set("difficulty", overlayDifficulty);
      }

      const response = await api.get(`/journal/search/filter?${params.toString()}`);
      
      if (Array.isArray(response.data)) {
        setOverlayEntries(response.data);
        setOverlayPagination({
          page: 1,
          limit: defaultPagination.limit,
          totalEntries: response.data.length,
          totalPages: 1,
        });
      } else {
        setOverlayEntries(response.data.entries || []);
        setOverlayPagination({
          ...defaultPagination,
          ...response.data.pagination,
          page: Number(response.data.pagination?.page) || page,
        });
      }
    } catch (error) {
      console.log("Failed to load overlay entries", error);
      toast.error("Failed to load full analytics data.");
    } finally {
      setOverlayLoading(false);
    }
  }, [overlaySearchText, overlayDifficulty, overlayPage]);

  // Sync entries inside overlay whenever search, filter, or page triggers
  useEffect(() => {
    if (isOverlayOpen) {
      const timeout = setTimeout(() => {
        loadOverlayEntries(overlayPage);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOverlayOpen, overlaySearchText, overlayDifficulty, overlayPage, loadOverlayEntries]);

  // Handle Edit submission inside overlay
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!entryToEdit) return;

    try {
      setEditLoading(true);
      const response = await api.put(`/journal/edit/${entryToEdit._id}`, editFormData);
      toast.success(response.data.message);
      setEntryToEdit(null);
      setEditFormData(defaultFormData);
      
      // Reload both dashboards
      loadOverlayEntries();
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to edit entry.");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Delete inside overlay
  const handleDeleteSubmit = async () => {
    if (!entryToDelete) return;

    try {
      const response = await api.delete(`/journal/delete/${entryToDelete._id}`);
      toast.success(response.data.message);
      setEntryToDelete(null);
      
      // Reload both dashboards
      loadOverlayEntries();
      loadDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete entry.");
    }
  };

  const openEditModal = (entry) => {
    setEntryToEdit(entry);
    setEditFormData({
      topicName: entry.topicName,
      description: entry.description,
      studyDuration: entry.studyDuration,
      difficultyLevel: entry.difficultyLevel,
    });
  };

  const getDifficultyBadge = (level) => {
    if (level === "Easy") return "badge badge-easy";
    if (level === "Medium") return "badge badge-medium";
    return "badge badge-hard";
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-32 md:h-36 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            <StatsCard
              title="Total Entries"
              value={dashboardData?.totalEntries}
              subtitle="Learning records"
              icon={FaLayerGroup}
              color="#1982C4"
            />

            <StatsCard
              title="Study Hours"
              value={`${dashboardData?.totalStudyHours}h`}
              subtitle="Total study time"
              icon={FaClock}
              color="#8AC926"
            />

            <StatsCard
              title="Productivity"
              value={dashboardData?.productivityLevel}
              subtitle="Current performance"
              icon={FaChartLine}
              color="#FFCA3A"
            />

            <StatsCard
              title="Recent Entries"
              value={dashboardData?.recentEntries?.length}
              subtitle="Latest activities"
              icon={FaListUl}
              color="#6A4C93"
            />
          </div>

          {/* Productivity & Recent Entries Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            
            {/* Productivity Summary Card */}
            <div className="card p-5 md:p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-base md:text-xl font-bold mb-4 border-b border-[var(--border-color)] pb-2.5" style={{ color: "var(--text-primary)" }}>
                  Productivity Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
                      Total Entries Logged
                    </p>
                    <span className="font-extrabold text-sm md:text-lg" style={{ color: "var(--text-primary)" }}>
                      {dashboardData?.totalEntries}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
                      Total Study Duration
                    </p>
                    <span className="font-extrabold text-sm md:text-lg" style={{ color: "var(--text-primary)" }}>
                      {dashboardData?.totalStudyHours}h
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
                      Average Productivity Status
                    </p>
                    <span className="font-extrabold text-sm md:text-lg text-[var(--blue)]">
                      {dashboardData?.productivityLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Entries Card with Maximize Expander */}
            <div className="card p-5 md:p-6 relative">
              <div className="flex items-center justify-between mb-4 border-b border-[var(--border-color)] pb-2.5">
                <h2 className="text-base md:text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                  Recent Entries
                </h2>
                
                {/* Maximize Button */}
                <button
                  type="button"
                  onClick={() => setIsOverlayOpen(true)}
                  className="p-2 rounded-xl transition-all duration-200 bg-[var(--bg-card-hover)] hover:bg-[rgba(106,76,147,0.15)] hover:scale-105"
                  style={{ color: "var(--purple)", border: "1px solid var(--border-color)" }}
                  title="View full-screen journal analytics"
                >
                  <FaExpandAlt size={13} />
                </button>
              </div>

              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {dashboardData?.recentEntries && dashboardData.recentEntries.length > 0 ? (
                  dashboardData.recentEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="rounded-xl p-3.5 transition-all duration-200 border border-[var(--border-color)] bg-[var(--bg-card-hover)] hover:translate-x-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-xs sm:text-sm md:text-base truncate flex-1" style={{ color: "var(--text-primary)" }}>
                          {entry.topicName}
                        </h3>

                        <span className={`${getDifficultyBadge(entry.difficultyLevel)} text-[9px] sm:text-xs px-2 py-0.5`}>
                          {entry.difficultyLevel}
                        </span>
                      </div>

                      <p className="text-[10px] sm:text-xs mt-1.5 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                        <FaClock size={11} className="text-[var(--purple)]" />
                        <span>{entry.studyDuration}h studied</span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center py-6" style={{ color: "var(--text-secondary)" }}>
                    No recent journal entries. Log a focus session or write one manually!
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* HIGH FIDELITY FULLSCREEN ANALYTICS OVERLAY (MODAL) */}
          {isOverlayOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden bg-black/60 backdrop-blur-md animate-fade-in">
              <div className="w-full h-full max-w-6xl rounded-3xl p-5 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl relative bg-[var(--bg-card)] border border-[var(--border-color)]">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4 mb-5">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2" style={{ color: "var(--purple)" }}>
                      <FaListUl />
                      <span>Learning Analytics Dashboard</span>
                    </h1>
                    <p className="text-xs md:text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      Search, sort, filter, or edit your complete history of study records.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOverlayOpen(false)}
                    className="p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-red-500"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
                  {/* Search Bar */}
                  <div className="md:col-span-8 relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }}>
                      <FaSearch size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search learning topics..."
                      value={overlaySearchText}
                      onChange={(e) => {
                        setOverlaySearchText(e.target.value);
                        setOverlayPage(1);
                      }}
                      className="input-field pl-10 w-full"
                    />
                  </div>

                  {/* Difficulty selector presets */}
                  <div className="md:col-span-4 flex items-center gap-1.5">
                    {["", "Easy", "Medium", "Hard"].map((difficulty) => (
                      <button
                        key={difficulty}
                        type="button"
                        onClick={() => {
                          setOverlayDifficulty(difficulty);
                          setOverlayPage(1);
                        }}
                        className={`flex-1 px-2.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                          overlayDifficulty === difficulty
                            ? "bg-[var(--purple)] text-white border-transparent"
                            : "bg-[var(--bg-card-hover)] border-[var(--border-color)]"
                        }`}
                        style={{
                          color: overlayDifficulty === difficulty ? "white" : "var(--text-primary)",
                        }}
                      >
                        {difficulty || "All"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid List View (Matching mockup) */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {overlayLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="card h-40 animate-pulse" />
                      ))}
                    </div>
                  ) : overlayEntries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {overlayEntries.map((entry) => (
                        <div
                          key={entry._id}
                          className="card p-4 md:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg border border-[var(--border-color)]"
                        >
                          <div className="mb-3.5 flex items-start justify-between gap-3">
                            {/* Purple book container */}
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                              style={{
                                background: "rgba(106, 76, 147, 0.15)",
                                color: "var(--purple)",
                              }}
                            >
                              <FaBookOpen size={16} />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditModal(entry)}
                                className="p-1.5 transition-colors duration-150 hover:bg-[rgba(106,76,147,0.1)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--blue)]"
                                title="Edit journal record"
                              >
                                <FaEdit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEntryToDelete(entry)}
                                className="p-1.5 transition-colors duration-150 hover:bg-red-500/10 rounded-lg text-[var(--text-secondary)] hover:text-red-500"
                                title="Delete journal record"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h3 className="mb-2 text-base font-extrabold line-clamp-1" style={{ color: "var(--text-primary)" }}>
                              {entry.topicName}
                            </h3>
                            <p className="mb-4 text-xs md:text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                              {entry.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2 border-t border-[var(--border-color)] pt-3 mt-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                              <FaClock size={12} className="text-[var(--purple)]" />
                              <span>{entry.studyDuration}h elapsed</span>
                            </div>

                            <span className={`${getDifficultyBadge(entry.difficultyLevel)} text-xs px-2.5 py-0.5`}>
                              {entry.difficultyLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <FaBookOpen size={48} className="text-[var(--border-color)] mb-4" />
                      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                        No matches found
                      </h2>
                      <p className="text-xs max-w-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                        Try modifying your query text or select another difficulty tier to locate learning records.
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4 mt-5">
                  <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Showing page {overlayPagination.page} of {overlayPagination.totalPages} ({overlayPagination.totalEntries} total entries)
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={overlayPagination.page <= 1}
                      onClick={() => {
                        setOverlayPage((p) => Math.max(p - 1, 1));
                        loadOverlayEntries(overlayPagination.page - 1);
                      }}
                      className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-hover)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <FaChevronLeft size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={overlayPagination.page >= overlayPagination.totalPages}
                      onClick={() => {
                        setOverlayPage((p) => p + 1);
                        loadOverlayEntries(overlayPagination.page + 1);
                      }}
                      className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card-hover)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* INNER EDIT MODAL */}
          <Modal
            isOpen={Boolean(entryToEdit)}
            onClose={() => setEntryToEdit(null)}
            title="Modify Learning Journal Entry"
          >
            <JournalForm
              formData={editFormData}
              loading={editLoading}
              onCancel={() => setEntryToEdit(null)}
              onChange={(e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })}
              onSubmit={handleEditSubmit}
              submitLabel="Save Changes"
            />
          </Modal>

          {/* INNER DELETE MODAL */}
          <Modal
            isOpen={Boolean(entryToDelete)}
            onClose={() => setEntryToDelete(null)}
            title="Delete Journal Record"
          >
            <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to permanently erase the entry <strong>&quot;{entryToDelete?.topicName}&quot;</strong>? This action is irreversible.
            </p>

            <div className="flex items-center justify-end gap-3.5">
              <button
                type="button"
                onClick={() => setEntryToDelete(null)}
                className="btn rounded-xl px-4 py-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Keep Record
              </button>

              <button
                type="button"
                onClick={handleDeleteSubmit}
                className="btn btn-coral px-4 py-2 text-white bg-red-500 rounded-xl"
              >
                Erase Entry
              </button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default HomePage;
