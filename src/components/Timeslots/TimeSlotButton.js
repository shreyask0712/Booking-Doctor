import React from "react";

const TimeSlotsButton = ({ slot, selected, isBooked, onClick, style }) => {
  return (
    <button
      className={`time-slot-button ${isBooked ? "booked" : ""} ${
        selected ? "selected" : ""
      }`}
      onClick={onClick}
      disabled={isBooked}
      style={style}
    >
      {slot}
    </button>
  );
};

export default TimeSlotsButton;
