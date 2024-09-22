'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import LoadingDetailCard from '@/components/LoadingDetailCard'
import Pokeball from '@/components/PokeBall'
import PokemonCard from '@/components/PokemonCard'
import PokemonDetailCard from '@/components/PokemonDetailCard'
import SearchPokemon from '@/components/SearchPokemon'
import TypeFilter from '@/components/TypeFilter'
import WeaknessFilter from '@/components/WeaknessFilter'
import * as Drawer from '@/components/ui/drawer'

import {
  Pokemon,
  PokemonDetail,
  fetchPokemonDetail,
  fetchPokemons,
} from '@/api/pokemon'
import { useToast } from '@/hooks/use-toast'
import useIsMobile from '@/hooks/useIsMobile'

export default function Home() {
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]) // Store all Pokémon
  const [filteredPokemonList, setFilteredPokemonList] = useState<Pokemon[]>([]) // Filtered Pokémon list
  const [displayedPokemonList, setDisplayedPokemonList] = useState<Pokemon[]>(
    []
  ) // Paginated Pokémon
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail>()
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('') // State for search query
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1) // Current page for local pagination
  const [hasMore, setHasMore] = useState<boolean>(true) // Track if more Pokémon to load
  const [drawer, setDrawer] = useState<boolean>(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const pageSize = 24 // Number of Pokémon per page
  const variants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 300 },
  }

  const handlePokemonClick = async (id: number) => {
    // If the clicked ID is the same as the currently selected Pokémon, do nothing
    if (id === pokemonDetail?.id) {
      if (!drawer) {
        setDrawer(true)
      }
      return
    }

    // Set loading state while fetching details for the new Pokémon
    setLoadingDetail(true)
    // Fetch Pokémon details and update the state
    try {
      setDrawer(true) // Open the drawer or detail view
      const data = await fetchPokemonDetail(id)
      setPokemonDetail(data) // Set the newly fetched Pokémon details
    } catch (error) {
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      })
      console.error('Error fetching Pokémon details:', error)
    } finally {
      // Stop loading after fetching is done
      setLoadingDetail(false)
    }
  }

  const handleReset = () => {
    setSelectedTypes([]) // Reset selected types
    setSelectedWeaknesses([]) // Reset selected weaknesses
    setSearchQuery('')
  }

  // Fetch all Pokémon data once on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPokemons() // Fetch all Pokémon initially
        setAllPokemon(data) // Store all Pokémon
        setFilteredPokemonList(data) // Set the filtered list to include all initially
        setDisplayedPokemonList(data.slice(0, pageSize)) // Display the first page
        setLoading(false)
        setHasMore(data.length > pageSize) // Set hasMore based on initial data size
      } catch (error) {
        console.error('Failed to fetch Pokémon data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter the Pokémon list based on the search query and selected types
  useEffect(() => {
    const filteredData = allPokemon.filter((pokemon) => {
      const matchesQuery = pokemon.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

      // If no type is selected, include all
      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some((selectedType) =>
          pokemon.types.includes(selectedType)
        )

      const matchesWeakness =
        selectedWeaknesses.length === 0 ||
        selectedWeaknesses.some((selectedWeakness) =>
          pokemon.weaknesses?.includes(selectedWeakness)
        )

      return matchesQuery && matchesType && matchesWeakness
    })

    setFilteredPokemonList(filteredData)
    setDisplayedPokemonList(filteredData.slice(0, pageSize)) // Reset to the first page of filtered data
    setCurrentPage(1) // Reset the current page to 1
    setHasMore(filteredData.length > pageSize) // Determine if there are more pages
  }, [searchQuery, selectedTypes, selectedWeaknesses, allPokemon])

  // Load the next page of Pokémon from the filtered list
  // Load the next page of Pokémon from the filtered list
  const loadNextPage = () => {
    // Calculate the start and end index for the next page based on currentPage
    const start = currentPage * pageSize // We start after the current page
    const end = (currentPage + 1) * pageSize // End of the next page

    // Get the next set of Pokémon to display
    const nextPageData = filteredPokemonList.slice(start, end)

    // Only update if there's more data to load
    if (nextPageData.length > 0) {
      setDisplayedPokemonList((prev) => [...prev, ...nextPageData]) // Append new data
      setCurrentPage((prevPage) => prevPage + 1) // Increment the current page
    } else {
      setHasMore(false) // If no more data, stop loading
    }
  }

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!hasMore || loading) return // Prevent further loading if no more data or if still loading

    const scrollTop = window.scrollY
    const documentHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight

    // If the user has scrolled near the bottom, load the next page
    if (scrollTop + windowHeight >= documentHeight - 300) {
      loadNextPage()
    }
  }, [hasMore, loading, currentPage, filteredPokemonList])

  // Attach scroll listener for infinite scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasMore, loading, currentPage, filteredPokemonList, handleScroll])

  // Scroll to the top when a Pokémon is selected
  useEffect(() => {
    if (scrollRef.current && pokemonDetail) {
      const timeoutId = setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 0 })
      }, 500)

      // Cleanup timeout
      return () => clearTimeout(timeoutId)
    }
  }, [pokemonDetail])

  if (loading && currentPage === 1) {
    // if (true) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <Pokeball size={50} color="gray" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div className="container mx-auto px-4 xl:w-5/6">
        <div className="flex gap-4">
          <div className="flex-1 lg:py-12">
            <div className="flex justify-between items-center py-2">
              <img
                src="/assets/pokedex-logo.png"
                alt="pokedex-logo"
                className="h-12"
              />
              <div className="flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/johan-simeon-damanik-a2a6a0253/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/linkedin-logo.png"
                    className="h-6"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="https://github.com/johansdamanik"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/github-logo.png"
                    className="h-6"
                    alt="GitHub"
                    width={24}
                    height={24}
                  />
                </a>
              </div>
            </div>
            <div className="my-4 flex flex-col gap-4">
              <div>
                {/* Pass setSearchQuery to SearchPokemon */}
                <SearchPokemon
                  onSearchChange={setSearchQuery}
                  searchQuery={searchQuery}
                />
              </div>
              <div className="flex justify-between gap-2">
                <TypeFilter
                  onTypeSelect={setSelectedTypes}
                  selectedTypes={selectedTypes}
                />
                <WeaknessFilter
                  onTypeSelect={setSelectedWeaknesses}
                  selectedWeaknesses={selectedWeaknesses}
                />
                <button
                  className={`transition-color rounded-xl px-4 py-2 text-sm ${selectedTypes.length || selectedWeaknesses.length ? 'bg-red-400 text-white hover:bg-red-300' : 'border border-red-400 bg-white text-red-400 hover:bg-red-100'} `}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3 lg:gap-y-16">
              {displayedPokemonList.map((pokemon, index) => (
                <PokemonCard
                  key={index}
                  id={pokemon.id}
                  name={pokemon.name}
                  img={pokemon.img}
                  gif={pokemon.gif}
                  types={pokemon.types}
                  onClick={() => handlePokemonClick(pokemon.id)}
                />
              ))}
            </div>
            {loading && hasMore && <div>Loading more Pokémon...</div>}
          </div>

          {/* Sticky Column for Pokemon Details */}

          <div
            className="custom-scroll sticky top-0 hidden h-screen w-[22rem] overflow-y-auto p-2 lg:block"
            ref={scrollRef}
          >
            {pokemonDetail ? (
              isMobile ? (
                <Drawer.Drawer open={drawer} onOpenChange={setDrawer}>
                  <Drawer.DrawerContent className="bg-white max-h-[85%] border-none">
                    <Drawer.DrawerTitle className="hidden">
                      Pokémon Detail
                    </Drawer.DrawerTitle>
                    <Drawer.DrawerDescription className="hidden">
                      The details about Pokémon
                    </Drawer.DrawerDescription>
                    <div className="flex flex-col overflow-y-scroll">
                      <PokemonDetailCard
                        item={pokemonDetail}
                        onClick={(id) => handlePokemonClick(id)}
                        loading={loadingDetail}
                      />
                    </div>
                  </Drawer.DrawerContent>
                </Drawer.Drawer>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pokemonDetail.id}
                    variants={variants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.5 }}
                  >
                    <div className="py-14">
                      <PokemonDetailCard
                        item={pokemonDetail}
                        onClick={(id) => handlePokemonClick(id)}
                        loading={loadingDetail}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              )
            ) : loadingDetail ? (
              <div className="py-14">
                <LoadingDetailCard />
              </div>
            ) : (
              <div className="h-screen flex justify-center items-center">
                <div className="grow text-center">
                  <p>Select a Pokémon to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
