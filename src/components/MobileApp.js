import React, { useState } from "react";
import { Fade, Slide } from "react-awesome-reveal";
import AppLayout from "../components/AppLayout";
import Login from "../components/Login";
import MenuOptions from "../components/MenuOptions";
import BookTickets from "../pages/BookTickets";

const MobileApp = () => {
  const [verified, setVerified] = useState(false);
  const [activePage, setActivePage] = useState("menu"); // "menu" | "book"

  const handleLogout = () => {
    setVerified(false);
    setActivePage("menu");
  };

  return (
    <AppLayout onLogout={handleLogout} showHeaderIcons={verified}>
      {!verified ? (
        <div className="flex flex-col items-center w-full">
          {/* Welcome Header */}
          <Fade direction="down" triggerOnce>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                Welcome to ServerPe
              </h1>
              <p className="text-gray-200 text-sm mt-1">
                Unreserved ticketing system
              </p>
              <p className="text-gray-100 text-xs mt-1 italic">
                'Kar'cheap mein tick'hit'
              </p>
            </div>
          </Fade>

          {/* OTP Login */}
          <Slide direction="up" triggerOnce>
            <Login onVerified={() => setVerified(true)} />
          </Slide>
        </div>
      ) : (
        <>
          {activePage === "menu" && (
            <MenuOptions
              onExit={() => setVerified(false)}
              onNavigate={(page) => setActivePage(page)}
            />
          )}
          {activePage === "book" && <BookTickets />}
        </>
      )}
    </AppLayout>
  );
};

export default MobileApp;
