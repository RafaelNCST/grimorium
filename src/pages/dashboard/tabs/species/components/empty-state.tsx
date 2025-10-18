import { Dna } from "lucide-react";

import { EmptyState as EmptyStateComponent } from "@/components/empty-state";

export function EmptyState() {
  return (
    <EmptyStateComponent
      icon={Dna}
      title="Nenhuma espécie cadastrada"
      description="Comece criando sua primeira espécie para popular o universo do seu mundo."
    />
  );
}
