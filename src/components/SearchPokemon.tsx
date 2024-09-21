import Pokeball from '@/components/PokeBall'
import { Input } from '@/components/ui/input'

interface SearchPokemonProps {
  onSearchChange: (query: string) => void
}

export default function SearchPokemon({ onSearchChange }: SearchPokemonProps) {
  return (
    <div className="relative w-full ">
      <Input
        placeholder="Search your Pokémon!"
        type="search"
        className="h-12 rounded-2xl bg-white pr-12 focus-visible:border-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
        onChange={(e) => onSearchChange(e.target.value)} // Capture input change
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer rounded-md bg-red-400 p-1 shadow-md shadow-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-300">
      <Pokeball size={24} color="white" />
      </div>
    </div>
  )
}
