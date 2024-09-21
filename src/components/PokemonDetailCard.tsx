import { Badge, validVariants } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import * as Tooltip from '@/components/ui/tooltip'

import LoadingDetailCard from './LoadingDetailCard'
import { PokemonDetail } from '@/api/pokemon'

interface PokemonDetailPageProps {
  item: PokemonDetail
  onClick?: (id: number) => void
  loading: boolean
}

export default function PokemonDetailPage({
  item,
  onClick,
  loading,
}: PokemonDetailPageProps) {
  return (
    <>
      {loading ? (
        <LoadingDetailCard />
      ) : (
        <Card className="relative pt-12 lg:pt-0 border-none lg:border !rounded-none lg:!rounded-3xl text-slate-700">
          <CardHeader>
            <div className="flex w-full justify-center">
              <div className="grid h-24 w-24 -translate-y-[2rem] place-items-center">
                <img
                  src={item.gif!}
                  className="scale-[2] transition-all duration-300 hover:scale-[2.2]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = item.img
                  }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-700">#{item.id} </p>
              <h2 className="text-xl font-extrabold capitalize">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.genus} </p>
              <p className="text-sm text-gray-500">{loading} </p>
            </div>
            <div className="flex justify-center gap-2">
              {item.types.map((type, index) => {
                // Ensure the variant is valid or fall back to 'default'
                const variant = validVariants.includes(
                  type.type.name as (typeof validVariants)[number]
                )
                  ? (type.type.name as (typeof validVariants)[number]) // Cast to the valid variant type
                  : 'normal'

                return (
                  <Badge
                    key={index}
                    className="cursor-default font-normal capitalize"
                    variant={variant}
                  >
                    {type.type.name}
                  </Badge>
                )
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="my-4">
              <h3 className="mb-1 text-center text-sm font-bold tracking-widest">
                POKÉDEX ENTRY
              </h3>
              <p className="text-center tracking-wide">
                {item.pokedex_entry.replace(/[\f\n\r]/g, ' ')}
              </p>
            </div>

            <div>
              <h3 className="mb-1 text-center text-sm font-bold tracking-widest">
                ABILITIES
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {item.abilities.map((ability, index) => (
                  <span
                    key={index}
                    className="cursor-default truncate rounded-full bg-gray-100 px-3 py-2 text-center text-sm capitalize"
                  >
                    {ability.ability.name
                      .split('-')
                      .map((word) => word.charAt(0) + word.slice(1))
                      .join(' ')}{' '}
                  </span>
                ))}
              </div>
            </div>

            <div className="my-4 grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-sm font-bold tracking-widest">WEIGHT</p>
                <span className="w-full cursor-default truncate rounded-full bg-gray-100 px-3 py-2 text-center text-sm">
                  {(item.weight / 10).toFixed(1)} kg
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-sm font-bold tracking-widest">HEIGHT</p>
                <span className="w-full cursor-default truncate rounded-full bg-gray-100 px-3 py-2 text-center text-sm">
                  {(item.height / 10).toFixed(1)} m
                </span>
              </div>
            </div>
            <div className="my-4 grid grid-cols-1">
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-sm font-bold tracking-widest">WEAKNESSES</p>
                <div className="w-full cursor-default truncate rounded-full bg-gray-100 px-3 py-2 text-center text-sm">
                  <div className="flex w-full flex-wrap justify-center gap-1">
                    <div className="truncate rounded-full bg-gray-300 p-1 text-center text-xs font-semibold text-gray-800">
                      2X
                    </div>
                    {item.weaknesses.map((weakness, index) => (
                      <Tooltip.TooltipProvider key={index}>
                        <Tooltip.Tooltip delayDuration={100}>
                          <Tooltip.TooltipTrigger asChild>
                            <div
                              key={index}
                              className="cursor-default truncate rounded-full p-1 text-center text-sm text-white"
                              style={{ backgroundColor: weakness.background }} // Apply the background color from weaknesses
                            >
                              <img
                                src={weakness.icon}
                                alt={weakness.name}
                                className="h-4 w-4"
                              />
                            </div>
                          </Tooltip.TooltipTrigger>
                          <Tooltip.TooltipContent
                            className="capitalize"
                            style={{ backgroundColor: weakness.background }}
                          >
                            {weakness.name}
                          </Tooltip.TooltipContent>
                        </Tooltip.Tooltip>
                      </Tooltip.TooltipProvider>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4 grid grid-cols-1">
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-sm font-bold tracking-widest">STATS</p>
                <div className="w-full cursor-default truncate text-center text-[10px]">
                  <div className="flex w-full flex-wrap justify-evenly">
                    {item.stats.map((stat, index) => (
                      <Tooltip.TooltipProvider key={index}>
                        <Tooltip.Tooltip delayDuration={100}>
                          <Tooltip.TooltipTrigger asChild>
                            <div
                              className={`rounded-full p-1 ${
                                stat.code === 'TOT'
                                  ? 'bg-[#86a8ff]'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <div
                                className="flex h-7 w-7 items-center justify-center rounded-full font-medium text-white"
                                style={{ backgroundColor: stat.color }}
                              >
                                {stat.code}
                              </div>
                              <div className="my-1 text-xs font-medium text-gray-950">
                                {stat.value}
                              </div>
                            </div>
                          </Tooltip.TooltipTrigger>
                          <Tooltip.TooltipContent
                            className="capitalize"
                            style={{ backgroundColor: stat.color }}
                          >
                            {stat.name}
                          </Tooltip.TooltipContent>
                        </Tooltip.Tooltip>
                      </Tooltip.TooltipProvider>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4 grid grid-cols-1">
              <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-sm font-bold tracking-widest">EVOLUTION</p>
                <div className="w-full cursor-default truncate text-center text-[10px]">
                  <div className="flex w-full flex-wrap justify-center">
                    {item.evolution_chain.map((evo, index) => (
                      <div
                        key={index}
                        className="relative flex items-center justify-between"
                      >
                        {evo.level_up !== null && (
                          <div className="mx-2">
                            <p className="rounded-full bg-gray-100 p-1 px-3 font-medium">
                              Lvl {evo.level_up}
                            </p>
                          </div>
                        )}
                        <Tooltip.TooltipProvider key={index}>
                          <Tooltip.Tooltip delayDuration={100}>
                            <Tooltip.TooltipTrigger asChild>
                              <img
                                src={evo.img!}
                                className="w-12 scale-125 cursor-pointer"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = evo.gif
                                }}
                                onClick={() => onClick && onClick(evo.id)}
                              />
                            </Tooltip.TooltipTrigger>
                            <Tooltip.TooltipContent className="bg-gray-300 font-medium capitalize text-gray-700">
                              {evo.name}
                            </Tooltip.TooltipContent>
                          </Tooltip.Tooltip>
                        </Tooltip.TooltipProvider>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
