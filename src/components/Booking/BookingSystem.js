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
      return; // Return early if the slot is already booked.
    }

    updateShopkeeperBooking(selectedBooking, selectedTimeSlot);

    if (checkIfAllShopkeepersBooked(selectedTimeSlot)) {
      const existingEntry = shopBooked.find(
        (entry) => entry.slot === selectedTimeSlot
      );
      if (existingEntry) {
        existingEntry.count++;
      } else {
        setShopBooked([...shopBooked, { slot: selectedTimeSlot, count: 1 }]);
      }
    } else {
      setShopBooked([
        ...shopBooked,
        { slot: selectedTimeSlot, count: 1, shopkeeper: shopkeeper.name },
      ]);
    }

    setSelectedBooking(null);
    setSelectedTimeSlot(null);
  };

  const book_shop = () => {
    const availableShopkeeper = shopkeepers.find(
      (shopkeep) => !shopkeep.bookedSlots.includes(selectedTimeSlot)
    );

    if (
      !availableShopkeeper ||
      shopBooked.some(
        (entry) =>
          entry.slot === selectedTimeSlot && entry.count === shopkeepers.length
      )
    ) {
      toast.error("Sonu Monu both are busy!!");
      return;
    }

    updateShopkeeperBooking(availableShopkeeper.id, selectedTimeSlot);

    const existingEntry = shopBooked.find(
      (entry) => entry.slot === selectedTimeSlot
    );
    if (existingEntry) {
      existingEntry.count++;
    } else {
      setShopBooked([...shopBooked, { slot: selectedTimeSlot, count: 1 }]);
    }

    setSelectedBooking(null);
    setSelectedTimeSlot(null);
  };

  const clearAllSlots = () => {
    setShopBooked([]);
    setSelectedShopkeepers(
      shopkeepers.map((shopkeep) => ({ ...shopkeep, bookedSlots: [] }))
    );
    toast.success("All slots cleared successfully");
  };

  const combinedBookings = [
    ...shopBooked.map(({ slot, count, shopkeeper }) => ({
      slot,
      label: shopkeeper ? `${shopkeeper} (Shop)` : `Shop (${count})`,
    })),
    ...shopkeepers.flatMap((shopkeep) =>
      shopkeep.bookedSlots.map((slot) => ({
        slot,
        label: `${slot} (${shopkeep.name})`,
      }))
    ),
  ];

  combinedBookings.sort((a, b) => {
    const timeA = a.slot.split(":").map(Number);
    const timeB = b.slot.split(":").map(Number);

    return timeA[0] - timeB[0] || timeA[1] - timeB[1];
  });

  const handleClick = (slot, isBooked) => {
    if (isBooked) {
      toast.error("This slot is already booked");
      return;
    }
    setSelectedTimeSlot(slot);
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
              />
              {shopkeepers.map((shopkeep) => (
                <BookingButton
                  key={shopkeep.id}
                  onClick={() => {
                    setSelectedBooking(shopkeep.id);
                  }}
                  label={`Book ${shopkeep.name}`}
                />
              ))}
            </>
          )}

          {selectedBooking && (
            <div className="time-slot-selection">
              <h2>
                {selectedBooking === "shop"
                  ? "Shop"
                  : shopkeepers.find(
                      (shopkeep) => shopkeep.id === selectedBooking
                    ).name}{" "}
                - Select Time Slot
              </h2>

              <div className="time-slot-grid">
                {timeSlots.map((slot) => {
                  const isBooked =
                    selectedBooking === "shop"
                      ? checkIfAllShopkeepersBooked(slot)
                      : shopkeepers
                          .find((shopkeep) => shopkeep.id === selectedBooking)
                          .bookedSlots.includes(slot);

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
                      onClick={() => handleClick(slot, isBooked)}
                    />
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
              {combinedBookings.map(({ slot, label }) => (
                <li key={`${slot}-${label}`}>{label}</li>
              ))}
            </ul>

            {combinedBookings.length > 0 ? (
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
