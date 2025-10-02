import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PropsHelpDialog {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ isOpen, onOpenChange }: PropsHelpDialog) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajuda - Criando um Bom Sistema de Poder</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="tips">
          <TabsList>
            <TabsTrigger value="tips">Dicas</TabsTrigger>
            <TabsTrigger value="features">Recursos</TabsTrigger>
          </TabsList>
          <TabsContent value="tips" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Organização Visual</h4>
              <p className="text-sm text-muted-foreground">
                Use cores consistentes para categorizar elementos relacionados.
                Agrupe conceitos similares próximos uns dos outros.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Hierarquia Clara</h4>
              <p className="text-sm text-muted-foreground">
                Use sub-mapas para detalhar sistemas complexos. Mantenha o mapa
                principal com visão geral.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="features" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Navegação</h4>
              <p className="text-sm text-muted-foreground">
                No modo visualização, arraste para navegar pelo mapa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Edição</h4>
              <p className="text-sm text-muted-foreground">
                No modo edição, arraste elementos, use Delete para excluir.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
