# Desenvolver a tab de facções
> Ao navegar para a tela de facções, temos uma lista vazia com uma mensagem e um botão "Nova facção", ao clicar nesse botão, um modal se abrirá, iremos refatorar as informações desse modal

## Novo Modal
> A estrutura do modal será a mesma usada em `C:\Users\rafae\Desktop\dev\grimorium\src\components\modals\create-character-modal`

**Dicionário**
- Quando eu falar "character modal" me refiro a `C:\Users\rafae\Desktop\dev\grimorium\src\components\modals\create-character-modal`
- Input pequeno: Ele mostra apenas uma linha pro usuário 
- Input médio: Mostra pelo menos 4 linhas pro usuário
- Input grande: Mostra pelo menos 8 linhas pro usuário
- Icon picker: Um group de valores sem card em volta, apenas icon e titulo colocados juntos para selecionar 1 ou mais
- Card icon picker: Um group de valores com card em volta, apenas icon, titulo e descrição colocados juntos para selecionar 1 ou mais
- Input tagger: Uma lista de tags colocadas por um input que permite excluir ou adicionar novas tags, o input deve ser pequeno de 100 caracteres máximos sempre
- Text list: Uma lista de trechos de textos criado por um input, onde cada adição separa a lista em uma lista de tópicos, o input deve ser médio de 500 caracteres máximos sempre
- Dropdown tagger: Dropdown que ao escolher valor, ele se junta a uma lista de tags

**Importante**
- Sempre faça os placeholders como se estivesse criando uma facção, para dar um exemplo direto ao usuário, use de exemplo uma facção de magos malignos, pode criar o resto que precisar pra preencher os placeholders
- Para os caracteres máximos pedidos, use a feature de contar caracteres que já existe no app
- Os campos avançados devem estar como os outros modais de criação e deve ter a capacidade de esconder, onde por padrão ele vem escondido (Exemplo no character modal)

### Campos básicos (Todos obrigatórios, exceto a imagem)**
> Coloque no texto introdutorio no topo dizendo que algumas seções especiais estão disponíveis apenas ao criar a facção
- Imagem: Retrato circular do mesmo tamanho e jeito do modal em character modal, aqui ficará o símbolo da facção
- Nome: Um input pequeno com limite de 200 caracteres
- Resumo: Um input grande com limite de 500 caracteres
- Status: um `icon picker` com os valores: Ativa, Enfraquecida, Dissolvida, Reformada, Ápice. Coloque cores diferentes para cada status
- Tipo de facção: Um `card icon picker`, faça cada valor com cores próprias combinando, os valores são: Comercial, Militar, Mágica, Religiosa, Culto, Tribal, Racial, Governamental, Acadêmica, Realeza, Mercenária

### Campos avançados (Todos opcionais)**
**Alinhamento**
> Use aqui o mesmo quadro de alinhamento que existe em character modal na seção `Alinhamento`

**Relacionamentos**
- Influência: Um card `icon picker` com descrição breve, faça cada valor com cores próprias combinando, os valores são: Inexistente (faça uma frase engraçada dizendo que não pode influenciar nada), Baixa (Pode influenciar vilas ou pequenas cidades), Média (Pode influenciar uma grande cidade com algum esforço, tendem a serem mais conhecida entre as grandes facções), Alta (Podem influenciar as ondas, desde que nenhum dos peixes grandes intervenha), Dominante (Facções de ápice que dominam todas as outras em sua região ou competem diretamente com outras que dominam)
- Reputação pública: Um card `icon picker` com descrição breve, faça cada valor com cores próprias combinando, os valores são: Desconhecida, Odiada, Temida, Tolerada, Respeitada, Adorada
- Influência externa: Um input grande de 500 caracteres máximos, aqui descreve o que essa facção influencia externamente

