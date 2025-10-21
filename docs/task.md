# Objetivo
Desenvolver o fluxo inteiro da tab `Espécies`, desde a listagem, filtragens, criação por modal e até os detalhes

# Processo Principal
**Observação**: A tab `Espécies` se chamará a partir de agora `Raças`, então certifique-se de entender que `Espécies` será `Raças` agora e que tudo que tem o nome `espécies` **DEVE** ser mudado para `raças`

## 1. Desenvolver Modal de criação de raça
> O modal será aberto quando clicado em `Nova Espécie`, abrindo o modal com os seguintes campos básicos:
- Imagem (Opcional) Imagem que cobrirá o width do modal inteiro, tendo altura consideravel para poder mostrar imnagens de corpo inteiro da raça. Se não houver imagem, coloque default
- Nome da raça (Obrigatório): Input de texto de uma linha com 150 caracteres máximos
- Nome Cientifico (Opcional): Input de texto de uma linha com 150 caracteres máximos (Deve estar na mesma linha do nome da raça, mas quebram para linhas únicas quando a janela diminui)
- Domínio (Obrigatório): Um pick contendo ícone e título, sendo cada ícone e título tendo cores representando seus valores, sendo esses valores: Aquático, Terrestre, Aéreo, Subterrâneo, Dimensional, Espiritual, Cósmico (Note que o estilo desse pick é semelhante ao pick já existente no `Status do modal de criar item`, trate de fazer o estilo de cores combinando com o mesmo tipo de hover e active, mas claro, com cores únicas combinando com o valor dos domínios) 
- Resumo (Obrigatório): Input de texto grande de várias linhas com 500 caracteres máximos

### E os campos avançados serão:

**Cultura e Mitos**
- Nomes Alternativos: Input com sistema de tags, podendo colocar vários nomes em fileira, podendo também excluir ou adicionar novas tags
- Visões entre raças: Um texto descrevendo o campo, onde aqui colocamos as visões de outras raças sobre a raça que estamos atualmente vendo, podemos então selecionar qual a raça será mostrada a visão e adicionar um texto de 500 caracteres máximos
- Ritos, Tabus e curiosidades: Um texto descrevendo o campo, onde aqui colocamos qualquer tipo de rito, tabu ou curiosidade da raça, será uma lista onde cada input terá no máximo 500 caracteres, podendo adicionar vários ritus, tabus ou curiosidades sobre a raça (Ex: Anões odeiam tomar banho, Elfos não comem sementes apesar de serem vegetarianos)

**Aparência e caracteristicas**
- Aparência geral: Input grande com varias linhasa com 500 caracteres máximos, serve pro usuário descrever a aparência daquela raça
- Expectativa de vida: Um input básico de uma linha de 100 caracteres máximos
- Altura média: Um input básico de uma linha de 100 caracteres máximos
- Peso médio: Um input básico de uma linha de 100 caracteres máximos
- Características fisícas especiais ou marcantes: Input grande com varias linhasa com 500 caracteres máximos, serve pro usuário descrever a aparência daquela raça

