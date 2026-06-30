import Image from "next/image";

import CircleMinor from "@/images/runes/CircleMinor.png";
import CircleMajor from "@/images/runes/CircleMajor.png";
import CircleExtreme from "@/images/runes/CircleExtreme.png";

type CustomRadioProps = {
  selected: boolean;
  value: "MINOR" | "MAJOR" | "EXTREME";
  label: React.ReactNode;
  description?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export default function CustomRadio({
  selected,
  value,
  label,
  description,
  onClick,
  disabled = false,
}: CustomRadioProps) {
  const getImage = () => {
    switch (value) {
      case "MINOR":
        return CircleMinor;
      case "MAJOR":
        return CircleMajor;
      case "EXTREME":
        return CircleExtreme;
    }
  };

  const getGlow = () => {
    switch (value) {
      case "MINOR":
        return "shadow-[0_0_30px_12px_rgba(34,197,94,0.75)]";
      case "MAJOR":
        return "shadow-[0_0_30px_12px_rgba(249,115,22,0.75)]";
      case "EXTREME":
        return "shadow-[0_0_30px_12px_rgba(168,85,247,0.75)]";
    }
  };

  const getBorder = () => {
    switch (value) {
      case "MINOR":
        return "border-green-500";
      case "MAJOR":
        return "border-orange-500";
      case "EXTREME":
        return "border-purple-500";
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
      relative flex w-full items-center gap-4 rounded-md border p-3 text-left
      transition-all duration-200

      ${
        selected
          ? `${getBorder()} bg-gray-700`
          : "border-gray-700 bg-gray-800 hover:border-gray-500 hover:bg-gray-700"
      }

      ${disabled ? "cursor-not-allowed opacity-50" : ""}
    `}
    >
      {/* ICON WRAPPER */}
      <div className="relative flex h-12 w-12 items-center justify-center">
        {/* OUTER GLOW */}
        <div
          className={`
      absolute h-10 w-10 rounded-full transition-all duration-300

      ${
        selected
          ? value === "MINOR"
            ? "bg-green-500/25 ring-1 ring-green-400 shadow-[0_0_24px_10px_rgba(34,197,94,0.55)]"
            : value === "MAJOR"
              ? "bg-orange-500/25 ring-1 ring-orange-400 shadow-[0_0_24px_10px_rgba(249,115,22,0.55)]"
              : "bg-purple-500/25 ring-1 ring-purple-400 shadow-[0_0_24px_10px_rgba(168,85,247,0.55)]"
          : "bg-transparent ring-0 shadow-none"
      }
    `}
        />

        {/* ICON CORE */}
        <div
          className={`
      relative z-10 flex h-8 w-8 items-center justify-center
      overflow-hidden rounded-full
      border bg-gray-900
      transition-all duration-200

      ${selected ? getBorder() : "border-gray-600"}
    `}
        >
          {selected && (
            <div className="h-full w-full animate-[fadeIn_300ms_ease-in-out]">
              <Image
                src={getImage()}
                alt={value}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* TEXT BLOCK */}
      <div>
        <div
          className={`
    font-semibold transition-all duration-300
    ${
      selected
        ? value === "MINOR"
          ? "text-green-300 drop-shadow-[0_0_6px_rgba(34,197,94,0.7)]"
          : value === "MAJOR"
            ? "text-orange-300 drop-shadow-[0_0_6px_rgba(249,115,22,0.7)]"
            : "text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.7)]"
        : "text-gray-100"
    }
  `}
        >
          {label}
        </div>

        {description && (
          <div className="text-sm text-gray-400">{description}</div>
        )}
      </div>
    </button>
  );
}
