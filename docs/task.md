# O que vamos fazer?
> Refatoração completa na tab sistema de poder, visando estabelecer uma tab mais perfomática, visualmente bonita e com uma melhor usabilidade e curva de aprendizagem.

## Como vamos fazer?
> Primeiro, estabeleceremos como será a nova página:

### Descrição de elementos
> Será um sistema de grupos e páginas hierarquicos colocados em um menu lateral, que permitirá navegar pelo seu conteudo. Cada grupo poderá ter varias páginas, e cada página é formado por seções, sendo cada seção formada por vários blocos. No topo, terá o título dado ao nome do sistema que é escolhido ao criar o sistema

**Grupos**
> São o topo da piramide, eles não são navegaveis e só servem para agrupar páginas, quando selecionados apenas devem esconder/mostrar suas páginas no menu lateral navegavel.

**Páginas**
> São criadas dentro de um grupo ou podem ser criadas fora dele, sendo apenas necessário nome. Quando clicadas no menu lateral, permitem navegar para ver seu conteudo que ainda está dentro da tab de sistema de poder, seu nome será seu título e ela será dividida em seções, com cada seção tendo seus blocos.

**Seções**
> São criadas dentro de páginas e agrupam blocos, quando criadas elas obrigam a colocar um título para serem criadas. Dentro delas, podemos criar blocos pré criados para conteudo. Note que cada página de seção terá um input no topo que permite filtrar seções (Só busca título de seção)

**Blocos**
> São conteudo pré criado com o objetivo de integrar conteudo, os blocos atuais serão:
- `Paragrafo`: Título opcional + paragrafo com input de 4 linhas + scroll caso pegue a altura.
- `Lista não ordenada`: Título opcional + Input de uma linha + botão de adicionar a lista + lista não ordenada vertical permitindo editar e deletar o conteudo de cada item (Permite arrastar cada item da lista dentro da lista pora cima e pra baixo)
- `Lista Numerada`: Título opcional + Input de uma linha + botão de adicionar a lista + lista numerada vertical permitindo editar e deletar o conteudo de cada item (Permite arrastar cada item da lista dentro da lista pora cima e pra baixo, quando arrastada mude o numero da ordem)
- `Lista de Tags`: Título opcional + Input de uma linha + botão adicionar + lista de tags horizontal que quebra pra próxima linha ao chegar no limite. Permite apenas deletar cada tag individualmente.
- `Dropdown`: Titulo opcional + dropdown que permite adicionar e remover valores com um input ao seu conteudo
- `Dropdown múltiplo`: Titulo opcional + dropdown que permite adicionar e remover valores com um input ao seu conteudo, quando adicionado é adicionado numa `lista de tags`
- `Imagem`: Título opcional + Imagem grande ocupando toda a width e com altura consideravel mas sem ser exagerado, seu formato será quadrado e ela terá uma possível legenda opcional de um input de uma linha. (Se não colocada fica apenas uma imagem default). 
- `Icone`: Uma imagem circular + título + descrição, todos ocupam a width toda e são editaveis e obrigatórios (Com exceção da imagem, que se não colocada fica apenas uma imagem default). 
- `Grupo de ícones`: Título opcional + um grupo de mini cards que podem ser colocados lado a lado com no máximo 4 por linha, cada card vai ter: ícone em formato circular, título e uma descrição pequena. O usuário pode adicionar, remover ou editar cada card individualmente. (Apenas a imagem e o titulo geral do grupo é opcional, se não houver imagem fica uma default)
- `Bloco informativo`: Icone escolhivel (alerta, informação, estrela, ideia, check mark, x de wrong) + input de uma linha mas que quando o usuário digita e chega ao width máximo, vai crescendo novas linhas quebrnado junto da altura do input até onde o usuário quiser escrever.
- `Divisor`: Um divisor de cor branca
- `Estrelas`: Título opcional + 5 estrelas que permitem serem preenchidas (Um clique preenche pela metade, e o segundo preenche ela inteira)
- `Atributos`: Título opcional + uma barra cortada por divisores internamente (Ela é uma barra inteira, mas tem divisores internos), o usuário pode então escolher até 10 divisores e pode escolher até que parte dos divisores ficarão cheios/ativos, o resto ficará cinza (Como se fosse uma barra de atributos, experiencia etc)

### Menu lateral navegavel
> Será um menu que ficará na lateral inicial do app quando a tab de sistema de poder for navegada, nela teremos os grupos e páginas separados como arquivos do vs code ou cursor, seguindo sua hierarquia, com os grupos podendo esconder/mostrar suas páginas.

**Outros detalhes**
- Use somente um ícone para grupos e somente um ícone para páginas
- O menu lateral pode ser escondido/mostrado também
- Sem filtros

### Menu de seção
> Será um menu lateral que ficará do outro lado, ele poderá ser escondido/mostrado e será dividido entre as seções daquela página que está aberta no momento, cada seção mostrará em uma mesma hierarquia do menu lateral navegavel seus blocos por nome (Somente os que tem título), permite scrollar para a parte que tem o titulo clicado ou seção clicada (Se scrollar para um titulo de bloco e a seção estiver escondida, apenas scrolla pra seção que o bloco está)

**Outros detalhes**
- Evite icones
- Sem filtros

### Modo editar/visualizar
> Haverá um modo editar e um visualizar, no modo editar obviamente podemos fazer qualquer tipo de edição desde criação, exclusão ou edição. No visualização, não podemos CRIAR, EDITAR, EXCLUIR NADA! E todos os botões e opções de edição desaparecem.

### Tela vazia e criação
> Será uma tela seguindo o padrão que existe em outras tabs, sem botão de ação. No topo terá um botão de criar novo sistema, que permite apenas dizer qual o nome do sistema e assim criar uma tela nova com menu lateral aberto e vazio e a tela com uma mensagem dizendo que não há páginas criadas

**Menu lateral vazio**
> Apenas uma mensagem centralizada no menu dizendo que está vazio

**Seções vazias**
> Apenas uma mensagem centralizada dizendo que não há sessões criadas

**Criar página/grupo**
> Quando editar estiver habilitado, haverá dois botões no topo do menu navegavel que permitem criar uma pasta ou página com um modal simples que precisa apenas do nome deles pra criar. Para criar uma página dentro de um grupo, haverá um mais do lado do nome do grupo que permite criar uma nova página (Somente clicando no botão de mais ele criará nova página, se clicar em qualquer outra parte ele esconde/mostra o conteudo do grupo)

**Criar sessão**
> Quando navegar pra uma página e editar tiver habilitado, no topo da página haverá um botão de adicionar novo bloco, ao ser clicado, criará uma sessão e escrolara pra ela lá no final da página, o nome por padrão é "Sessão", mas pode ser mudado, no topo da sessão haverá um delete e um mais, delete apaga a sessão (Com modal de confirmação) e mais adiciona blocos

**Criar bloco**
> Quando uma sessão tiver criada, no topo dela terá um mais isolado que ao clicar permite escolher entre varios blocos existentes em um modal para escolher entre cada bloco que foi descrito. Quando um bloco é escolhido, ele aparece dentro da seção com todos os seus campos vazios, campos opcionais aparecem quando estamos editando, mas eles desaparecem se estiverem vazios ao ir pro modo visualizar


### Outros pontos importantes
- Não se esqueça do i18n e fazer os textos
- Siga o design já existente no app
- Não se esqueça de configurar scrolls para as páginas quando ela são grandes o suficiente
- Tudo que for pedido drag and drop não coloque o icone de 6 pontas que representa drag and drop, apenas faça eles arrastaveis sem esse iconeq