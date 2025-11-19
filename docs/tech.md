# Grimorium - Tech Stack & Architecture

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Patterns](#architecture-patterns)
- [Naming Conventions](#naming-conventions)
- [Code Organization](#code-organization)
- [Best Practices](#best-practices)

---

## Tech Stack

### Core
- **Tauri 2.x** - Native desktop application framework
- **React 18.x** - UI library
- **TypeScript 5.x** - Type-safe JavaScript
- **Vite 5.x** - Build tool and dev server
- **@vitejs/plugin-react-swc** - Fast React compiler using SWC
- **pnpm** - Package manager

### Routing & State
- **Tanstack Router** - Type-safe file-based routing
- **Zustand** - Lightweight state management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled accessible components
- **shadcn/ui** - Re-usable component collection
- **class-variance-authority (CVA)** - Component variant management
- **clsx + tailwind-merge** - Conditional className utilities
- **Lucide React + React Icons** - Icon libraries
- **tailwindcss-animate** - Animation utilities
- **@tailwindcss/typography** - Typography plugin

### Forms & Validation
- **React Hook Form** - Performant form library
- **Zod** - TypeScript-first schema validation

### Specialized Components
- **@dnd-kit** - Drag and drop functionality
- **cmdk** - Command palette
- **embla-carousel-react** - Carousel component
- **react-day-picker** - Date picker
- **react-easy-crop** - Image cropping
- **react-resizable-panels** - Resizable panel layouts
- **react-zoom-pan-pinch** - Image zoom/pan
- **recharts** - Chart library
- **@tanstack/react-virtual** - Virtual scrolling for large lists

### Utilities
- **date-fns** - Date manipulation and formatting
- **i18next + react-i18next** - Internationalization

### Tauri Plugins
- **@tauri-apps/plugin-dialog** - Native dialogs
- **@tauri-apps/plugin-fs** - File system access
- **@tauri-apps/plugin-sql** - SQLite database

### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

---

## Project Structure

```
src/
├── components/          # Global reusable components
│   ├── ui/             # shadcn/ui components
│   ├── modals/         # Modal components
│   ├── dialogs/        # Dialog components
│   ├── forms/          # Form components
│   └── ...             # Other global components
├── pages/              # Page components (with controller/view pattern)
│   └── [page-name]/
│       ├── index.tsx   # Controller (logic)
│       ├── view.tsx    # View (presentation)
│       ├── components/ # Page-specific components
│       ├── hooks/      # Page-specific hooks
│       ├── utils/      # Page-specific utilities
│       ├── types/      # Page-specific types
│       └── constants/  # Page-specific constants
├── routes/             # Tanstack Router file-based routes
├── lib/                # Core utilities and services
│   ├── db/            # Database services (Tauri SQL)
│   ├── validation/    # Zod schemas
│   ├── utils/         # Global utility functions
│   ├── assets/        # Static assets management
│   └── i18n.ts        # i18n configuration
├── stores/             # Zustand global stores
├── types/              # Global TypeScript types and interfaces
├── mocks/              # Mock data (development only)
│   ├── global/        # Global mock data
│   └── local/         # Local mock data
├── hooks/              # Global custom hooks
├── utils/              # Global utility functions
├── App.tsx             # App component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

---

## Architecture Patterns

### 1. Controller/View Pattern (Pages & Modals)

All pages and complex modals follow the **Controller/View** separation pattern.

#### **Controller (index.tsx)**
- Contains all business logic
- Manages state with hooks (`useState`, `useEffect`, etc.)
- Handles data fetching and side effects
- Defines event handlers (prefix with `handle`)
- Memoizes functions with `useCallback`
- Memoizes computed values with `useMemo`
- Passes data and callbacks to the View as props

**Example:**
```tsx
// src/pages/home/index.tsx
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { HomeView } from './view';

export function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Event handlers use 'handle' prefix
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleBookSelect = useCallback((bookId: string) => {
    navigate({ to: '/dashboard/$dashboardId', params: { dashboardId: bookId } });
  }, [navigate]);

  // Computed values are memoized
  const filteredBooks = useMemo(() => {
    return books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  // Pass data and callbacks to View with 'on' prefix for callbacks
  return (
    <HomeView
      filteredBooks={filteredBooks}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      onBookSelect={handleBookSelect}
    />
  );
}
```

#### **View (view.tsx)**
- Pure presentational component
- Receives all data via props
- Contains only JSX markup
- Can use `useTranslation` hook for i18n
- Can have simple derived values that don't cause re-renders
- Event handlers received as props use `on` prefix

**Example:**
```tsx
// src/pages/home/view.tsx
import { useTranslation } from 'react-i18next';
import { BookCard } from './components/book-card';

interface HomeViewProps {
  filteredBooks: Book[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onBookSelect: (bookId: string) => void;
}

export function HomeView({
  filteredBooks,
  searchTerm,
  onSearchChange,
  onBookSelect,
}: HomeViewProps) {
  const { t } = useTranslation();

  return (
    <div className="container">
      <h1>{t('home.title')}</h1>
      <input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {filteredBooks.map(book => (
        <BookCard
          key={book.id}
          book={book}
          onClick={() => onBookSelect(book.id)}
        />
      ))}
    </div>
  );
}
```

### 2. Component Organization

#### **Global Components** (`src/components/`)
- Reusable across multiple pages
- Should be framework-agnostic (no page-specific logic)
- Export as named exports

#### **Local Components** (`src/pages/[page-name]/components/`)
- Used only within a specific page
- Can be more coupled to page context
- Organize by feature if needed

#### **UI Components** (`src/components/ui/`)
- Low-level, highly reusable components (from shadcn/ui)
- Typically wrappers around Radix UI
- Should have no business logic

### 3. Service Layer (Database)

All database operations go through services in `src/lib/db/`.

**Example:**
```tsx
// src/lib/db/books.service.ts
import Database from '@tauri-apps/plugin-sql';

export async function getAllBooks(): Promise<Book[]> {
  const db = await Database.load('sqlite:grimorium.db');
  return await db.select<Book[]>('SELECT * FROM books ORDER BY last_opened DESC');
}

export async function createBook(bookData: BookFormData): Promise<Book> {
  const db = await Database.load('sqlite:grimorium.db');
  const result = await db.execute(
    'INSERT INTO books (title, genre, created_at) VALUES (?, ?, ?)',
    [bookData.title, bookData.genre, new Date().toISOString()]
  );
  return { id: result.lastInsertId, ...bookData };
}
```

### 4. State Management

#### **Local State** - `useState`, `useReducer`
Use for component-specific state that doesn't need to be shared.

#### **Global State** - Zustand stores (`src/stores/`)
Use for state shared across multiple components/pages.

**Example:**
```tsx
// src/stores/book-store.ts
import { create } from 'zustand';

interface BookStore {
  books: Book[];
  setBooks: (books: Book[]) => void;
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
}

export const useBookStore = create<BookStore>((set) => ({
  books: [],
  setBooks: (books) => set({ books }),
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  removeBook: (bookId) => set((state) => ({
    books: state.books.filter(b => b.id !== bookId)
  })),
}));
```

### 5. Form Handling

Use **React Hook Form** with **Zod** for validation.

**Example:**
```tsx
// src/lib/validation/book-schema.ts
import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  genre: z.array(z.string()).min(1, 'Select at least one genre'),
  synopsis: z.string().optional(),
});

export type BookFormData = z.infer<typeof bookSchema>;
```

```tsx
// In component
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookSchema, BookFormData } from '@/lib/validation/book-schema';

function BookForm() {
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: { title: '', genre: [], synopsis: '' },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data); // Type-safe data
  });

  return <form onSubmit={onSubmit}>...</form>;
}
```

---

## Naming Conventions

### Files and Folders
- **kebab-case** for all files and folders: `user-profile.tsx`, `get-user-data.ts`
- Exception: Route parameters use `$` prefix: `routes/$bookId.tsx`

### Components
- **PascalCase** for component names: `UserProfile`, `BookCard`
- **kebab-case** for file names: `user-profile.tsx`, `book-card.tsx`

### Functions and Variables
- **camelCase** for functions: `getUserData`, `calculateTotal`
- **camelCase** for variables: `userName`, `bookList`
- **Event handlers** in controllers: prefix with `handle` → `handleClick`, `handleSubmit`
- **Event handler props** in views: prefix with `on` → `onClick`, `onSubmit`

### Booleans
Use descriptive prefixes:
- `is` - state: `isLoading`, `isActive`
- `has` - possession: `hasPermission`, `hasError`
- `should` - condition: `shouldRedirect`, `shouldValidate`
- `can` - ability: `canEdit`, `canDelete`

### Collections
- Use plural: `users`, `books`, `characters`

### Constants
- **UPPER_SNAKE_CASE**: `MAX_RETRIES`, `API_URL`, `DEFAULT_TIMEOUT`

### TypeScript Types

#### Component Props
- Suffix with `Props`: `ButtonProps`, `HomeViewProps`, `BookCardProps`

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

#### Other Interfaces/Types
- Prefix with `I` for interfaces: `IUser`, `IBook`, `ICharacter`
- No prefix for types: `BookStatus`, `UserRole`

```tsx
// Interface
interface IBook {
  id: string;
  title: string;
  author: IAuthor;
}

