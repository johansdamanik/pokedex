import { typeStyles } from '@/app/styles/typeStyles'

export interface Pokemon {
  id: number
  name: string
  img: string
  gif: string
  types: string[]
  weaknesses?: string[]
  onClick?: () => void
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  abilities: { ability: { name: string } }[]
  stats: { code: string; name: string; value: number; color: string }[]
  types: { type: { name: string } }[]
  img: string // Direct PNG image
  gif: string | null // Direct GIF if available, otherwise null
  weaknesses: {
    name: string
    background: string // Background color for the weakness
    icon: string // Icon for the weakness
  }[]
  base_experience: number
  genus: string
  evolution_chain: {
    id: number
    name: string
    img: string
    gif: string
    level_up: number | null
  }[]
  pokedex_entry: string // For Pokedex Entry
}

export interface PokemonApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Pokemon[]
}

// Extract animated gif if available, otherwise fallback to null
const imgUrl =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/'
const gifUrl =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/'

// Fetch Pokemon data with types
export const fetchPokemons = async (): Promise<Pokemon[]> => {
  try {
    // Fetch basic Pokemon data (names, URLs, etc.)
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=898')
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon data')
    }

    const data = await response.json()
    const imgUrl =
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/'
    const gifUrl =
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/'

    // Map initial Pokemon data
    let pokemons: Pokemon[] = data.results.map((pokemon: any) => {
      // Extract ID from the URL
      const urlParts = pokemon.url.split('/')
      const id = urlParts[urlParts.length - 2] // Get the second-last part which is the ID

      return {
        id: parseInt(id), // Convert the id to an integer
        name: pokemon.name,
        url: pokemon.url,
        img: `${imgUrl}${id}.png`, // Use the extracted id for the image URL
        gif: `${gifUrl}${id}.gif`, // Use the extracted id for the gif URL
        types: [], // Initial empty types
      }
    })

    // Fetch and add types to each Pokemon
    pokemons = await getAllTypes(pokemons)
    return pokemons
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
    throw error
  }
}

// Fetch Pokemon types and append to each Pokemon
export const getAllTypes = async (pokemons: Pokemon[]): Promise<Pokemon[]> => {
  for (let i = 0; i < 18; i++) {
    let url = 'https://pokeapi.co/api/v2/type/' + (i + 1)
    const response = await fetch(url)
    const responseAsJson = await response.json()

    const pokemonInType = responseAsJson.pokemon
    const typeName = responseAsJson.name

    // Fetch weaknesses for the current type from damage_relations
    const weaknesses = responseAsJson.damage_relations.double_damage_from.map(
      (type: any) => type.name
    )

    // Loop through all Pokemon in the current type and add the type and weaknesses
    for (let j = 0; j < pokemonInType.length; j++) {
      const pokemonId = pokemonInType[j].pokemon.url
        .replace('https://pokeapi.co/api/v2/pokemon/', '')
        .replace('/', '')

      // Ensure pokemonId is within range and types array exists
      if (
        parseInt(pokemonId) <= pokemons.length &&
        pokemons[parseInt(pokemonId) - 1]
      ) {
        // Add type to the Pokémon
        pokemons[parseInt(pokemonId) - 1].types.push(typeName)

        // Add weaknesses to the Pokémon if they don't already exist
        const currentWeaknesses =
          pokemons[parseInt(pokemonId) - 1].weaknesses || []
        pokemons[parseInt(pokemonId) - 1].weaknesses = Array.from(
          new Set([...currentWeaknesses, ...weaknesses])
        )
      }
    }
  }

  return pokemons
}

