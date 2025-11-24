import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface VersionsPanelProps {
  /**
   * Título do painel de versões
   */
  title: string;
  /**
   * Conteúdo do painel (geralmente EntityVersionManager)
   */
  children: ReactNode;
}

/**
 * Painel reutilizável para exibição do sistema de versões
 * Encapsula o layout e estilo padrão usado em páginas de detalhe de entidades
 */
export function VersionsPanel({ title, children }: VersionsPanelProps) {
  return (
    <Card className="card-magical sticky top-[5.5rem] flex flex-col max-h-[calc(100vh-7rem)]">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-6 pt-0 overflow-hidden">
        {children}
      </CardContent>
    </Card>
  );
}
