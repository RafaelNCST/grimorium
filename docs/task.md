# O que vamos fazer?
> Vamos agora refatorar a tab Mundo, introduzindo uma forma dinâmica e visual de interagir e registrar o mundo da sua história.

## Visão Geral
> A ideia é o usuário lidar apena regiões e suas hierarquias apenas, onde o usuário define quem é o pai dessa região e o resto é feito pelo app

## Design e lógica

**Dados vazios**
> Já está estalalecido atualmente, não deve mudar

**Nova Região**
> O botão já existe, mas ao clicar nele deve abrir um modal que tem os campos:
- Imagem (Opcional): Quadrada, grande e que ocupe toda a width, ela será um mapa demonstrativo da região. Se não for definido imagem, terá uma imagem default
- Nome da região: Input de uma linha com tamanho máximo de 200 caracteres
- Região Pai (Opcional): Dropdown contendo todas as regiões, permitindo que o usuário escolher quem é a região acima dessa em hierarquia (Exemplo: estamos criando região cidade de Noix e ela fica no continente Montial, então a região pai é o continente Montial). Por padrão, toda região é considerada "Neutra" até que escolha um pai, se não escolher um pai ela continua a ser neutra.
- Escala: Um picker de cores diferentes para cada item de cards que contém icone, descrição e titulo, com os dados sendo: Local (Imperios, cidades, florestas, vilas, montanhas, etc), Continental (Ilhas, continentes, paises, etc), Planetária (Planetas, satelites, cometas, etc), Galáctica (Estrelas, sistemas solares, Galaxias, sistemas, etc), Universal (Universos e Dimensões), Multiversal (Conjunto de universos, dimensões, reinos divinos etc). Note que os textos que dei são exemplos, ajeite tudo para ter a melhor apresentação
- Resumo: Um input grande para colocar o resumo da região

**Gerenciar Hierarquia**
> Deve ter um botão ao lado de "Nova Região" chamado "Gerenciar hierarquia", esse botão abre um modal que nos mostrará:
- Uma árvore de regiões mostrando todas as regiões e sua hierarquia que já existe no app, quem é filho e pai de quem, tudo em uma árvore visual. Em cada item da região, deve aparecer apenas nome e a sua escala, além de abaixo dele suas regiões filhas.
- A árvore deve ter a capacidade de ajudar a reorganizar a ordem das regiÕes de forma fácil, com drag and drop permitindo escolher quem é pai ou filho de quem
- A árvore deve permitir excluir INDIVIDUALMENTE cada região com modal de confirmação pedindo texto antes de excluir (Semelhante a modais de exclusão de detalhes de outras tabs)
- Regiões neutras aparecem sempre isoladas e fora da arvore, já que não foi definido pai para elas

**Card**
> Ao criar com sucesso através do modal, um card será criado na lista de tabs, esse card terá as informações listadas anteriormente nele, e a lista será uma lista horizontal que quebra pra proxima linha ao chegar no limite da width
- Deve haver filtro de busca de texto que busca por nome de região
- Deve haver um filtro/contador para filtrar por escala. O design será igual a outros filtro/contador de outras tabs, inclusive a lógica de filtro
- Todo card deve ter um hover semelhante ao card de outras tabs
- O design do card deve seguir a mesma identidade visual de cada campo (Ou seja, se uma tag tem cor, siga a mesma cor, se a imagem é quadrada e grande, deixe quadrada e grande)

## Importante lembrar
- Lembre-se de conferir se está usando i18n corretamente configurado para as linguagens do app, e se tudo está importado da maneira correta
- Não faça nenhuma navegação pro card ainda, isso será em outro momento
