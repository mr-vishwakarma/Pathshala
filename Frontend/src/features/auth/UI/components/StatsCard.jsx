const StatsCard = ({
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900">

      <h3 className="mb-2 text-sm text-slate-500 dark:text-slate-400">
        {title}
      </h3>

      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        {value}
      </h2>

      <p className="text-green-500 text-sm mt-2">
        {subtitle}
      </p>

    </div>
  );
};

export default StatsCard;
