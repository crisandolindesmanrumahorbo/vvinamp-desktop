import React, { useState } from "react";
import { X } from "lucide-react";

interface ClockPickerProps {
  timeSelected: string;
  onTimeChange?: (time: string) => void;
}

const ClockPicker: React.FC<ClockPickerProps> = ({
  timeSelected,
  onTimeChange,
}) => {
  const [hour, setHour] = useState<string | null>(null);
  const [minute, setMinute] = useState<string | null>(null);

  // Generate hour options (00-23)
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  // Generate minute options (00, 05, 10, ..., 55)
  const minutes = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0"),
  );

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = e.target.value;
    setHour(newHour);
    if (minute === null) {
      setMinute("00");
      updateTime(newHour, "00");
      return;
    }
    updateTime(newHour, minute);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = e.target.value;
    setMinute(newMinute);
    if (hour === null) {
      setHour("00");
      updateTime("00", newMinute);
      return;
    }
    updateTime(hour, newMinute);
  };

  const updateTime = (h: string | null, m: string | null) => {
    if (h && m) {
      const time = `${h}:${m}`;
      onTimeChange?.(time);
    } else {
      onTimeChange?.("");
    }
  };

  const handleReset = () => {
    setHour(null);
    setMinute(null);
    onTimeChange?.("");
  };

  return (
    <div
      className="rounded-md p-1 focus:outline-none appearance-none cursor-pointer border-black
      border-2 transition-all flex items-center text-gray-700 bg-white 
      gap-1 px-2 py-1 w-fit shadow-md focus:shadow-none"
    >
      <select
        value={hour || ""}
        onChange={handleHourChange}
        className="rounded-md p-1 focus:outline-none appearance-none cursor-pointer"
      >
        <option value="" disabled>
          HH
        </option>
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-gray-500">:</span>
      <select
        value={minute || ""}
        onChange={handleMinuteChange}
        className="rounded-md p-1 focus:outline-none appearance-none cursor-pointer"
      >
        <option value="" disabled>
          mm
        </option>
        {minutes.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {timeSelected && (
        <button
          onClick={handleReset}
          className="text-gray-700 hover:text-red-500 transition disabled:text-gray-300 disabled:cursor-not-allowed"
          disabled={!hour && !minute}
        >
          <X size={16} color="red" />
        </button>
      )}
    </div>
  );
};

export default ClockPicker;
