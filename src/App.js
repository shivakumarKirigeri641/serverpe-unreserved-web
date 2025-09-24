import React from "react";
import "./index.css";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import MobileApp from "./components/MobileApp";

function App() {
  return (
    <Provider store={appStore}>
      <div>
        <MobileApp /> {/* 👈 This should render Login/Menu/etc */}
      </div>
    </Provider>
  );
}

export default App;
