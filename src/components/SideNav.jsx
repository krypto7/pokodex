import React, { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils";

function SideNav({
  selectPokemon,
  setSelectPokemon,
  handleToggleMenu,
  showSideMenu,
  handleCloseMenu,
}) {
  const [searchValue, setSearchValue] = useState("");

  const filteredPokemon = first151Pokemon.filter((elem, elemIndex) => {
    //if full pokedex number includes the current search value, return true
    if (getFullPokedexNumber(elemIndex).includes(searchValue)) {
      return true;
    }

    //if the pokemon name incudes current search value return true
    if (elem.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }

    //otherwise exclude from array
    return false;
  });

  return (
    <nav className={" " + (!showSideMenu ? " open" : "")}>
      <div className={"header " + (!showSideMenu ? "open" : "")}>
        <button className="open-nav-button" onClick={handleToggleMenu}>
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-gradient">Pokémon</h1>
      </div>
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="e.g 001 or Bulba..."
      />
      {filteredPokemon.map((item, index) => {
        const truePokedex = first151Pokemon.indexOf(item);
        return (
          <button
            onClick={() => {
              setSelectPokemon(truePokedex);
              handleCloseMenu();
            }}
            className={
              "nav-card" + (index === selectPokemon ? "nav-card-selected" : " ")
            }
            key={index}
          >
            <p>{getFullPokedexNumber(truePokedex)}</p>
            <p>{item}</p>
          </button>
        );
      })}
    </nav>
  );
}

export default SideNav;
