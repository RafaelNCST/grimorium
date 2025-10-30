# Ferramenta de texto na tab sistema de poder

# O que é
> É uma ferramenta que permite escrever um texto sem background na área de edição

# Como deve ser selecionado
> Deve ser selecionado na ferramenta de texto que já existe na barra de ferramentas

# Como deve ser colocado na área de edição
> O usuário ao selecionar a ferramenta, pode clicar em qualquer lugar da área de edição (Incluindo em cima de outros elementos) e assim um indicador de texto aparece, pronto para o usuário digitar. Não deve ter nenhum placeholder, apenas o indicador do cursor do mouse na cor padrão do texto ou que está selecionada
- Se o usuário não digitar nada e deselecionar o texto, a caixa de texto é automaticamente excluida
- Se o usuário escrever algo, o elemento de texto agora existe e deve permanecer 

# Como o elemento de texto deve reagir a textos grandes
- Caso o texto nunca tenha sido redimensionado antes: Em caso de um texto que é maior que sua width, ele vai aumentando a width para comportar o texto até o usuário quiser parar, o wrapper deve sempre acompanhar o elemento de texto, sempre mostrando em tempo real o tamanho aumentando
- Caso ele já tenha sido redimensionado uma única vez (Seja verticalmente, horizontalmente ou diagonalmente): Deve pular linha e aumentar a height para comportar o novo texto, a width deve ser mantida

# Em caso de arraste
> Manter o arraste atual que está muito bom

# Tamanhos padrões
- O tamanho mínimo para width é o tamanho do texto atual no input e os espaçamentos internos (Ou seja, se tiver um caracterem vau ficar com width com esse caractere de tamanho). O tamanho máximo não existe para width, aumente INFINITAMENTE a width do jeito que o usuário quiser
- Para redimensionar o tamanho com width e altura ao mesmo tempo + o tamanho do conteudo, será até o conteudo/texto ter o tamanho máximo permitido que é 64px de fonte, enquanto o tamanho minimo da fonte é 8px

# Em caso de redimensionamento
- Redimensionado para qualquer um dos lados da lateral(Horizontal) irá aumentar a width do texto, puxando o input até onde o usuário quiser, além disso irá aumentar ou diminuir a altura automasticamente para permitir que o texto interno possa ter mais linhas ou menos linhas de acordo se está diminuindo ou aumentando altura. Lembre-se que o feedback do tamanho do wrapper e do texto remodelando é em tempo real
- Redimensionamento na vertical (Cima e baixo) ou na diagonal (Cantos) irá aumentar a width e altura ao mesmo tempo que aumenta o conteudo interno pr5oporcinalmente, respeitando o tamanho limite e minimo da fonte do texto. Lembre-se de sempre mostrar feedback visual do wrapper e aumento de tamanho em tempo real
- Lembre-se de que deve EXISTIR feedback em tempo real nos tamanhos aumentando, evite mostrar o feedback apenas quando solto o mouse ou deseleciono algo
- Atente-se para que a área de alça e redimensionamento esteja pegando todo o wrapper inclusive quando o seu tamanho mudar, para evitar de o tamanho do wrapper mudar e só uma parte permitir redimensionar

# Menu lateral
- O menu lateral do texto deve ter opções de texto justificado também
- O tamanho da fonte deve ser atualizado caso o tamanho do texto for aumentado por meio de redimensionamento automatico