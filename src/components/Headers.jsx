import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function Headers({ handleToggleMenu }) {
  return (
    <header>
      <button className="open-nav-button" onClick={() => handleToggleMenu()}>
        <i class="fa-solid fa-bars"></i>
      </button>
      <h1 className="text-gradient">Pokémon</h1>
    </header>
  );
}

export default Headers;
