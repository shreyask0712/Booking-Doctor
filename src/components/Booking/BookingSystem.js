import React, { useState } from "react";
import BookingButton from "./Bookingbutton";
import TimeSlotsButton from "../Timeslots/TimeSlotButton";
import "../Styles/styles.css";
import toast, { Toaster } from "react-hot-toast";

const generateTimeSlots = (start, end) => {
  let currentTime = start;
  const slots = [];

  while (currentTime < end) {
    slots.push(`${String(currentTime).padStart(2, "0")}:00`);
    slots.push(`${String(currentTime).padStart(2, "0")}:30`);
    currentTime++;
  }
  return slots;
};

const BookingSystem = () => {
  const timeSlots = generateTimeSlots(10, 19);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [shopBooked, setShopBooked] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const [shopkeepers, setSelectedShopkeepers] = useState([
    { id: 1, name: "Monu", bookedSlots: [] },
    { id: 2, name: "Sonu", bookedSlots: [] },
  ]);

  const updateShopkeeperBooking = (shopkeeperId, selectedTimeSlot) => {
    setSelectedShopkeepers(
      shopkeepers.map((shopkeep) =>
        shopkeep.id === shopkeeperId
          ? {
              ...shopkeep,
              bookedSlots: [...shopkeep.bookedSlots, selectedTimeSlot],
            }
          : shopkeep
      )
    );
  };

  const checkIfAllShopkeepersBooked = (selectedTimeSlot) => {
    return shopkeepers.every((shopkeep) =>
      shopkeep.bookedSlots.includes(selectedTimeSlot)
    );
  };

  const bookShopkeeper = () => {
    const shopkeeper = shopkeepers.find(
      (shopkeep) => shopkeep.id === selectedBooking
    );

    const isShopkeeperBooked =
      shopkeeper.bookedSlots.includes(selectedTimeSlot);

    if (isShopkeeperBooked) {
      toast.error(`${shopkeeper.name} is already booked for that time slot`);
    }

    updateShopkeeperBooking(selectedBooking, selectedTimeSlot);

    if (checkIfAllShopkeepersBooked(selectedTimeSlot)) {
      toast.success("Shop successfully booked");
    }

    selectedBooking(null);
    selectedTimeSlot(null);
  };

  const book_shop = () => {
    const availableShopkeeper = shopkeepers.map(
      (shopkeep) => !shopkeep.bookedSlots.includes(selectedTimeSlot)
    );

    if (
      availableShopkeeper.length === 0 ||
      shopBooked.includes(selectedTimeSlot)
    ) {
      toast.error("Sonu Monu both are busy!!");
      return;
    }

    const shopkeeper = availableShopkeeper[0];

    updateShopkeeperBooking(shopkeeper, selectedTimeSlot);

    setSelectedBooking(null);
    setSelectedTimeSlot(null);
  };

  const hasBookings =
    shopBooked.length > 0 ||
    shopkeepers.some((shopkeep) => shopkeep.bookedSlots.length > 0);

  const combinedBookings = [
    ...shopBooked.map((slot) => ({ type: "shop", slot })),
    ...shopkeepers.flatMap((shopkeep) =>
      shopkeep.bookedSlots.map((slot) => ({ type: shopkeep.name, slot }))
    ),
  ];

  combinedBookings.sort((a, b) => {
    const timeA = a.slot.split(":").map(Number);
    const timeB = b.slot.split(":").map(Number);

    return timeA[0] - timeB[0] || timeA[1] - timeB[1];
  });

  const clearAllSlots = () => {
    setShopBooked(
      shopkeepers.map((shopkeep) => [{ ...shopkeep, bookedSlots: [] }])
    );
    setShopBooked([]);
    toast.success("All slots cleared successfully");
  };

  return (
    <>
      <div className="shopname">
        <h1>
          Sonu <span>Monu</span>
        </h1>
      </div>

      <div className="shop-container">
        <div className="booking-options">
          {!selectedBooking && (
            <>
              <BookingButton
                onClick={() => {
                  setSelectedBooking("shop");
                }}
                label={"Book Shop"}
              ></BookingButton>
              {shopkeepers.map((shopkeep) => (
                <BookingButton
                  key={shopkeep.id}
                  onClick={() => {
                    setSelectedBooking(shopkeep.id);
                  }}
                  label={`Book ${shopkeep.name}`}
                ></BookingButton>
              ))}
            </>
          )}

          {selectedBooking && (
            <div className="time-slot-selection">
              <h2>
                {selectedBooking === "shop"
                  ? "Shop"
                  : shopkeepers.find(
                      (shopkeep) => (shopkeep.id === selectedBooking).name
                    )}{" "}
                - Select Time Slot
              </h2>

              <div className="time-slot-grid">
                {timeSlots.map((slot) => {
                  const isBooked =
                    selectedBooking === "shop"
                      ? shopBooked.includes(slot) ||
                        checkIfAllShopkeepersBooked(slot)
                      : shopkeepers
                          .find((shopkeep) => shopkeep.id === selectedBooking)
                          .bookedSlots.includes(slot);

                  const handleClick = () => {
                    if (isBooked) {
                      toast.error("This slot is already booked");
                    }

                    setSelectedTimeSlot(slot);
                  };

                  return (
                    <TimeSlotsButton
                      slot={slot}
                      key={slot}
                      isBooked={isBooked}
                      style={{
                        backgroundColor: isBooked
                          ? "#EF4444"
                          : slot === selectedTimeSlot
                          ? "#10B981"
                          : "#475569",
                        color: "white",
                      }}
                      onClick={handleClick}
                    ></TimeSlotsButton>
                  );
                })}
              </div>

              <div className="action-buttons">
                <button
                  onClick={() =>
                    selectedBooking === "shop" ? book_shop() : bookShopkeeper()
                  }
                  disabled={!selectedTimeSlot}
                  className={
                    selectedBooking === "shop"
                      ? "book-shop-button"
                      : "book-shopkeeper-button"
                  }
                >
                  Book Slot
                </button>
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setSelectedTimeSlot(null);
                  }}
                >
                  Go back to Booking Options
                </button>
              </div>
            </div>
          )}
        </div>
        {!selectedBooking && (
          <div className="booking-list">
            <h2>Booking :</h2>
            <ul>
              {combinedBookings.map(({ type, slot }) => (
                <li key={`${type}-${slot}`}>
                  {slot} ({type})
                </li>
              ))}
            </ul>

            {hasBookings ? (
              <button onClick={clearAllSlots} className="clear-slots-button">
                Clear Slots
              </button>
            ) : (
              <button className="no-booked-slots-button">
                No booked slots available
              </button>
            )}
          </div>
        )}
      </div>

      <Toaster position="top-right"></Toaster>
    </>
  );
};

export default BookingSystem;
