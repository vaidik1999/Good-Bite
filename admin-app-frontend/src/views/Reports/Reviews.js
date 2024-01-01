import React, { useState, useEffect } from "react";
import Footer from "../../common/Footer";

const Reviews = () => {
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
          src="https://lookerstudio.google.com/embed/reporting/2d247339-e291-430c-b794-96e8a4e087d7/page/G14jD"
          frameBorder="0"
          style={{ width: "100%", height: "100%", border: "0" }} // Full width and height, no border
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Reviews;
