import React, { useState, useEffect, useRef } from "react";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import { RefreshCcw } from "lucide-react"; // icon for swap
import axios from "axios";

const BookTickets = () => {
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [sourceQuery, setSourceQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  // Focus on source input when component loads
  useEffect(() => {
    sourceRef.current?.focus();
    fetchStations();
  }, []);

  // Fetch stations from API
  const fetchStations = async () => {
    try {
      const response = await axios.get("/api/stations"); // replace with your endpoint
      setStations(response.data);
    } catch (error) {
      console.error("Failed to fetch stations:", error);
    }
  };

  // Filter stations
  const filterStations = (query) =>
    stations.filter((s) =>
      s.station_name.toLowerCase().includes(query.toLowerCase())
    );

  // Handle select
  const handleSelect = (station, type) => {
    if (type === "source") {
      setSource(station);
      setSourceQuery(station.station_name);
      setShowSourceSuggestions(false);
      destinationRef.current?.focus();
    } else {
      setDestination(station);
      setDestinationQuery(station.station_name);
      setShowDestinationSuggestions(false);
    }
  };

  // Clear field on focus
  const handleFocus = (type) => {
    if (type === "source") {
      setSourceQuery("");
      setSource(null);
      setShowSourceSuggestions(true);
    } else {
      setDestinationQuery("");
      setDestination(null);
      setShowDestinationSuggestions(true);
    }
  };

  // Swap source and destination
  const handleSwap = () => {
    if (source || destination) {
      const tempSource = source;
      const tempQuery = sourceQuery;
      setSource(destination);
      setSourceQuery(destinationQuery);
      setDestination(tempSource);
      setDestinationQuery(tempQuery);
    }
  };

  // Enable search only if both are selected
  const isSearchEnabled = source && destination;

  return (
    <div className="w-80 bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Book Ticket</h2>

      {/* Source Input */}
      <Slide direction="up" triggerOnce>
        <div className="relative mb-4">
          <input
            ref={sourceRef}
            type="text"
            value={sourceQuery}
            onChange={(e) => setSourceQuery(e.target.value)}
            onFocus={() => handleFocus("source")}
            placeholder="Source Station"
            className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-lg"
          />
          {showSourceSuggestions && sourceQuery && (
            <div className="absolute bg-white border rounded mt-1 max-h-40 overflow-auto shadow-lg w-full z-20">
              {filterStations(sourceQuery).map((station) => (
                <Fade key={station.code} triggerOnce>
                  <div
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => handleSelect(station, "source")}
                  >
                    {station.station_name} ({station.code})
                  </div>
                </Fade>
              ))}
            </div>
          )}
        </div>
      </Slide>

      {/* Swap Button */}
      <Zoom triggerOnce>
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwap}
            className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition"
          >
            <RefreshCcw className="text-indigo-600 w-6 h-6" />
          </button>
        </div>
      </Zoom>

      {/* Destination Input */}
      <Slide direction="up" triggerOnce delay={100}>
        <div className="relative mb-4">
          <input
            ref={destinationRef}
            type="text"
            value={destinationQuery}
            onChange={(e) => setDestinationQuery(e.target.value)}
            onFocus={() => handleFocus("destination")}
            placeholder="Destination Station"
            className="w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-lg"
          />
          {showDestinationSuggestions && destinationQuery && (
            <div className="absolute bg-white border rounded mt-1 max-h-40 overflow-auto shadow-lg w-full z-20">
              {filterStations(destinationQuery).map((station) => (
                <Fade key={station.code} triggerOnce>
                  <div
                    className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => handleSelect(station, "destination")}
                  >
                    {station.station_name} ({station.code})
                  </div>
                </Fade>
              ))}
            </div>
          )}
        </div>
      </Slide>

      {/* Current Date */}
      <Fade direction="up" triggerOnce delay={200}>
        <input
          type="text"
          value={new Date().toLocaleDateString()}
          disabled
          className="w-full border-b-2 border-gray-300 bg-gray-100 py-2 px-2 text-gray-500 mb-6 outline-none"
        />
      </Fade>

      {/* Search Button */}
      <Fade direction="up" triggerOnce delay={300}>
        <button
          disabled={!isSearchEnabled}
          className={`w-full py-3 rounded-xl font-semibold mb-3 transition ${
            isSearchEnabled
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          Search
        </button>
      </Fade>
    </div>
  );
};

export default BookTickets;
