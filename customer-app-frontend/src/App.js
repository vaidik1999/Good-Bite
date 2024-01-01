import React from "react";
import "./App.css";
import Router from "./routes";
import { BrowserRouter } from "react-router-dom";
import Header from "./common/Header";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Router />
      </div>
    </BrowserRouter>
  );
}

export default App;
