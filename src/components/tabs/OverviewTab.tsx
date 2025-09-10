import { useState } from "react";
import { Edit2, Target, BookOpen, TrendingUp, StickyNote, Plus, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/StatsCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface Book {
  title: string;
  chapters: number;
  currentArc: string;
  authorSummary: string;
  storySummary: string;
}

interface OverviewTabProps {
  book: Book;
}

interface StickyNote {
  id: string;
  content: string;
  color: string;
  x: number;
  y: number;
}

interface Goals {
  wordsPerDay: number;
  chaptersPerWeek: number;
}

const noteColors = [
  'bg-yellow-200 border-yellow-400 text-yellow-900 shadow-lg',
  'bg-pink-200 border-pink-400 text-pink-900 shadow-lg', 
  'bg-green-200 border-green-400 text-green-900 shadow-lg',
  'bg-blue-200 border-blue-400 text-blue-900 shadow-lg',
  'bg-purple-200 border-purple-400 text-purple-900 shadow-lg'
];

export function OverviewTab({ book }: OverviewTabProps) {
  const { t } = useLanguage();
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isEditingAuthorSummary, setIsEditingAuthorSummary] = useState(false);
  const [isEditingStorySummary, setIsEditingStorySummary] = useState(false);
  const [goals, setGoals] = useState<Goals>({ wordsPerDay: 1500, chaptersPerWeek: 2 });
  const [authorSummary, setAuthorSummary] = useState(book.authorSummary);
  const [storySummary, setStorySummary] = useState(book.storySummary);
  
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    { id: "1", content: "Adicionar mais detalhes sobre o sistema de magia no capítulo 5", color: noteColors[0], x: 20, y: 20 },
    { id: "2", content: "Desenvolver relacionamento entre protagonista e mentor", color: noteColors[1], x: 280, y: 40 },
    { id: "3", content: "Revisar consistência dos nomes de lugares", color: noteColors[2], x: 540, y: 60 }
  ]);