**Comportamentos**
- Hábitos: Pick de cards com ícone, texto e uma descrição leve do que são cada hábito: Noturno (Durante a noite, sob a lua e as estrelas), Diurno (Durante o dia, sob a luz do sol), Crespuscular (Nos limiares do dia e da noite), Catemeral (Variável ao longo do dia e da noite, sem padrão fixo), Lunar (Apenas sob luz lunar, ou em fases específicas da lua), Solar (Apenas em presença direta do sol) Atemporal (Fora do tempo linear — podem surgir em qualquer hora, ou com condições atendidas), ínfero (Sem relação com o ciclo solar, em total ausência de luz)
- Ciclo reprodutivo: Texto descrevendo que aqui você escolhe como é a reprodução daquela raça, sendo a escolha com um Pick com ícone, texto e descrição simples de cada opção e as opções: Sexuado, Assexuado, Hermafrodita, Parthenogênico, Vivíparo, Mágica (A partir de meios mágicos ou que envolvam o sobrenatural), Artificial (Por meio de qualquer forma artificial, desde máquinas criadas por humanos ou até homunculus), Espiritual (Vem a partir de espiritos, almas, etc), Divino (Vem a partir de divindades ou seres extra poderosos), Cósmico (Vem de fora do mundo do autor).
- Dieta: Texto descrevendo que aqui você escolhe como é a dieta daquela raça, sendo a escolha com um Pick com ícone, texto e descrição simples de cada opção e as opções: Hérbivoro, Carnívoro, Onívoro, Insetívoro, Frugívoro, Detritívoro, elemental (Come algum elemento, se escolhido essa pode ainda adicionar um texto permitindo dizer qual elemento ou poder elemental é a dieta daquele ser), Espiritual (Absorve espiritos, almas, etc), Cósmica (Absorve forças cósmicas ou abstratas).
- Comunicação: Pode adicionar varias tags com ícone e texto com as opções (Fala, Telepatia, Feromônios, Gestos), pode adicionar varias opções de tag para uma raça com varias formas de comunicação.
- Tendência Moral: Pick com descrição geral explicando o que é esse campo, com cada opção com icone, texto e descrição do valor com as opções: Caótico (A maioria são maus), Neutro (Há variação extensa na tendencia moral, não existindo um bom ou mau necessariamente), Honrado (A maioria são bons), Extremo Caótico (Todos são maus),Extremo Honrado (Todos são bons), Extremo Invertido (Ou eles são extremamente bons, ou extremamente maus).
- Organização social: Input grande de 500 caracteres máximos, aqui o usuário descreverá como é organizado a sociedade na sua espécie
- Habitat: Um input que permite adicionar tags de no máximo 50 caracteres cada (Ex: Montanhoso, Aéreo, Subterrâneo)
- Tendencia comportamental: Input grande de 500 caracteres. (Ex: Anões são diretos e justos, odiando qualquer tipo de joguinhos ou manipulações)

**Poder**
- Capacidade fisíca: Pick descritivo com nome, ícone e descrição simples para cada opção. Além disso, deve ter uma descrição maior explicando que esse campo é para você sempre lembrar de quão forte é fisicamente aquela raça comparada a um ser humano comum na sua obra. Opções: Impotente, Mais fraco, Comparável, Mais forte, Invencível
- Caracteristicas especiais: Input de texto grande com limite de 500 caracteres (Afinidade ao fogo, podem controlar rochas, etc)
- Fraquezas:  Input de texto grande com limite de 500 caracteres (Fraqueza fogo, São muito frageis, etc)

**Narrativa**
- Motivação na história: Qual a motivação dessa raça na história, sendo um input grande com 500 caracteres máximos
- Inspirações: Input grande com 500 caracteres máximos, usado para para descrever suas inspirações daquela raça

## 2. Desenvolver fluxo de criação de card na listagem
> Quando o modal de criar raça tiver os campos básicos preenchidos (Com exceção dos opcionais), um card de raça será criado na listagem e os contadores/filtros aparecerão
- Deve salvar no banco de dados o que foi criado no modal com todos os campos do modal
- Deve criar um card para a raça criada, o card deve ter a imagem cobrindo o width total do topo com uma altura consideravel (Algo semelhante ao card dos itens na tab itens). Conterá todas as informações básicas no card de listagem com design combinando com o app (Informações avançadas somente nos detalhes da raça)
- Lembre-se de aplicar o mesmo hover que existe na listagem de personagens e itens em seus cards
- Input de busca deve ser igual aos que já existem na listagem de personagens e itens, não se esqueça de centralizar a mensagem de raça não achado
- O card não deve ter ação ao ser clicado por hora
- Evite hover em locais que não tem area de clique
- Use no card os mesmo ícones, textos e cores para os campos básicos que tiverem dropdown ou picker

## 3. Desenvolver fluxo de filtragem das raças
> Deve criar contadores e quando clicado em uma tag de contador deve ter a capacidade de filtrar a listagem
- O design dos contadores será igual ao que temos atualmente na listagem de personagens e itens
- Os contadores irão contar com o campo dominio, e terão a mesma lógica dos contadores/filtro de itens e personagens, tendo total para limpar os filtros e filtros multi selecionaveis com a mesma regra do filtro de personagens
- Não se esqueça que o hover/active dos filtros é igual, tendo um estilo semelhante ao de itens e personagens, com a cor cobrindo tudo e a cor do texto mudando

