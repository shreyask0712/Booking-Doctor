import React from "react";
import PropTypes from "prop-types";

const BookingButton = ({ onClick, label }) => {
  return (
    <button className="booking-button" onClick={onClick}>
      {label}
    </button>
  );
};

BookingButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default BookingButton;
