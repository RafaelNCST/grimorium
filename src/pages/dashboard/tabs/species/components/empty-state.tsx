import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
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
        </div>
      </CardContent>
    </Card>
  );
}
