# Refatorar tab sistema de poder

## Problema
> Anteriormente, tentamos criar features de redimensionamento e controle de tamanho de formas e cards, mas não deu muito certo, então decidi mudar a estrategia.

## Nova estratégia
> Agora, teremos uma novo estrutura com elementos chamados blocos, além das formas, tendo blocos e formas para o usuário usar

## O que precisamos fazer

### 1. Limpeza
> Sempre que for fazer qualquer nova aplicação pedida nessa task, limpe lógicas anteriores para evitar que lixos influenciem no resultado final

### 2. Blocos
> Blocos são elementos visuais e textuais que ajudam a agrupar informações, eles são:

**Bloco de paragrafo**
> Bloco simples contendo background e o seu conteudo textual

- Ao atingir o limite da width, quebra pra próxima linha, ao atingir o limite de height, ele cria um scroll
- Tamanho padrão é 800x200

**Bloco de imagem**
> Bloco simples com background em volta e dentro do background uma imagem contendo 90% da area e um texto que começa com uma linha embaixo

- Tamanho padrão é 900x300
- O texto começa com apenas uma linha, mas quando chega ao limite da width, ele começa a quebrar linha automaticamente aumentando o tamanho do bloco até onde o usuário desejar escrever

**Bloco de sessão**
> Bloco simples contendo background, título e texto

- Titulo deve ser por padrão uma linha e o texto por padrão cobre o resto da altura
- Tamanho padrão é 800x200

**Bloco avançado**
> Bloco mais complexo contendo background, imagem circular pequena no topo, embaixo titulo e embaixo um texto.

- **Bloco de paragrafo**
- **Bloco de sessão**

- **Bloco de imagem**
- **Bloco avançado**
- **Bloco de nota**

