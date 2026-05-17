const StatsCard = ({ title, value, subtitle, icon: Icon, color }) => {
  return (
    <div
      className="card p-5 transition-shadow duration-200 hover:shadow-md"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {title}
        </h3>

        {Icon && (
          <div
            className="flex items-center justify-center h-10 w-10 rounded-lg"
            style={{ background: `${color}20`, color: color }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <h2 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
        {value}
      </h2>

      <p className="text-xs mt-1.5" style={{ color }}>
        {subtitle}
      </p>
    </div>
  );
};

export default StatsCard;
