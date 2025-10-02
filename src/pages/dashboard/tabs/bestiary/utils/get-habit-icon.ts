import { Sun, Moon, TreePine } from "lucide-react";

export function getHabitIcon(habit: string) {
  switch (habit) {
    case "diurno":
      return Sun;
    case "noturno":
      return Moon;
    case "subterrâneo":
      return TreePine;
    default:
      return Sun;
  }
}
