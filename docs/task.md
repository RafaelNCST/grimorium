# Refatorar formas e cards na tab sistema de poder

## Cards

### Card básico
**Importante**
- Note que tudo que eu falar aqui é no modo edição (Cursor de edição), para casos que não for eu deixo claro que é de visualização

**Default**
> Ao ser criado clicando na área de edição, ele ainda será um card "não alterado" (sem redimensionamento) e não terá foco em nenhum input
- Quando ele for redimensionado pelo usuário manualmente (Puxando diagonais, horizontais ou vertices) ele deixa de ser não alterado
- Por padrão, ele deve ter a width suficiente para englobar os textos e mostrar seus placeholders e seus espaçamentos internos. Quanto a altura, ela deve ser a altura suficiente para ter uma linha de cada placeholder e seus espaçamentos internos

**Digitar**
> Para digitar, o usuário precisa clicar duas vezes em cima da caixa de input no card para que o input habilite
- Se o card for não alterado, qualquer digito dele irá aumentar a width do card e do input até onde o usuário quiser digitar
- Se o card já foi alterado, qualquer digito dele irá quebrar linha e aumentar a height do input, consequentemente aumentando o height do card, isso para qualquer input titulo ou descrição

**Redimensionar**
> Haverá três tipos de redimensionamento, horizontal, vertical e diagonal:
- Horizontal irá aumentar a width do card infinitamente até onde o usuário quiser. Ele também pode diminuir a width, ao diminuir a width, os textos internos quebram as linhas e aumentam a altura do card para caber, o limite minimo é de ter pelo menos uma quatro letras por linha em cada input
- Vertical e Diagonal serão iguais, quando puxados irão aumentar tanto a width, quanto a height do card e a fonte do texto proporcionalmente, até chegar no limite. O limite máximo é a fonte, sendo 64 para o máximo e 8 para o minimo. Uma vez que chegue no limite minimo ou maximo, o aumento do width e height do card também devem travar com o limite de fonte.

**Wrapper**
> É a borda roxa que permite demarcar qual card tá selecionado. Use o wrapper do texto que fizemos para usar aqui com o mesmo design.

**Arrastar**
> A lógica de mover o card é a mesma do texto, pode mover em qualquer area interna do card.
- Note que se eu apertar apenas uma vez o card, ele seleciona o card e não o input, já que preciso clicar 2x em cima do input para liberar o input

**Menu de edição**
> Adicione a modificação de fonte dentro do menu lateral, com os limites de 8 a 64 px. Faça o feedback ser em tempo real para mudanças na fonte usando redimensionamento

**Visualização**
> No modo visualização (Cursor com a mãozinha quando apertamos h) tudo será desabilitado, permitindo apenas arrastar pelo card ou selecionar um texto para copiar e colar no máximo, mas sempre deixe a mãozinha no cursor.

### Card detalhado
**Importante**
- Note que tudo que eu falar aqui é no modo edição (Cursor de edição), para casos que não for eu deixo claro que é de visualização

**Default**
> Ao ser criado clicando na área de edição, ele ainda será um card "não alterado" (sem redimensionamento) e não terá foco em nenhum input
- Quando ele for redimensionado pelo usuário manualmente (Puxando diagonais, horizontais ou vertices) ele deixa de ser não alterado
- Por padrão, ele deve ter a width suficiente para englobar os textos e mostrar seus placeholders e seus espaçamentos internos. Quanto a altura, ela deve ser a altura suficiente para ter uma linha de cada placeholder e seus espaçamentos internos

**Digitar**
> Para digitar, o usuário precisa clicar duas vezes em cima da caixa de input no card para que o input habilite
- Se o card for não alterado, qualquer digito dele irá aumentar a width do card e do input até onde o usuário quiser digitar
- Se o card já foi alterado, qualquer digito dele irá quebrar linha e aumentar a height do input, consequentemente aumentando o height do card, isso para qualquer input titulo ou descrição

**Redimensionar**
> Haverá três tipos de redimensionamento, horizontal, vertical e diagonal:
- Horizontal irá aumentar a width do card infinitamente até onde o usuário quiser. Ele também pode diminuir a width, ao diminuir a width, os textos internos quebram as linhas e aumentam a altura do card para caber, o limite minimo é de ter pelo menos uma letra por linha em cada input
- Vertical e Diagonal serão iguais, quando puxados irão aumentar tanto a width, quanto a height do card, a imagem e a fonte do texto proporcionalmente, até chegar no limite. O limite máximo é a fonte, sendo 64 para o máximo e 8 para o minimo. Uma vez que chegue no limite minimo ou maximo, o aumento do width e height do card e o tamanho da imagem também devem travar com o limite de fonte.

**Wrapper**
> É a borda roxa que permite demarcar qual card tá selecionado. Use o wrapper do texto que fizemos para usar aqui com o mesmo design.

**Arrastar**
> A lógica de mover o card é a mesma do texto, pode mover em qualquer area interna do card.
- Note que se eu apertar apenas uma vez o card, ele seleciona o card e não o input, já que preciso clicar 2x em cima do input para liberar o input

**Menu de edição**
> Adicione a modificação de fonte dentro do menu lateral, com os limites de 8 a 64 px. Faça o feedback ser em tempo real para mudanças na fonte usando redimensionamento

**Visualização**
> No modo visualização (Cursor com a mãozinha quando apertamos h) tudo será desabilitado, permitindo apenas arrastar pelo card ou selecionar um texto para copiar e colar no máximo, mas sempre deixe a mãozinha no cursor.