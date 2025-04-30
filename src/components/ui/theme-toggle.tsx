
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./button";
import { Toggle } from "./toggle";

export function ThemeToggle({ className }: { className?: string }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Toggle 
      pressed={isDarkMode}
      onPressedChange={toggleTheme} 
      className={className} 
      aria-label="Toggle dark mode"
      title={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDarkMode ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">{isDarkMode ? "Switch to light theme" : "Switch to dark theme"}</span>
    </Toggle>
  );
}
