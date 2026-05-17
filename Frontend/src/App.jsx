import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const difficultyOptions = ["Easy", "Medium", "Hard"];

const emptyEntryForm = {
  topicName: "",
  description: "",
  studyDuration: "",
  difficultyLevel: "Medium",
};

const emptyFilters = {
  topic: "",
  difficulty: "",
  startDate: "",
  endDate: "",
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "journal", label: "Journal", icon: "journal" },
  { id: "profile", label: "Profile", icon: "profile" },
];

const viewMeta = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Your learning momentum at a glance",
  },
  journal: {
    title: "Learning Journal",
    subtitle: "Capture topics, study time, and difficulty",
  },
  profile: {
    title: "Profile",
    subtitle: "Account, photo, and password settings",
  },
};

const weekDays = {
  1: "Sun",
  2: "Mon",
  3: "Tue",
  4: "Wed",
  5: "Thu",
  6: "Fri",
  7: "Sat",
};

const iconPaths = {
  dashboard: (
    <>
      <path d="M4 13h6V4H4v9Z" />
      <path d="M14 20h6V4h-6v16Z" />
      <path d="M4 20h6v-3H4v3Z" />
    </>
  ),
  journal: (
    <>
      <path d="M6 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1Z" />
      <path d="M8 17h11" />
      <path d="M9 8h6" />
      <path d="M9 12h4" />
    </>
  ),
  profile: (
    <>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17 5 12l5-5" />
      <path d="M5 12h12" />
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  search: (
    <>
      <path d="m21 21-4.2-4.2" />
      <path d="M10.8 18a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M5 20h14" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" />
      <path d="M20 20v-4h-4" />
    </>
  ),
  mail: (
    <>
      <path d="M4 6h16v12H4V6Z" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  lock: (
    <>
      <path d="M6 10h12v10H6V10Z" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
};

async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? options.headers
    : { "Content-Type": "application/json", ...options.headers };

  const config = {
    ...options,
    credentials: "include",
    headers,
  };

  if (config.body && !isFormData && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string" ? payload : payload?.message || "Request failed";
    throw new Error(message);
  }

  return payload;
}

function sanitizeUser(userData) {
  if (!userData) {
    return null;
  }

  const safeUser = { ...userData };
  delete safeUser.password;
  return safeUser;
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

function getInitials(name = "") {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "P";
}

function formatDate(value) {
  if (!value) {
    return "Today";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function buildEntryQuery(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `/journal/search/filter?${query}` : "/journal/search/filter";
}

function TextField({ label, name, value, onChange, type = "text", ...rest }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#253149]">
      <span>{label}</span>
      <input
        className="h-11 rounded-md border border-[#d8dee8] bg-white px-3 text-[#172033] outline-none transition focus:border-[#2f6fed] focus:ring-4 focus:ring-[#2f6fed]/10"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </label>
  );
}

function TextAreaField({ label, name, value, onChange, ...rest }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#253149]">
      <span>{label}</span>
      <textarea
        className="min-h-28 resize-y rounded-md border border-[#d8dee8] bg-white px-3 py-3 text-[#172033] outline-none transition focus:border-[#2f6fed] focus:ring-4 focus:ring-[#2f6fed]/10"
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </label>
  );
}

function SelectField({ label, name, value, onChange, children, ...rest }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#253149]">
      <span>{label}</span>
      <select
        className="h-11 rounded-md border border-[#d8dee8] bg-white px-3 text-[#172033] outline-none transition focus:border-[#2f6fed] focus:ring-4 focus:ring-[#2f6fed]/10"
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}

function Alert({ type = "info", children }) {
  if (!children) {
    return null;
  }

  const styles = {
    info: "border-[#b9d1ff] bg-[#eef5ff] text-[#244777]",
    error: "border-[#ffc8c8] bg-[#fff0f0] text-[#8a2424]",
    success: "border-[#a8dfc2] bg-[#edf9f2] text-[#1f6b3f]",
  };

  return (
    <div className={cx("rounded-md border px-4 py-3 text-sm", styles[type])}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, className, ...rest }) {
  return (
    <button
      className={cx(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2f6fed] px-4 text-sm font-semibold text-white transition hover:bg-[#255bc5] disabled:cursor-not-allowed disabled:bg-[#9db6ef]",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className, ...rest }) {
  return (
    <button
      className={cx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#d8dee8] bg-white px-3 text-sm font-semibold text-[#253149] transition hover:border-[#b8c4d8] hover:bg-[#f6f8fb] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function IconButton({ label, icon, tone = "neutral", className, ...rest }) {
  const tones = {
    neutral: "border-[#d8dee8] text-[#566176] hover:border-[#b8c4d8] hover:bg-[#f6f8fb]",
    danger: "border-[#ffd0d0] text-[#b73232] hover:bg-[#fff0f0]",
    active: "border-[#b9d1ff] bg-[#eef5ff] text-[#2f6fed]",
  };

  return (
    <button
      aria-label={label}
      title={label}
      className={cx(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white transition disabled:cursor-not-allowed disabled:opacity-60",
        tones[tone],
        className,
      )}
      {...rest}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  );
}

function Avatar({ user, className = "h-11 w-11" }) {
  if (user?.profilePhoto) {
    return (
      <img
        className={cx("rounded-full object-cover ring-2 ring-white", className)}
        src={user.profilePhoto}
        alt={user.fullname || "Profile"}
      />
    );
  }

  return (
    <div
      className={cx(
        "grid place-items-center rounded-full bg-[#1f8f6a] font-semibold text-white ring-2 ring-white",
        className,
      )}
    >
      {getInitials(user?.fullname)}
    </div>
  );
}

function AuthScreen({
  authMode,
  authForm,
  forgotEmail,
  resetLink,
  isSubmitting,
  message,
  error,
  onModeChange,
  onAuthFieldChange,
  onForgotEmailChange,
  onSubmit,
}) {
  const isRegister = authMode === "register";
  const isForgot = authMode === "forgot";
  const heading = isForgot
    ? "Reset password"
    : isRegister
      ? "Create your account"
      : "Welcome back";

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#172033]">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <section className="max-w-2xl">
          <div className="mb-8 inline-flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#172033] text-white">
              <Icon name="journal" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-[#1f8f6a]">
                Pathshala
              </p>
              <p className="text-sm text-[#647086]">Learning journal</p>
            </div>
          </div>

          <h1 className="max-w-xl text-4xl font-bold leading-tight text-[#101828] md:text-6xl">
            Track every focused study session.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#566176]">
            A calm workspace for logging topics, measuring study hours, and
            reviewing your progress over time.
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              ["Entries", "Daily logs"],
              ["Hours", "Study time"],
              ["Focus", "Progress"],
            ].map(([label, value]) => (
              <div
                className="rounded-lg border border-[#dfe5ef] bg-white p-4 shadow-sm"
                key={label}
              >
                <p className="text-xl font-bold text-[#172033]">{label}</p>
                <p className="mt-1 text-sm text-[#647086]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#dfe5ef] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex rounded-md border border-[#d8dee8] bg-[#f6f8fb] p-1">
            {[
              ["login", "Login"],
              ["register", "Register"],
              ["forgot", "Reset"],
            ].map(([mode, label]) => (
              <button
                className={cx(
                  "h-9 flex-1 rounded-md text-sm font-semibold transition",
                  authMode === mode
                    ? "bg-white text-[#172033] shadow-sm"
                    : "text-[#647086] hover:text-[#172033]",
                )}
                key={mode}
                type="button"
                onClick={() => onModeChange(mode)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#101828]">{heading}</h2>
            <p className="mt-2 text-sm text-[#647086]">
              {isForgot
                ? "Use the email linked to your Pathshala account."
                : "Use your verified email to continue."}
            </p>
          </div>

          <form className="grid gap-4" onSubmit={onSubmit}>
            {isRegister && (
              <TextField
                label="Full name"
                name="fullname"
                value={authForm.fullname}
                onChange={onAuthFieldChange}
                placeholder="Your name"
                required
              />
            )}

            <TextField
              label="Email"
              name={isForgot ? "forgotEmail" : "email"}
              type="email"
              value={isForgot ? forgotEmail : authForm.email}
              onChange={isForgot ? onForgotEmailChange : onAuthFieldChange}
              placeholder="you@example.com"
              required
            />

            {!isForgot && (
              <TextField
                label="Password"
                name="password"
                type="password"
                value={authForm.password}
                onChange={onAuthFieldChange}
                placeholder="Your password"
                minLength={6}
                required
              />
            )}

            <Alert type="success">{message}</Alert>
            <Alert type="error">{error}</Alert>

            {resetLink && (
              <a
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#b9d1ff] bg-[#eef5ff] px-3 text-sm font-semibold text-[#2f6fed] transition hover:bg-[#e3efff]"
                href={resetLink}
                target="_blank"
                rel="noreferrer"
              >
                Open reset form
                <Icon name="arrowRight" className="h-4 w-4" />
              </a>
            )}

            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Please wait"
                : isForgot
                  ? "Send reset link"
                  : isRegister
                    ? "Create account"
                    : "Login"}
              <Icon name="arrowRight" className="h-4 w-4" />
            </PrimaryButton>
          </form>
        </section>
      </div>
    </main>
  );
}

function AppShell({
  user,
  activeView,
  mobileNavOpen,
  onMobileNavToggle,
  onViewChange,
  onLogout,
  children,
}) {
  const meta = viewMeta[activeView];

  const nav = (
    <nav className="grid gap-2">
      {navItems.map((item) => (
        <button
          className={cx(
            "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition",
            activeView === item.id
              ? "bg-[#eef5ff] text-[#2f6fed]"
              : "text-[#566176] hover:bg-[#f6f8fb] hover:text-[#172033]",
          )}
          key={item.id}
          type="button"
          onClick={() => onViewChange(item.id)}
        >
          <Icon name={item.icon} className="h-5 w-5" />
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#172033]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-[#dfe5ef] bg-white px-4 py-5 lg:flex lg:flex-col">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#172033] text-white">
            <Icon name="journal" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-bold text-[#101828]">Pathshala</p>
            <p className="text-xs text-[#647086]">Learning journal</p>
          </div>
        </div>

        {nav}

        <div className="mt-auto rounded-lg border border-[#dfe5ef] bg-[#f9fafc] p-3">
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#172033]">
                {user?.fullname || "Learner"}
              </p>
              <p className="truncate text-xs text-[#647086]">{user?.email}</p>
            </div>
          </div>
          <button
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#d8dee8] bg-white text-sm font-semibold text-[#566176] transition hover:border-[#b8c4d8] hover:text-[#172033]"
            type="button"
            onClick={onLogout}
          >
            <Icon name="logout" className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-[#dfe5ef] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#172033] text-white">
              <Icon name="journal" className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-[#101828]">Pathshala</p>
              <p className="text-xs text-[#647086]">{meta.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Avatar user={user} className="h-9 w-9 text-sm" />
            <IconButton
              label={mobileNavOpen ? "Close navigation" : "Open navigation"}
              icon={mobileNavOpen ? "close" : "menu"}
              onClick={onMobileNavToggle}
            />
          </div>
        </div>

        {mobileNavOpen && (
          <div className="mt-3 border-t border-[#dfe5ef] pt-3">
            {nav}
            <button
              className="mt-2 flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-[#b73232] transition hover:bg-[#fff0f0]"
              type="button"
              onClick={onLogout}
            >
              <Icon name="logout" className="h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#101828]">{meta.title}</h1>
              <p className="mt-2 text-sm text-[#647086]">{meta.subtitle}</p>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

function DashboardView({ stats, loading, error, onRefresh }) {
  const totalHours = Number(stats?.totalStudyHours || 0);
  const totalEntries = Number(stats?.totalEntries || 0);
  const averageHours = totalEntries ? totalHours / totalEntries : 0;
  const weeklyStats = stats?.weeklyStudyStats || [];
  const difficultyStats = stats?.difficultyStats || [];
  const recentEntries = stats?.recentEntries || [];
  const maxWeeklyHours = Math.max(
    1,
    ...weeklyStats.map((item) => Number(item.totalHours || 0)),
  );

  const metrics = [
    {
      label: "Total entries",
      value: totalEntries,
      detail: "Logged sessions",
      color: "bg-[#eef5ff] text-[#2f6fed]",
    },
    {
      label: "Study hours",
      value: totalHours,
      detail: "Across your journal",
      color: "bg-[#edf9f2] text-[#1f8f6a]",
    },
    {
      label: "Productivity",
      value: stats?.productivityLevel || "Low",
      detail: "Based on total hours",
      color: "bg-[#fff7e6] text-[#a96400]",
    },
    {
      label: "Average",
      value: averageHours.toFixed(1),
      detail: "Hours per entry",
      color: "bg-[#fff0f0] text-[#b73232]",
    },
  ];

  return (
    <div className="grid gap-5">
      <div className="flex justify-end">
        <SecondaryButton type="button" onClick={onRefresh} disabled={loading}>
          <Icon name="refresh" className="h-4 w-4" />
          Refresh
        </SecondaryButton>
      </div>

      <Alert type="error">{error}</Alert>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            className="rounded-lg border border-[#dfe5ef] bg-white p-5 shadow-sm"
            key={metric.label}
          >
            <div
              className={cx(
                "mb-5 grid h-10 w-10 place-items-center rounded-md",
                metric.color,
              )}
            >
              <Icon name="dashboard" className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-[#647086]">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#101828]">
              {loading ? "..." : metric.value}
            </p>
            <p className="mt-2 text-sm text-[#647086]">{metric.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-[#dfe5ef] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#101828]">Weekly study</h2>
              <p className="mt-1 text-sm text-[#647086]">Hours grouped by day</p>
            </div>
          </div>

          <div className="grid gap-4">
            {weeklyStats.length ? (
              weeklyStats.map((item) => {
                const hours = Number(item.totalHours || 0);
                const width = `${Math.max(8, (hours / maxWeeklyHours) * 100)}%`;

                return (
                  <div className="grid gap-2" key={item._id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-[#253149]">
                        {weekDays[item._id] || "Day"}
                      </span>
                      <span className="text-[#647086]">{hours}h</span>
                    </div>
                    <div className="h-3 rounded-md bg-[#edf1f7]">
                      <div
                        className="h-3 rounded-md bg-[#2f6fed]"
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState title="No weekly data yet" />
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[#dfe5ef] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[#101828]">Difficulty mix</h2>
          <div className="mt-5 grid gap-3">
            {difficultyStats.length ? (
              difficultyStats.map((item) => (
                <div
                  className="flex items-center justify-between rounded-md border border-[#dfe5ef] px-3 py-3"
                  key={item._id}
                >
                  <span className="text-sm font-semibold text-[#253149]">
                    {item._id}
                  </span>
                  <span className="text-sm text-[#647086]">{item.count} entries</span>
                </div>
              ))
            ) : (
              <EmptyState title="No difficulty data yet" />
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#101828]">Recent entries</h2>
        </div>
        <div className="grid gap-3">
          {recentEntries.length ? (
            recentEntries.map((entry) => <EntryRow entry={entry} key={entry._id} />)
          ) : (
            <div className="rounded-lg border border-dashed border-[#c9d3e2] bg-white p-6">
              <EmptyState title="Your newest entries will appear here" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function JournalView({
  entries,
  loading,
  error,
  filters,
  entryForm,
  editingEntry,
  formError,
  entrySubmitting,
  onFilterChange,
  onSearch,
  onClearFilters,
  onEntryChange,
  onEntrySubmit,
  onEditEntry,
  onCancelEdit,
  onDeleteEntry,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <section className="rounded-lg border border-[#dfe5ef] bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#101828]">
              {editingEntry ? "Edit entry" : "New entry"}
            </h2>
            <p className="mt-1 text-sm text-[#647086]">
              {editingEntry ? "Update your learning log" : "Add a study session"}
            </p>
          </div>
          {editingEntry && (
            <IconButton label="Cancel edit" icon="close" onClick={onCancelEdit} />
          )}
        </div>

        <form className="grid gap-4" onSubmit={onEntrySubmit}>
          <TextField
            label="Topic"
            name="topicName"
            value={entryForm.topicName}
            onChange={onEntryChange}
            placeholder="React hooks"
            required
          />
          <TextAreaField
            label="Description"
            name="description"
            value={entryForm.description}
            onChange={onEntryChange}
            placeholder="What did you learn?"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <TextField
              label="Duration"
              name="studyDuration"
              type="number"
              value={entryForm.studyDuration}
              onChange={onEntryChange}
              min="0.25"
              step="0.25"
              placeholder="1.5"
              required
            />
            <SelectField
              label="Difficulty"
              name="difficultyLevel"
              value={entryForm.difficultyLevel}
              onChange={onEntryChange}
              required
            >
              {difficultyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>
          </div>

          <Alert type="error">{formError}</Alert>

          <PrimaryButton type="submit" disabled={entrySubmitting}>
            <Icon name={editingEntry ? "edit" : "plus"} className="h-4 w-4" />
            {entrySubmitting
              ? "Saving"
              : editingEntry
                ? "Save changes"
                : "Add entry"}
          </PrimaryButton>
        </form>
      </section>

      <section>
        <form
          className="mb-5 rounded-lg border border-[#dfe5ef] bg-white p-4 shadow-sm"
          onSubmit={onSearch}
        >
          <div className="grid gap-3 md:grid-cols-[1fr_180px_150px_150px_auto]">
            <TextField
              label="Topic"
              name="topic"
              value={filters.topic}
              onChange={onFilterChange}
              placeholder="Search topic"
            />
            <SelectField
              label="Difficulty"
              name="difficulty"
              value={filters.difficulty}
              onChange={onFilterChange}
            >
              <option value="">All</option>
              {difficultyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>
            <TextField
              label="From"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={onFilterChange}
            />
            <TextField
              label="To"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={onFilterChange}
            />
            <div className="flex items-end gap-2">
              <IconButton
                label="Search entries"
                icon="search"
                tone="active"
                type="submit"
              />
              <IconButton
                label="Clear filters"
                icon="close"
                type="button"
                onClick={onClearFilters}
              />
            </div>
          </div>
        </form>

        <Alert type="error">{error}</Alert>

        <div className="mt-4 grid gap-3">
          {loading ? (
            <div className="rounded-lg border border-[#dfe5ef] bg-white p-6">
              <EmptyState title="Loading entries" />
            </div>
          ) : entries.length ? (
            entries.map((entry) => (
              <EntryCard
                entry={entry}
                key={entry._id}
                onEdit={() => onEditEntry(entry)}
                onDelete={() => onDeleteEntry(entry)}
              />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-[#c9d3e2] bg-white p-8">
              <EmptyState title="No entries match this view" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProfileView({
  user,
  profileForm,
  passwordForm,
  photoFile,
  profileMessage,
  profileError,
  passwordMessage,
  passwordError,
  photoMessage,
  photoError,
  profileLoading,
  passwordLoading,
  photoLoading,
  onProfileChange,
  onPasswordChange,
  onPhotoChange,
  onProfileSubmit,
  onPasswordSubmit,
  onPhotoSubmit,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <section className="rounded-lg border border-[#dfe5ef] bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#101828]">Account</h2>
          <p className="mt-1 text-sm text-[#647086]">Name and email</p>
        </div>
        <form className="grid gap-4" onSubmit={onProfileSubmit}>
          <TextField
            label="Full name"
            name="fullname"
            value={profileForm.fullname}
            onChange={onProfileChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={profileForm.email}
            onChange={onProfileChange}
            required
          />
          <Alert type="success">{profileMessage}</Alert>
          <Alert type="error">{profileError}</Alert>
          <PrimaryButton type="submit" disabled={profileLoading}>
            {profileLoading ? "Saving" : "Save profile"}
          </PrimaryButton>
        </form>
      </section>

      <section className="rounded-lg border border-[#dfe5ef] bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#101828]">Photo</h2>
          <p className="mt-1 text-sm text-[#647086]">Profile image</p>
        </div>
        <div className="mb-5 flex items-center gap-4">
          <Avatar user={user} className="h-20 w-20 text-2xl" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#172033]">
              {user?.fullname || "Learner"}
            </p>
            <p className="truncate text-sm text-[#647086]">{user?.email}</p>
          </div>
        </div>
        <form className="grid gap-4" onSubmit={onPhotoSubmit}>
          <input
            className="block w-full rounded-md border border-[#d8dee8] bg-white px-3 py-2 text-sm text-[#253149] file:mr-4 file:rounded-md file:border-0 file:bg-[#eef5ff] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#2f6fed]"
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
          />
          <p className="text-sm text-[#647086]">
            {photoFile ? photoFile.name : "No file selected"}
          </p>
          <Alert type="success">{photoMessage}</Alert>
          <Alert type="error">{photoError}</Alert>
          <SecondaryButton type="submit" disabled={photoLoading || !photoFile}>
            <Icon name="upload" className="h-4 w-4" />
            {photoLoading ? "Uploading" : "Upload photo"}
          </SecondaryButton>
        </form>
      </section>

      <section className="rounded-lg border border-[#dfe5ef] bg-white p-5 shadow-sm xl:col-span-2">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#101828]">Password</h2>
          <p className="mt-1 text-sm text-[#647086]">Change password</p>
        </div>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onPasswordSubmit}>
          <TextField
            label="Old password"
            name="oldPassword"
            type="password"
            value={passwordForm.oldPassword}
            onChange={onPasswordChange}
            required
          />
          <TextField
            label="New password"
            name="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={onPasswordChange}
            minLength={6}
            required
          />
          <div className="md:col-span-2">
            <Alert type="success">{passwordMessage}</Alert>
            <Alert type="error">{passwordError}</Alert>
          </div>
          <PrimaryButton
            className="md:w-fit"
            type="submit"
            disabled={passwordLoading}
          >
            <Icon name="lock" className="h-4 w-4" />
            {passwordLoading ? "Updating" : "Update password"}
          </PrimaryButton>
        </form>
      </section>
    </div>
  );
}

function EntryRow({ entry }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[#dfe5ef] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#172033]">{entry.topicName}</p>
        <p className="mt-1 line-clamp-1 text-sm text-[#647086]">
          {entry.description}
        </p>
      </div>
      <div className="flex items-center gap-3 text-sm text-[#647086]">
        <span>{entry.studyDuration}h</span>
        <DifficultyBadge value={entry.difficultyLevel} />
      </div>
    </div>
  );
}

function EntryCard({ entry, onEdit, onDelete }) {
  return (
    <article className="rounded-lg border border-[#dfe5ef] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-[#101828]">{entry.topicName}</h3>
            <DifficultyBadge value={entry.difficultyLevel} />
          </div>
          <p className="mt-2 text-sm leading-6 text-[#566176]">
            {entry.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <IconButton label="Edit entry" icon="edit" onClick={onEdit} />
          <IconButton
            label="Delete entry"
            icon="trash"
            tone="danger"
            onClick={onDelete}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#647086]">
        <span className="rounded-md bg-[#edf9f2] px-2 py-1 font-semibold text-[#1f8f6a]">
          {entry.studyDuration}h
        </span>
        <span>{formatDate(entry.createdAt)}</span>
      </div>
    </article>
  );
}

function DifficultyBadge({ value }) {
  const styles = {
    Easy: "bg-[#edf9f2] text-[#1f8f6a]",
    Medium: "bg-[#fff7e6] text-[#a96400]",
    Hard: "bg-[#fff0f0] text-[#b73232]",
  };

  return (
    <span
      className={cx(
        "inline-flex h-7 items-center rounded-md px-2 text-xs font-bold",
        styles[value] || "bg-[#eef5ff] text-[#2f6fed]",
      )}
    >
      {value || "Medium"}
    </span>
  );
}

function EmptyState({ title }) {
  return (
    <div className="grid min-h-24 place-items-center text-center">
      <p className="text-sm font-semibold text-[#647086]">{title}</p>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f6f8fb]">
      <div className="rounded-lg border border-[#dfe5ef] bg-white px-6 py-5 text-center shadow-sm">
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-lg bg-[#172033] text-white">
          <Icon name="journal" className="h-6 w-6" />
        </div>
        <p className="font-semibold text-[#172033]">Opening Pathshala</p>
      </div>
    </div>
  );
}

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");

  const [stats, setStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entriesError, setEntriesError] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [entryForm, setEntryForm] = useState(emptyEntryForm);
  const [editingEntry, setEditingEntry] = useState(null);
  const [entrySubmitting, setEntrySubmitting] = useState(false);
  const [entryFormError, setEntryFormError] = useState("");

  const [profileForm, setProfileForm] = useState({
    fullname: "",
    email: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [photoFile, setPhotoFile] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoError, setPhotoError] = useState("");

  const displayUser = useMemo(() => profile || user, [profile, user]);

  const hydrateProfile = useCallback((profileData) => {
    const safeProfile = sanitizeUser(profileData);
    setProfile(safeProfile);
    setUser((currentUser) => sanitizeUser({ ...currentUser, ...safeProfile }));
    setProfileForm({
      fullname: safeProfile?.fullname || "",
      email: safeProfile?.email || "",
    });
  }, []);

  const fetchDashboard = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError("");

    try {
      const data = await apiRequest("/dashboard/stats");
      setStats(data);
    } catch (error) {
      setDashboardError(error.message);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const fetchEntries = useCallback(async (nextFilters = emptyFilters) => {
    setEntriesLoading(true);
    setEntriesError("");

    try {
      const data = await apiRequest(buildEntryQuery(nextFilters));
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      setEntriesError(error.message);
    } finally {
      setEntriesLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiRequest("/profile/me");
      hydrateProfile(data);
    } catch (error) {
      setProfileError(error.message);
    }
  }, [hydrateProfile]);

  useEffect(() => {
    let mounted = true;

    apiRequest("/auth/profile")
      .then((data) => {
        if (!mounted) {
          return;
        }

        const safeUser = sanitizeUser(data);
        setUser(safeUser);
        hydrateProfile(safeUser);
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setAuthChecked(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [hydrateProfile]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const timer = window.setTimeout(() => {
      fetchDashboard();
      fetchEntries(emptyFilters);
      fetchProfile();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchDashboard, fetchEntries, fetchProfile, user]);

  function handleAuthModeChange(mode) {
    setAuthMode(mode);
    setAuthMessage("");
    setAuthError("");
    setResetLink("");
  }

  function handleAuthFieldChange(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthSubmitting(true);
    setAuthError("");
    setAuthMessage("");
    setResetLink("");

    try {
      if (authMode === "forgot") {
        const data = await apiRequest("/auth/forgot-password", {
          method: "POST",
          body: { email: forgotEmail },
        });

        setAuthMessage("Reset link sent to your email.");
        if (data?.resetToken) {
          setResetLink(`/api/auth/reset-password/${data.resetToken}`);
        }
        return;
      }

      if (authMode === "register") {
        await apiRequest("/auth/register", {
          method: "POST",
          body: authForm,
        });
        setAuthMessage("Account created. Verify your email before logging in.");
        setAuthMode("login");
        setAuthForm((current) => ({ ...current, password: "" }));
        return;
      }

      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: {
          email: authForm.email,
          password: authForm.password,
        },
      });
      const safeUser = sanitizeUser(data.user);
      setUser(safeUser);
      hydrateProfile(safeUser);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await apiRequest("/auth/logout");
    } catch {
      // Clear local session even if the backend is unreachable.
    }

    setUser(null);
    setProfile(null);
    setStats(null);
    setEntries([]);
    setActiveView("dashboard");
    setMobileNavOpen(false);
  }

  function handleViewChange(view) {
    setActiveView(view);
    setMobileNavOpen(false);
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function handleSearch(event) {
    event.preventDefault();
    fetchEntries(filters);
  }

  function handleClearFilters() {
    setFilters(emptyFilters);
    fetchEntries(emptyFilters);
  }

  function handleEntryChange(event) {
    const { name, value } = event.target;
    setEntryForm((current) => ({ ...current, [name]: value }));
  }

  async function handleEntrySubmit(event) {
    event.preventDefault();
    setEntrySubmitting(true);
    setEntryFormError("");

    const studyDuration = Number(entryForm.studyDuration);
    if (!studyDuration || studyDuration <= 0) {
      setEntryFormError("Study duration must be greater than zero.");
      setEntrySubmitting(false);
      return;
    }

    const payload = {
      ...entryForm,
      studyDuration,
    };

    try {
      if (editingEntry) {
        await apiRequest(`/journal/edit/${editingEntry._id}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        await apiRequest("/journal/add", {
          method: "POST",
          body: payload,
        });
      }

      setEntryForm(emptyEntryForm);
      setEditingEntry(null);
      await fetchEntries(filters);
      await fetchDashboard();
    } catch (error) {
      setEntryFormError(error.message);
    } finally {
      setEntrySubmitting(false);
    }
  }

  function handleEditEntry(entry) {
    setEditingEntry(entry);
    setEntryForm({
      topicName: entry.topicName || "",
      description: entry.description || "",
      studyDuration: String(entry.studyDuration || ""),
      difficultyLevel: entry.difficultyLevel || "Medium",
    });
    setEntryFormError("");
  }

  function handleCancelEdit() {
    setEditingEntry(null);
    setEntryForm(emptyEntryForm);
    setEntryFormError("");
  }

  async function handleDeleteEntry(entry) {
    const shouldDelete = window.confirm(`Delete "${entry.topicName}"?`);
    if (!shouldDelete) {
      return;
    }

    try {
      await apiRequest(`/journal/delete/${entry._id}`, { method: "DELETE" });
      await fetchEntries(filters);
      await fetchDashboard();
    } catch (error) {
      setEntriesError(error.message);
    }
  }

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileLoading(true);
    setProfileMessage("");
    setProfileError("");

    try {
      await apiRequest("/profile/update", {
        method: "PUT",
        body: profileForm,
      });
      await fetchProfile();
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setProfileLoading(false);
    }
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage("");
    setPasswordError("");

    try {
      await apiRequest("/profile/change-password", {
        method: "PUT",
        body: passwordForm,
      });
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setPasswordMessage("Password updated successfully.");
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setPasswordLoading(false);
    }
  }

  function handlePhotoChange(event) {
    setPhotoFile(event.target.files?.[0] || null);
    setPhotoMessage("");
    setPhotoError("");
  }

  async function handlePhotoSubmit(event) {
    event.preventDefault();
    if (!photoFile) {
      return;
    }

    const formData = new FormData();
    formData.append("image", photoFile);

    setPhotoLoading(true);
    setPhotoMessage("");
    setPhotoError("");

    try {
      await apiRequest("/profile/upload-photo", {
        method: "POST",
        body: formData,
      });
      await fetchProfile();
      setPhotoFile(null);
      setPhotoMessage("Photo uploaded successfully.");
    } catch (error) {
      setPhotoError(error.message);
    } finally {
      setPhotoLoading(false);
    }
  }

  if (!authChecked) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <AuthScreen
        authMode={authMode}
        authForm={authForm}
        forgotEmail={forgotEmail}
        resetLink={resetLink}
        isSubmitting={authSubmitting}
        message={authMessage}
        error={authError}
        onModeChange={handleAuthModeChange}
        onAuthFieldChange={handleAuthFieldChange}
        onForgotEmailChange={(event) => setForgotEmail(event.target.value)}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  return (
    <AppShell
      user={displayUser}
      activeView={activeView}
      mobileNavOpen={mobileNavOpen}
      onMobileNavToggle={() => setMobileNavOpen((current) => !current)}
      onViewChange={handleViewChange}
      onLogout={handleLogout}
    >
      {activeView === "dashboard" && (
        <DashboardView
          stats={stats}
          loading={dashboardLoading}
          error={dashboardError}
          onRefresh={fetchDashboard}
        />
      )}

      {activeView === "journal" && (
        <JournalView
          entries={entries}
          loading={entriesLoading}
          error={entriesError}
          filters={filters}
          entryForm={entryForm}
          editingEntry={editingEntry}
          formError={entryFormError}
          entrySubmitting={entrySubmitting}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
          onEntryChange={handleEntryChange}
          onEntrySubmit={handleEntrySubmit}
          onEditEntry={handleEditEntry}
          onCancelEdit={handleCancelEdit}
          onDeleteEntry={handleDeleteEntry}
        />
      )}

      {activeView === "profile" && (
        <ProfileView
          user={displayUser}
          profileForm={profileForm}
          passwordForm={passwordForm}
          photoFile={photoFile}
          profileMessage={profileMessage}
          profileError={profileError}
          passwordMessage={passwordMessage}
          passwordError={passwordError}
          photoMessage={photoMessage}
          photoError={photoError}
          profileLoading={profileLoading}
          passwordLoading={passwordLoading}
          photoLoading={photoLoading}
          onProfileChange={handleProfileChange}
          onPasswordChange={handlePasswordChange}
          onPhotoChange={handlePhotoChange}
          onProfileSubmit={handleProfileSubmit}
          onPasswordSubmit={handlePasswordSubmit}
          onPhotoSubmit={handlePhotoSubmit}
        />
      )}
    </AppShell>
  );
}

export default App;
