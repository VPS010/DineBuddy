import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";

const JAWG_API_KEY = import.meta.env.VITE_JAWG_API_KEY;

const MapCenterer = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const GeoFenceSelector = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [bounds, setBounds] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [center, setCenter] = useState([51.505, -0.09]);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef(null);

  const jawgConfig = {
    url: `https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=${JAWG_API_KEY}`,
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    subdomains: "abcd",
    accessToken: JAWG_API_KEY,
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      notifyUser("Please enter a location to search");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCenter([parseFloat(lat), parseFloat(lon)]);
        notifyUser("Location found successfully");
      } else {
        notifyUser("Location not found. Please try a different search term");
      }
    } catch (error) {
      notifyUser("Error searching location. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const notifyUser = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          notifyUser("Location updated successfully");
          setIsLoading(false);
        },
        () => {
          notifyUser("Unable to get location");
          setIsLoading(false);
        }
      );
    }
  };

  const MapEvents = () => {
    const map = useMapEvents({
      mousedown: (e) => {
        if (isDrawMode && !isDrawing) {
          setIsDrawing(true);
          setStartPoint(e.latlng);
          map.dragging.disable();
        }
      },
      mousemove: (e) => {
        if (isDrawMode && isDrawing && startPoint) {
          const newBounds = new LatLngBounds(startPoint, e.latlng);
          setBounds(newBounds);
        }
      },
      mouseup: () => {
        if (isDrawMode && isDrawing) {
          setIsDrawing(false);
          map.dragging.enable();
        }
      },
    });
    return null;
  };

  const handleSubmit = async () => {
    if (!bounds) {
      notifyUser("Please draw a geo-fence area first");
      return;
    }

    try {
      const northWest = bounds.getNorthWest();
      const southEast = bounds.getSouthEast();

      // Structure exactly matching the schema
      const updateData = {
        geoFence: {
          coordinates: [
            [northWest.lat, northWest.lng],
            [southEast.lat, southEast.lng],
          ],
        },
      };

      console.log("Sending geoFence data:", updateData); // Debug log

      const token = localStorage.getItem("authorization");

      const response = await axios.put(
        "https://dinebuddy.in/api/v1/admin/restaurant",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.message) {
        notifyUser("Geo-fence saved successfully");
        console.log("Updated restaurant data:", response.data.restaurant);
      }
    } catch (error) {
      console.error("Error saving geofence:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to save geo-fence";
      notifyUser(errorMessage);
    }
  };

  const toggleDrawMode = () => {
    setIsDrawMode(!isDrawMode);
    notifyUser(
      isDrawMode
        ? "Draw mode disabled"
        : "Draw mode enabled - Click and drag to draw fence"
    );
  };

  const resetGeoFence = () => {
    setBounds(null);
    notifyUser("Geo-fence reset");
  };

  if (!JAWG_API_KEY) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
          Please set your Jawg API key at the top of the component.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, address, or location..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Use Current Location"}
          </button>
        </form>
        <div className="flex gap-2">
          <button
            onClick={toggleDrawMode}
            className={`px-4 py-2 text-white rounded ${
              isDrawMode
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isDrawMode ? "Exit Draw Mode" : "Enter Draw Mode"}
          </button>
          <button
            onClick={resetGeoFence}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset Geo-fence
          </button>
        </div>
        {notification && (
          <div className="p-2 bg-blue-100 rounded">{notification}</div>
        )}
      </div>

      <div className="h-96 mb-4">
        <MapContainer center={center} zoom={13} ref={mapRef} className="h-full">
          <TileLayer
            url={jawgConfig.url}
            attribution={jawgConfig.attribution}
          />
          <MapEvents />
          <MapCenterer center={center} />
          {bounds && (
            <Rectangle bounds={bounds} pathOptions={{ color: "blue" }} />
          )}
        </MapContainer>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Geo-fence
      </button>
    </div>
  );
};

export default GeoFenceSelector;
