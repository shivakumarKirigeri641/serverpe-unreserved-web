import React, { useState, useEffect, useRef } from "react";
import { Slide, Fade } from "react-awesome-reveal";

const BookTickets = () => {
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [sourceFocused, setSourceFocused] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);

  // Set today's date as default
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const sourceRef = useRef(null);
  const destRef = useRef(null);

  // Fetch stations on component load
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch("/api/stations"); // your API endpoint
        const data = await res.json();
        setStations(data);
      } catch (err) {
        console.error("Failed to fetch stations", err);
      }
    };
    fetchStations();
  }, []);

  // Filter suggestions
  const sourceSuggestions = stations.filter(
    (s) =>
      s.station_name.toLowerCase().includes(source.toLowerCase()) &&
      s.station_name !== destination
  );

  const destinationSuggestions = stations.filter(
    (s) =>
      s.station_name.toLowerCase().includes(destination.toLowerCase()) &&
      s.station_name !== source
  );

  // Swap source & destination
  const handleSwap = () => {
    const temp = selectedSource;
    setSelectedSource(selectedDestination);
    setSelectedDestination(temp);
    setSource(selectedDestination ? selectedDestination.station_name : "");
    setDestination(selectedSource ? selectedSource.station_name : "");
  };

  // Select source/destination from suggestions
  const handleSelectSource = (station) => {
    setSelectedSource(station);
    setSource(station.station_name);
    setSourceFocused(false);
  };

  const handleSelectDestination = (station) => {
    setSelectedDestination(station);
    setDestination(station.station_name);
    setDestinationFocused(false);
  };

  // Search button action
  const handleSearch = () => {
    if (selectedSource && selectedDestination) {
      alert(
        `Searching tickets from ${selectedSource.station_name} to ${selectedDestination.station_name} on ${date}`
      );
    }
  };

  return (
    <div className="w-80 bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Book Tickets</h2>

      {/* Source Input */}
      <div className="relative mb-4">
        <input
          type="text"
          ref={sourceRef}
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setSelectedSource(null);
          }}
          onFocus={() => setSourceFocused(true)}
          className="peer w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-lg"
          placeholder="Source Station"
        />
        {sourceFocused && sourceSuggestions.length > 0 && (
          <div className="absolute z-10 bg-white border rounded-xl mt-1 max-h-40 overflow-y-auto w-full shadow-lg">
            {sourceSuggestions.map((s, idx) => (
              <Fade key={s.code} direction="up" triggerOnce delay={idx * 50}>
                <div
                  className={`p-2 cursor-pointer hover:bg-indigo-100 ${
                    idx === 0 ? "bg-indigo-100 font-semibold" : ""
                  }`}
                  onClick={() => handleSelectSource(s)}
                >
                  {s.station_name} ({s.code})
                </div>
              </Fade>
            ))}
          </div>
        )}
      </div>

      {/* Swap Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSwap}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          ↕
        </button>
      </div>

      {/* Destination Input */}
      <div className="relative mb-4">
        <input
          type="text"
          ref={destRef}
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            setSelectedDestination(null);
          }}
          onFocus={() => setDestinationFocused(true)}
          className="peer w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-lg"
          placeholder="Destination Station"
        />
        {destinationFocused && destinationSuggestions.length > 0 && (
          <div className="absolute z-10 bg-white border rounded-xl mt-1 max-h-40 overflow-y-auto w-full shadow-lg">
            {destinationSuggestions.map((s, idx) => (
              <Fade key={s.code} direction="up" triggerOnce delay={idx * 50}>
                <div
                  className={`p-2 cursor-pointer hover:bg-indigo-100 ${
                    idx === 0 ? "bg-indigo-100 font-semibold" : ""
                  }`}
                  onClick={() => handleSelectDestination(s)}
                >
                  {s.station_name} ({s.code})
                </div>
              </Fade>
            ))}
          </div>
        )}
      </div>

      {/* Date Input */}
      <div className="mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={today} // disables past dates
          className="peer w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-lg"
        />
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={!selectedSource || !selectedDestination}
        className={`w-full py-3 rounded-xl font-semibold mb-3 transition ${
          !selectedSource || !selectedDestination
            ? "bg-gray-400 cursor-not-allowed text-gray-200"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        Search
      </button>
    </div>
  );
};

export default BookTickets;
