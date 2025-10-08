import { Globe } from "lucide-react";

import { EmptyState as GlobalEmptyState } from "@/components/empty-state";

export function EmptyState() {
  return (
    <GlobalEmptyState
      icon={Globe}
      title="Nenhum mundo criado"
      description="Comece criando o primeiro mundo da sua história para organizar continentes e locais."
    />
  );
}
