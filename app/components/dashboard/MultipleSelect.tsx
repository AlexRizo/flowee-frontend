import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "~/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "~/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Button } from "~/components/ui/button"
import { useRouteLoaderData } from "react-router"
import { Roles, type User } from "~/services/interfaces/users-service.interface"

export const MultipleSelect = ({ options, value, onChange }: { options: { label: string, value: string }[], value: string[], onChange: (value: string[]) => void }) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(value)

  const handleSelect = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option]
    
    setSelected(newSelected)
    onChange(newSelected)
  }

  const { user } = useRouteLoaderData('routes/dashboard/_layout') as { user: User }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-gray-200"
        >
          {selected.length === 0 
            ? "Selecciona roles..."
            : `${selected.length} roles seleccionados`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-gray-200">
        <Command>
          <CommandInput placeholder="Buscar rol..." className="h-9" />
          <CommandEmpty>No se encontraron roles.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              if (option.value === Roles.SUPER_ADMIN && !user.roles.includes(Roles.SUPER_ADMIN)) {
                return null
              }

              return (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
