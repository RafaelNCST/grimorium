import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NoteFile {
  id: string;
  name: string;
  content: string;
  type: 'file';
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data - in real app this would come from API/database
const mockFiles: NoteFile[] = [
  {
    id: '2',
    name: 'Personagens Secundários',
    content: '# Personagens Secundários\n\n## Elena Thornfield\n*Comerciante de especiarias*\n\n> "O segredo dos negócios é saber quando dobrar a aposta."\n\nPersonagem importante para o desenvolvimento do mercado negro.\n\n**Características:**\n- Astuta\n- Corajosa\n- Misteriosa',
    type: 'file',
    parentId: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '4',
    name: 'Sistema de Magia',
    content: '# Sistema de Magia\n\nO sistema de magia é baseado em *elementos naturais*.\n\n## Elementos Principais:\n- **Fogo**: Destruição e energia\n- **Água**: Cura e fluidez\n- **Terra**: Proteção e estabilidade\n\n> "A magia flui como um rio, nunca forçada, sempre natural."',
    type: 'file',
    parentId: '3',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
];

export default function FileEditor() {
  const { bookId, fileId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState<NoteFile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editName, setEditName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Find the file by ID
    const foundFile = mockFiles.find(f => f.id === fileId);
    if (foundFile) {
      setFile(foundFile);
      setEditContent(foundFile.content);
      setEditName(foundFile.name);
    }
  }, [fileId]);

  useEffect(() => {
    if (file) {
      const hasNameChanged = editName !== file.name;
      const hasContentChanged = editContent !== file.content;
      setHasUnsavedChanges(hasNameChanged || hasContentChanged);
    }
  }, [editName, editContent, file]);

  const handleSave = () => {
    if (!file) return;

    // Here you would update the file in your state management/API
    const updatedFile = {
      ...file,
      name: editName,
      content: editContent,
      updatedAt: new Date(),
    };
    
    setFile(updatedFile);
    setHasUnsavedChanges(false);
    
    toast({
      title: "Arquivo salvo",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Arquivo excluído",
      description: `O arquivo "${file?.name}" foi excluído com sucesso.`,
    });
    navigate(`/book/${bookId}`);
  };

  const handleBack = () => {
    if (hasUnsavedChanges && isEditing) {
      if (confirm("Você tem alterações não salvas. Deseja sair mesmo assim?")) {
        navigate(`/book/${bookId}`);
      }
    } else {
      navigate(`/book/${bookId}`);
    }
  };

  const formatText = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-6 text-foreground border-b border-border pb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-4 text-foreground mt-8">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-3 text-foreground mt-6">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-6 py-3 italic text-muted-foreground bg-muted/50 rounded-r-lg mb-4 shadow-sm">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/\n\n/g, '<div class="mb-4"></div>')
      .replace(/\n/g, '<br />');
  };

  if (!file) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Arquivo não encontrado</h1>
          <Button onClick={() => navigate(`/book/${bookId}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-2xl font-bold border-none px-0 focus-visible:ring-0 bg-transparent"
                    placeholder="Nome do arquivo"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{file.name}</h1>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Última edição: {file.updatedAt.toLocaleDateString()} às {file.updatedAt.toLocaleTimeString()}
                  {hasUnsavedChanges && <span className="text-amber-600 ml-2">• Não salvo</span>}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditContent(file.content);
                    setEditName(file.name);
                    setHasUnsavedChanges(false);
                  }}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="min-h-[600px]">
          <CardContent className="p-8">
            {isEditing ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Guia de Formatação:</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p><code># Título 1</code></p>
                      <p><code>## Título 2</code></p>
                      <p><code>### Título 3</code></p>
                    </div>
                    <div>
                      <p><code>**negrito**</code></p>
                      <p><code>*itálico*</code></p>
                      <p><code>&gt; citação</code></p>
                    </div>
                  </div>
                </div>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={25}
                  className="min-h-[500px] font-mono text-sm resize-none"
                  placeholder="Escreva suas anotações aqui..."
                />
              </div>
            ) : (
              <div 
                className="prose prose-lg max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatText(file.content) }}
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Tem certeza que deseja excluir o arquivo "{file.name}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}