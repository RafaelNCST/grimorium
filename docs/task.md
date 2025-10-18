
# Task: Refatorar tela de detalhes de itens

# Local
- `src\pages\dashboard\tabs\items\item-detail`

# Problema
> A tela de detalhes de itens precisa combinar com os refatoramentos feitos na tab de itens

# Solução
> Iremos usar uma estrutura igual aos detalhes do personagem (src\pages\dashboard\tabs\characters\character-detail), apenas que usando os campos de (src\components\modals\create-item-modal)
- Quando clicar no card do item, deve navegar para o detalhe daquele item
- Adicione os itens criados no banco de dados com a estrutura baseada no que já existe
No código atual que temos de detalhes do item:
    - A seção final Anotações será removida
    - O botão chamado "Anotações" será removido
    - Timeline ficará comentado, será introduzido no futuro
O que deve manter de detalhes do personagem para detalhes do item: 
    - Todo o menu superior com botão de voltar, toggle de mostrar e esconder lista de itens para navegação rapida, botão de editar e excluir.
    - Aba de versões, para diferentes versões do item
O que deve mudar nessa imitação de estrutura entre os detalhes de personagem e item
    - A imagem de detalhes do item é maior e por isso deve cobrir um espaço unico, cobrindo todo o width e topo da seção básica.
    - Note que as cores diferentes, nomes, descrições e placeholder vindos do modal de criar item, deve ser mantidos 

# Objetivo
> Refatorar os detalhes do item com a mesma estrutura e seções compartilhadas do detalhes de personagem, usando as seções e informações do modal de criar item, além de introduzir os itens no banco de dados

# Pontos adicionais
- Use i18n para textos e não esqueça as traduções para pt e en