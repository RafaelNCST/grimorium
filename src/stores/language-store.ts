import { create } from "zustand";
import { persist } from "zustand/middleware";

import i18n from "@/lib/i18n";

type Language = "pt" | "en";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    "home.welcome": "Bem-vindo ao",
    "home.creative_universe": "Grimorium",
    "home.organize_worlds": "Organize seus mundos criativos em um só lugar",
    "home.create_new_book": "Criar Novo Livro",
    "home.total_books": "Total de Livros",
    "home.active_projects": "projetos ativos",
    "home.storage_used": "Armazenamento Usado",
    "home.storage_available": "de 10 GB disponíveis",
    "home.last_edition": "Última Edição",
    "home.this_month": "neste mês",
    "home.library": "Biblioteca",
    "home.search_books": "Buscar livros...",
    "home.no_books_found": "Nenhum livro encontrado",
    "home.adjust_search": "Tente ajustar sua busca ou criar um novo livro.",
    "home.create_first_book": "Comece criando seu primeiro livro!",
    "book.dashboard": "Dashboard do Livro",
    "modal.create_book": "Criar Novo Livro",
    "modal.book_cover": "Capa do Livro",
    "modal.book_title": "Nome da História",
    "modal.book_genre": "Gênero da História",
    "modal.book_style": "Estilo da História",
    "modal.author_summary": "Resumo do Autor",
    "modal.title_required": "O título é obrigatório",
    "modal.genre_required": "Selecione pelo menos um gênero",
    "modal.style_required": "O estilo visual é obrigatório",
    "modal.title_placeholder": "Ex: As Crônicas do Reino Perdido",
    "modal.genre_placeholder": "Selecione os gêneros da sua história",
    "modal.style_placeholder": "Selecione o estilo visual",
    "modal.summary_placeholder": "Escreva um resumo rápido e casual da sua história. Não precisa ser perfeito, apenas suas ideias iniciais sobre o enredo, personagens ou o que você imagina para esta obra",
    "modal.book_synopsis": "Sinopse",
    "modal.synopsis_placeholder": "Escreva a sinopse oficial que será apresentada aos leitores. Descreva de forma atraente o enredo, os personagens principais e o que torna sua história única",
    "modal.optional": "Opcional",
    "modal.upload_image": "Clique para selecionar ou arraste uma imagem",
    "modal.upload_formats": "PNG, JPG, JPEG, WEBP ou GIF",
    "modal.change_image": "Alterar imagem",
    "button.create": "Criar Livro",
    "button.cancel": "Cancelar",
    "genre.urban": "Urbano",
    "genre.fantasy": "Fantasia",
    "genre.futuristic": "Futurístico",
    "genre.cyberpunk": "Cyberpunk",
    "genre.high_fantasy": "Alta Fantasia",
    "genre.romance": "Romance",
    "genre.mystery": "Mistério",
    "genre.horror": "Terror",
    "genre.suspense": "Suspense",
    "genre.drama": "Drama",
    "genre.sci_fi": "Ficção Científica",
    "genre.historical": "Histórico",
    "genre.action": "Ação",
    "genre.adventure": "Aventura",
    "genre.litrpg": "LitRPG",
    "style.realistic": "Realista",
    "style.cartoon": "Cartoon",
    "style.anime": "Anime",
  },
  en: {
    "home.welcome": "Welcome to",
    "home.creative_universe": "Grimorium",
    "home.organize_worlds": "Organize your creative worlds in one place",
    "home.create_new_book": "Create New Book",
    "home.total_books": "Total Books",
    "home.active_projects": "active projects",
    "home.storage_used": "Storage Used",
    "home.storage_available": "of 10 GB available",
    "home.last_edition": "Last Edition",
    "home.this_month": "this month",
    "home.library": "Library",
    "home.search_books": "Search books...",
    "home.no_books_found": "No books found",
    "home.adjust_search": "Try adjusting your search or create a new book.",
    "home.create_first_book": "Start by creating your first book!",
    "book.dashboard": "Book Dashboard",
    "modal.create_book": "Create New Book",
    "modal.book_cover": "Book Cover",
    "modal.book_title": "Story Name",
    "modal.book_genre": "Story Genre",
    "modal.book_style": "Story Style",
    "modal.author_summary": "Author Summary",
    "modal.title_required": "Title is required",
    "modal.genre_required": "Select at least one genre",
    "modal.style_required": "Visual style is required",
    "modal.title_placeholder": "Ex: The Chronicles of the Lost Kingdom",
    "modal.genre_placeholder": "Select your story genres",
    "modal.style_placeholder": "Select visual style",
    "modal.summary_placeholder": "Write a quick and casual summary of your story. It doesn't have to be perfect, just your initial ideas about the plot, characters, or what you imagine for this work",
    "modal.book_synopsis": "Synopsis",
    "modal.synopsis_placeholder": "Write the official synopsis that will be presented to readers. Describe in an engaging way the plot, main characters, and what makes your story unique",
    "modal.optional": "Optional",
    "modal.upload_image": "Click to select or drag an image",
    "modal.upload_formats": "PNG, JPG, JPEG, WEBP or GIF",
    "modal.change_image": "Change image",
    "button.create": "Create Book",
    "button.cancel": "Cancel",
    "genre.urban": "Urban",
    "genre.fantasy": "Fantasy",
    "genre.futuristic": "Futuristic",
    "genre.cyberpunk": "Cyberpunk",
    "genre.high_fantasy": "High Fantasy",
    "genre.romance": "Romance",
    "genre.mystery": "Mystery",
    "genre.horror": "Horror",
    "genre.suspense": "Suspense",
    "genre.drama": "Drama",
    "genre.sci_fi": "Sci-Fi",
    "genre.historical": "Historical",
    "genre.action": "Action",
    "genre.adventure": "Adventure",
    "genre.litrpg": "LitRPG",
    "style.realistic": "Realistic",
    "style.cartoon": "Cartoon",
    "style.anime": "Anime",
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "pt",
      setLanguage: (language) => {
        set({ language });
        i18n.changeLanguage(language);
      },
      t: (key: string) => {
        const { language } = get();
        return (
          translations[language][key as keyof typeof translations.pt] || key
        );
      },
    }),
    {
      name: "language-storage",
    }
  )
);
