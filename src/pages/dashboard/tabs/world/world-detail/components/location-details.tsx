import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { IWorldDetailEntity } from "../types/world-detail-types";

interface PropsLocationDetails {
  entity: IWorldDetailEntity;
}

export function LocationDetails({ entity }: PropsLocationDetails) {
  if (entity.type !== "Location") return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entity.climate && (
          <Card>
            <CardHeader>
              <CardTitle>Clima</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{entity.climate}</p>
            </CardContent>
          </Card>
        )}

        {entity.terrain && (
          <Card>
            <CardHeader>
              <CardTitle>Terreno</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{entity.terrain}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {entity.organizations && entity.organizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Organizações Presentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {entity.organizations.map((org, idx) => (
                <Badge key={idx} variant="secondary">
                  {org}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
