"use client";

export default function LoadingSpinner({ size = "medium", color = "primary" }) {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-12 w-12",
    xlarge: "h-16 w-16",
  };

  const colorClasses = {
    primary: "border-[var(--primary)]",
    secondary: "border-[var(--secondary)]",
    success: "border-[var(--success)]",
    warning: "border-[var(--warning)]",
    error: "border-[var(--error)]",
    text: "border-[var(--text)]",
    textLight: "border-[var(--text-light)]",
    mutant: "border-[var(--mutant-color)]",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
    </div>
  );
}











