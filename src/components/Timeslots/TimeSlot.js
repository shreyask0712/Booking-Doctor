import React from "react";

const TimeSlots = ({ slot, selected, isBooked, onClick }) => {
  <button
    className={`time-slot-button ${isBooked ? "booked" : ""} ${
      selected ? "selected" : ""
    }`}
    onClick={onClick}
    disabled={isBooked}
  >
    {slot}
  </button>;
};

export default TimeSlots;
