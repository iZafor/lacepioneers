"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function ThemeSwitcher({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Button
            variant="ghost"
            className={cn("justify-start gap-2 transition-colors", className)}
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            <div className="relative w-4 h-4">
                {isDark ? (
                    <Moon className="h-4 w-4 text-prime transition-all animate-in fade-in" />
                ) : (
                    <Sun className="h-4 w-4 text-prime transition-all animate-in fade-in" />
                )}
            </div>
            <span className="text-sm">Toggle Theme</span>
        </Button>
    );
}