export const fetchPokemonDetail = async (
  id: number
): Promise<PokemonDetail> => {
  try {
    // Fetch the main pokemon data
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    )
    const pokemonData = await pokemonResponse.json()

    // Fetch pokemon species to get genus, pokedex entry, and evolution chain
    const speciesResponse = await fetch(pokemonData.species.url)
    const speciesData = await speciesResponse.json()

    // Fetch evolution chain
    const evolutionResponse = await fetch(speciesData.evolution_chain.url)
    const evolutionData = await evolutionResponse.json()

    // Fetch weaknesses from pokemon types and add icon paths
    const typePromises = pokemonData.types.map(async (typeInfo: any) => {
      const typeResponse = await fetch(typeInfo.type.url)
      const typeData = await typeResponse.json()
      return typeData.damage_relations.double_damage_from.map((damage: any) => {
        const typeName = damage.name
        return {
          name: typeName,
          background: typeStyles[typeName]?.background || '#ccc', // Assign background color or default to gray
          icon: typeStyles[typeName]?.icon || null, // Assign icon if available
        }
      })
    })

    const weaknesses = (await Promise.all(typePromises)).flat()

    // Get the Pokedex entry in English (flavor text)
    const pokedexEntry = speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'en'
    )?.flavor_text

    // Map stat names and calculate total stats
    const statNameMapping: { [key: string]: { code: string; color: string } } =
      {
        hp: { code: 'HP', color: '#df2140' },
        attack: { code: 'ATK', color: '#ff994d' },
        defense: { code: 'DEF', color: '#ffdc41' },
        'special-attack': { code: 'SpA', color: '#85ddff' },
        'special-defense': { code: 'SpD', color: '#a8ef95' },
        speed: { code: 'SPD', color: '#fb94a8' },
      }

    const stats = pokemonData.stats.map((stat: any) => {
      const mappedStat = statNameMapping[stat.stat.name] // Check if stat exists in the mapping

      return {
        name: stat.stat.name,
        code: mappedStat ? mappedStat.code : '?', // Map to the shortened name or fallback to original
        color: mappedStat ? mappedStat.color : '#ccc', // Assign the corresponding color or default to gray
        value: stat.base_stat ?? 0,
      }
    })

    // Calculate total stats (TOT)
    const totalStats = stats.reduce(
      (acc: number, stat: { name: string; value: number }) => acc + stat.value,
      0
    )

    // Add the total stat with a default color (or specify a color if you want)
    stats.push({
      code: 'TOT',
      name: 'Total',
      color: '#7195dc',
      value: totalStats,
    }) // Add TOT with a specific color if needed

    // Extract the required details
    const pokemonDetail: PokemonDetail = {
      id: pokemonData.id,
      name: pokemonData.name,
      height: pokemonData.height,
      weight: pokemonData.weight,
      abilities: pokemonData.abilities,
      stats,
      types: pokemonData.types,
      img: `${imgUrl}${pokemonData.id}.png`,
      gif: `${gifUrl}${pokemonData.id}.gif`,
      weaknesses, // From types
      base_experience: pokemonData.base_experience, // Base experience
      genus: speciesData.genera.find(
        (genus: any) => genus.language.name === 'en'
      ).genus, // Get genus in English
      evolution_chain: await extractEvolutionChain(evolutionData.chain), // Extract evolution chain
      pokedex_entry: pokedexEntry || 'No entry available.', // Fallback if no Pokedex entry found
    }

    return pokemonDetail
  } catch (error) {
    console.error('Error fetching Pokemon details:', error)
    throw error
  }
}

const extractEvolutionChain = async (chain: any): Promise<any[]> => {
  const evolutions = []
  let currentStage = chain

  while (currentStage) {
    // Fetch Pokemon details for each stage to get the id and images
    const speciesResponse = await fetch(currentStage.species.url)
    const speciesData = await speciesResponse.json()

    evolutions.push({
      name: currentStage.species.name,
      url: currentStage.species.url,
      id: speciesData.id,
      img: `${imgUrl}${speciesData.id}.png`,
      gif: `${gifUrl}${speciesData.id}.gif`,
      level_up: currentStage.evolution_details.length
        ? currentStage.evolution_details[0].min_level || null
        : null, // Add evolution level if available
    })

    currentStage = currentStage.evolves_to.length
      ? currentStage.evolves_to[0]
      : null // Move to the next stage
  }

  return evolutions
}
