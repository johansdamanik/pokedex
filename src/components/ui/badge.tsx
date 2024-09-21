import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const validVariants = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
] as const

const badgeVariants = cva(
  "inline-flex items-center text-primary-foreground rounded-md border border-transparet px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        normal: "bg-[#BCBCAC] hover:bg-[#BCBCAC]/80",
        fighting: "bg-[#BC5442] hover:bg-[#BC5442]/80",
        flying: "bg-[#669AFF] hover:bg-[#669AFF]/80",
        poison: "bg-[#AB549A] hover:bg-[#AB549A]/80",
        ground: "bg-[#DEBC54] hover:bg-[#DEBC54]/80",
        rock: "bg-[#BCAC66] hover:bg-[#BCAC66]/80",
        bug: "bg-[#ABBC1C] hover:bg-[#ABBC1C]/80",
        ghost: "bg-[#6666BC] hover:bg-[#6666BC]/80",
        steel: "bg-[#ABACBC] hover:bg-[#ABACBC]/80",
        fire: "bg-[#FF421C] hover:bg-[#FF421C]/80",
        water: "bg-[#2F9AFF] hover:bg-[#2F9AFF]/80",
        grass: "bg-[#78CD54] hover:bg-[#78CD54]/80",
        electric: "bg-[#FFCD30] hover:bg-[#FFCD30]/80",
        psychic: "bg-[#FF549A] hover:bg-[#FF549A]/80",
        ice: "bg-[#78DEFF] hover:bg-[#78DEFF]/80",
        dragon: "bg-[#7866EF] hover:bg-[#7866EF]/80",
        dark: "bg-[#785442] hover:bg-[#785442]/80",
        fairy: "bg-[#FFACFF] hover:bg-[#FFACFF]/80",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants, validVariants }