**Estrutura interna**
- Forma de governo: Input grande de 500 caracteres máximos, aqui o usuário pode explicar sua estrutura governamental livremente
- Regras e leis: `Text list`, aqui o usuário pode adicionar regras e leis da facção
- Símbolos importantes: `Text List`
- Recursos principais: `input tagger`
- Economia: Input grande de texto com 500 caracteres máximos
- Tesouros e segredos da facção: `text list`
- Moedas usadas: `input tagger`

**Poder**
> Aqui vai ter contadores de escala especial de 1 a 10, que o usuário pode modificar para setar os valores: Poder militar, Poder político, Poder cultural, Poder econômico
- Cada valor descreve o quão poderoso frente ao universo do autor é a facção em cada setor
- Coloque descrição para cada valor, explicando o que é cada um 

**Cultura**
- Lema da facção: Input médio de 300 caracteres
- Tradições e rituais: `Text list`
- Crenças e valores: `Text list`
- Idiomas usados: `input tagger`
- Uniforme e estética: Input grande de 500 caracteres
- Raças: `Dropdown tagger` contendo todas as raças cadastradas

**História**
- Data de fundação: Input médio de 200 caracteres máximos
- Resumo da história de fundação: Input grande de 500 caracteres máximos
- Fundadores: `Dropdown tagger` que permite escolher um personagem da tab characters (Deve conter apenas personagens que estão cadastrados em character)
- Cronologia: Campo único que permite criar uma linha do tempo simples com todos os eventos de um tempo x até um tempo y da escolha do usuário, cada seção da linha do tempo permite um titulo e um texto descritivo simples de 500 caracteres máximos e serão organizados em um design limpo, mas didático para representar uma linha do tempo com cores e ícones

**Narrativa**
- Objetivos da organização: Um input grande de 500 caracteres máximos
- Importância narrativa: Um input grande de 500 caracteres máximos
- Inspirações: Um input grande de 500 caracteres máximos

## Criação do card
> Quando todos os campos básicos (Com exceção de imagem) estiverem preenchidos no modal, o botão para criar no modal ficará ativo e poderá ser pressionado, uma vez pressionado criará um card na listagem das facções
- O card deve ter o hover igual a outros cards que existem, use o exemplo na listagem de `C:\Users\rafae\Desktop\dev\grimorium\src\pages\dashboard\tabs\characters`
- O card deve estar em uma lista vertical, com seu comprimento cobrindo toda a width
- A foto deve estar no começo do card e deve ter um valor default se não existir, enquanto ao lado terá nome, status e tipo de facção e mais embaixo o resumo, sendo que o resumo terá um limite de caracteres que mostrará antes de ser cortado para não quebrar o design (e para ser mostrado depois nos detalhes)
- Faça os contadores contando: Status e tipo de facção, com a mesma lógica de filtro usada em `C:\Users\rafae\Desktop\dev\grimorium\src\pages\dashboard\tabs\items`, onde pode selecionar múltiplos valores. Lembre-se que cada tag deve ter cor diferente e o hover/active devem serem cores iguais!
- Input de busca terá a mesma lógica dos outros inputs de busca, buscando pelo nome da facção apenas

## Detalhes da facção: Em breve, primeiro termine o resto

# Pontos importantes a seguir
- Certifique-se de que todos os textos do `i18n` estejam funcionando corretamente
- Use typescript da forma correta, evite acumular erros de typescript
- Certifique-se de que o app esteja sem erros ao final da implementação e que qualquer servidor aberto esteja fechado após finalizar tudo
- Certifique-se de corrigir e melhorar cada texto que eu mandar, com exceçao dos textos que eu digo especificamente para não mexer
- Se não existir algum valor pros campos, sempre faça um default
- Todo botão roxo mágico deve ter o design igual ao que já existe atualmente "Nova Facção"
- Quando for pedido qualquer tipo de `Icon picker` ou `Card Icon Picker` com cores diferentes, lembre que a cor pro hover/active devem ser iguais, para dar a impressão de que o hover é um preview de como ficaria o active