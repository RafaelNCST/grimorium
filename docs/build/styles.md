# Styles

Padrões de estilo visual do projeto.

---

## Hover Effects

### Hover Brilhante Claro

Efeito de hover sutil que cria uma aparência levemente brilhante sobre o elemento.

**Classe:**
```tsx
className="hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200"
```

**Exemplo:**
```tsx
<CardHeader className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200">
  <CardTitle>Título da Seção</CardTitle>
</CardHeader>
```

### Hover Brilhante Escuro

Efeito de hover sutil que cria um escurecimento suave sobre o elemento.

**Classe:**
```tsx
className="hover:bg-black/10 dark:hover:bg-black/20 transition-colors duration-200"
```

**Exemplo:**
```tsx
<Button className="cursor-pointer hover:bg-black/10 dark:hover:bg-black/20 transition-colors duration-200">
  <Icon className="h-4 w-4" />
</Button>
```

---

## Button Variants

### Ghost Bright

Variant de botão ghost com efeito de hover brilhante escuro.

**Uso:**
```tsx
<Button variant="ghost-bright">
  <Icon className="h-4 w-4" />
</Button>
```

**Estilo aplicado:**
```tsx
"hover:bg-black/10 dark:hover:bg-black/20 transition-colors duration-200"
```

**Exemplo completo:**
```tsx
<Button
  variant="ghost-bright"
  size="sm"
  onClick={handleClick}
  className="h-6 w-6 p-0"
>
  <Palette className="h-3.5 w-3.5" />
</Button>
```
