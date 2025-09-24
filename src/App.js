import React, { useState } from "react";
import Login from "./components/Login";
import MenuOptions from "./components/MenuOptions";
import Loading from "./components/Loading";
import BookTickets from "./components/BookTickets";
import TicketHistory from "./components/TicketHistory";
import Wallet from "./components/Wallet";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("menu");
  const [loading, setLoading] = useState(false);

  // OTP verified → login success
  const handleOtpVerified = () => {
    setLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setCurrentPage("menu");
      setLoading(false);
    }, 800); // simulate API delay
  };

  // Navigate menu
  const handleNavigate = (page) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setLoading(false);
    }, 500); // simulate page load
  };

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("menu");
  };

  // Render current page
  const renderContent = () => {
    if (loading) return <Loading />;

    if (!isLoggedIn) return <Login onVerified={handleOtpVerified} />;

    if (currentPage === "menu")
      return <MenuOptions onNavigate={handleNavigate} onExit={handleLogout} />;

    switch (currentPage) {
      case "book":
        return <BookTickets />;
      case "history":
        return <TicketHistory />;
      case "wallet":
        return <Wallet />;
      default:
        return (
          <MenuOptions onNavigate={handleNavigate} onExit={handleLogout} />
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {renderContent()}
    </div>
  );
};

export default App;
