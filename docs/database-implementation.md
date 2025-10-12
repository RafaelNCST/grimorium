# Documentação de Implementação do Banco de Dados

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Schema do Banco de Dados](#schema-do-banco-de-dados)
4. [Camada de Serviços](#camada-de-serviços)
5. [Sistema de Tipos](#sistema-de-tipos)
6. [Integração com a Interface](#integração-com-a-interface)
7. [Fluxo de Dados](#fluxo-de-dados)
8. [Gerenciamento de Assets](#gerenciamento-de-assets)
9. [Guia de Testes](#guia-de-testes)
10. [Melhorias Futuras](#melhorias-futuras)

---

## Visão Geral

Esta implementação adiciona persistência de dados completa ao Grimorium usando SQLite como banco de dados local. A arquitetura foi projetada para ser offline-first, garantindo que todos os dados sejam armazenados localmente e acessíveis sem conexão com a internet.

### O Que Foi Implementado

- ✅ Banco de dados SQLite integrado via `tauri-plugin-sql`
- ✅ Schema completo com 5 tabelas principais
- ✅ Camada de serviços com operações CRUD
- ✅ Sistema de tipos TypeScript bidirecional (Domain ↔ Database)
- ✅ Integração completa com o ciclo: Home → Dashboard → Overview → Personagens
- ✅ Gerenciamento de relacionamentos entre personagens
- ✅ Sistema de árvore genealógica
- ✅ Sistema de versionamento de personagens
- ✅ Gerenciamento básico de assets (imagens em base64)

### Tecnologias Utilizadas

- **SQLite**: Banco de dados relacional leve e rápido
- **tauri-plugin-sql**: Plugin oficial do Tauri para acesso ao SQLite
- **TypeScript**: Tipagem forte para segurança de tipos
- **React**: Framework de interface
- **Zustand**: Gerenciamento de estado global (preparado para uso futuro)

---

## Arquitetura

### Estrutura de Pastas

```
src/
├── lib/
│   ├── db/
│   │   ├── schema.sql              # Schema do banco de dados
│   │   ├── types.ts                # Tipos TypeScript do DB
│   │   ├── index.ts                # Inicialização e migrações
│   │   ├── books.service.ts        # CRUD de livros
│   │   └── characters.service.ts   # CRUD de personagens
│   └── assets/
│       └── index.ts                # Gerenciamento de assets
├── pages/
│   ├── home/
│   │   └── index.tsx               # Integrado com books.service
│   └── dashboard/
│       └── tabs/
│           └── characters/
│               ├── index.tsx       # Integrado com characters.service
│               └── character-detail/
│                   └── index.tsx   # Carrega dados do DB
└── types/
    ├── book-types.ts               # Tipos de domínio (livros)
    └── character-types.ts          # Tipos de domínio (personagens)
```

### Camadas da Arquitetura

```
┌─────────────────────────────────────────┐
│         Interface (React)               │
│  (Home, Dashboard, Character Detail)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Camada de Serviços                │
│  (books.service, characters.service)    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Converters (Domain ↔ DB)           │
│  (Bidirecional com type safety)         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          SQLite Database                │
│     (Armazenamento persistente)         │
└─────────────────────────────────────────┘
```

---

## Schema do Banco de Dados

### Tabela: `books`

Armazena informações sobre os livros/projetos.

```sql
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_image_path TEXT,
  genre TEXT,                    -- JSON array de gêneros
  status TEXT DEFAULT 'draft',   -- draft, in_progress, completed
  word_count_goal INTEGER,
  current_word_count INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  last_opened_at INTEGER
);
```

**Índices:**
- `idx_books_status`: Otimiza busca por status
- `idx_books_updated_at`: Otimiza ordenação por data de atualização

### Tabela: `characters`

Armazena todos os dados dos personagens.

```sql
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age TEXT,
  gender TEXT,
  role TEXT,
  description TEXT,
  image TEXT,                    -- Base64 ou caminho do arquivo
  alignment TEXT,                -- Alinhamento moral (ex: lawful-good)

  -- Aparência (9 campos)
  height TEXT,
  weight TEXT,
  skin_tone TEXT,
  physical_type TEXT,
  hair TEXT,
  eyes TEXT,
  face TEXT,
  distinguishing_features TEXT,
  species_and_race TEXT,

  -- Comportamento (7 campos)
  archetype TEXT,
  personality TEXT,
  hobbies TEXT,
  dreams_and_goals TEXT,
  fears_and_traumas TEXT,
  favorite_food TEXT,
  favorite_music TEXT,

  -- Localização (3 campos)
  birth_place TEXT,
  affiliated_place TEXT,
  organization TEXT,

  -- Metadados
  field_visibility TEXT,         -- JSON de campos visíveis
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),

  UNIQUE(book_id, name)          -- Impede nomes duplicados no mesmo livro
);
```

**Índices:**
- `idx_characters_book_id`: Otimiza busca por livro
- `idx_characters_role`: Otimiza filtros por papel

### Tabela: `character_versions`

Armazena versões alternativas de personagens.

```sql
CREATE TABLE IF NOT EXISTS character_versions (
  id TEXT PRIMARY KEY,
  character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL,
  is_main_version INTEGER DEFAULT 0,  -- Versão principal (boolean)
  data TEXT NOT NULL,                  -- JSON com dados completos
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);
```

**Índices:**
- `idx_versions_character_id`: Otimiza busca por personagem

### Tabela: `relationships`

Armazena relacionamentos entre personagens.

```sql
CREATE TABLE IF NOT EXISTS relationships (
  id TEXT PRIMARY KEY,
  character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  target_character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  type TEXT NOT NULL,              -- ally, enemy, mentor, student, etc.
  description TEXT,
  intensity INTEGER DEFAULT 5,     -- 1-10
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);
```

**Tipos de relacionamentos suportados:**
- `ally` - Aliado
- `enemy` - Inimigo
- `mentor` - Mentor
- `student` - Estudante
- `rival` - Rival
- `love_interest` - Interesse romântico
- `family` - Familiar (genérico)
- `acquaintance` - Conhecido
- `leader` - Líder

**Índices:**
- `idx_relationships_character_id`: Otimiza busca por personagem origem
- `idx_relationships_target_id`: Otimiza busca por personagem alvo

### Tabela: `family_relations`

Armazena relações familiares específicas.

```sql
CREATE TABLE IF NOT EXISTS family_relations (
  id TEXT PRIMARY KEY,
  character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  related_character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL,     -- father, mother, spouse, child, etc.
  created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
);
```

**Tipos de relações familiares:**
- `father` - Pai
- `mother` - Mãe
- `spouse` - Cônjuge
- `child` - Filho(a)
- `sibling` - Irmão(ã)
- `half_sibling` - Meio-irmão(ã)
- `grandparent` - Avô/Avó
- `uncle_aunt` - Tio(a)
- `cousin` - Primo(a)

**Índices:**
- `idx_family_character_id`: Otimiza busca por personagem

### Decisões de Design

1. **Timestamps como INTEGER**: Armazenados em milissegundos (epoch) para facilitar ordenação e comparação
2. **Campos JSON**: `genre` e `field_visibility` armazenados como JSON para flexibilidade
3. **CASCADE DELETE**: Todas as foreign keys usam `ON DELETE CASCADE` para manter integridade referencial
4. **UNIQUE constraint**: Impede criação de personagens com mesmo nome no mesmo livro
5. **Base64 para imagens**: Solução temporária, preparada para migração para sistema de arquivos

---

## Camada de Serviços

### books.service.ts

Gerencia todas as operações relacionadas a livros.

#### Funções Principais

**`getAllBooks(): Promise<IBook[]>`**
```typescript
// Busca todos os livros ordenados por última abertura
const books = await getAllBooks();
```

**`getBookById(id: string): Promise<IBook | null>`**
```typescript
// Busca um livro específico por ID
const book = await getBookById('book-123');
```

**`createBook(book: IBook): Promise<void>`**
```typescript
// Cria um novo livro
await createBook({
  id: 'book-123',
  title: 'Meu Livro',
  subtitle: 'Uma aventura épica',
  description: 'Um livro sobre...',
  genre: ['fantasy', 'adventure'],
  status: 'draft',
  // ... outros campos
});
```

**`updateBook(id: string, updates: Partial<IBook>): Promise<void>`**
```typescript
// Atualiza campos específicos de um livro
await updateBook('book-123', {
  status: 'in_progress',
  currentWordCount: 5000
});
```

**`deleteBook(id: string): Promise<void>`**
```typescript
// Deleta um livro (e todos os personagens relacionados por CASCADE)
await deleteBook('book-123');
```

**`updateLastOpened(id: string): Promise<void>`**
```typescript
// Atualiza timestamp de última abertura
await updateLastOpened('book-123');
```

### characters.service.ts

Gerencia todas as operações relacionadas a personagens.

#### Funções Principais

**Personagens**

**`getCharactersByBookId(bookId: string): Promise<ICharacter[]>`**
```typescript
// Busca todos os personagens de um livro
const characters = await getCharactersByBookId('book-123');
```

**`getCharacterById(id: string): Promise<ICharacter | null>`**
```typescript
// Busca um personagem específico
const character = await getCharacterById('char-123');
```

**`createCharacter(bookId: string, character: ICharacter): Promise<void>`**
```typescript
// Cria um novo personagem
await createCharacter('book-123', {
  id: 'char-123',
  name: 'João Silva',
  age: '30',
  gender: 'male',
  role: 'protagonist',
  description: 'Um herói valente...',
  // ... outros campos
});
```

**`updateCharacter(id: string, updates: Partial<ICharacter>): Promise<void>`**
```typescript
// Atualiza campos específicos de um personagem
await updateCharacter('char-123', {
  age: '31',
  description: 'Um herói ainda mais experiente...'
});
```

**`deleteCharacter(id: string): Promise<void>`**
```typescript
// Deleta um personagem (e todos os relacionamentos por CASCADE)
await deleteCharacter('char-123');
```

**Relacionamentos**

**`getCharacterRelationships(characterId: string): Promise<IRelationship[]>`**
```typescript
// Busca todos os relacionamentos de um personagem
const relationships = await getCharacterRelationships('char-123');
```

**`saveCharacterRelationships(characterId: string, relationships: IRelationship[]): Promise<void>`**
```typescript
// Salva/atualiza todos os relacionamentos de um personagem
await saveCharacterRelationships('char-123', [
  {
    id: 'rel-1',
    characterId: 'char-123',
    targetCharacterId: 'char-456',
    type: 'ally',
    description: 'Melhor amigo',
    intensity: 9
  }
]);
```

**Família**

**`getCharacterFamily(characterId: string): Promise<IFamily>`**
```typescript
// Busca toda a árvore genealógica de um personagem
const family = await getCharacterFamily('char-123');
// Retorna: { father: 'char-456', mother: 'char-789', children: [...], ... }
```

**`saveCharacterFamily(characterId: string, family: IFamily): Promise<void>`**
```typescript
// Salva/atualiza toda a árvore genealógica
await saveCharacterFamily('char-123', {
  father: 'char-456',
  mother: 'char-789',
  spouse: 'char-101',
  children: ['char-102', 'char-103'],
  siblings: ['char-104'],
  halfSiblings: [],
  grandparents: ['char-200', 'char-201'],
  unclesAunts: [],
  cousins: []
});
```

**Versões**

**`getCharacterVersions(characterId: string): Promise<ICharacterVersion[]>`**
```typescript
// Busca todas as versões de um personagem
const versions = await getCharacterVersions('char-123');
```

**`createCharacterVersion(version: ICharacterVersion): Promise<void>`**
```typescript
// Cria uma nova versão
await createCharacterVersion({
  id: 'ver-1',
  characterId: 'char-123',
  versionName: 'Versão Alternativa - Vilão',
  isMainVersion: false,
  data: characterDataAsJSON
});
```

**`updateCharacterVersion(id: string, updates: Partial<ICharacterVersion>): Promise<void>`**
```typescript
// Atualiza uma versão existente
await updateCharacterVersion('ver-1', {
  versionName: 'Versão Final',
  data: updatedCharacterData
});
```

**`deleteCharacterVersion(id: string): Promise<void>`**
```typescript
// Deleta uma versão específica
await deleteCharacterVersion('ver-1');
```

---

## Sistema de Tipos

### Domain Types (src/types/)

Tipos usados na interface e lógica de negócio.

**IBook (book-types.ts)**
```typescript
export interface IBook {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  coverImagePath?: string;
  genre: string[];              // Array de strings
  status: 'draft' | 'in_progress' | 'completed';
  wordCountGoal?: number;
  currentWordCount: number;
  createdAt: string;            // ISO 8601 string
  updatedAt: string;
  lastOpenedAt?: string;
}
```

**ICharacter (character-types.ts)**
```typescript
export interface ICharacter {
  id: string;
  name: string;
  age?: string;
  gender?: string;
  role?: string;
  description: string;
  image?: string;
  alignment?: string;

  // Appearance (9 campos)
  height?: string;
  weight?: string;
  skinTone?: string;
  physicalType?: string;
  hair?: string;
  eyes?: string;
  face?: string;
  distinguishingFeatures?: string;
  speciesAndRace?: string;

  // Behavior (7 campos)
  archetype?: string;
  personality?: string;
  hobbies?: string;
  dreamsAndGoals?: string;
  fearsAndTraumas?: string;
  favoriteFood?: string;
  favoriteMusic?: string;

  // Location (3 campos)
  birthPlace?: string;
  affiliatedPlace?: string;
  organization?: string;

  // Relationships & Family
  relationships?: IRelationship[];
  family?: IFamily;

  // Metadata
  fieldVisibility?: Record<string, boolean>;
  qualities?: string[];
  createdAt: string;
  updatedAt?: string;
}
```

**IRelationship**
```typescript
export interface IRelationship {
  id: string;
  characterId: string;
  targetCharacterId: string;
  type: 'ally' | 'enemy' | 'mentor' | 'student' | 'rival' |
        'love_interest' | 'family' | 'acquaintance' | 'leader';
  description?: string;
  intensity: number;  // 1-10
}
```

**IFamily**
```typescript
export interface IFamily {
  father: string | null;
  mother: string | null;
  spouse: string | null;
  children: string[];
  siblings: string[];
  halfSiblings: string[];
  grandparents: string[];
  unclesAunts: string[];
  cousins: string[];
}
```

### Database Types (src/lib/db/types.ts)

Tipos que mapeiam diretamente para as tabelas do banco.

**DBBook**
```typescript
export interface DBBook {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image_path: string | null;
  genre: string | null;          // JSON serializado
  status: string;
  word_count_goal: number | null;
  current_word_count: number;
  created_at: number;            // Timestamp em ms
  updated_at: number;
  last_opened_at: number | null;
}
```

**DBCharacter**
```typescript
export interface DBCharacter {
  id: string;
  book_id: string;
  name: string;
  // ... todos os campos em snake_case
  field_visibility: string | null;  // JSON serializado
  created_at: number;                // Timestamp em ms
  updated_at: number;
}
```

### Converters

Funções bidirecionais para conversão entre Domain Types e Database Types.

**Exemplo: Book Converters**
```typescript
// Domain → Database
export function bookToDBBook(book: IBook): DBBook {
  return {
    id: book.id,
    title: book.title,
    subtitle: book.subtitle || null,
    description: book.description || null,
    cover_image_path: book.coverImagePath || null,
    genre: book.genre ? JSON.stringify(book.genre) : null,
    status: book.status,
    word_count_goal: book.wordCountGoal || null,
    current_word_count: book.currentWordCount,
    created_at: new Date(book.createdAt).getTime(),
    updated_at: new Date(book.updatedAt).getTime(),
    last_opened_at: book.lastOpenedAt
      ? new Date(book.lastOpenedAt).getTime()
      : null,
  };
}

// Database → Domain
export function dbBookToBook(dbBook: DBBook): IBook {
  return {
    id: dbBook.id,
    title: dbBook.title,
    subtitle: dbBook.subtitle || undefined,
    description: dbBook.description || undefined,
    coverImagePath: dbBook.cover_image_path || undefined,
    genre: dbBook.genre ? JSON.parse(dbBook.genre) : [],
    status: dbBook.status as IBook['status'],
    wordCountGoal: dbBook.word_count_goal || undefined,
    currentWordCount: dbBook.current_word_count,
    createdAt: new Date(dbBook.created_at).toISOString(),
    updatedAt: new Date(dbBook.updated_at).toISOString(),
    lastOpenedAt: dbBook.last_opened_at
      ? new Date(dbBook.last_opened_at).toISOString()
      : undefined,
  };
}
```

**Benefícios dos Converters:**
- ✅ Type safety completo
- ✅ Separação de responsabilidades (UI não conhece estrutura do DB)
- ✅ Facilita migrações futuras
- ✅ Previne erros de naming (camelCase vs snake_case)

---

## Integração com a Interface

### Home Page (src/pages/home/index.tsx)

**Carregamento Inicial**
```typescript
useEffect(() => {
  const loadBooks = async () => {
    try {
      const booksFromDB = await getAllBooks();
      setBooks(booksFromDB);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoading(false);
    }
  };
  loadBooks();
}, []);
```

**Criação de Novo Livro**
```typescript
const handleCreateBook = useCallback(async (bookData: IBook) => {
  try {
    await createBook(bookData);
    setBooks((prev) => [...prev, bookData]);
  } catch (error) {
    console.error('Error creating book:', error);
  }
}, []);
```

**Atualização de Last Opened**
```typescript
const handleBookClick = useCallback(async (bookId: string) => {
  try {
    await updateLastOpened(bookId);
    navigate({ to: '/dashboard/$dashboardId', params: { dashboardId: bookId } });
  } catch (error) {
    console.error('Error updating last opened:', error);
  }
}, [navigate]);
```

### Characters Tab (src/pages/dashboard/tabs/characters/index.tsx)

**Carregamento de Personagens**
```typescript
useEffect(() => {
  const loadCharacters = async () => {
    try {
      const charactersFromDB = await getCharactersByBookId(bookId);
      setCharacters(charactersFromDB);
    } catch (error) {
      console.error("Error loading characters:", error);
    } finally {
      setIsLoading(false);
    }
  };
  loadCharacters();
}, [bookId]);
```

**Criação de Personagem**
```typescript
const handleCharacterCreated = useCallback(
  async (newCharacter: ICharacter) => {
    try {
      await createCharacter(bookId, newCharacter);
      setCharacters((prev) => [...prev, newCharacter]);
    } catch (error) {
      console.error("Error creating character:", error);
    }
  },
  [bookId]
);
```

### Character Detail (src/pages/dashboard/tabs/characters/character-detail/index.tsx)

**Carregamento Completo**
```typescript
useEffect(() => {
  const loadCharacter = async () => {
    try {
      // Carrega dados básicos
      const characterFromDB = await getCharacterById(characterId);
      if (characterFromDB) {
        setCharacter(characterFromDB);
        setEditData(characterFromDB);
        setImagePreview(characterFromDB.image || "");
        setFieldVisibility(characterFromDB.fieldVisibility || {});

        // Carrega relacionamentos
        const relationships = await getCharacterRelationships(characterId);
        setCharacter((prev) => ({ ...prev, relationships }));
        setEditData((prev) => ({ ...prev, relationships }));

        // Carrega família
        const family = await getCharacterFamily(characterId);
        setCharacter((prev) => ({ ...prev, family }));
        setEditData((prev) => ({ ...prev, family }));
      }
    } catch (error) {
      console.error("Error loading character:", error);
      toast.error("Erro ao carregar personagem");
    } finally {
      setIsLoading(false);
    }
  };
  loadCharacter();
}, [characterId]);
```

**Salvamento Completo**
```typescript
const handleSave = useCallback(async () => {
  try {
    // Atualiza dados básicos
    const updatedCharacter: ICharacter = {
      ...editData,
      fieldVisibility,
      updatedAt: new Date().toISOString(),
    };

    await updateCharacter(characterId, updatedCharacter);

    // Salva relacionamentos
    if (updatedCharacter.relationships) {
      await saveCharacterRelationships(
        characterId,
        updatedCharacter.relationships
      );
    }

    // Salva família
    if (updatedCharacter.family) {
      await saveCharacterFamily(characterId, updatedCharacter.family);
    }

    setCharacter(updatedCharacter);
    setIsEditing(false);
    toast.success("Personagem atualizado com sucesso!");
  } catch (error) {
    console.error("Error saving character:", error);
    toast.error("Erro ao salvar personagem");
  }
}, [editData, fieldVisibility, characterId]);
```

---

## Fluxo de Dados

### Ciclo de Criação de Livro

```
1. Usuário clica em "Novo Livro" (Home)
   ↓
2. Modal de criação abre
   ↓
3. Usuário preenche dados e confirma
   ↓
4. handleCreateBook() é chamado
   ↓
5. createBook() salva no SQLite
   ↓
6. Estado local é atualizado (setBooks)
   ↓
7. Card do livro aparece na grid
```

### Ciclo de Criação de Personagem

```
1. Usuário clica em "Novo Personagem" (Characters Tab)
   ↓
2. Modal de criação abre
   ↓
3. Usuário preenche 26+ campos
   ↓
4. handleCharacterCreated() é chamado
   ↓
5. createCharacter(bookId, character) salva no SQLite
   ↓
6. Estado local é atualizado (setCharacters)
   ↓
7. Card do personagem aparece na grid
```

### Ciclo de Edição de Personagem

```
1. Usuário clica em card de personagem
   ↓
2. Navega para Character Detail
   ↓
3. useEffect carrega:
   - Dados básicos (getCharacterById)
   - Relacionamentos (getCharacterRelationships)
   - Família (getCharacterFamily)
   ↓
4. Usuário clica em "Editar"
   ↓
5. Campos se tornam editáveis
   ↓
6. Usuário modifica dados
   ↓
7. Usuário clica em "Salvar"
   ↓
8. handleSave() executa:
   - updateCharacter(id, updates)
   - saveCharacterRelationships(id, relationships)
   - saveCharacterFamily(id, family)
   ↓
9. Toast de sucesso aparece
   ↓
10. Modo de visualização é ativado
```

### Fluxo de Relacionamentos

```
1. Usuário abre seção "Relacionamentos"
   ↓
2. Clica em "Adicionar Relacionamento"
   ↓
3. Dialog abre com:
   - Select de personagem alvo
   - Select de tipo (Aliado, Inimigo, etc)
   - Textarea para descrição
   - Slider de intensidade (1-10)
   ↓
4. Usuário confirma
   ↓
5. Relacionamento é adicionado ao estado local
   ↓
6. Ao salvar personagem:
   - saveCharacterRelationships() deleta todos relacionamentos antigos
   - Insere novos relacionamentos no DB
```

### Fluxo de Família

```
1. Usuário abre seção "Família"
   ↓
2. Para relações únicas (pai, mãe, cônjuge):
   - Select com lista de personagens do livro
   - Previne auto-seleção
   ↓
3. Para relações múltiplas (filhos, irmãos, etc):
   - Multi-select com validação de duplicatas
   ↓
4. Botão "Visualizar Árvore" abre dialog com:
   - 4 gerações organizadas verticalmente
   - Avós → Pais/Tios → Personagem/Irmãos/Primos → Filhos
   - Linhas conectoras entre gerações
   ↓
5. Ao salvar personagem:
   - saveCharacterFamily() deleta todas relações antigas
   - Insere novas relações no DB
```

---

## Gerenciamento de Assets

### Implementação Atual: Base64

**Como funciona:**
```typescript
// Ao selecionar imagem
const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setEditData((prev) => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  }
};
```

**Armazenamento:**
- Imagens são convertidas para base64
- String base64 completa é armazenada no campo `image` ou `cover_image_path`
- Funciona para prototipagem mas não é ideal para produção

**Limitações:**
- ❌ Aumenta tamanho do banco de dados
- ❌ Queries mais lentas
- ❌ Dificulta exportação de assets
- ❌ Sem otimização de cache

### Solução Futura: Sistema de Arquivos

**Estrutura proposta:**
```
AppData/
└── Grimorium/
    ├── database.db
    └── assets/
        ├── books/
        │   └── {book-id}/
        │       ├── cover.jpg
        │       └── characters/
        │           └── {character-id}/
        │               ├── profile.jpg
        │               └── versions/
        │                   └── {version-id}.jpg
        └── temp/
```

**Implementação preparada em `src/lib/assets/index.ts`:**
```typescript
// Salvar imagem no disco
export async function saveAsset(
  bookId: string,
  characterId: string,
  file: File
): Promise<string> {
  // Converte para Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Caminho no disco
  const path = `assets/books/${bookId}/characters/${characterId}/profile.jpg`;

  // Usa Tauri FS API para salvar
  await writeBinaryFile(path, uint8Array, { dir: BaseDirectory.AppData });

  return path;
}

// Carregar imagem do disco
export async function loadAsset(path: string): Promise<string> {
  const contents = await readBinaryFile(path, { dir: BaseDirectory.AppData });
  const blob = new Blob([contents]);
  return URL.createObjectURL(blob);
}
```

**Benefícios:**
- ✅ Banco de dados menor e mais rápido
- ✅ Fácil exportação/backup de assets
- ✅ Cache nativo do navegador para URLs
- ✅ Suporta qualquer tipo de arquivo (áudio, vídeo, PDFs)

**Migração:**
1. Adicionar coluna `image_path` nas tabelas
2. Mover todas as imagens base64 para arquivos
3. Atualizar registros com caminhos dos arquivos
4. Remover colunas `image` antigas

---

## Guia de Testes

### Teste Completo do Ciclo

**1. Teste de Criação de Livro**
```
□ Abrir aplicação
□ Clicar em "Novo Livro"
□ Preencher:
  - Título: "Meu Livro de Testes"
  - Descrição: "Livro para testar persistência"
  - Gênero: Fantasy, Adventure
  - Status: Draft
□ Confirmar criação
□ Verificar se card aparece na grid
□ Fechar e reabrir aplicação
□ Verificar se livro ainda está lá ✅ (teste de persistência)
```

**2. Teste de Navegação Dashboard**
```
□ Clicar no card do livro
□ Verificar navegação para Dashboard
□ Verificar se título do livro aparece no header
□ Verificar tabs: Overview, Personagens (ativas), outros (desabilitadas)
□ Abrir Overview
□ Verificar estatísticas (devem estar zeradas)
```

**3. Teste de Criação de Personagem**
```
□ Ir para tab "Personagens"
□ Clicar em "Novo Personagem"
□ Preencher dados básicos:
  - Nome: "João Silva"
  - Idade: "30"
  - Gênero: Masculino
  - Papel: Protagonista
  - Descrição: "Um herói corajoso..."
□ Upload de imagem (qualquer JPG/PNG)
□ Preencher campos de aparência (altura, peso, etc)
□ Preencher campos de comportamento (personalidade, hobbies, etc)
□ Preencher campos de localização (local de nascimento, etc)
□ Confirmar criação
□ Verificar se card aparece na grid
□ Verificar badge de papel (deve ser amarelo - Protagonista)
□ Verificar estatísticas (deve mostrar "1 Protagonista")
```

**4. Teste de Criação de Segundo Personagem**
```
□ Criar segundo personagem:
  - Nome: "Maria Santos"
  - Papel: Antagonista
  - Preencher outros campos
□ Verificar se ambos aparecem na grid
□ Verificar estatísticas (1 Protagonista, 1 Antagonista)
□ Testar filtros clicando nos badges
□ Testar busca digitando nomes
```

**5. Teste de Character Detail**
```
□ Clicar no card de "João Silva"
□ Verificar navegação para Character Detail
□ Verificar se TODOS os dados preenchidos aparecem:
  - Nome, idade, gênero, papel ✅
  - Descrição ✅
  - Imagem ✅
  - Altura, peso, tom de pele, etc ✅
  - Personalidade, hobbies, sonhos, etc ✅
  - Local de nascimento, organização, etc ✅
□ Verificar modo de visualização (campos read-only)
```

**6. Teste de Edição de Personagem**
```
□ Clicar em botão "Editar" (ícone de lápis)
□ Verificar que todos os campos ficam editáveis
□ Modificar alguns campos:
  - Idade: "31"
  - Personalidade: "Ainda mais corajoso..."
□ Clicar em "Salvar"
□ Verificar toast de sucesso
□ Verificar que campos voltam para modo read-only
□ Verificar que mudanças foram aplicadas
□ Voltar para lista de personagens
□ Verificar se mudanças persistem no card
```

**7. Teste de Relacionamentos**
```
□ Voltar para Character Detail de "João Silva"
□ Clicar em "Editar"
□ Abrir seção "Relacionamentos"
□ Clicar em "Adicionar Relacionamento"
□ No dialog:
  - Selecionar: "Maria Santos"
  - Tipo: "Inimigo"
  - Descrição: "Rival de longa data"
  - Intensidade: 8
□ Confirmar
□ Verificar card de relacionamento criado
□ Salvar personagem
□ Recarregar página
□ Verificar que relacionamento persiste ✅
```

**8. Teste de Família**
```
□ Criar mais 2 personagens:
  - "Pedro Silva" (pai de João)
  - "Ana Silva" (mãe de João)
□ Editar "João Silva"
□ Abrir seção "Família"
□ Selecionar pai: "Pedro Silva"
□ Selecionar mãe: "Ana Silva"
□ Salvar
□ Clicar em "Visualizar Árvore"
□ Verificar que árvore mostra:
  - Avós: (vazio)
  - Pais: Pedro Silva, Ana Silva
  - Personagem Atual: João Silva (destacado)
  - Filhos: (vazio)
□ Fechar dialog
□ Salvar personagem
□ Recarregar
□ Verificar que família persiste ✅
```

**9. Teste de Visibilidade de Campos**
```
□ Editar "João Silva"
□ Encontrar campos opcionais com ícone de olho
□ Clicar no ícone de olho de "Hobbies"
□ Verificar que ícone muda para "olho fechado"
□ Salvar personagem
□ Verificar que campo "Hobbies" não aparece em modo visualização
□ Editar novamente
□ Clicar no olho fechado de "Hobbies"
□ Salvar
□ Verificar que campo volta a aparecer ✅
```

**10. Teste de Versões** (Feature avançada)
```
□ Editar "João Silva"
□ No sidebar de versões, clicar em "+"
□ No dialog:
  - Nome: "João como Vilão"
  - Modificar alguns campos para versão alternativa
□ Confirmar criação
□ Verificar que versão aparece no sidebar
□ Clicar na versão para alternar
□ Verificar que dados mudam conforme versão
□ Deletar versão alternativa
□ Verificar que volta para versão principal
```

**11. Teste de Deleção**
```
□ Criar personagem de teste: "Personagem Temp"
□ Abrir Character Detail
□ Clicar em botão de deletar (ícone de lixeira)
□ No dialog:
  - Digitar nome completo: "Personagem Temp"
  - Verificar que botão "Confirmar" só habilita após nome correto
  - Confirmar primeira vez
  - Confirmar segunda vez (double confirmation)
□ Verificar navegação de volta para lista
□ Verificar que personagem foi removido da grid
□ Fechar e reabrir aplicação
□ Verificar que deleção persiste ✅
```

**12. Teste de Persistência Completa**
```
□ Fechar aplicação completamente
□ Reabrir aplicação
□ Verificar que livro "Meu Livro de Testes" ainda existe
□ Abrir livro
□ Verificar que todos os personagens existem
□ Abrir "João Silva"
□ Verificar que todos os dados, relacionamentos e família persistem
✅ SUCESSO - Persistência funcionando!
```

### Checklist de Funcionalidades

**Livros**
- [ ] Criar livro
- [ ] Listar livros
- [ ] Abrir livro (navegação)
- [ ] Atualizar last_opened_at
- [ ] Editar livro (futuro)
- [ ] Deletar livro (futuro)

**Personagens**
- [ ] Criar personagem com 26+ campos
- [ ] Listar personagens de um livro
- [ ] Filtrar por papel (badges)
- [ ] Buscar por nome/descrição
- [ ] Ver detalhes completos
- [ ] Editar personagem
- [ ] Deletar personagem

**Relacionamentos**
- [ ] Adicionar relacionamento
- [ ] Editar relacionamento
- [ ] Deletar relacionamento
- [ ] Persistir relacionamentos

**Família**
- [ ] Definir pai/mãe/cônjuge
- [ ] Adicionar filhos/irmãos/outros
- [ ] Visualizar árvore genealógica
- [ ] Persistir família

**Versões**
- [ ] Criar versão alternativa
- [ ] Alternar entre versões
- [ ] Editar versão
- [ ] Deletar versão
- [ ] Marcar versão principal

**Visibilidade de Campos**
- [ ] Ocultar campo opcional
- [ ] Mostrar campo novamente
- [ ] Persistir preferências

---

## Melhorias Futuras

### Curto Prazo (1-2 sprints)

**1. Migração de Assets para Sistema de Arquivos**
- Implementar saveAsset() e loadAsset()
- Migrar imagens existentes de base64 para arquivos
- Adicionar suporte para múltiplas imagens por personagem
- Implementar thumbnails automáticos

**2. Sistema de Backup/Export**
```typescript
// Exportar livro completo
export async function exportBook(bookId: string): Promise<Blob> {
  // Busca livro + todos personagens + relacionamentos + família
  // Gera arquivo JSON
  // Inclui assets como base64 ou referências
}

// Importar livro
export async function importBook(file: File): Promise<void> {
  // Parse JSON
  // Valida estrutura
  // Insere no banco
  // Restaura assets
}
```

**3. Busca Global**
```typescript
// Buscar em todos os livros e personagens
export async function globalSearch(query: string): Promise<SearchResults> {
  // Full-text search no SQLite
  // Retorna livros e personagens que contenham o termo
}
```

**4. Histórico de Mudanças**
```sql
CREATE TABLE IF NOT EXISTS change_history (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,  -- 'book', 'character'
  entity_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
  user_note TEXT
);
```

### Médio Prazo (3-6 sprints)

**5. Sistema de Tags/Categorias**
```sql
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS character_tags (
  character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (character_id, tag_id)
);
```

**6. Timeline de Eventos**
```sql
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT,  -- Data dentro da história
  location TEXT,
  participating_characters TEXT,  -- JSON array de IDs
  created_at INTEGER
);
```

**7. Locations/Worldbuilding**
```sql
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_location_id TEXT REFERENCES locations(id),
  coordinates TEXT,  -- JSON com lat/lng
  map_image_path TEXT,
  created_at INTEGER
);
```

**8. Magic Systems/Power Systems**
```sql
CREATE TABLE IF NOT EXISTS power_systems (
  id TEXT PRIMARY KEY,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rules TEXT,  -- JSON com regras do sistema
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS character_powers (
  id TEXT PRIMARY KEY,
  character_id TEXT REFERENCES characters(id) ON DELETE CASCADE,
  power_system_id TEXT REFERENCES power_systems(id) ON DELETE CASCADE,
  power_name TEXT,
  power_level INTEGER,
  description TEXT
);
```

### Longo Prazo (6+ sprints)

**9. Capítulos e Escrita**
```sql
CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  book_id TEXT REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER,
  word_count INTEGER,
  status TEXT DEFAULT 'draft',
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS chapter_notes (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES chapters(id) ON DELETE CASCADE,
  note_type TEXT,  -- 'plot', 'character', 'worldbuilding'
  content TEXT,
  created_at INTEGER
);
```

**10. Sincronização em Nuvem** (Opcional)
- SQLite Replication
- Conflict Resolution
- Offline-first com sync quando online

**11. Colaboração Multi-usuário**
- Sistema de permissões
- Real-time updates via WebSocket
- Comentários e sugestões

**12. Exportação Avançada**
```typescript
// Export para PDF/Word
export async function exportToPDF(bookId: string): Promise<Blob>;
export async function exportToWord(bookId: string): Promise<Blob>;
export async function exportToMarkdown(bookId: string): Promise<string>;

// Export de character sheets
export async function exportCharacterSheet(
  characterId: string,
  template: 'dnd' | 'custom'
): Promise<Blob>;
```

---

## Conclusão

Esta implementação estabelece uma base sólida para o Grimorium, com:

✅ **Persistência de Dados**: SQLite com schema completo e bem estruturado
✅ **Type Safety**: Tipos TypeScript em todas as camadas
✅ **Separation of Concerns**: Domain types separados de DB types
✅ **Offline-First**: Todos os dados locais, sem dependência de internet
✅ **Escalabilidade**: Arquitetura preparada para features futuras
✅ **Performance**: Índices otimizados para queries comuns
✅ **Integridade**: Foreign keys com CASCADE para manter consistência

### Próximos Passos Recomendados:

1. **Executar testes completos** conforme guia acima
2. **Migrar assets para sistema de arquivos** para melhor performance
3. **Implementar sistema de backup/export** para segurança dos dados
4. **Adicionar sistema de tags** para melhor organização
5. **Desenvolver features de worldbuilding** (locations, magic systems)
6. **Implementar capítulos e escrita** para completar o ciclo de autor

### Recursos de Apoio:

- **Schema SQL**: `src/lib/db/schema.sql`
- **Documentação Tauri SQL**: https://tauri.app/plugin/sql
- **SQLite Docs**: https://www.sqlite.org/docs.html
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

**Documentação criada em**: 2025-10-11
**Versão**: 1.0
**Autor**: Claude (Anthropic) + Rafael (usuário)
**Projeto**: Grimorium - Fantasy Story Management Tool
