const StatsCard = ({
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">

      <h3 className="text-gray-500 text-sm mb-2">
        {title}
      </h3>

      <h2 className="text-3xl font-bold text-gray-800">
        {value}
      </h2>

      <p className="text-green-500 text-sm mt-2">
        {subtitle}
      </p>

    </div>
  );
};

export default StatsCard;
