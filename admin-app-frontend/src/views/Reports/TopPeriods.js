import React, { useState, useEffect } from "react";
import Footer from "../../common/Footer";

const TopPeriods = () => {
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
          src="https://lookerstudio.google.com/embed/reporting/8bf14123-f04d-4d67-8422-f707cb11e18e/page/074jD"
          frameBorder="0"
          style={{ width: "100%", height: "100%", border: "0" }} // Full width and height, no border
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TopPeriods;
