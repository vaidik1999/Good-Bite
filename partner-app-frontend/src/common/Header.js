import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Import the logout icon

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.setItem("restaurant_id", "");
      localStorage.removeItem(
        "firebase:authUser:[AIzaSyBMXP3EqiPQEP6f91mMekTuiBTp-Uw6baE]:[csci5410-serverless-auth]"
      );
    } catch (error) {
      console.error("Error signing out:", error);
    }
    navigate("/signin");
  };
  const navigateToView = () => {
    navigate("/view");
  };
  const navigateToHome = () => {
    navigate("/holistic");
  };
  const navigateToResDetails = () => {
    navigate("/restaurant-details");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="h6" color="inherit" onClick={navigateToHome}>
          GoodBite
        </Button>

        <div>
          <Button color="inherit" onClick={navigateToResDetails}>
            Restaurant Details
          </Button>
          <Button color="inherit" onClick={navigateToView}>
            View Bookings
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            SignOut
            <ExitToAppIcon /> {/* Logout icon */}
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
