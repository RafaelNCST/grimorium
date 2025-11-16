# Modais Reutilizáveis

Classificação dos modais genéricos e reutilizáveis utilizados no projeto.

**Localização:** `src/components/modals/`

---

## 1. EntityModal (Modal de Entidade)
**Componente:** `EntityModal` (`src/components/modals/entity-modal.tsx`)
**Uso:** Modal genérico para criar/editar entidades com campos básicos e avançados
**Descrição:** Modal estruturado com header (título, ícone, descrição), seção de campos básicos, seção avançada colapsável opcional e footer com botões de ação. Usado como base para todos os modais de criação/edição de entidades.

**Exemplo de uso:**
```tsx
<EntityModal
  open={isOpen}
  onOpenChange={setIsOpen}
  header={{
    title: "Criar Região",
    icon: Map,
    description: "Adicione uma nova região ao seu mundo",
    warning: "Tudo pode ser editado mais tarde. Algumas seções especiais só podem ser adicionadas após a criação."
  }}
  basicFieldsTitle="Informações Básicas"
  basicFields={
    <Form {...form}>
      <FormField name="name" ... />
      <FormField name="scale" ... />
    </Form>
  }
  advancedFields={
    <>
      <FormField name="climate" ... />
      <FormField name="description" ... />
    </>
  }
  footer={{
    isSubmitting: false,
    isValid: form.formState.isValid,
    onSubmit: form.handleSubmit(handleSubmit),
    onCancel: handleClose,
    editMode: false,
    submitLabel: "Criar Região",
    cancelLabel: "Cancelar"
  }}
  maxWidth="max-w-2xl"
/>
```

**Propriedades principais:**
- `open`: Se o modal está aberto
- `onOpenChange`: Callback quando estado de abertura muda
- `header`: Objeto com configuração do cabeçalho
  - `title`: Título do modal
  - `icon`: Ícone Lucide
  - `description`: Descrição/subtítulo
  - `warning`: (Opcional) Texto de aviso em InfoAlert
- `basicFields`: ReactNode com os campos básicos
- `advancedFields`: (Opcional) ReactNode com campos avançados
- `basicFieldsTitle`: (Opcional) Título da seção básica (default: "Informações Básicas")
- `footer`: Objeto com configuração do rodapé
  - `isSubmitting`: Se está submetendo
  - `isValid`: Se formulário é válido
  - `onSubmit`: Callback ao submeter
  - `onCancel`: Callback ao cancelar
  - `submitLabel`: (Opcional) Texto do botão submit
  - `cancelLabel`: (Opcional) Texto do botão cancelar
  - `editMode`: (Opcional) Se true, usa ícone Save
- `maxWidth`: (Opcional) Largura máxima (default: "max-w-2xl")

**Funcionalidades:**
- ✅ Header com ícone, título e descrição
- ✅ InfoAlert opcional para avisos
- ✅ Seção de campos básicos
- ✅ Seção avançada colapsável (usa AdvancedSection)
- ✅ Footer com botões cancelar/submeter
- ✅ Validação integrada (botão desabilitado quando inválido)
- ✅ Estados de loading durante submissão
- ✅ Scroll automático quando conteúdo excede altura

---

## 2. DeleteEntityModal (Modal de Exclusão de Entidade)
**Componente:** `DeleteEntityModal` (`src/components/modals/delete-entity-modal.tsx`)
**Uso:** Modal genérico de confirmação de exclusão com suporte a versões
**Descrição:** Modal de exclusão em dois passos para entidades principais (digitar nome + confirmação final) ou um passo para versões. Totalmente configurável via i18n e type-safe com generics.

**Exemplo de uso:**
```tsx
<DeleteEntityModal
  isOpen={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  entityName={region.name}
  entityType="region"
  currentVersion={currentVersion}
  versionName={currentVersion?.name}
  totalVersions={versions.length}
  onConfirmDelete={handleDelete}
  i18nNamespace="world"
/>
```

**Propriedades principais:**
- `isOpen`: Se o modal está aberto
- `onClose`: Callback para fechar
- `entityName`: Nome da entidade sendo excluída
- `entityType`: Tipo da entidade (usado para chaves i18n)
- `currentVersion`: Versão atual (genérico `T extends IEntityVersion`)
- `versionName`: (Opcional) Nome da versão sendo excluída
- `totalVersions`: (Opcional) Total de versões
- `onConfirmDelete`: Callback ao confirmar exclusão
- `i18nNamespace`: Namespace i18n (ex: "world", "character-detail")

**Fluxo de exclusão:**
- **Versão não-principal** (`currentVersion.isMain === false`):
  1. Confirmação simples em um passo

- **Entidade principal** (`currentVersion.isMain === true`):
  1. **Passo 1**: Digitar nome da entidade para confirmar
  2. **Passo 2**: Confirmação final com aviso de versões

