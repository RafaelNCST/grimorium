import { useState, type ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface PropsEntityCardWrapper {
  children: ReactNode;
  onClick?: () => void;
  overlayText?: string;
  className?: string;
  contentClassName?: string;
}

export function EntityCardWrapper({
  children,
  onClick,
  overlayText = "Ver detalhes",
  className = "",
  contentClassName = "",
}: PropsEntityCardWrapper) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`relative cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-card/80 ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className={contentClassName}>
        {children}
      </CardContent>

      {/* Overlay covering entire card */}
      <div
        className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 rounded-lg ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white text-lg font-semibold">
          {overlayText}
        </span>
      </div>
    </Card>
  );
}
