// src/components/LoadingSpinner.jsx
import logo from "../assets/1000472563.png";

export default function LoadingSpinner({ size = "md" }) {
  const ringSize = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  const logoSize = {
    sm: "w-10 h-10",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`relative ${ringSize[size]}`}>
        {/* Ring inayozunguka */}
        <div
          className={`absolute inset-0 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-emerald-500`}
          aria-hidden="true"
        />

        {/* Logo katikati */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={logo}
            alt="GOD CARES 365"
            className={`${logoSize[size]} object-contain`}
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}