**Funcionalidades:**
- ✅ Type-safe com generics TypeScript
- ✅ Dois fluxos: versão simples vs entidade principal
- ✅ Validação de nome digitado (passo 1)
- ✅ Informação sobre total de versões
- ✅ Totalmente configurável via i18n
- ✅ Ícone de alerta visual
- ✅ Botão destrutivo com animação

**Estrutura i18n necessária:**
```json
{
  "delete": {
    "version": {
      "title": "Excluir Versão",
      "message": "Tem certeza que deseja excluir a versão \"{{versionName}}\"?",
      "cancel": "Cancelar",
      "confirm": "Excluir Versão"
    },
    "region": {
      "title": "Excluir Região",
      "step1": {
        "message": "Você está prestes a excluir \"{{entityName}}\"...",
        "input_label": "Digite o nome para confirmar:",
        "cancel": "Cancelar",
        "continue": "Continuar"
      },
      "step2": {
        "title": "Confirmação Final",
        "message": "Isso excluirá \"{{entityName}}\" e todas as {{totalVersions}} versões...",
        "cancel": "Cancelar",
        "confirm": "Excluir Permanentemente"
      }
    }
  }
}
```

---

## 3. ConfirmDeleteModal (Modal de Confirmação Simples)
**Componente:** `ConfirmDeleteModal` (`src/components/modals/confirm-delete-modal.tsx`)
**Uso:** Modal de confirmação de exclusão simples com validação de nome opcional
**Descrição:** AlertDialog para confirmações de exclusão. Opcionalmente requer que o usuário digite o nome do item para confirmar.

**Exemplo de uso básico:**
```tsx
<ConfirmDeleteModal
  open={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleDelete}
  title="Excluir Item"
  description="Tem certeza que deseja excluir este item?"
/>
```

**Exemplo com validação de nome:**
```tsx
<ConfirmDeleteModal
  open={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleDeleteBook}
  title="Excluir Livro"
  description="Você está prestes a excluir este livro e todo seu conteúdo."
  itemName={book.name}
  itemType="livro"
/>
```

**Propriedades principais:**
- `open`: Se o modal está aberto
- `onClose`: Callback para fechar
- `onConfirm`: Callback ao confirmar
- `title`: Título do modal
- `description`: Descrição/mensagem
- `itemName`: (Opcional) Nome que deve ser digitado para confirmar
- `itemType`: (Opcional) Tipo do item (ex: "livro", "personagem")

**Funcionalidades:**
- ✅ Confirmação simples (Sim/Não)
- ✅ Validação de nome opcional (usuário digita para confirmar)
- ✅ Ícone de alerta visual
- ✅ Botão destrutivo com animação
- ✅ Mensagem "Esta ação não pode ser desfeita" automática quando tem validação
- ✅ Input com fonte monospace para melhor legibilidade
- ✅ Botão desabilitado até nome correto ser digitado

---

## 4. WarningDialog (Modal de Aviso)
**Componente:** `WarningDialog` (`src/components/dialogs/WarningDialog.tsx`)
**Uso:** Modal genérico de aviso/confirmação com estilo amarelo de alerta
**Descrição:** AlertDialog padronizado para avisos e confirmações que não são exclusões. Possui ícone de alerta amarelo, suporte a conteúdo customizado e botões personalizáveis.

**Exemplo de uso básico:**
```tsx
<WarningDialog
  open={showWarning}
  onOpenChange={setShowWarning}
  title="Trocar imagem do mapa?"
  description="Existem elementos posicionados neste mapa. Ao trocar a imagem, todos os elementos serão removidos."
  cancelText="Cancelar"
  confirmText="Continuar e escolher imagem"
  onConfirm={handleConfirm}
/>
```

**Exemplo com conteúdo adicional:**
```tsx
<WarningDialog
  open={showWarning}
  onOpenChange={setShowWarning}
  title="Descartar alterações?"
  description="Você tem alterações não salvas. Se sair agora, todas as mudanças serão perdidas."
  cancelText="Continuar Editando"
  confirmText="Descartar Alterações"
  onConfirm={handleDiscard}
>
  <div className="text-sm text-muted-foreground">
    <p>• 3 campos modificados</p>
    <p>• Última alteração há 2 minutos</p>
  </div>
</WarningDialog>
```

**Propriedades principais:**
- `open`: Se o modal está aberto
- `onOpenChange`: Callback quando estado de abertura muda
- `onConfirm`: Callback ao confirmar
- `title`: Título do modal
- `description`: Descrição/mensagem
- `cancelText`: (Opcional) Texto do botão cancelar (default: "Cancelar")
- `confirmText`: (Opcional) Texto do botão confirmar (default: "Confirmar")
- `children`: (Opcional) Conteúdo adicional renderizado em área com fundo cinza

**Funcionalidades:**
- ✅ Ícone de alerta amarelo em círculo
- ✅ Design visual distinto de modais de exclusão
- ✅ Suporte a conteúdo adicional customizado
- ✅ Botão destrutivo com animação
- ✅ Textos de botões personalizáveis
- ✅ Layout responsivo (flex-col em mobile, flex-row em desktop)
