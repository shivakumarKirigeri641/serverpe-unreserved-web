import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";

const TicketHistory = () => {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/tickets"); // your API endpoint
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(
    (t) =>
      t.source.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-4">Ticket History</h2>

      <input
        type="text"
        placeholder="Search by source or destination"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="peer w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-lg mb-4 rounded-lg"
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading tickets...</p>
      ) : filteredTickets.length === 0 ? (
        <p className="text-center text-gray-400">No tickets found</p>
      ) : (
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2">Source</th>
                <th className="border-b p-2">Destination</th>
                <th className="border-b p-2">Date</th>
                <th className="border-b p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t, idx) => (
                <Fade key={idx} direction="up" triggerOnce delay={idx * 50}>
                  <tr className="hover:bg-indigo-50 transition">
                    <td className="p-2">{t.source}</td>
                    <td className="p-2">{t.destination}</td>
                    <td className="p-2">{t.date}</td>
                    <td className="p-2">{t.status}</td>
                  </tr>
                </Fade>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketHistory;