// Type
type BookStatus = 'draft' | 'published' | 'archived';
```

---

## Code Organization

### Custom Hooks

#### Global Hooks (`src/hooks/`)
- Reusable across the app
- Start with `use`: `useDebounce`, `useLocalStorage`

#### Local Hooks (`src/pages/[page]/hooks/`)
- Specific to a page
- Extract complex logic from controllers

**Example:**
```tsx
// src/pages/home/hooks/use-book-filters.ts
import { useMemo } from 'react';

export function useBookFilters(books: Book[], searchTerm: string) {
  return useMemo(() => {
    return books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);
}
```

### Utility Functions

#### Global Utils (`src/utils/` or `src/lib/utils/`)
- Pure functions with no React dependencies
- Reusable across the app

#### Local Utils (`src/pages/[page]/utils/`)
- Specific to a page
- Can be organized by subdirectories: `utils/filters/`, `utils/formatters/`, `utils/calculators/`

**Example:**
```tsx
// src/pages/dashboard/utils/formatters/get-status-color.ts
export function getStatusColor(status: BookStatus): string {
  const colors: Record<BookStatus, string> = {
    draft: 'text-yellow-500',
    published: 'text-green-500',
    archived: 'text-gray-500',
  };
  return colors[status];
}
```

### Constants

#### Global Constants (`src/constants/`)
- Used across multiple pages
- Example: `src/constants/api-endpoints.ts`

#### Local Constants (`src/pages/[page]/constants/`)
- Specific to a page
- Example: `src/pages/characters/constants/character-roles.ts`

**Example:**
```tsx
// src/pages/characters/constants/character-roles.ts
export const CHARACTER_ROLES = [
  'protagonist',
  'antagonist',
  'supporting',
  'background',
] as const;

export type CharacterRole = typeof CHARACTER_ROLES[number];
```

### Mocks

All mock data goes in `src/mocks/` (development only).

#### Structure:
- `src/mocks/global/` - Mock data used globally
- `src/mocks/local/` - Mock data for specific features

**Naming:**
- Files: prefix with `mock-` → `mock-users.ts`, `mock-books.ts`
- Variables: `UPPER_SNAKE_CASE` → `MOCK_USERS`, `MOCK_BOOKS`

**Example:**
```tsx
// src/mocks/global/books.ts
import { IBook } from '@/types/book-types';

export const MOCK_BOOKS: IBook[] = [
  { id: '1', title: 'The Great Adventure', genre: ['fantasy'], createdAt: '2024-01-01' },
  { id: '2', title: 'Mystery of the Manor', genre: ['mystery'], createdAt: '2024-01-02' },
];
```

---

## Best Practices

### General Guidelines

1. **Keep components small and focused** - If a component exceeds 200-250 lines, consider breaking it down
2. **Extract complex logic** - Move complex logic to custom hooks or utility functions
3. **Avoid prop drilling** - Use Zustand for deeply nested state
4. **Type everything** - Never use `any`; create proper types instead
5. **Colocate related code** - Keep related files close in the file structure

### React Best Practices

1. **Use functional components** - No class components
2. **Memoize expensive computations** - Use `useMemo` for derived data
3. **Memoize callbacks** - Use `useCallback` for functions passed as props
4. **Handle loading and error states** - Always show feedback to users
5. **Avoid inline styles** - Use Tailwind classes

### TypeScript Best Practices

1. **Prefer interfaces for objects** - Use `type` for unions, primitives, or computed types
2. **Use `const` assertions** for literal arrays** - `as const` for immutable arrays
3. **Avoid type assertions** - Use type guards instead
4. **Export types** - Make types reusable across the codebase

### Code Quality

1. **No `console.log` in production code** - Remove or use proper logging
2. **Write meaningful comments** - Only when code intent is unclear
3. **Use descriptive variable names** - Avoid abbreviations
4. **Keep functions pure when possible** - Easier to test and reason about
5. **Follow ESLint and Prettier rules** - Run `pnpm format` before committing

### Performance

1. **Use virtual scrolling** - For lists with 100+ items (use `@tanstack/react-virtual`)
2. **Lazy load images** - Defer loading of images below the fold
3. **Code splitting** - Use dynamic imports for large components
4. **Debounce search inputs** - Avoid excessive re-renders during typing
5. **Optimize Zustand selectors** - Only subscribe to needed state slices

### Accessibility

1. **Use semantic HTML** - Proper heading hierarchy, landmarks
2. **Add ARIA labels** - For icon buttons and interactive elements
3. **Keyboard navigation** - Ensure all interactions work with keyboard
4. **Focus management** - Restore focus after modal closes
5. **Color contrast** - Ensure text meets WCAG standards

---

## Internationalization (i18n)

### Structure
- Translation files: `locales/[language]/[namespace].json`
- Namespaces by feature: `home.json`, `characters.json`, `common.json`

### Keys
- Use dot notation: `page.home.title`, `form.validation.required`
- Keep keys descriptive and hierarchical

**Example:**
```json
// locales/en/home.json
{
  "title": "My Books",
  "search": {
    "placeholder": "Search books...",
    "noResults": "No books found"
  },
  "actions": {
    "create": "Create New Book",
    "delete": "Delete"
  }
}
```

```tsx
// In component
import { useTranslation } from 'react-i18next';

function HomePage() {
  const { t } = useTranslation('home');

  return (
    <div>
      <h1>{t('title')}</h1>
      <input placeholder={t('search.placeholder')} />
      <button>{t('actions.create')}</button>
    </div>
  );
}
```

---

## Git Workflow

1. **Named exports only** - No default exports (except for route files)
2. **Commit frequently** - Small, focused commits
3. **Write descriptive commit messages** - Follow conventional commits format
4. **Branch naming**: `feature/feature-name`, `fix/bug-name`

---

## When to Break the Rules

These guidelines are strong conventions, but not absolute laws. You may break them when:

1. **It improves readability** - Clarity > strict adherence
2. **Library conventions differ** - Follow the library's recommended patterns
3. **Performance requirements** - Optimize when needed
4. **Team consensus** - Discuss and document exceptions

**Always document why you're deviating from conventions.**

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Tauri Documentation](https://v2.tauri.app)
- [Tanstack Router](https://tanstack.com/router)
- [Zustand](https://docs.pmnd.rs/zustand)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
