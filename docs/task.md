
# Task: Refatorar tela de tab de itens

# Local
- `src\pages\dashboard\tabs\items`
- `src\components\modals\create-item-modal`

# Problema
> O modal de criar itens foi refatorado e agora precisamos fazer a tab de itens combinar e se juntar com o fluxo desse modal

# Solução
> Ao preencher todos os campos obrigatórios do modal e o botão `confirmar` liberar, o botão quando clicado deve criar um novo card na listagem de itens na tab itens, liberando tudo da listagem
- Card novo é criado na listagem, o card deve ter todas as seções básicas no modal de criar itens, mas não necessariamente a mesma estrutura e organização, apenas uma que combine com o modal e visualmente.
- Estrutura recomendada para o card: Imagem cobrindo o topo com toda a width, nome embaixo de um lado e no final o status com ícone e a cor que tem no modal colocado no final da mesma linha do nome, embaixo tem a categoria com ícone e nome, enquanto no final tem a descrição básica que mostra um limite de 2 linhas no máximo escondendo o resto.
- Ao adicionar o primeiro card, deve liberar o input de busca
- Ao adicionar o primeiro card, deve liberar 2 contadores:
    - O primeiro contador é para categoria, sendo a mesma estrutura e design que os outros contadores/filtros, mas como não tem cor definida para ela no modal, coloque uma cor para todos eles. A categoria outro, mostrará todas as categorias personalizadas juntas.
    - O segundo contador é para status, seguindo uma estrutura e filtro semelhantes ao que existe na tab personagens, onde o hover e o active tem a mesma cor que existe no modal de criar personagem que são diferente para cada uma, o contador mostra em tempo real o numero de personagens com esse status e quando ativadon ele filtra os cards
    - Deve não só filtrar individualmente entre eles, como também deve filtrar em conjunto, onde se a categoria armaduras estiver ativa e o status completa tiver ativa, deve filtrar apenas armaduras que estão completas.

# Objetivo
> Ter a tab de itens pronta para seguir o fluxo de criar um item

# Pontos adicionais
- O objetivo é apenas criar o card e não tratar de navegar para detalhes
- Use i18n para textos e não esqueça as traduções para pt e en.