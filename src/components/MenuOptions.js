import React from "react";
import { Fade } from "react-awesome-reveal";

const MenuOptions = ({ onExit, onNavigate }) => {
  const options = [
    { label: "Book unreserved ticket", action: () => onNavigate("book") },
    { label: "Ticket history", action: () => onNavigate("history") },
    { label: "Wallets & recharges", action: () => onNavigate("wallet") },
    { label: "Exit", action: onExit },
  ];

  return (
    <div className="w-80 bg-white p-6 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">Menu</h2>
      <div className="flex flex-col space-y-4">
        {options.map((opt, index) => (
          <Fade key={opt.label} direction="up" triggerOnce delay={index * 150}>
            <button
              onClick={opt.action}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              {opt.label}
            </button>
          </Fade>
        ))}
      </div>
    </div>
  );
};

export default MenuOptions;
