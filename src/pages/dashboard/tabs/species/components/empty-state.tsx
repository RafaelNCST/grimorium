import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PropsEmptyState {
  onCreateSpecies: () => void;
}

export function EmptyState({ onCreateSpecies }: PropsEmptyState) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma espécie cadastrada
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece criando sua primeira espécie para este mundo
          </p>
          <Button onClick={onCreateSpecies}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Espécie
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
