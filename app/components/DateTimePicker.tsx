import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { Control, UseFormSetValue } from "react-hook-form";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { es } from "date-fns/locale";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import type { FC } from "react";

interface Props {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
}

export const DateTimePicker: FC<Props> = ({
  control,
  setValue,
  name = "date",
  label = "Fecha y hora",
  placeholder = "Selecciona fecha y hora",
  className = "w-full",
}) => {
  const handleTimeChange = (type: 'hour' | 'minute' | 'ampm', value: string ) => {
    const currentDate = control._getWatch(name) || new Date();
    let newDate = new Date(currentDate);
    const isPM = newDate.getHours() >= 12;

    if (type === 'hour') {
      const hour = parseInt(value);
      newDate.setHours(isPM ? (hour % 12) + 12 : hour % 12);
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === 'ampm') {
      const hours = newDate.getHours();
      if (value === 'AM' && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === 'PM' && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    setValue(name, newDate, { shouldValidate: true });
  }
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-min">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  id={name}
                  variant="outline"
                  className={cn(
                    "text-left font-normal pl-3 border-gray-200",
                    !field.value && "text-muted-foreground",
                    className
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP hh:mm aaaa", { locale: es })
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-gray-200">
              <div className="sm:flex">
                <Calendar
                  mode="single"
                  locale={es}
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < subDays(new Date(), 1)}
                />
                <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i + 1)
                        .reverse()
                        .map((hour) => (
                          <Button
                            key={hour}
                            variant={
                              field.value &&
                              field.value.getHours() % 12 === hour % 12
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => {
                              handleTimeChange('hour', hour.toString());
                            }}
                          >
                            {hour}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {Array.from({ length: 12 }, (_, i) => i * 5)
                        .map((minute) => (
                          <Button
                            key={minute}
                            variant={
                              field.value &&
                              field.value.getMinutes() === minute
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => {
                              handleTimeChange('minute', minute.toString());
                            }}
                          >
                            {minute.toString().padStart(2, '0')}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                  <ScrollArea className="w-64 sm:w-auto">
                    <div className="flex sm:flex-col p-2">
                      {['AM', 'PM'].map((ampm) => (
                        <Button
                          key={ampm}
                            variant={
                              field.value && ((ampm === 'AM' &&
                                field.value.getHours() < 12) ||
                                (ampm === 'PM' && field.value.getHours() >= 12)
                              )
                                ? "default"
                                : "ghost"
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => {
                              handleTimeChange('ampm', ampm);
                            }}
                          >
                            {ampm}
                          </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage className="w-full"/>
        </FormItem>
      )}
    />
  );
};
