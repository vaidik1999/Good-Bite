import React from "react";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const FooterContainer = styled("footer")({
  backgroundColor: "#1976d2",
  color: "#fff",
  padding: "40px 0",
});

const FooterGridContainer = styled(Grid)({
  maxWidth: "1200px",
  padding: "0 20px",
});

const FooterLogo = styled("img")({
  width: "220px",
  marginBottom: "20px",
});

const FooterTitle = styled(Typography)({
  fontSize: "18px",
  fontWeight: "bold",
  marginBottom: "12px",
});

const FooterLink = styled(Link)({
  color: "#fff",
  fontSize: "14px",
  marginBottom: "8px",
  display: "block",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

const Footer = () => {
  const navigate = useNavigate();
  return (
    <FooterContainer>
      <FooterGridContainer container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          {/* <FooterLogo src={logo} alt="" /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FooterTitle variant="h6">Order</FooterTitle>
          <FooterLink
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Customer
          </FooterLink>
          <FooterLink
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Partner
          </FooterLink>
          <FooterLink
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Admin
          </FooterLink>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FooterTitle variant="h6">About</FooterTitle>
          <FooterLink
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            About GoodBite
          </FooterLink>
          <FooterLink
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            News
          </FooterLink>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FooterTitle variant="h6">Customer Service</FooterTitle>
          <FooterLink
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Contact Us
          </FooterLink>
          <FooterLink
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            FAQ
          </FooterLink>
        </Grid>
      </FooterGridContainer>
    </FooterContainer>
  );
};

export default Footer;
