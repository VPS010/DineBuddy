import React, { useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { geoFenceState } from "../store/atoms";
import { ConfirmationDialog } from "./ConfirmationDialog";

const LocationVerification = ({ onLocationVerified, onLocationDenied }) => {
  const geoFence = useRecoilValue(geoFenceState);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showPreBookDialog, setShowPreBookDialog] = useState(false);
  const hasLocationPermissionRef = useRef(false);

  // Function to check if user is within geofence boundaries
  const checkGeofenceBoundary = (userLat, userLng) => {
    if (!geoFence.coordinates || geoFence.coordinates.length !== 2) {
      console.error("Invalid fence coordinates");
      return false;
    }

    const [[lat1, lng1], [lat2, lng2]] = geoFence.coordinates;

    return (
      userLat >= Math.min(lat1, lat2) &&
      userLat <= Math.max(lat1, lat2) &&
      userLng >= Math.min(lng1, lng2) &&
      userLng <= Math.max(lng1, lng2)
    );
  };

  // Function to verify user's location
  const verifyLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const isWithin = checkGeofenceBoundary(latitude, longitude);
          console.log(
            "Location check:",
            isWithin ? "Inside restaurant" : "Outside restaurant",
            `(${latitude}, ${longitude})`
          );
          hasLocationPermissionRef.current = true;
          resolve(isWithin);
        },
        (error) => {
          console.error("Geolocation error:", error);
          hasLocationPermissionRef.current = false;
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });
  };

  const handleLocationPermission = async () => {
    try {
      const isWithin = await verifyLocation();
      setShowLocationDialog(false);

      if (isWithin) {
        onLocationVerified();
      } else {
        toast.error("You appear to be outside the restaurant.");
        setShowPreBookDialog(true);
      }
    } catch (error) {
      console.error("Location verification failed:", error);
      toast.error("Unable to verify location. Please try again.");
      setShowLocationDialog(false);
      onLocationDenied();
    }
  };

  const handlePreBook = () => {
    console.log("Redirecting to pre-booking page...");
    setShowPreBookDialog(false); // Hide the pre-book dialog
    onLocationDenied(); // Execute any other necessary logic
    window.location.href = "https://dinebuddy.in"; // Redirect to the new link
};


  const startVerification = async () => {
    try {
      if (hasLocationPermissionRef.current) {
        const isWithin = await verifyLocation();
        if (isWithin) {
          onLocationVerified();
        } else {
          setShowPreBookDialog(true);
        }
      } else {
        setShowLocationDialog(true);
      }
    } catch (error) {
      console.error("Location verification failed:", error);
      toast.error("Unable to verify location. Please try again.");
      onLocationDenied();
    }
  };

  return {
    startVerification,
    dialog: (
      <>
        <ConfirmationDialog
          isOpen={showLocationDialog}
          title="Location Verification"
          message="We need to verify your location to process your order. Please allow location access."
          onConfirm={handleLocationPermission}
          onCancel={() => {
            setShowLocationDialog(false);
            onLocationDenied();
          }}
          confirmText="Allow Location"
          confirmButtonClass="bg-[#C5A572] hover:bg-[#B59562]"
        />

        <ConfirmationDialog
          isOpen={showPreBookDialog}
          title="Pre-Book Your Order"
          message="You're currently outside the restaurant. Would you like to pre-book your order instead?"
          onConfirm={handlePreBook}
          onCancel={() => {
            setShowPreBookDialog(false);
            onLocationDenied();
          }}
          confirmText="Pre-Book Order"
          confirmButtonClass="bg-[#C5A572] hover:bg-[#B59562]"
        />
      </>
    ),
  };
};

export default LocationVerification;
