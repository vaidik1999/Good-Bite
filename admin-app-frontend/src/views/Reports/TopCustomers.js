import React, { useState, useEffect } from "react";
import Footer from "../../common/Footer";

const TopCustomers = () => {
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
          src="https://lookerstudio.google.com/embed/reporting/12303afe-dd7e-4ea7-93f1-ca992aace61a/page/754jD"
          frameBorder="0"
          style={{ width: "100%", height: "100%", border: "0" }} // Full width and height, no border
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TopCustomers;
