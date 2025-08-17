import Image from "next/image";
import React from "react";

export default function LevelQuiz({ width = "100%" }) {
  return (
    <div
      style={{
        width,
        backgroundColor: "#020202",
        color: "white",
        fontFamily: "sans-serif",
        padding: "2rem",
        borderRadius: "10px",
      }}
    >
      <h2
        style={{ fontWeight: "bold", fontSize: "1.5rem", marginBottom: "1rem",textAlign: "center" }}
      >
        According to the Image, what is the Perfect strategy?
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[
          "A. Build an excel table",
          "B. Leave it blank",
          "C. Override the strategy",
          "D. Facebook should have two slots",
        ].map((option, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#111",
              padding: "1rem",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}
