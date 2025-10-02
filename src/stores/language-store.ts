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
