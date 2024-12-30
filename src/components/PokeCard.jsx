import React, { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

function PokeCard({ selectPokemon }) {
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);
  const [loadingSkills, setLoadingSkill] = useState(false);
  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) {
      return false;
    }
    if (["versions", "other"].includes(val)) {
      return false;
    }
    return true;
  });

  async function fetchmoveData(move, moveUrl) {
    if (loadingSkills || !localStorage || !moveUrl) {
      return;
    }
    //check cache
    let c = {};
    if (localStorage.getItem("pokemon-moves")) {
      c = JSON.parse(localStorage.getItem("pokemon-moves"));
    }
    if (move in c) {
      setSkill(c[move]);
      console.log("found move in cache");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();
      console.log("fetch move from api", moveData);
      const description = moveData?.flavor_text_entries?.filter((val) => {
        return (val.version_group.name = "firered-leafgreen");
      })[0]?.flavor_text;

      const skillData = {
        name: move,
        description,
      };
      setSkill(skillData);
      c[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(c));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    //if loading exit loop;
    if (loading || !localStorage) return;

    //Check if the selected pokemon onfo is available in cache
    //1.define the cache
    let cache = {};
    if (localStorage.getItem("pokedex")) {
      cache = JSON.parse(localStorage.getItem("pokedex"));
    }

    //2.check the selected pokemon in the cache, otherwise fetch from the api
    if (selectPokemon in cache) {
      setdata(cache[selectPokemon]);
      console.log("Found pokemon in cache");

      return;
    }
    //we passed all the cache  stuff to no avail and now need to fetch the data from the api

    async function fetchPokemonData() {
      setLoading(true);
      try {
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = "pokemon/" + getPokedexNumber(selectPokemon);
        const finalUrl = baseUrl + suffix;
        const res = await fetch(finalUrl);
        const pokemonData = await res.json();
        setdata(pokemonData);
        cache[selectPokemon] = pokemonData;
        localStorage.setItem("pokedex", JSON.stringify(cache));
      } catch (err) {
        console.log("====error", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPokemonData();

    //if we fetch from the api , make sure to save the information to the next time
  }, [selectPokemon]);

  // if (loading || !data) {
  //   return (
  //     <div>
  //       <h4>Loading...</h4>
  //     </div>
  //   );
  // }

  if (loading || !data) {
    return (
      <div>
        <h4>Loading.....</h4>
      </div>
    );
  }

  return (
    <div className="poke-card">
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div>
            <h6>Name</h6>
            <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
          </div>
          <div>
            <h6>description</h6>
            <p>{skill.description}</p>
          </div>
        </Modal>
      )}
      <div>
        <h4>#{getFullPokedexNumber(selectPokemon)}</h4>
        <h2>{name} </h2>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIndex) => {
          return <TypeCard type={typeObj?.type?.name} key={typeIndex} />;
        })}
      </div>
      <div className="img-container">
        <img
          src={"/pokemon/" + getFullPokedexNumber(selectPokemon) + ".png"}
          alt={`${name}-large-img`}
        />
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites[spriteUrl];
          return <img src={imgUrl} key={spriteIndex} />;
        })}
      </div>
      <h4>States</h4>
      <div className="stats-card">
        {stats.map((statObj, statIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={statIndex} className="stat-item">
              <p>{stat.name.replaceAll("-", "")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((moveObj, moveIndex) => {
          return (
            <button
              className="button-card pokemon-move"
              key={moveIndex}
              onClick={() => {
                fetchmoveData(moveObj?.move?.name, moveObj?.move?.url);
              }}
            >
              <p>{moveObj?.move?.name.replaceAll("-", "  ")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PokeCard;
