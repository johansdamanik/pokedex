import { Badge, validVariants } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Pokemon } from '@/api/pokemon'

export default function PokemonCard({
  id,
  name,
  img,
  gif,
  types,
  onClick,
}: Pokemon) {
  return (
    <Card
      onClick={onClick}
      className="group relative cursor-pointer rounded-3xl transition-shadow duration-300 hover:shadow-md"
    >
      <div className="absolute left-0 top-0 flex w-full justify-center">
        <div className="grid h-24 w-24 -translate-y-14 place-items-center">
          <img
            src={gif}
            alt={name}
            className="transition-all duration-300 group-hover:z-50 group-hover:scale-[1.35]"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = img
            }}
          />
        </div>
      </div>
      <CardHeader className="pt-12 text-center">
        <CardDescription className="text-xs font-semibold">
          N°{id}
        </CardDescription>
        <CardTitle className="capitalize">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center gap-2">
        {types
          .slice()
          .reverse()
          .map((name, index) => {
            const variant = validVariants.includes(
              name as (typeof validVariants)[number]
            )
              ? (name as (typeof validVariants)[number])
              : 'normal'

            return (
              <Badge
                className="font-normal capitalize"
                key={index}
                variant={variant}
              >
                {name}
              </Badge>
            )
          })}
      </CardContent>
    </Card>
  )
}
