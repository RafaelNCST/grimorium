import { NOTE_COLORS_CONSTANT } from "../constants/note-colors";

interface PropsColorPicker {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  disabled?: boolean;
}

export function ColorPicker({
  selectedColor,
  onColorSelect,
  disabled = false,
}: PropsColorPicker) {
  return (
    <div className="flex gap-2 flex-wrap">
      {NOTE_COLORS_CONSTANT.map((color) => (
        <button
          key={color}
          type="button"
          disabled={disabled}
          onClick={() => onColorSelect(color)}
          className={`w-8 h-8 rounded-full border-2 transition-all ${color} ${
            selectedColor === color
              ? "border-foreground ring-2 ring-foreground ring-offset-2 scale-110"
              : "border-muted-foreground/20 hover:scale-105"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
}
