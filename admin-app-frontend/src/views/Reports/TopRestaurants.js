import React, { useState, useEffect } from "react";
import Footer from "../../common/Footer";

const TopRestaurants = () => {
  useEffect(() => {}, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <iframe
          src="https://lookerstudio.google.com/embed/reporting/a8755d9a-e1f6-488e-968c-424c567b3b21/page/EK4jD"
          frameBorder="0"
          style={{ width: "100%", height: "100%", border: "0" }} // Full width and height, no border
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TopRestaurants;
