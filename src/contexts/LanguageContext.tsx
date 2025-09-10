import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Home
    'home.welcome': 'Bem-vindo ao seu',
    'home.creative_universe': 'Universo Criativo',
    'home.organize_worlds': 'Organize seus mundos, personagens e histórias de fantasia',
    'home.create_new_book': 'Criar Novo Livro',
    'home.total_books': 'Total de Livros',
    'home.active_projects': 'Projetos ativos',
    'home.storage_used': 'Armazenamento Usado',
    'home.storage_available': 'de 10 GB disponível',
    'home.last_edition': 'Última Edição',
    'home.this_month': 'Este mês',
    'home.library': 'Sua Biblioteca',
    'home.search_books': 'Buscar livros...',
    'home.no_books_found': 'Nenhum livro encontrado',
    'home.adjust_search': 'Tente ajustar sua busca',
    'home.create_first_book': 'Que tal criar seu primeiro livro?',
    
    // Buttons
    'button.create': 'Criar',
    'button.cancel': 'Cancelar',
    'button.save': 'Salvar',
    'button.edit': 'Editar',
    'button.delete': 'Excluir',
    'button.yes': 'Sim',
    'button.no': 'Não',
    
    // Book Dashboard
    'book.dashboard': 'Dashboard do Livro',
    'book.overview': 'Overview',
    'book.characters': 'Personagens',
    'book.world': 'Mundo',
    'book.organizations': 'Organizações',
    'book.timeline': 'Linha do Tempo',
    'book.plot': 'Enredo',
    'book.magic_system': 'Magia',
    'book.encyclopedia': 'Enciclopédia',
    'book.relations': 'Relações',
    
    // Create Book Modal
    'modal.create_book': 'Criar Novo Livro',
    'modal.book_title': 'Título do Livro',
    'modal.book_genre': 'Gênero',
    'modal.book_style': 'Estilo Visual',
    'modal.book_cover': 'Capa (opcional)',
    'modal.book_synopsis': 'Sinopse (opcional)',
    'modal.author_summary': 'Resumo do Autor (opcional)',
    'modal.title_required': 'Título é obrigatório',
    'modal.genre_required': 'Gênero é obrigatório',
    'modal.style_required': 'Estilo visual é obrigatório',
    
    // Settings
    'settings.title': 'Configurações',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.privacy_policy': 'Política de Privacidade',
    'settings.terms_of_use': 'Termos de Uso',
    'settings.dark_mode': 'Modo Escuro',
    'settings.light_mode': 'Modo Claro',
  },
  en: {
    // Home
    'home.welcome': 'Welcome to your',
    'home.creative_universe': 'Creative Universe',
    'home.organize_worlds': 'Organize your fantasy worlds, characters and stories',
    'home.create_new_book': 'Create New Book',
    'home.total_books': 'Total Books',
    'home.active_projects': 'Active projects',
    'home.storage_used': 'Storage Used',
    'home.storage_available': 'of 10 GB available',
    'home.last_edition': 'Last Edition',
    'home.this_month': 'This month',
    'home.library': 'Your Library',
    'home.search_books': 'Search books...',
    'home.no_books_found': 'No books found',
    'home.adjust_search': 'Try adjusting your search',
    'home.create_first_book': 'How about creating your first book?',
    
    // Buttons
    'button.create': 'Create',
    'button.cancel': 'Cancel',
    'button.save': 'Save',
    'button.edit': 'Edit',
    'button.delete': 'Delete',
    'button.yes': 'Yes',
    'button.no': 'No',
    
    // Book Dashboard
    'book.dashboard': 'Book Dashboard',
    'book.overview': 'Overview',
    'book.characters': 'Characters',
    'book.world': 'World',
    'book.organizations': 'Organizations',
    'book.timeline': 'Timeline',
    'book.plot': 'Plot',
    'book.magic_system': 'Magic',
    'book.encyclopedia': 'Encyclopedia',
    'book.relations': 'Relations',
    
    // Create Book Modal
    'modal.create_book': 'Create New Book',
    'modal.book_title': 'Book Title',
    'modal.book_genre': 'Genre',
    'modal.book_style': 'Visual Style',
    'modal.book_cover': 'Cover (optional)',
    'modal.book_synopsis': 'Synopsis (optional)',
    'modal.author_summary': 'Author Summary (optional)',
    'modal.title_required': 'Title is required',
    'modal.genre_required': 'Genre is required',
    'modal.style_required': 'Visual style is required',
    
    // Settings
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.privacy_policy': 'Privacy Policy',
    'settings.terms_of_use': 'Terms of Use',
    'settings.dark_mode': 'Dark Mode',
    'settings.light_mode': 'Light Mode',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    const stored = localStorage.getItem('grimorium-language');
    if (stored && (stored === 'pt' || stored === 'en')) {
      setLanguage(stored);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('grimorium-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.pt] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}