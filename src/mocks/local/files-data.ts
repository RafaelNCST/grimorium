import { AnnotationLink } from "@/types/annotations";

export interface NoteFile {
  id: string;
  name: string;
  content: string;
  type: "file";
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  links?: AnnotationLink[];
}

export const mockFiles: NoteFile[] = [
  {
    id: "2",
    name: "Personagens Secundários",
    content:
      '<h1>Personagens Secundários</h1><h2>Elena Thornfield</h2><p><em>Comerciante de especiarias</em></p><blockquote>"O segredo dos negócios é saber quando dobrar a aposta."</blockquote><p>Personagem importante para o desenvolvimento do mercado negro.</p><p><strong>Características:</strong></p><div>• Astuta</div><div>• Corajosa</div><div>• Misteriosa</div>',
    type: "file",
    parentId: "1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    links: [],
  },
  {
    id: "4",
    name: "Sistema de Magia",
    content:
      '<h1>Sistema de Magia</h1><p>O sistema de magia é baseado em <em>elementos naturais</em>.</p><h2>Elementos Principais:</h2><div>• <strong>Fogo</strong>: Destruição e energia</div><div>• <strong>Água</strong>: Cura e fluidez</div><div>• <strong>Terra</strong>: Proteção e estabilidade</div><blockquote>"A magia flui como um rio, nunca forçada, sempre natural."</blockquote>',
    type: "file",
    parentId: "3",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18"),
    links: [],
  },
];
