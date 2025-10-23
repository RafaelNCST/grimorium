import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PropsPowerSlider {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

export function PowerSlider({
  label,
  description,
  value,
  onChange,
}: PropsPowerSlider) {
  const isMaxPower = value === 10;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <span
          className={`text-lg font-bold w-8 text-center transition-colors ${
            isMaxPower ? "text-amber-500" : "text-primary"
          }`}
        >
          {value}
        </span>
      </div>
      <div className="relative">
        {isMaxPower && (
          <style>{`
            @keyframes flowingEnergy {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
          `}</style>
        )}
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          min={1}
          max={10}
          step={1}
          className={`w-full ${
            isMaxPower
              ? "[&_.bg-primary]:!bg-gradient-to-r [&_.bg-primary]:from-amber-600 [&_.bg-primary]:via-yellow-400 [&_.bg-primary]:to-amber-600 [&_.bg-primary]:bg-[length:200%_100%] [&_.bg-primary]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:bg-gradient-to-r [&_span[data-radix-collection-item]]:from-amber-600 [&_span[data-radix-collection-item]]:via-yellow-400 [&_span[data-radix-collection-item]]:to-amber-600 [&_span[data-radix-collection-item]]:bg-[length:200%_100%] [&_span[data-radix-collection-item]]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:shadow-lg [&_span[data-radix-collection-item]]:shadow-amber-500/50 [&_span[data-radix-collection-item]]:border-amber-500"
              : ""
          }`}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1 (Fraco)</span>
        <span>10 (Dominante)</span>
      </div>
    </div>
  );
}
