import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FolderOpen, Plus, Edit2, Trash2, Folder, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";
import { toast } from "@/hooks/use-toast";

interface NotesTabProps {
  bookId: string;
}

interface NoteFile {
  id: string;
  name: string;
  content: string;
  type: 'file';
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteFolder {
  id: string;
  name: string;
  type: 'folder';
  parentId?: string;
  createdAt: Date;
}

interface TextStyle {
  bold: boolean;
  italic: boolean;
  heading: 'none' | 'h1' | 'h2' | 'h3';
  quote: boolean;
}

type NoteItem = NoteFile | NoteFolder;

const mockNotes: NoteItem[] = [
  {
    id: '1',
    name: 'Ideias Principais',
    type: 'folder',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Personagens Secundários',
    content: '<h1>Personagens Secundários</h1><h2>Elena Thornfield</h2><p><em>Comerciante de especiarias</em></p><blockquote>"O segredo dos negócios é saber quando dobrar a aposta."</blockquote><p>Personagem importante para o desenvolvimento do mercado negro.</p><p><strong>Características:</strong></p><div>• Astuta</div><div>• Corajosa</div><div>• Misteriosa</div>',
    type: 'file',
    parentId: '1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Notas Gerais',
    type: 'folder',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    name: 'Sistema de Magia',
    content: '<h1>Sistema de Magia</h1><p>O sistema de magia é baseado em <em>elementos naturais</em>.</p><h2>Elementos Principais:</h2><div>• <strong>Fogo</strong>: Destruição e energia</div><div>• <strong>Água</strong>: Cura e fluidez</div><div>• <strong>Terra</strong>: Proteção e estabilidade</div><blockquote>"A magia flui como um rio, nunca forçada, sempre natural."</blockquote>',
    type: 'file',
    parentId: '3',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
];

export function NotesTab({ bookId }: NotesTabProps) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<NoteItem[]>(mockNotes);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  const getCurrentFolderId = () => {
    if (currentPath.length === 0) return undefined;
    return currentPath[currentPath.length - 1];
  };

  const getCurrentItems = () => {
    const currentFolderId = getCurrentFolderId();
    return notes.filter(item => item.parentId === currentFolderId);
  };

  const getFolderPath = () => {
    const path = ['Anotações'];
    currentPath.forEach(folderId => {
      const folder = notes.find(item => item.id === folderId && item.type === 'folder');
      if (folder) path.push(folder.name);
    });
    return path;
  };

  const handleFolderClick = (folderId: string) => {
    setCurrentPath([...currentPath, folderId]);
  };

  const handleBackClick = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleFileClick = (file: NoteFile) => {
    navigate(`/book/${bookId}/file/${file.id}`);
  };

  const handleSaveFile = () => {
    // This function is no longer needed since editing happens on separate page
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;

    const newFile: NoteFile = {
      id: Date.now().toString(),
      name: newFileName,
      content: '<div>Comece a escrever suas anotações aqui...</div>',
      type: 'file',
      parentId: getCurrentFolderId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([...notes, newFile]);
    setNewFileName('');
    setShowCreateFile(false);
    toast({
      title: "Arquivo criado",
      description: `O arquivo "${newFileName}" foi criado com sucesso.`,
    });
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: NoteFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      type: 'folder',
      parentId: getCurrentFolderId(),
      createdAt: new Date(),
    };

    setNotes([...notes, newFolder]);
    setNewFolderName('');
    setShowCreateFolder(false);
    toast({
      title: "Pasta criada",
      description: `A pasta "${newFolderName}" foi criada com sucesso.`,
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setNotes(notes.filter(item => item.id !== itemId && item.parentId !== itemId));
    toast({
      title: "Item excluído",
      description: "O item foi excluído com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Anotações</h2>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {getFolderPath().map((folder, index) => (
              <span key={index}>
                {folder}
                {index < getFolderPath().length - 1 && ' / '}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {currentPath.length > 0 && (
            <Button variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          
          <Dialog open={showCreateFile} onOpenChange={setShowCreateFile}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Novo Arquivo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Arquivo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fileName">Nome do arquivo</Label>
                  <Input
                    id="fileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Nome do arquivo"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateFile(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateFile}>Criar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderOpen className="w-4 h-4 mr-2" />
                Nova Pasta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Pasta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folderName">Nome da pasta</Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Nome da pasta"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateFolder(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateFolder}>Criar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getCurrentItems().map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 flex-1"
                  onClick={() => item.type === 'folder' ? handleFolderClick(item.id) : handleFileClick(item as NoteFile)}
                >
                  {item.type === 'folder' ? (
                    <Folder className="w-8 h-8 text-amber-600" />
                  ) : (
                    <FileText className="w-8 h-8 text-blue-600" />
                  )}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{item.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Criado: {item.createdAt.toLocaleDateString()}
                      {item.type === 'file' && (
                        <>
                          <br />
                          Modificado: {(item as NoteFile).updatedAt.toLocaleDateString()}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        
        {getCurrentItems().length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma anotação encontrada</p>
            <p className="text-sm text-muted-foreground">Crie seu primeiro arquivo ou pasta</p>
          </div>
        )}
      </div>
    </div>
  );
}