// import { useState, useEffect } from 'react';
// import GetPokemon from './assets/GetPokemon';
// import type { PokemonData } from './assets/GetPokemon.tsx'
// import db from './assets/GetPokemon'

// function App() {
//   const [pokemon, setPokemon] = useState<PokemonData[]>([]);
//   const [selectedPokemon, setSelectedPokemon] = useState<PokemonData | null>(null);
//   const [errorFound, setErrorFound] = useState('');
//   const [pokeball, setPokeball] = useState('');

//   async function fetchPokemon(pokemonID: number) {
//     try {
//       const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
//       const data = await res.json();
 
//       setErrorFound('')
//       setSelectedPokemon(data);

//       return data;

//     } catch (error) {
//       console.log(error);
//       setErrorFound('Found no Pokémon with that ID.');
//       setSelectedPokemon(null);
//     }
//   }

//   function startCountdown() {
//     // instert randomly timed countdown before user finds pokemon
//     const chosenPokemon = Math.floor(Math.random() * 1017);

//     // pokemon found (aka timer reached 0)
//     if (chosenPokemon) {
//       fetchPokemon(chosenPokemon);
//     }
//   }

//   async function handleClick() {
//       try{
//         // const names = [];
//         const client = await db.connect();
//         console.log('Succesfully connected.');
        
//         // for(let i = 0; i < 10000; i++) {
//         //     const name = await getRandomNames();
//         //     names.push(`('${name}')`);
//         // }

//         // const insertQuery = `INSERT INTO names (name) VALUES ${names.join(',')}`;
//         // await client.query(insertQuery);
//         // await Promise.all(names.map((name) => client.query(insertQuery, [name])));

//         // const getQuery = 'SELECT * FROM names';
//         // const results = await client.query(getQuery);
//         // console.log(results.rows);
        
//         client.release();

//     } catch(error) {
//         console.log(error);
//     }
//   }
  
//   useEffect(() => {
//     if(pokemon.length > 0) {
//       setSelectedPokemon(pokemon[0]);
//     }
//   },[pokemon]);

//   return (
//     <>
//      <div id="background" className="w-full h-screen flex flex-col gap-20 overflow-hidden">
//         <div className="w-full h-2/6 mt-56 ml-60">
//           {errorFound}
//           {selectedPokemon && <GetPokemon data={selectedPokemon} />}
//         </div>

//         <div className="w-full flex justify-center items-center flex-row-reverse gap-40">
//           <button onClick={handleClick} id="pokeball" className="h-40 w-40"></button>
//           <button onClick={startCountdown} className="bg-green-700 border-4 border-green-900 rounded-lg p-4 text-green-100 text-2xl"> <strong>Explore further!</strong></button>
//         </div>
//      </div>
//     </>
//   )
// }

// export default App

import { useState, useEffect } from "react";
import GetPokemon from "./components/GetPokemon.tsx";
import type { PokemonData } from "./components/GetPokemon.tsx";

function App() {
  const random = Math.floor(Math.random() * 1017)

  const [pokemon, setPokemon] = useState<PokemonData>({} as PokemonData)
  const [catchStatus, setCatchStatus] = useState("")

  async function fetchPokemon() {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + random);
    const data = await res.json();

    setPokemon(data);
  }
  useEffect(() => {
    fetchPokemon()
  }, [])

  function tryCatchNormal(exp: number) {
    if(catchStatus == "Pokemon caught" || catchStatus == "You already caught this Pokemon!") {
      setCatchStatus("You already caught this Pokemon!")
    } else {

      const catchChance = Math.random()
      const pokeCaught = -0.00109 * exp + 0.54909
      if (catchChance <= pokeCaught) {
        saveCaughtPokemon(pokemon)
        setCatchStatus("Pokemon caught")
        console.log(catchChance, pokeCaught + " Pokemon caught")
      } else {
        setCatchStatus("Pokemon escaped")
        console.log(catchChance, pokeCaught + " Pokemon escaped")
      }
    }
    
  }

  function startCountdown() {
    setCatchStatus("")
    fetchPokemon(); 
  }

  const saveCaughtPokemon = async (pokemon: PokemonData) => {
    console.log(pokemon)
    try {
      const response = await fetch('http://localhost:3000/api/pokemon', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          name: pokemon.name,
          base_experience: pokemon.base_experience,
          sprite: pokemon.sprites.front_default,
        }),
      });


      if (response.ok) {
        console.log('Pokemon saved successfully.');
      } else {
        console.error('Failed to save Pokemon. Server returned:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error while saving Pokemon:', error);
    }
  };


  return (

    <>
      <div id="background" className="flex h-screen w-full justify-center items-center">
        <h1 className="text-3xl absolute top-40 left-[770px]">{catchStatus}</h1>

        <div className="flex flex-col items-end ml-80 mt-60">
          <GetPokemon data={pokemon} />
          <div className="flex justify-center items-center">
            <button onClick={startCountdown} className="bg-green-700 h-20 border-4 border-green-900 rounded-lg p-4 text-green-100 text-2xl"> <strong>Explore further!</strong></button>
            <button id="pokeball" onClick={() => { tryCatchNormal(pokemon.base_experience) }} className="h-40 w-40 hover:cursor-pointer"></button>
          </div>
        </div>

      </div>
    </>
  )
}

export default App