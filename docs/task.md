# Objetivo 
> Desenvolver a tab enredo/plot em `C:\Users\rafae\Desktop\dev\grimorium\src\pages\dashboard\tabs\plot`

## Para que o usuário precisa
> O primeiro passo é criar um arco narrativo para a história, cada arco representa uma parte da história em si e essa feature ajudará o escritor a ter anotações escritas de como ele espera que seja cada arco, além de outros campos que auxiliam o leitor a entender suas ideias

## O que vamos fazer
- No enredo/plot, teremos campos básicos, avançados e automáticos

**Campos básicos**
> Campos obrigatórios de serem preenchidos para criar ou editar um arco
- Nome do arco: Input de uma linha com limite de 200 csracteres
- Resumo do arco: Input grande com limite de 1000 caracteres
- Status do arco: Finalizado, Atual, Planejamento. Eles serão colocados com ícones, titulo assim o usuário pode escolher somente uma dessa opções. Faça cada opção da mesma cor, mas quando estão com hover/ativada ficam com uma cor diferente, onde o seu hover será um preview do seu active.
- Tamanho do arco: mini (menos de 10 capitulos), pequeno (até 50 capítulos), médio (até 200 capitulos), grande (+ 200 capítulos). Eles serão colocados com ícones, titulo e descrição básica explicando o limite de capitulos de forma bem humorada para cada opção, assim o usuário pode escolher somente uma dessa opções. Faça cada opção da mesma cor, mas quando estão com hover/ativada ficam com uma cor diferente, onde o seu hover será um preview do seu active. Faça um texto introdutorio também para essa parte, onde ele explicará que esse é o tamanho do arco que você imagina para esse arco
- Foco do arco: Input grande com limite de 500 caracteres
- Cadeia de eventos: Existe um cadeia de eventos já no app feito, use ele como base, apenas certifique-se de que está deletando e editando, também limite o tamanho da descrição para 500 caracteres e do titulo para 100 caracteres. Também use O dnd para permitir movimentar os eventos para baixo ou para cima, para organizar sua ordem, cada movimento muda o numero da ordem mas não modifica o status do check. Para que possa contar como preenchido para o obrigatório deve ter pelo menos 1 evento sempre

**Campos avançados**
- Personagens importantes: Dropdown contendo todos os personagens cadastrados no app, cada personagem vira um card com nome e imagem em formato circular
- Facções importantes: Dropdown contendo todos as facções cadastrados no app, cada facção vira um card com nome e imagem em formato quadrado com bordas arredondadas (Igual que existe na tab de facções)
- Mensagem do arco: Input grande de 500 caracteres máximos, onde o usuário pode colocar algum tipo de mensagem moral pro usuário
- Impacto no mundo: Input grande de 500 caracteres máximos, onde o usuário pode colocar impactos que houveram no mundo

**Automático**
> Campos que são preenchidos automaticamente com base em outros, o usuário não vê na hora de criar e nem de editar, somente na visualização
- Progresso: Uma barra roxa que vai de 0% a 100% que aumenta e diminui com base nos checks da lista de `cadeia de eventos`, o calculo do aumento ou diminuição é com base na porcentagem da quantidade de eventos criados

## Modal de criação
> Quando clicado em "Novo Arco" deve abrir o modal de criar arco
- Ele será dividido em campos básicos e avançados, campos automaticos não aparecem.
- A estrutura seguirá a mesma estrutura dos outros modais no app, use como base a de personagens em `C:\Users\rafae\Desktop\dev\grimorium\src\pages\dashboard\tabs\characters`, ou seja campos básicos a mostra primeiro e campos avançados escondidos, só modifique os campos para os campos de arco
- Uma vez preenchido os campos básicos seguindo suas regras, o botão criar deve ser clicado e um card é criado na listagem

## Listagem
> Quando um arco é criado, ele cria um card semelhante ao que já existe, apenas retirando a feature de subir e descer das setas por completo, na verdade a agora o usuário pode mover para baixo ou para cima com drag and out (use dnd) os cards, facilitando organizar da forma que ele preferir
- Os status vão virar os contadores/filtros que existem em outras tabs, ao lado de tamanho de arco, usando a mesma lógica de tabs como `itens`, com o mesmo design de cores e o hover/active sendo a mesma cor e mudança
- Input de busca será por nome do arco
- Botão de arvore visual continua existindo, só padronize o hover deve para combinar com outros botões semelhantes

## Detalhes do arco
> Quando clicado em um card de arco, ele vai abrir os detalhes do arco. Ele será igual a outros detalhes no app, use como base detalhes do personagem para separar seções básicas e seções avançadas, apenas que não coloque menu de navegação lateral e versões, ambas não fazem parte dessa página, o resto é igual

## Árvore visual
> Na página de listagem, ao clicar em "Arvore visual" irá levar para a página que já existe mostrando por padrão em ordem os primeiros serão com status finalizado, no meio com status atual e os ultimos com status em planejamento, sendo que o usuário pode reorganizar a qualquer momento cada card, podendo escolher a posição. Além disso, para caso de ter muitos arcos, deve ter um scroll lateral de arrastar e soltar para poder ver arcos que estão além da tela. Melhore também o design, dando mais espaçamento em várias partes coladas e não esqueça de que cada card deve ainda permitir navegar para a página de detalhes daquele arco, e quando voltar deve voltar para a arvore ainda

# Pontos importantes a seguir
- Certifique-se de que todos os textos do `i18n` estejam funcionando corretamente
- Use typescript da forma correta, evite acumular erros de typescript
- Certifique-se de que o app esteja sem erros ao final da implementação e que qualquer servidor aberto esteja fechado após finalizar tudo
- Se não existir algum valor pros campos, sempre faça um default
- Todos os placeholders devem ser um exemplo de uso ao invés de uma descrição, e não coloque "ex"
- Todo botão roxo mágico deve ter o design igual ao que já existe atualmente no botão "Novo Arco"