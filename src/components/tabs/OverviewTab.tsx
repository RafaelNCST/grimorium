import { useState } from "react";
import { Edit2, Target, BookOpen, TrendingUp, StickyNote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StatsCard } from "@/components/StatsCard";

interface Book {
  title: string;
  chapters: number;
  currentArc: string;
  synopsis: string;
}

interface OverviewTabProps {
  book: Book;
}

export function OverviewTab({ book }: OverviewTabProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState([
    "Adicionar mais detalhes sobre o sistema de magia no capítulo 5",
    "Desenvolver relacionamento entre protagonista e mentor",
    "Revisar consistência dos nomes de lugares"
  ]);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote]);
      setNewNote("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Capítulos"
          value={book.chapters}
          icon={BookOpen}
        />
        <StatsCard
          title="Palavras Escritas"
          value="85,432"
          description="Meta: 100k"
          icon={TrendingUp}
        />
        <StatsCard
          title="Personagens"
          value="23"
          description="Principais: 8"
          icon={Target}
        />
        <StatsCard
          title="Locais"
          value="12"
          description="Principais: 5"
          icon={Target}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Arc */}
        <Card className="card-magical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Arco Atual</CardTitle>
              <CardDescription>Progresso da história</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Edit2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-3">{book.currentArc}</h3>
            <p className="text-muted-foreground">
              O protagonista descobre seus verdadeiros poderes enquanto enfrenta o primeiro grande desafio. 
              Este arco estabelece as bases para os conflitos futuros.
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progresso do Arco</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Writing Goals */}
        <Card className="card-magical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Metas de Escrita</CardTitle>
              <CardDescription>Objetivos do mês</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Edit2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Palavras por dia</span>
                  <Badge variant="secondary">1,250 / 1,500</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-accent h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Capítulos este mês</span>
                  <Badge variant="secondary">3 / 4</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Synopsis */}
      <Card className="card-magical">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Sinopse</CardTitle>
            <CardDescription>Resumo da história</CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <Edit2 className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">
            {book.synopsis}
          </p>
        </CardContent>
      </Card>

      {/* Sticky Notes */}
      <Card className="card-magical">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5" />
              Lembretes Rápidos
            </CardTitle>
            <CardDescription>Notas e ideias importantes</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notes.map((note, index) => (
              <div
                key={index}
                className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-sm animate-fade-in-up"
              >
                {note}
              </div>
            ))}
            
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}