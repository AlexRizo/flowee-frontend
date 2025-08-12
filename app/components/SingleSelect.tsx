import type { Control } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import type { FC } from "react";
import { cn } from "~/lib/utils";

interface Props {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  className?: string;
}

export const SingleSelect: FC<Props> = ({
  control,
  name = "select",
  label = "Selecciona una opción",
  placeholder = "-----",
  options = [],
  className = "w-full",
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <SelectTrigger className={cn(className)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="border-gray-200">
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={cn(field.value !== option.value && "opacity-60")}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
