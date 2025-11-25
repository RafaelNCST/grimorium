# O que vamos fazer?
> Refatorar a tab de anotações

# Como iremos fazer?
> Explicarei como será o fluxo de uso das anotações e você com base nesse fluxo tenta implementar as mudanças

# Pontos importantes
- Use as documentações de `C:\Users\rafae\Desktop\dev\grimorium\docs\build`
- Sempre coloque todos os textos no i18n em portugues e inglês
- Qualquer formulário use sempre os de `C:\Users\rafae\Desktop\dev\grimorium\docs\build\forms.md`

## 1. Entrada
- O usuário clica no botão de anotações, localizado no header do dashboard, entre os capitulos e o personalizar.
- Usuário então adentra e se depara com uma nova página, que contém:

**Header superior**
`Botão de voltar para dashboard` - `Título escrito anotações`

**Sub-header**
`Espaço vazio` - `Input de busca por texto` - `dropdown que contém filtragem "A-Z" (Alfabetica) e do mais recente editado pro mais antigo "Recente"` - `Botão de criar nova anotação - Botão de ativar modo exclusão`
`Filtro com badges (Semelhante ao filtro que existe nas tabs) badges com os nomes: personagens, mundo, facções, raças, itens`

**Lista**
`ícone de anotação - Nome da anotação ----------------------------------------------- última vez editado`
`Resto da lista`

**Lista vazia**
`ícone`
`Sem anotações por aqui`
`Crie sua primeira anotação e ela aparecerá aqui!`

## 2. Criar anotação
> No botão criar nova anotação quando pressionado aparecerá um modal pedindo: Nome (Obrigatório - Input de 200 linhas máximas), links (Opcional - Permite linkar a sua anotação a um ou varias entidades, desde personagem, mundo, facções item ou raças, sendo que podemos linkar a varios entidades da mesma tab ao mesmo tempo ou a multiplas entidades de varias tabs, lembrando que a linkagem é direto em uma entidade, mas ele também registra qual tab essa entidade pertence). Lembrando que teremos botão de cancelar e criar, sendo que o botão de criar só habilita quando tiver todos os obrigatórios preenchido e não coloque qualquer tipo de erro no input, a unica validação e o botão criar ficar desabilitado até os obrigatórios serem preenchidos. Ao criar com sucesso, uma nova anotação surge e automaticamente somos navegados para a anotação que é uma nova página, onde podemos ver mais dela em `5. Anotação`

## 3. Filtragem e ordenação
- A primeira filtragem é a por texto, que filtra apenas pelo nome, use o mesmo design usado nas tabs do dashboard.
- A segunda filtragem é por dropdown (Ou ordenação podemos chamar), onde podemos escolher ou arrumar por ordem alfabetica ou por mais recente, lembrando que cada filtro é individual e filtra de acordo com os dados atuais, então se eu pesquisei algo por texto e escolhi um filtro por mais recente, ele só vai ver os mais recente dentre os pesquisados no texto.
- A ultima filtragem é por badge, você pode clicar nas badges para filtrar somente as anotações linkadas que queremos, no caso elas vão aparecer de acordo com as tabs que cada anotação está linkada, então eu posso clicar em personagens e itens ao mesmo tempo e ver só personagens e itens. Lembrando que uma vez que houver filtro por badge, deve aparecer também em formato de tag quais entidades estão linkadas nessa anotação (3 máx, se houver mais que isso corte e mostre que tem mais, mas está no limite)
- Um ponto importante é a ordem de filtragem. Se eu pesquisar por "Anotações rapidas" no texto, filtrar por mais recente e filtrar com itens e raças, eu teria somente o que cabe em todos esses filtros e ordenações.

## 4. Modo exclusão
> Quando clicado no botão "Ativar modo exclusão" o icone de anotação vira um checkbox e agora clicar no card permite ativar o checkbox (O checkbox ativa agora clicando em qualquer parte do card). O botão "Ativar modo exclusão" se tornar dois botões, um "Cancelar" e outro "Excluir", se apertado em cancelar, cancela tudo e volta e sai do modo, se apertado em excluir, aparecerá um modal de confirmação dizendo quantas anotações serão excluidas e se o usuário tem certeza, se ele confirmar todas as anotações são excluidas e o modo exclusão é automaticamente desativado.

## 5. Anotação e edição
> Em teoria não teremos modo edição e nem visualização, os dois são um só, o que acontece que ao apertar em um card, ele navegará para sua tela individual de anotações, onde finalmente o usuário verá onde ele pode colocar suas anotações. No geral, a tela de anotações vai ser um word simplificado, não tenho ideia de como seria então me surpreenda, mas tem alguns pontos que quero:
- Ver a data de criação de arquivo e a ultima vez editado
- Nome do arquivo no topo que pode ser editado clicando duas vezes
- Quero que o papel onde escreve possa alternar entre modo branco com letras pretas e modo preto com letras brancas
- Deve ter as modificações normal de texto como negrito, traçado, italico, tamanho de texto, Poder criar listas etc
- Quero ter a capacidade de gerenciar links (Saber em quais entidades está linkado e até remover essa linkagem)
- Botão de voltar
- possibilidade de excluir a anotação ali mesmo (Com modal de 2 etapas pedindo nome primeiro e depois pedindo pra confirmar)
- Auto save a cada mudança
- Undo/redo
