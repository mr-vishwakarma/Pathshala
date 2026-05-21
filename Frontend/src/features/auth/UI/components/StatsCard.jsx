const StatsCard = ({ title, value, subtitle, icon: Icon, color }) => {
  return (
    <div
      className="card p-2.5 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-center justify-between mb-1.5 sm:mb-2.5 md:mb-3">
        <h3
          className="text-[10px] min-span:text-xs sm:text-xs md:text-sm font-medium tracking-tight truncate mr-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {title}
        </h3>

        {Icon && (
          <div
            className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-md sm:rounded-lg flex-shrink-0"
            style={{ background: `${color}18`, color: color }}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </div>
        )}
      </div>

      <h2
        className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight truncate"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </h2>

      <p 
        className="text-[9px] sm:text-xs font-semibold mt-0.5 sm:mt-1.5 truncate" 
        style={{ color }}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default StatsCard;
