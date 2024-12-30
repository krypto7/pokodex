import React, { useState } from "react";
import SideNav from "./components/SideNav";
import Headers from "./components/Headers";
import PokeCard from "./components/PokeCard";

function App() {
  const [selectPokemon, setSelectPokemon] = useState(0);
  const [showSideMenu, setShowSideMenu] = useState(true);

  function handleToggleMenu() {
    setShowSideMenu(!showSideMenu);
  }

  function handleCloseMenu() {
    setShowSideMenu(true);
  }

  return (
    <>
      <Headers handleToggleMenu={handleToggleMenu} />
      <SideNav
        selectPokemon={selectPokemon}
        setSelectPokemon={setSelectPokemon}
        handleToggleMenu={handleToggleMenu}
        showSideMenu={showSideMenu}
        handleCloseMenu={handleCloseMenu}
      />
      <PokeCard selectPokemon={selectPokemon} />
    </>
  );
}

export default App;
