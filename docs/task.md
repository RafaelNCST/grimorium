## Bloco de imagem (Novo Bloco)

Agora, ao lado do botão nova imagem que fica no menu lateral    
  do bloco de imagem, coloque um botão entre o botão nova imagem  
  e o de excluir que abrirá um modal que permitirá escolher o     
  enquadramento da imagem no espaço disponivel, permitindo ver a  
  area que será visivel e permitir arrastar até ter a area        
  visivel que o usuário quer da imagem 

**Design**
> Ele terá um formato e bordas iguais ao bloco de paragrafo. Seu tamanho será todo de imagem com um input de uma linha embaixo pra escrever legenda. A imagem deve estar dentro do background com um espaçamento da borda igual ao que existe em paragrafo. O input deve ter uma borda no seu input igual ao que existe no bloco de paragrafo. A imagem terá o mesmo formato do bloco. Deve haver um leve espaçamento entre imagem e input de texto. O tamanho pode 800x400

**Comportamento ao criar**
> Ao ser criado na área de edição, o bloco aparecerá na área clicada com foco nele, mas com nenhum input focado.

**Comportamento ao dar foco/selecionar bloco**
> Para selecionar, basta clicar uma vez em cima do bloco, selecionando ele. Ao selecionar, um wrapper roxo especial (o mesmo usado nos blocos de paragrafo e imagem) que irá encobrir o bloco inteiro e permitir e arrasto pela área.

**Comportamento ao escrever**
> Para escrever, deve clicar 2x dentro da área do input e assim liberar a caixa de texto. Deve quebrar quando o texto chegar no limite do width, adicionando uma nova linha para baixo no input e fazendo todo o bloco acompanhar a altura (Não coloque animações, apenas deixe a altura do bloco encobrir o texto).

**Menu lateral de edição**
> Ao clicar no bloco e selecionar ele, um menu lateral de edição se abre. No geral, ele vai ser igual aos menus de bloco de paragrafo, contendo propriedades permitindo ativar/desativar navegações, bordas. Permite ver alinhamento do texto embaixo da imagem, cor do bloco, cor do texto, cor da borda.

**Navegação pelo card**
> O bloco permite navegação da mesma forma que os blocos de paragrafo e sessão

**Outros pontos**
- A fonte base dos blocos será alguma fonte mono espaçada
- O font size dos textos será de 16px