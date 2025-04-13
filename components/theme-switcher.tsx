"use client";

import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";

export default function ThemeSwitcher({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();

    return (
        <Switch
            className={className}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        />
    );
}