const [newNote, setNewNote] = useState("");
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Mock data for current arc events
  const currentArcEvents = [
    { id: "1", name: "Descoberta dos poderes", completed: true },
    { id: "2", name: "Primeiro confronto", completed: true },
    { id: "3", name: "Encontro com mentor", completed: false },
    { id: "4", name: "Revelação do passado", completed: false }
  ];

  const completedEvents = currentArcEvents.filter(e => e.completed).length;
  const progressPercentage = Math.round((completedEvents / currentArcEvents.length) * 100);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const newStickyNote: StickyNote = {
        id: Date.now().toString(),
        content: newNote,
        color: noteColors[Math.floor(Math.random() * noteColors.length)],
        x: Math.random() * 300,
        y: Math.random() * 200
      };
      setStickyNotes([...stickyNotes, newStickyNote]);
      setNewNote("");
    }
  };

  const handleDeleteNote = (id: string) => {
    setStickyNotes(stickyNotes.filter(note => note.id !== id));
  };

  const handleEditNote = (id: string, newContent: string) => {
    setStickyNotes(notes => 
      notes.map(note => 
        note.id === id ? { ...note, content: newContent } : note
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    setDraggedNote(noteId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNote) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStickyNotes(notes => 
      notes.map(note => 
        note.id === draggedNote 
          ? { ...note, x: Math.max(0, x - 100), y: Math.max(0, y - 25) }
          : note
      )
    );
    setDraggedNote(null);
  };

  const saveGoals = () => {
    setIsEditingGoals(false);
    // Here you would save to your backend/state management
  };

  const saveAuthorSummary = () => {
    setIsEditingAuthorSummary(false);
    // Here you would save to your backend/state management
  };

  const saveStorySummary = () => {
    setIsEditingStorySummary(false);
    // Here you would save to your backend/state management
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Capítulos"
          value={book.chapters}
          description="Meta: 15"
          icon={BookOpen}
        />
        <StatsCard
          title="Média/Semana"
          value="2.1"
          description="Capítulos"
          icon={TrendingUp}
        />
        <StatsCard
          title="Último Capítulo"
          value="Cap. 12"
          description="há 2 dias"
          icon={Target}
        />
        <StatsCard
          title="Total de Palavras"
          value="85.4k"
          description="Meta: 100k"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Writing Goals */}
        <Card className="card-magical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Metas de Escrita</CardTitle>
              <CardDescription>Objetivos editáveis</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditingGoals(!isEditingGoals)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isEditingGoals ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Palavras por dia</label>
                  <Input 
                    type="number" 
                    value={goals.wordsPerDay}
                    onChange={(e) => setGoals(g => ({ ...g, wordsPerDay: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Capítulos por semana</label>
                  <Input 
                    type="number" 
                    value={goals.chaptersPerWeek}
                    onChange={(e) => setGoals(g => ({ ...g, chaptersPerWeek: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="accent" size="sm" onClick={saveGoals}>Salvar</Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingGoals(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Palavras por dia</span>
                    <Badge variant="secondary">1,250 / {goals.wordsPerDay.toLocaleString()}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-accent h-2 rounded-full" style={{ width: `${Math.min(100, (1250 / goals.wordsPerDay) * 100)}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Capítulos por semana</span>
                    <Badge variant="secondary">2 / {goals.chaptersPerWeek}</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: `${Math.min(100, (2 / goals.chaptersPerWeek) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Arc */}
        <Card className="card-magical">
          <CardHeader>
            <CardTitle>Arco Atual</CardTitle>
            <CardDescription>{book.currentArc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="font-medium mb-2">Último evento concluído:</h4>
              <p className="text-sm text-muted-foreground mb-3">Primeiro confronto</p>
              
              <h4 className="font-medium mb-2">Próximos eventos:</h4>
              <div className="space-y-2">
                <div className="text-sm p-2 bg-muted/30 rounded">Encontro com mentor</div>
                <div className="text-sm p-2 bg-muted/30 rounded">Revelação do passado</div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progresso do Arco</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Author Summary */}
        <Card className="card-magical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Resumo do Autor</CardTitle>
              <CardDescription>Anotações pessoais para o autor</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditingAuthorSummary(!isEditingAuthorSummary)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isEditingAuthorSummary ? (
              <div className="space-y-4">
                <Textarea 
                  value={authorSummary}
                  onChange={(e) => setAuthorSummary(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Suas anotações pessoais sobre a obra..."
                />
                <div className="flex gap-2">
                  <Button variant="accent" size="sm" onClick={saveAuthorSummary}>Salvar</Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingAuthorSummary(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed">{authorSummary}</p>
            )}
          </CardContent>
        </Card>

        {/* Story Summary */}
        <Card className="card-magical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Resumo da História</CardTitle>
              <CardDescription>Apresentação da obra para leitores</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditingStorySummary(!isEditingStorySummary)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isEditingStorySummary ? (
              <div className="space-y-4">
                <Textarea 
                  value={storySummary}
                  onChange={(e) => setStorySummary(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Resumo da história para apresentação..."
                />
                <div className="flex gap-2">
                  <Button variant="accent" size="sm" onClick={saveStorySummary}>Salvar</Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingStorySummary(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <p className="text-foreground leading-relaxed">{storySummary}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Post-it Notes Board */}
      <Card className="card-magical">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5" />
              Quadro de Lembretes
            </CardTitle>
            <CardDescription>Arraste as notas para organizá-las</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className="relative min-h-[300px] bg-muted/10 rounded-lg border-2 border-dashed border-muted-foreground/20 mb-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {stickyNotes.map((note) => (
              <div
                key={note.id}
                className={`absolute p-4 rounded-lg border-2 cursor-move min-w-[180px] max-w-[200px] transform rotate-1 hover:rotate-0 transition-all duration-200 ${note.color}`}
                style={{ left: note.x, top: note.y }}
                draggable
                onDragStart={(e) => handleDragStart(e, note.id)}
              >
                {/* Pushpin effect */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full shadow-md border border-red-600"></div>
                
                <div className="flex items-start justify-between mb-2">
                  <GripVertical className="w-4 h-4 opacity-50" />
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 hover:bg-black/10"
                      onClick={() => {
                        setEditingNote(note.id);
                        setEditContent(note.content);
                      }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 hover:bg-black/10"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                {editingNote === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 text-xs bg-transparent border border-black/20 rounded resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        className="text-xs h-6"
                        onClick={() => {
                          handleEditNote(note.id, editContent);
                          setEditingNote(null);
                        }}
                      >
                        Salvar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-6"
                        onClick={() => setEditingNote(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p 
                    className="text-xs leading-relaxed font-handwriting cursor-pointer"
                    onClick={() => {
                      setEditingNote(note.id);
                      setEditContent(note.content);
                    }}
                  >
                    {note.content}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Textarea
              placeholder="Adicionar nova nota..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[60px]"
            />
            <Button variant="outline" onClick={handleAddNote}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}