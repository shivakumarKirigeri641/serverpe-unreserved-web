import React, { useState } from "react";
import { Menu, LogOut, X } from "lucide-react";
import MenuOptions from "./MenuOptions";

const AppLayout = ({
  children,
  onLogout,
  showHeaderIcons,
  onNavigate,
  onExit,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 to-purple-600">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md relative">
        {/* Left: Menu Icon (hardcoded*/}
        {showHeaderIcons ? (
          <button onClick={() => setDrawerOpen(true)}>
            {/*<Menu className="w-6 h-6 text-indigo-600" />*/}
          </button>
        ) : (
          <div className="w-6 h-6" /> // placeholder
        )}

        {/* Center: Company Name / Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-lg font-bold text-indigo-700">ServerPe</h1>
          {/* Or use logo: <img src="/logo.png" alt="ServerPe" className="h-8" /> */}
        </div>

        {/* Right: Logout Icon */}
        {showHeaderIcons ? (
          <button onClick={onLogout}>
            <LogOut className="w-6 h-6 text-red-500" />
          </button>
        ) : (
          <div className="w-6 h-6" /> // placeholder
        )}
      </header>

      {/* Drawer (Left Slide Menu) */}
      {drawerOpen && (
        <div className="fixed top-0 left-0 w-3/4 h-full bg-white shadow-lg z-30 p-4 flex flex-col">
          {/* Drawer Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-indigo-700">Menu</h2>
            <button onClick={() => setDrawerOpen(false)}>
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Drawer Menu Options */}
          <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
            <MenuOptions
              onExit={() => {
                setDrawerOpen(false);
                onExit();
              }}
              onNavigate={(page) => {
                setDrawerOpen(false);
                onNavigate(page);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-2 text-center text-white text-xs">
        © {new Date().getFullYear()} ServerPe. All rights reserved.
      </footer>
    </div>
  );
};

export default AppLayout;
