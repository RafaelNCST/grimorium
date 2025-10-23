# Desenvolver as seções especiais de Diplomacia e Hierarquia

## Diplomacia
- Relacionamentos entre reinos do tipo: Aliança, subordinados, Guerra, Paz, Odio e Neutro
- No modo visualização vai ser um conjunto de tabs que cada uma mostra em card semelhante ao card da tab facções todos as facçoes que estão com algum desses status diplomaticos, se ela não tiver com nenhum status, ela é automaticamente neutro
- No modo edição, você pode editar, excluir e adicionar facções e dar a elas relacionamentos dela com a facção selecionada atual

## Hierarquia
- Da a capacidade de adicionar títulos/posições para poder linkar personagens existentes a essas posições na facção
- Pode também dar numeros a cada posição com o objetivo de automaticamente colocar em ordem do mais importante pro menos importante com base em numero (Por exemplo, usuário cria titulo Rei e coloca ele em primeiro com numeron 1)
- Titulos podem ser excluidos e editados, se for excluido, ele some e o resto não muda
- Por padrão, existe o titulo membros, onde será uma lista longa onde o usuário pode abrir um modal e colocar múltiplos personagens de uma vez ali

# Pontos importantes a seguir
- Certifique-se de que todos os textos do `i18n` estejam funcionando corretamente
- Use typescript da forma correta, evite acumular erros de typescript
- Certifique-se de que o app esteja sem erros ao final da implementação e que qualquer servidor aberto esteja fechado após finalizar tudo
- Se não existir algum valor pros campos, sempre faça um default
- Todo botão roxo mágico deve ter o design igual ao que já existe atualmente no botão "Nova Facção"