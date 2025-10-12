
# Task: Refatorar tela de detalhes do personagem

# Local
- `src\pages\dashboard\tabs\characters`
- `src\pages\dashboard\tabs\characters\character-detail`

# Problema
> Após criar um personagem com o modal, um card vai ser criado, e quando clicado no card, navegaremos para detalhes daquele personagem, mas atualmente os dados do personagem criado estão diferente dos detalhes, precisamos refatorar!

# Solução
- Terá um menu fixo superior com botão de voltar, toggle de navegação rapida, botão ícone de excluir e outro de editar.
- Detalhes será uma tela que quando navegada, será dividida em 2 modos:

**IMPORTANTE**: Lembre-se que os campos devem ser **TODOS** e **SOMENTE** os que existem **DENTRO** do modal de criar personagem na tab personagens. Com exceção de: `Relacionamentos`(Seção especial), `Relações familiares`(Seção especial). A seção aparições na história será comentada, já que será adicionada no futuro. Qualquer outra seção pode ser excluida.


## Visualização
> O modo padrão, quando o usuário entra, ele vê tudo no modo visualização, sendo esse modo dividido entre as seções básicas e as seções avançadas, tendo uma estrutura semelhante ao modal de adicionar personagem, mas adaptada para ter mais espaço de tela e para ser apenas visualização do elemento escolhido e finalizado e totalmente a mostra.
- Por padrão, todos os campos devem aparecer, os que não tiverem informação irá mostrar um aviso simples dizendo que nada foi adicionado ali ainda e se quiser adicionar edite
- Esse modo é apenas visualização e nada de edição de nenhum campo deve aparecer (Com exceção de versões, que permite adicionar nova versões mesmo no modo visualização)

**Navegação rápida**
> Uma botão togglavel que quando apertado abre um menu lateral permitindo navegação rapida entre diferentes personagens cadastrados.
- O personagem selecionado atualmente não pode ser navegado
- navegações feitas pela barra rápida não contam no histórico de navegaçÕes, o botão de voltar deve sempre voltar para a tela de dashboard na tab personagens
- O menu lateral não deve ter background impedindo a interação com o app ou dando foco nele, ele deve ser um menu lateral que permite a interação com o app atrás dele seja aberto ou fechado
- Tem o seu próprio scroll, então o scroll da página não afeta ela, do mesmo jeito que o scroll dela não afeta a página
- Input de busca simples para buscar por nome

**Versões**
> Uma seção lateral ao lado da seção básica que guardará versões alternativas daquele personagem (Ex: Personagem perdeu um olho e se tornou mais maduro, Personagem enloqueuceu em poder e agora se tornou uma besta enlouquecida emanando energia, personagem encontrou sua versão alternativa de outro universo e etc)
- Será uma lista vertical com pequenos cards mostrando nome da versão, descrição da versão (Pequeno e não deve esconder do card, deve mostrar ela toda), data de criação e a imagem da versão (A mesma imagem que tem na seção básica ou na lista da tab personagens).
- Clicando em um desses cards, os detalhes do personagens mudarão para a versão clicada (Básicos e avançados)
- A versão principal sempre aparecerá no topo da lista, ela será destacada como main (Versão principal). Quando o usuário apertar em excluir estando com uma versão selecionada, somente a versão é deletada, mas se ele deletar com a main selecionada, ele deletará todas as versões.
- Versões devem ter um botão "+" para permitir abrir um modal de criar novas versões, esse modal é simples com botão cancelar e continuar, além de um input de texto para nome e para descrição, lembrando que ambos devem ter tamanho de no máximo 150 caracteres. Uma vez continuado, abrirá então agora um modal de criação de personagem semelhante ao que já existe, poderá reusar, esse modal terá as mesmas regras e quando adicionado, criará uma versão alternativa daquele personagem.
- Apesar de pode ter infinitas versões, a seção versões deve ter limite de altura e ter um scroll interno quando chegar nesse limite

**Relacionamentos**
> Manter o que já existe com algumas mudanças:
- Troque os ícones por ícones que combine mais com o app
- Se não houver personagem adicionados non app além daquele que está olhando os detalhes, irá ter um aviso dizendo que é necessário mais personagens para criar relacionamentos
- Pode criar relacionamentos entre versões também, eles contam como personagens normais.
- No modo visualização só vê os relacionamentos, não pode adicionar
- No modo edição, permite adicionar relacionamentos, editar e excluir
- Melhore o design dentro do que é possível

**Família**
> Deixe como está também, apenas resolva alguns problemas: 
- Faça com que a árvore funcione e consigamos ver a arvore genealógica do personagem de forma bonita e com design moderno.
- Só pode adicionar novos membros ou deletar membros antigos no modo edição
- No modo visualização tem um breve resumo da família e um botão para ver a arvore genealógica.
- Se não houver nenhum personagem adicionado, deve avisar mensagem
- Se não houver nenhum personagem para adicionar no modo edição, deve também avisar com mensagem para o usuário criar mais personagens, mas sem botão de action

**Excluir**
> Um botão só com ícone que permite excluir versões e o personagem
- Ao clicar, se estiver em uma versão que não seja a principal (main), ele abrirá um modal simples avisando o usuário de que aquela versão será deletada com sim ou não, se não fecha moda, se sim deletará a versão permanentemente e será mudado as informações para a versão main automaticamente
- Se clicar e estiver na versão do personagem principal (Main), será aberto um modal avisando que aquele personagem e suas versões serão deletados, o usuário deve então escrever o nome do personagem inteiro dentro de um input e se estiver correto, outro modal irá aparecer no lugar dando outro aviso com botões de sim ou não, se não cancela tudo e fecha os modais, se sim, o personagem será deletado permanentemente e será navegado para o dashboard na tab personagens.

**Editar**
> Um botão só com ícone que permite ativar o modo edição.

**Organização do menu fixo superior**
| Botão de voltar -- Toggle que abre e fecha barra lateral -------------------------------------------- ícone botão de editar -- ícone botão de excluir |

## Edição
> Aqui, os campos de input se tornam livros para editar e os campos de escolha, dropdown e etc se abrem para escolher todas as opções, tente imitar a estrutura do modal criar personagem mas adaptado para mais espaço
- Nesse modo, haverá um ícone de olho aberto em cada opção (inputs, dropdowns, picks e etc) para que quando clicado, o olho aberto mudasse seu icone e permitisse esconder aquela opção do modo visualização, algo semelhante no que existe em `overview` onde esconde do modo visualização, mas ainda permite ver no modo edição para caso queira botar de volta.
- As versões devem desaparecer enquanto no modo edição, não haverá edição para modo versão.
- No topo, os botões de excluir e voltar no topo devem desaparecer e um botão de cancelar e salvar aparecer, somente depois de ou confirmar ou cancelar as edições, irá voltar tudo ao normal.

# Objetivo
> Ter uma tela de detalhes do personagem organizada e pronto para visualizar, editar, excluir, ver versões e navegar de formna rapida.

# Pontos adicionais
- Os botões relacionados a anotações do personagem não devem ser excluidos, mas escondidos, já que serão refatorados no futuro, mas agora não terá foco.