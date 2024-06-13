import React from "react";
import { Link } from 'react-router-dom'; 

const NotFoundPage = () => {
  return (
    <div
      id="notfound"
      style={{ background: "#030005", position: "relative", height: "100vh" }}
    >
      <div
        className="notfound"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "767px",
          width: "100%",
          lineHeight: "1.4",
          textAlign: "center",
        }}
      >
        <div
          className="notfound-404"
          style={{
            position: "relative",
            height: "180px",
            marginBottom: "20px",
            zIndex: "-1",
          }}
        >
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50% , -50%)",
              fontSize: "224px",
              fontWeight: "900",
              marginTop: "0px",
              marginBottom: "0px",
              marginLeft: "-12px",
              color: "#030005",
              textTransform: "uppercase",
              textShadow: "-1px -1px 0px #8400ff, 1px 1px 0px #ff005a",
              letterSpacing: "-20px",
            }}
          >
            404
          </h1>
          <h2
            style={{
              fontFamily: "Montserrat, sans-serif",
              position: "absolute",
              left: "0",
              right: "0",
              top: "110px",
              fontSize: "42px",
              fontWeight: "700",
              color: "#fff",
              textTransform: "uppercase",
              textShadow: "0px 2px 0px #8400ff",
              letterSpacing: "13px",
              margin: "0",
            }}
          >
            Page not found
          </h2>
        </div>
        <Link
          to="/"
          style={{
            fontFamily: "Montserrat, sans-serif",
            display: "inline-block",
            textTransform: "uppercase",
            color: "#ff005a",
            textDecoration: "none",
            border: "2px solid",
            background: "transparent",
            padding: "10px 40px",
            fontSize: "14px",
            fontWeight: "700",
            transition: "0.2s all",
          }}
        >
          Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
