import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface FormImageDisplayProps {
  icon: LucideIcon;
  text?: string;
  height?: string;
  width?: string;
  shape?: "square" | "rounded" | "circle";
  className?: string;
}

/**
 * FormImageDisplay - Componente puramente visual para exibir estado vazio de imagem
 *
 * Este componente é usado em modo visualização (não editável) para mostrar
 * um placeholder quando não há imagem disponível. Não possui interatividade.
 *
 * @param icon - Ícone do Lucide React a ser exibido
 * @param text - Texto opcional abaixo do ícone
 * @param height - Altura do componente (default: h-40)
 * @param width - Largura do componente (default: w-40)
 * @param shape - Forma do componente: square, rounded ou circle (default: rounded)
 * @param className - Classes CSS adicionais
 *
 * @example
 * // Exibir estado vazio quando não está editando e não tem imagem
 * {!isEditing && !image && (
 *   <FormImageDisplay
 *     icon={ImagePlus}
 *     text="Sem imagem"
 *     height="h-[28rem]"
 *   />
 * )}
 */
export function FormImageDisplay({
  icon: Icon,
  text,
  height = "h-40",
  width = "w-40",
  shape = "rounded",
  className,
}: FormImageDisplayProps) {
  const shapeClasses = {
    square: "",
    rounded: "rounded-lg",
    circle: "rounded-full",
  };

  return (
    <div
      className={cn(
        "bg-purple-950/40 flex flex-col items-center justify-center gap-2",
        height,
        width,
        shapeClasses[shape],
        className
      )}
    >
      <Icon className="w-12 h-12 text-purple-400" />
      {text && <span className="text-sm text-purple-300">{text}</span>}
    </div>
  );
}
