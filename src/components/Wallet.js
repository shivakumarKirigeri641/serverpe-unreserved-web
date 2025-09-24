import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/wallet"); // your API endpoint
        const data = await res.json();
        setBalance(data.balance);
        setTransactions(data.transactions);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchWallet();
  }, []);

  return (
    <div className="w-80 bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-4">
        Wallet & Transactions
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading wallet...</p>
      ) : (
        <>
          <div className="text-center text-xl mb-4 font-semibold">
            Balance: ₹{balance.toFixed(2)}
          </div>

          {transactions.length === 0 ? (
            <p className="text-center text-gray-400">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b p-2">Date</th>
                    <th className="border-b p-2">Amount</th>
                    <th className="border-b p-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, idx) => (
                    <Fade key={idx} direction="up" triggerOnce delay={idx * 50}>
                      <tr className="hover:bg-indigo-50 transition">
                        <td className="p-2">{t.date}</td>
                        <td className="p-2">₹{t.amount.toFixed(2)}</td>
                        <td className="p-2">{t.type}</td>
                      </tr>
                    </Fade>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Wallet;
