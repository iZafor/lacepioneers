"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
    name: string;
    defaultValue: string;
    values: string[];
    onChange: (value: string) => void;
    className?: string;
}

export function Combobox({
    name,
    defaultValue,
    values,
    onChange,
    className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(defaultValue);
    const [search, setSearch] = React.useState("");

    const filteredValues = React.useMemo(() => {
        return values.filter((val) =>
            val.toLowerCase().includes(search.toLowerCase())
        );
    }, [values, search]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {value
                        ? values.find((val) => val === value)
                        : `Select ${name}...`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder={`Search ${name}...`}
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setOpen(false);
                                    setValue(search);
                                    setSearch("");
                                    onChange(search);
                                }}
                                className="text-prime"
                            >
                                Add new {name}: {`" ${search} "`}
                            </Button>
                        </CommandEmpty>
                        <CommandGroup>
                            {filteredValues.map((val) => (
                                <CommandItem
                                    key={val}
                                    value={val}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );
                                        onChange(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === val
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {val}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
