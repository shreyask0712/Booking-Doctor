import React, { useState } from "react";
import BookingButton from "./Bookingbutton";
import TimeSlots from "../Timeslots/TimeSlot";
import { Toaster, toast } from "react-hot-toast";

const generateTimeSlots = (start, end) => {
  const slots = [];
  let current = start;
  while (current < end) {
    slots.push(`${String(current).padStart(2, "0")}:00`);
    slots.push(`${String(current).padStart(2, "0")}:30`);
    current++;
  }

  return slots;
};

const timeSlots = generateTimeSlots(10, 19);

const BookingSystem = () => {
  const { doctors, setDoctors } = useState([
    { id: 1, name: "Doctor 1", bookedSlots: [] },
    { id: 2, name: "Doctor 2", bookedSlots: [] },
  ]);

  const { selectedBooking, setSelectedBooking } = useState(null);
  const { clinicBooked, setClinicBooked } = useState([]);
  const { selectedTimeSlot, setselectedTimeSlot } = useState(null);

  const checkIfAllDoctorsBooked = (slot) => {
    return doctors.every((doc) => doctors.bookedSlots.includes(slot));
  };

  const updateDoctorBooking = (doctorId, slot) => {
    setDoctors(
      doctors.map((doc) =>
        doc.id === doctorId
          ? { ...doc, bookedSlots: [...doc.bookedSlots, slot] }
          : { doc }
      )
    );
  };

  const bookDocSlots = () => {
    const doctor = doctors.find((doc) => doc.id === selectedBooking);
    const isDoctorBooked = doctors.bookedSlots.find(slot);

    if (isDoctorBooked) {
      toast.error("Doctor is Booked!");
    }

    updateDoctorBooking(selectedBooking, selectedTimeSlot);

    if (checkIfAllDoctorsBooked(setselectedTimeSlot)) {
      setClinicBooked([...setClinicBooked], setselectedTimeSlot);
      toast.success("Time slot successfully booked for doctor and clinic");
    }

    setselectedTimeSlot(null);
    setSelectedBooking(null);
  };

  const bookClinic = () => {
    const availableDoctor = doctors.filter(
      (doc) => !doc.bookedSlots.includes(selectedTimeSlot)
    );

    if (!availableDoctor) {
      toast.error("No available doctors!");
    }

    updateDoctorBooking(availableDoctor, selectedTimeSlot);

    if (checkIfAllDoctorsBooked(selectedTimeSlot)) {
      toast.success("All slots successfully booked for the clinic");
    }

    setselectedTimeSlot(null);
    setSelectedBooking(null);
  };

  const clearAllSlots = () => {
    setDoctors(doctors.map((doc) => ({ ...doc, bookedSlots: [] })));
  };

  const hasBookings =
    clinicBooked.length > 0 ||
    doctors.some((doc) => doc.bookedSlots.length > 0);

  const combinedBookings = [
    ...clinicBooked.map((slot) => ({ type: "clinic" }, slot)),
    ...doctors.flatMap((doc) =>
      doc.bookedSlots.map((slot) => ({ type: doc.name }, slot))
    ),
  ];

  combinedBookings.sort((a, b) => {});

  return <div>Hello</div>;
};

export default BookingSystem;
