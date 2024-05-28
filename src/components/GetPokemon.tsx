
export interface PokemonData {
  name: string;
  id: number;
  types: { type: { name: string } }[];
  base_experience: number;
  sprites: { front_default: string };
  // Add any other properties you expect from the Pokemon data
}

export default function GetPokemon({data}: { data: PokemonData}) {

  if(!data.name){
    return(
      <div>loading...</div>
    )
  }

  return (
    <div>
        <div className="w-full flex justify-center items-center gap-28">
          <div className="w-60 flex justify-center flex-col border-4 border-slate-800 p-4 rounded-md bg-slate-500/30 text-2xl">
            <h2>name: <span className="font-bold">{data.name}</span></h2>
            <h2>type: <span className="font-bold">{data.types[0].type.name}</span></h2>
            <h2>base-exp: <span className="font-bold">{data.base_experience}</span></h2>
          </div>

          <img src={data.sprites.front_default} alt="picture of pokemon" className="w-80" />
        </div>
    </div>
  )
}
