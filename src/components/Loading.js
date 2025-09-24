import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-80 h-40 bg-white p-6 rounded-3xl shadow-xl">
      <div className="flex flex-col items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading...</p>
      </div>
      <style jsx>{`
        .loader {
          border-top-color: #4f46e5;
        }
      `}</style>
    </div>
  );
};

export default Loading;
