import { useState } from "react";
import { Edit2, Target, BookOpen, TrendingUp, StickyNote, Plus, GripVertical, Trash2, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  bookId: string;
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

interface StoryProgress {
  estimatedArcs: number;
  estimatedChapters: number;
  completedArcs: number;
  currentArcProgress: number;
}

const noteColors = [
  'bg-yellow-200 border-yellow-400 text-yellow-900 shadow-lg',
  'bg-pink-200 border-pink-400 text-pink-900 shadow-lg', 
  'bg-green-200 border-green-400 text-green-900 shadow-lg',
  'bg-blue-200 border-blue-400 text-blue-900 shadow-lg',
  'bg-purple-200 border-purple-400 text-purple-900 shadow-lg'
];

// Book-specific sticky notes data
const getBookStickyNotes = (bookId: string): StickyNote[] => {
  if (bookId === "4") {
    // Empty book - no notes
    return [];
  }
  
  if (bookId === "1") {
    // Book 1 - Sample notes
    return [
      { id: "1", content: "Adicionar mais detalhes sobre o sistema de magia no capítulo 5", color: noteColors[0], x: 20, y: 20 },
      { id: "2", content: "Desenvolver relacionamento entre protagonista e mentor", color: noteColors[1], x: 280, y: 40 },
      { id: "3", content: "Revisar consistência dos nomes de lugares", color: noteColors[2], x: 540, y: 60 }
    ];
  }
  
  // Other books have different notes or empty
  return [];
};

export function OverviewTab({ book, bookId }: OverviewTabProps) {
  const { t } = useLanguage();
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isEditingAuthorSummary, setIsEditingAuthorSummary] = useState(false);
  const [isEditingStorySummary, setIsEditingStorySummary] = useState(false);
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [goals, setGoals] = useState<Goals>({ wordsPerDay: 1500, chaptersPerWeek: 2 });
  const [authorSummary, setAuthorSummary] = useState(book.authorSummary);
  const [storySummary, setStorySummary] = useState(book.storySummary);
  const [storyProgress, setStoryProgress] = useState<StoryProgress>({
    estimatedArcs: 5,
    estimatedChapters: 25,
    completedArcs: 1,
    currentArcProgress: 50
  });
  
  const [stickyNotes, setStickyNotes] = useState(() => getBookStickyNotes(bookId));
const [newNote, setNewNote] = useState("");
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Mock data for statistics
  const totalWords = 85400;
  const totalCharacters = 487230;
  const lastChapterNumber = 12;
  const lastChapterName = "A Grande Revelação";

  // Calculate story progress percentage
  const calculateStoryProgress = () => {
    const totalProgress = storyProgress.completedArcs + (storyProgress.currentArcProgress / 100);
    return Math.round((totalProgress / storyProgress.estimatedArcs) * 100);
  };

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

  const saveProgress = () => {
    setIsEditingProgress(false);
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
    <div className="space-y-0">
      {/* Stats Overview - Compact sections without gaps */}
      <div className="flex flex-wrap">
        {/* Média por Semana */}
        <Card className="card-magical flex-shrink-0 m-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média/Semana</p>
                <p className="text-xl font-bold text-foreground">2.1</p>
                <p className="text-xs text-muted-foreground">Capítulos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Último Capítulo */}
        <Card className="card-magical flex-shrink-0 m-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Último Capítulo</p>
                <p className="text-xl font-bold text-foreground">Cap. {lastChapterNumber}</p>
                <p className="text-xs text-muted-foreground">{lastChapterName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total de Palavras */}
        <Card className="card-magical flex-shrink-0 m-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Palavras</p>
                <p className="text-xl font-bold text-foreground">{(totalWords / 1000).toFixed(1)}k</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total de Caracteres */}
        <Card className="card-magical flex-shrink-0 m-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Caracteres</p>
                <p className="text-xl font-bold text-foreground">{(totalCharacters / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progressão da História */}
        <Card className="card-magical flex-shrink-0 m-1 min-w-[280px]">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Progressão da História</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditingProgress(!isEditingProgress)}
              className="h-6 w-6"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditingProgress ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block">Estimativa de arcos</label>
                  <Input 
                    type="number" 
                    value={storyProgress.estimatedArcs}
                    onChange={(e) => setStoryProgress(s => ({ ...s, estimatedArcs: parseInt(e.target.value) || 0 }))}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Estimativa de capítulos</label>
                  <Input 
                    type="number" 
                    value={storyProgress.estimatedChapters}
                    onChange={(e) => setStoryProgress(s => ({ ...s, estimatedChapters: parseInt(e.target.value) || 0 }))}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="accent" size="sm" className="h-6 text-xs" onClick={saveProgress}>Salvar</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsEditingProgress(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progresso Geral</span>
                  <span>{calculateStoryProgress()}%</span>
                </div>
                <Progress value={calculateStoryProgress()} className="h-2" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Arcos: </span>
                    <span className="font-medium">{storyProgress.completedArcs}/{storyProgress.estimatedArcs}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capítulos: </span>
                    <span className="font-medium">{lastChapterNumber}/{storyProgress.estimatedChapters}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap">
        {/* Writing Goals */}
        <Card className="card-magical flex-1 min-w-[300px] m-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base">Metas de Escrita</CardTitle>
              <CardDescription>Objetivos editáveis</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditingGoals(!isEditingGoals)}
              className="h-6 w-6"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditingGoals ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block">Palavras por dia</label>
                  <Input 
                    type="number" 
                    value={goals.wordsPerDay}
                    onChange={(e) => setGoals(g => ({ ...g, wordsPerDay: parseInt(e.target.value) || 0 }))}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block">Capítulos por semana</label>
                  <Input 
                    type="number" 
                    value={goals.chaptersPerWeek}
                    onChange={(e) => setGoals(g => ({ ...g, chaptersPerWeek: parseInt(e.target.value) || 0 }))}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="accent" size="sm" className="h-6 text-xs" onClick={saveGoals}>Salvar</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsEditingGoals(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">Palavras por dia</span>
                    <Badge variant="secondary" className="text-xs">1,250 / {goals.wordsPerDay.toLocaleString()}</Badge>
                  </div>
                  <Progress value={Math.min(100, (1250 / goals.wordsPerDay) * 100)} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium">Capítulos por semana</span>
                    <Badge variant="secondary" className="text-xs">2 / {goals.chaptersPerWeek}</Badge>
                  </div>
                  <Progress value={Math.min(100, (2 / goals.chaptersPerWeek) * 100)} className="h-1.5" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Arc */}
        <Card className="card-magical flex-1 min-w-[300px] m-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Arco Atual</CardTitle>
            <CardDescription>{book.currentArc}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-3">
              <h4 className="font-medium mb-1 text-sm">Último evento concluído:</h4>
              <p className="text-xs text-muted-foreground mb-2">Primeiro confronto</p>
              
              <h4 className="font-medium mb-1 text-sm">Próximos eventos:</h4>
              <div className="space-y-1">
                <div className="text-xs p-2 bg-muted/30 rounded">Encontro com mentor</div>
                <div className="text-xs p-2 bg-muted/30 rounded">Revelação do passado</div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progresso do Arco</span>
                <span>{storyProgress.currentArcProgress}%</span>
              </div>
              <Progress value={storyProgress.currentArcProgress} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap">
        {/* Author Summary */}
        <Card className="card-magical flex-1 min-w-[300px] m-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base">Resumo do Autor</CardTitle>
              <CardDescription>Anotações pessoais para o autor</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditingAuthorSummary(!isEditingAuthorSummary)}
              className="h-6 w-6"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditingAuthorSummary ? (
              <div className="space-y-3">
                <Textarea 
                  value={authorSummary}
                  onChange={(e) => setAuthorSummary(e.target.value)}
                  className="min-h-[80px] text-xs"
                  placeholder="Suas anotações pessoais sobre a obra..."
                />
                <div className="flex gap-2">
                  <Button variant="accent" size="sm" className="h-6 text-xs" onClick={saveAuthorSummary}>Salvar</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsEditingAuthorSummary(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground leading-relaxed">{authorSummary}</p>
            )}
          </CardContent>
        </Card>

        {/* Story Summary */}
        <Card className="card-magical flex-1 min-w-[300px] m-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base">Resumo da História</CardTitle>
              <CardDescription>Apresentação da obra para leitores</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditingStorySummary(!isEditingStorySummary)}
              className="h-6 w-6"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {isEditingStorySummary ? (
              <div className="space-y-3">
                <Textarea 
                  value={storySummary}
                  onChange={(e) => setStorySummary(e.target.value)}
                  className="min-h-[80px] text-xs"
                  placeholder="Resumo da história para apresentação..."
                />
                <div className="flex gap-2">
                  <Button variant="accent" size="sm" className="h-6 text-xs" onClick={saveStorySummary}>Salvar</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsEditingStorySummary(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground leading-relaxed">{storySummary}</p>
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