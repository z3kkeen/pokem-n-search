import './index.css'
import { useState, useEffect, ChangeEvent } from 'react';
import GetPokemon from './assets/GetPokemon';

interface SinglePokemon {
  name: string;
  id: number;
  types: { type: { name: string } }[];
  base_experience: number;
  sprites: { front_default: string };
  // more pokemon data goes here
}

function App() {
  const [pokemon, setPokemon] = useState<SinglePokemon[]>([]);
  const [searchedPok, setSearchedPok] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<SinglePokemon | null>(null);
  const [errorFound, setErrorFound] = useState('');

  async function fetchPokemon(pokemonName: string) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await res.json();

      setErrorFound('')
      setSelectedPokemon(data);

    } catch (error) {
      console.log(error);
      setErrorFound('Found no Pokémon by that name. Check your spelling and try again.');
      setSelectedPokemon(null);
    }
  }
  
  function searchPok(e: ChangeEvent<HTMLInputElement>) {
    setSearchedPok(e.target.value);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const searchTerm = searchedPok.toLowerCase();

      if (searchTerm) {
        fetchPokemon(searchTerm);
      }
  
      if (pokemon.length > 0) {
        const foundPokemon = pokemon.find((p: SinglePokemon) => p.name.includes(searchTerm));
        if (foundPokemon) {
          setSelectedPokemon(foundPokemon); // updates selected pokemon
        } else {
          console.log('Pokemon not found');
        }
      }
      setSearchedPok('');
    }
  }

  console.log(searchedPok);

  useEffect(() => {
    if(pokemon.length > 0) {
      setSelectedPokemon(pokemon[0]);
    }
  },[pokemon]);

  return (
    <>
     <div className="w-full h-screen bg-orange-200 flex justify-center items-center">
        <div className="bg-orange-100 p-10 rounded-md w-80 border-2 border-orange-300 justify-center items-center flex-col">
          <input value={searchedPok} onChange={searchPok} onKeyDown={handleEnter} type="text" className="p-1 mb-10 w-56 border-2 border-orange-200" placeholder="Search for pookie" />

          {errorFound}
          {selectedPokemon && <GetPokemon data={selectedPokemon} />}
        </div>
     </div>
    </>
  )
}

export default App
