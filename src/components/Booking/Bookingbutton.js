import React from "react";
import proptypes from "prop-types";

const BookingButton = ({ onClick, label }) => {
  <button className="booking-button" onClick={onClick}>
    {label}
  </button>;
};

BookingButton.proptypes = {
  onClick: proptypes.func.isRequired,
  label: proptypes.string.isRequired,
};

export default BookingButton;
