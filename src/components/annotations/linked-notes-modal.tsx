import { useNavigate } from "@tanstack/react-router";
import {
  FileText,
  ExternalLink,
  Calendar,
  User,
  Skull,
  Globe,
  Mountain,
  MapPin,
  Package,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PropsLinkedNotesModal {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityName: string;
  entityType:
    | "character"
    | "beast"
    | "world"
    | "continent"
    | "location"
    | "item";
  linkedNotes: Array<{
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    linkCreatedAt: Date;
  }>;
}

export function LinkedNotesModal({
  isOpen,
  onClose,
  entityName,
  entityType,
  linkedNotes,
}: PropsLinkedNotesModal) {
  const navigate = useNavigate();

  const getEntityIcon = () => {
    switch (entityType) {
      case "character":
        return <User className="w-4 h-4" />;
      case "beast":
        return <Skull className="w-4 h-4" />;
      case "world":
        return <Globe className="w-4 h-4" />;
      case "continent":
        return <Mountain className="w-4 h-4" />;
      case "location":
        return <MapPin className="w-4 h-4" />;
      case "item":
        return <Package className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getEntityTypeName = () => {
    switch (entityType) {
      case "character":
        return "Personagem";
      case "beast":
        return "Besta";
      case "world":
        return "Mundo";
      case "continent":
        return "Continente";
      case "location":
        return "Local";
      case "item":
        return "Item";
      default:
        return "Entidade";
    }
  };

  const handleOpenNote = (noteId: string) => {
    // Assuming we have a route for file editor
    navigate({
      to: "/dashboard/$dashboardId/file/$fileId",
      params: { dashboardId: "1", fileId: noteId },
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[80vh]"
        aria-describedby="linked-notes-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getEntityIcon()}
            Anotações Linkadas - {entityName}
            <Badge variant="outline">{getEntityTypeName()}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div id="linked-notes-description" className="sr-only">
          Modal para visualizar e gerenciar anotações linkadas à entidade{" "}
          {entityName}
        </div>

        <ScrollArea className="h-[60vh] pr-4">
          {linkedNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma anotação linkada
              </h3>
              <p className="text-muted-foreground">
                Você pode criar links para anotações nas abas de anotações ou no
                editor de arquivos.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {linkedNotes.map((note) => (
                <Card
                  key={note.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {note.name}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenNote(note.id)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Abrir
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      {truncateContent(note.content.replace(/<[^>]*>/g, ""))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Criado: {note.createdAt.toLocaleDateString("pt-BR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Editado: {note.updatedAt.toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Linkado em{" "}
                        {note.linkCreatedAt.toLocaleDateString("pt-BR")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
