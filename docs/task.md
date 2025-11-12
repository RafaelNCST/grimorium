# Feature: Mapa de Regiões

## 1. Visão Geral
Implementar um sistema de mapas interativos para cada região, permitindo visualizar e posicionar regiões filhas geograficamente dentro da região pai.

---

## 2. Ponto de Entrada

### Localização
- **Onde:** Página de detalhes da região (`region-detail`)
- **Botão:** "Ver Mapa" ao lado do botão "Editar"
- **Comportamento:** Navega para a página de mapa da região (`/world/region/:id/map`)

---

## 3. Estrutura da Página do Mapa

### 3.1 Navegação Superior
- **Botão Voltar:** Seta flutuante no canto superior esquerdo
  - Ação: Retorna para os detalhes da região
- **Nome da Região:** Container flutuante centralizado no topo
  - Exibe o nome da região atual

### 3.2 Área do Mapa (Canvas Principal)
- **Tamanho:** Ocupa toda a área disponível da página
- **Formatos suportados:** PNG, JPEG, SVG
- **Comportamento da imagem:**
  - Mantém tamanho original (sem redimensionamento automático)
  - Áreas vazias mostram a cor de fundo da aplicação
  - Se maior que a viewport: permite arrastar (pan) em modo visualização
- **Zoom:** Permite zoom in/out via mouse wheel ou botões
- **Upload:**
  - Se não houver imagem: mostra placeholder com botão de upload
  - Upload feito diretamente na página do mapa
  - Imagem armazenada no Tauri Filesystem (arquivo local)

### 3.3 Menu Lateral Esquerdo (Flutuante)

#### Seção 1: Seletor de Modo
Dois modos de cursor mutuamente exclusivos:
1. **Modo Visualização** (padrão)
   - Permite apenas arrastar o mapa (pan)
   - Marcadores não são interativos
2. **Modo Edição**
   - Permite interagir com marcadores
   - Permite arrastar marcadores no mapa
   - Permite adicionar novos marcadores

#### Seção 2: Lista de Regiões Filhas
- **Conteúdo:** Todas as regiões filhas cadastradas
- **Visual:** Cada região representada por:
  - Círculo com ícone de localização
  - Nome da região
  - Design visual atrativo
- **Comportamento:**
  - Arrastar e soltar no mapa para posicionar
  - Se já posicionada, mostra indicador visual
  - Permite remover marcadores já posicionados

### 3.4 Menu Lateral Direito (Flutuante, condicional)

**Trigger:** Clicar em um marcador no mapa (no modo Edição)

**Conteúdo:**
- Nome da região filha
- Imagem da região
- Descrição
- Todas as informações das seções avançadas
- **Botão "Ver mais detalhes":** Navega para a página de detalhes da região filha

---

## 4. Estrutura de Dados

### 4.1 Nova Tabela: `region_maps`
```sql
CREATE TABLE region_maps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region_id INTEGER NOT NULL UNIQUE,
  image_path TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);
```

### 4.2 Nova Tabela: `region_map_markers`
```sql
CREATE TABLE region_map_markers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_region_id INTEGER NOT NULL,
  child_region_id INTEGER NOT NULL,
  position_x INTEGER NOT NULL,
  position_y INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (parent_region_id) REFERENCES regions(id) ON DELETE CASCADE,
  FOREIGN KEY (child_region_id) REFERENCES regions(id) ON DELETE CASCADE,
  UNIQUE(parent_region_id, child_region_id)
);
```

### 4.3 Sistema de Coordenadas
- **Tipo:** Pixels absolutos
- **Origem:** Canto superior esquerdo da imagem
- **Armazenamento:** `position_x` e `position_y` em pixels inteiros

---

## 5. Funcionalidades Detalhadas

### 5.1 Upload de Imagem
1. Usuário clica no placeholder ou botão de upload
2. Diálogo de seleção de arquivo (PNG, JPEG, SVG)
3. Imagem copiada para diretório do Tauri (`app_data_dir/maps/`)
4. Caminho salvo na tabela `region_maps`
5. Imagem exibida no canvas
**Nota:** Sem limite de tamanho - usuário gerencia seu próprio armazenamento

### 5.2 Adicionar Marcador
1. Ativar modo Edição
2. Arrastar região filha do menu lateral esquerdo
3. Soltar no mapa
4. Coordenadas calculadas e salvas em `region_map_markers`
5. Marcador renderizado na posição

### 5.3 Editar Marcador
1. Em modo Edição, arrastar marcador existente
2. Nova posição calculada
3. Banco de dados atualizado

### 5.4 Remover Marcador
1. Em modo Edição, clicar no marcador
2. Menu lateral direito se abre
3. Botão "Remover do Mapa" disponível
4. Confirmação e remoção do banco

### 5.5 Zoom
- **Controles:** Mouse wheel ou botões +/-
- **Limites:** Min 25%, Max 400%
- **Centro:** Posição do cursor (quando usar wheel)

---

## 6. Rotas

### Nova Rota
```
/world/region/:id/map
```

**Componente:** `src/pages/dashboard/tabs/world/region-map/index.tsx`

---

## 7. Componentes a Criar

1. `RegionMapPage` - Página principal
2. `MapCanvas` - Canvas do mapa com zoom e pan
3. `MapModeSelector` - Seletor de modo (Visualização/Edição)
4. `RegionChildrenList` - Lista de regiões filhas
5. `MapMarker` - Componente de marcador no mapa
6. `MapMarkerDetails` - Menu lateral direito com detalhes
7. `MapImageUploader` - Componente de upload de imagem

---

## 8. Services a Criar/Atualizar

### Novo Service: `region-maps.service.ts`
```typescript
- uploadMapImage(regionId, filePath)
- getMapByRegionId(regionId)
- deleteMap(regionId)
- addMarker(parentRegionId, childRegionId, x, y)
- updateMarkerPosition(markerId, x, y)
- removeMarker(markerId)
- getMarkersByRegion(parentRegionId)
```

---

## 9. Estados e Validações

### Estados Especiais
- **Região sem mapa:** Mostra placeholder com botão de upload
- **Região sem filhas:** Menu lateral esquerdo mostra mensagem vazia
- **Erro no upload:** Toast de erro, mantém estado anterior

### Validações
- Formatos de arquivo: PNG, JPEG, SVG apenas
- Tamanho: Sem limite (usuário gerencia seu armazenamento)
- Uma região filha só pode ter UM marcador por região pai (UNIQUE constraint)

---

## 10. Stack Técnica

- **UI:** React + TailwindCSS + shadcn/ui
- **State:** Zustand para estado do mapa (zoom, pan, modo)
- **Drag & Drop:** react-dnd ou HTML5 Drag & Drop API
- **Canvas/Pan/Zoom:** react-zoom-pan-pinch ou implementação custom
- **File System:** @tauri-apps/api/fs
- **Database:** SQLite via existing services pattern

---

## 11. Checklist de Implementação

- [ ] Criar migrations para novas tabelas
- [ ] Implementar `region-maps.service.ts`
- [ ] Criar estrutura de pastas e componentes
- [ ] Implementar upload de imagem
- [ ] Implementar canvas com zoom e pan
- [ ] Implementar drag & drop de marcadores
- [ ] Implementar menu lateral esquerdo
- [ ] Implementar menu lateral direito
- [ ] Adicionar botão "Ver Mapa" na página de detalhes
- [ ] Testes de funcionalidade
- [ ] Ajustes de UI/UX