import { CaretDownIcon, CheckIcon } from '@radix-ui/react-icons'
import * as React from 'react'

import { cn } from '@/lib/utils'

import { validVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { typeStyles } from '@/app/styles/typeStyles'

interface FilterMenuProps {
  onTypeSelect: (types: string[]) => void // Update to handle multiple types
  selectedWeaknesses: string[]
}

export default function WeaknessFilter({
  onTypeSelect,
  selectedWeaknesses,
}: FilterMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [types, setTypes] = React.useState<string[]>(selectedWeaknesses)

  React.useEffect(() => {
    setTypes(selectedWeaknesses) // Reset local state when `selectedWeaknesses` is reset
  }, [selectedWeaknesses])

  const handleSelect = (currentValue: string) => {
    let updatedSelectedTypes = [...types]

    // Toggle the type selection
    if (types.includes(currentValue)) {
      updatedSelectedTypes = updatedSelectedTypes.filter(
        (type) => type !== currentValue
      )
    } else {
      updatedSelectedTypes.push(currentValue)
    }

    setTypes(updatedSelectedTypes)
    onTypeSelect(updatedSelectedTypes) // Pass updated types to the parent component
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`h-10 w-full justify-between !rounded-xl ${types.length ? 'bg-red-200 hover:bg-red-100' : 'bg-white'}`}
        >
          Weakness
          <CaretDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search type..." className="h-9" />
          <CommandList className="custom-scroll">
            <CommandEmpty>No type found.</CommandEmpty>
            <CommandGroup>
              {validVariants.map((variant) => (
                <CommandItem
                  key={variant}
                  value={variant}
                  onSelect={() => handleSelect(variant)}
                >
                  <div
                    className="cursor-default truncate rounded-full p-1 text-center text-sm text-white"
                    style={{ backgroundColor: typeStyles[variant]?.background }}
                  >
                    <img
                      src={typeStyles[variant]?.icon}
                      alt={variant}
                      className="h-4 w-4"
                    />
                  </div>
                  <span className="ml-2 capitalize">{variant}</span>
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      types.includes(variant) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
