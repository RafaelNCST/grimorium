import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PropsColorPickerInput {
  label: string;
  colorValue: string;
  textValue: string;
  onColorChange: (color: string) => void;
  onTextChange: (text: string) => void;
  placeholder?: string;
}

export function ColorPickerInput({
  label,
  colorValue,
  textValue,
  onColorChange,
  onTextChange,
  placeholder,
}: PropsColorPickerInput) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={colorValue || "#ffffff"}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-12 h-10 rounded-md cursor-pointer border border-muted"
          />
        </div>
        <Input
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
      </div>
    </div>
  );
}