## 4. Desenvolver feature de grupos de raças
> Deve ter a capacidade de agrupar raças na listagem na tab raças, permitindo que o usuário possa agrupar suas raças
- Haverá um botão chamado "Criar grupo" ao lado do "Criar raça". Quando clicado, abre um modal simples pedindo Nome do grupo (300 caracteres máximos) e resumo (500 caracteres máximos)
- Quando criado, um grupo criará um tipo de accordion que envolve cards de raça dentron dele que o usuário colocou, tendo nome e descrição nele, sendo que a descrição pode ser diminuida ou aumentada (Ler mais ou ler menos...)
- Para colocar um card dentro do grupo, basta segurar o card da raça e arrastar pro grupo soltando lá dentro, novos cards sempre são os últimos da fileira dentro do grupo. Outra forma vai ser um botão que fica no accordion chamado "Adicionar no grupo" que ao ser clicado abre um modal com input de busca mostrando todos as raças (Somente nome e imagem em miniatura)
- Haverá um botão no accordion chamado "Criar raça no grupo" que permite criar uma raça dentro do grupo diretamente (O modal será o mesmo do outro modal de criar raça, mas ele será criado dentro do grupo)
- Para retirar uma raça do grupo, você pode puxar o card de lá (arrastar e soltar fora) ou poderá clicar em um botão ao lado do botão adicionar no grupo ("Excluir do grupo") diretamente que ao ser clicado, faz com que o grupo entre no modo excluir, onde o click em um card não faz a navegação e sim retira ele do grupo e deixa ele solto, para voltar com a navegaçao pelo click, precisa sair do modo excluir
- Quando um grupo é criado, ele sempre ocupará o topo da lista, mas seu accordion só abrirá se tiver algum card dentro, se não houver, irá mostrar uma mensagem simples dizendo que não há nada no grupo. Cada grupo terá a width e height preenchendo a quantidade de cards, então na mesma fileira horizontal pode ter um grupo e uma raça solta

## 5. Desenvolver a navegação e a tela de detalhes da raça
> Quando clicado em um card da raça, deve navegar para os detalhes da raça contendo o modo de visualização como padrão, tendo o modo de edição para acessar a exclusão funcionando
- O Header dos detalhes seguirá a mesma forma dos headers de personagens e itens, com botão voltar, menu lateral para navegação rapida, botão editar e botão excluir
- A lógica do menu lateral de navegação rapida será a mesma, mas voltada para raças
- O botão de editar terá a mesma lógica
- O botão de excluir também terá a mesma lógica, abrindo modal pedindo nome da raça para exclusão
- Modo visualização: Será dividido igual ao modal em informações básicas e avançadas, sendo que informações avançadas terá o efeito de esconder semelhante ao que temos nas telas de detalhes de personagem e item. Lembre-se que por padrão tudo deve aparecer, nem que seja com uma mensagem dizendo que não há nada adicionado. Itens de dropdown ou picker devem aparecer com o mesmo ícone, cor e design, mas só mostrando o valor selecionado 
- Modo de versões será igual aos de personagens e itens, será chamado "Variações" e terá a mesma lógica de criar e excluir, lembre-se de conferir se todo o fluxo está feito e o design está igual ao de detalhes personagens e itens
- Ao entrar no modo editar, seguirá a mesma regra dos outros, esconder variações, menu lateral é fechado e botão some, e botão de voltar some. Na edição, os campos devem ser editaveis **IGUAL** aos que existem no modal de criar raça, seguindo se é picker, dropdown ou input, cores, ícones e etc. incluindo a capacidade de esconder campos do modo de visualização e editar igual ao modal de criar raças
- Relacionamento entre raças: Um campo especial extra que é forma de adicionar relacionamentos entre as espécies. Vai ser igual ao criador de relacionamentos dos detalhes do personagem, mas com relações diferentes e sem o contador de intensidade, apenas o ícone, nome da relação e uma pequena descrição deve ter e o nome da espécie que pertence, as relações serão: Predação, Presa, Parasítismo, Comensalismo, Mutualismo, Competição, Neutralismo.

# Pontos importantes a seguir
- Desenvolva o modal seguindo o padrão de modal de criação nas tabs `itens` e `personagens`, incluindo a separação com campos básicos e avançados. O que não for especificado nesse documento você pode seguir de lá
- Certifique-se de que todos os textos do `i18n` estejam funcionando corretamente
- Use typescript da forma correta, evite acumular erros de typescript
- Certifique-se de que o app esteja rodando ao final da implementação e que qualquer servidor aberto esteja fechado após finalizar tudo
- Note que os placeholders do `modal de criação` e do `modo edição da tela de detalhes` devem ser exemplos de uma raça sendo adicionada, no caso, o placeholder será um exemplo de um dragão de fogo sendo criado (Ou seja, nome será Dragão de fogo, descrição será apenas descrevendo o dragão e etc)