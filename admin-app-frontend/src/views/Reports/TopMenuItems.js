import React, { useState, useEffect } from "react";
import Footer from "../../common/Footer";

const TopMenuItems = () => {
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
          src="https://lookerstudio.google.com/embed/reporting/2a30274f-6cfe-4112-a31c-28d3f1632d02/page/De4jD"
          frameBorder="0"
          style={{ width: "100%", height: "100%", border: "0" }} // Full width and height, no border
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TopMenuItems;
