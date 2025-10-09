
# Task: Refatorar criação de personagem na tab personagens

# Local
- `src\pages\dashboard\tabs\characters`
- `src\components\modals\create-character-modal.tsx`

# Problema
O fluxo de criação de personagem atualmente não está agradavel seguindo o que inicialmente foi pensado

# Solução
- Haverá agora ao apertar no botão `Novo Personagem` um modal separado por duas seções: Itens obrigatórios e Itens avançados
- Itens obrigatórios são obrigatoriamente necessários para que o botão de criar personagem no fim do modal fique disponivel.
- Itens avançados são todos opcionais e por padrão vem escondidos em um toggle accordion, ao qual quando apertado na setinha para baixo, aparecia todos os campos avançados pro usuário ver, podendo apertar na agora seta pra cima pra esconder novamente a seção avançada
- Deve haver um aviso no modal dizendo que tudo pode ser editado mais tarde e que algumas seções especiais só podem serem editadas ou adicionadas quando o personagem for criado.

# Itens obrigatórios
- Imagem do personagem: Deve ser redonda, com tamanho mediano.
- Nome do personagem: Input simples de uma linha de texto com limite de 100 caracteres
- Papel do personagem: São as mesmas opções que já existem, ela deve ser um pick item, com todas as opções com texto e imagem de forma visual, colorida e bonita pro usuário escolher uma das opções.
- Idade: Um input mediano de uma linha que permite numeros e letras também (Para casos de idade diferenciadas que o autor pode querer)
- Genero: Um dropdown contendo os generos que tem atualmente já disponível 
- Descrição simples do personagem: Um input de texto maior em altura e que ocupa a largura inteira do modal, deve ter no máximo 500 caracteres.


**Organização no modal**
|Imagem - Nome
|Imagem - Idade - Genero
Papel do personagem
Descrição simples

# Itens avançados
> Dividido em seções:
**Aparência**
- Altura: Input de texto
- Tom de pele: Pick de cores com todas as cores do espectro além de um input junto pro usuário colocar o nome da cor que ele quiser.
- Peso: Input de texto
- Tipo fisico (Desnutrido, Magro, Atlético, Robusto, Corpulento, Aberração)
- Cabelo: Input de texto
- Olhos: Input de texto
- Rosto: Input pro usuário colocar o que quiser
- Caracteristicas marcantes: Input de texto (Cicatriz, tatuagem, chifres, objetos marcantes, trajes marcantes etc)
- Especie e raça: Dropdown, ele terá somenbte raças e especies cadastradas, se não houver nenhuma por padrão haverá só uma mensagemn dizendo pro usuário ir adicionar uma espécie e raça na tab especies.

**Comportamentos e Gostos**
- Arquétipo: 12 Arquétipos Clássicos (estável e versátil)
Inocente, Órfão/Comum, Herói, Cuidador, Explorador, Rebelde, Amante, Criador, Bobo/Trickster, Sábio, Mago, Governante. São pequenos cards com imagens representando cada arquétipo e uma descrição leve sobre ele. Essa parte pode ser escondida e mostrada por um toggle simples, já que ela seria um pouco maior que as outras.
- Personalidade: Input de texto grande com limite de 500 caracteres
- Hobbies e interesses: Input de texto médio com limite de 250 caracteres
- Sonhos e objetivos: Input de texto médio com limite de 250 caracteres
- Medos e traumas: Input médio de texto com limite de 250 caracteres
- Comida favorita: Input de texto de 1 linha
- Música favorita: Input simples de texto com 1 linha que permite colocar links

**Alinhamento**
> Uma matriz 3x3 (como um tabuleiro), com cada célula representando um alinhamento.
Quando o usuário toca em uma célula:
- ela brilha (com cor e ícone)
- aparece uma breve descrição, ex: “Caótico e Bom — acredita em liberdade e compaixão acima de regras.”
- Ícone em cada célula
- Paleta de cores sutis: verdes (bons), cinzas (neutros), vermelhos (maus).

**Local
izações e Organizações**
- Local de nascimento: Dropdown com somente locais que existe na tab Mundo, se não existir nenhum, tem somente um aviso dizendo para ir para tab Mundo para criar um local.
- Local afiliado: Dropdown com somente locais que existe na tab Mundo, se não existir nenhum, tem somente um aviso dizendo para ir para tab Mundo para criar um local.
- Organização: Dropdown com somente organizações que existe na tab Organização, se não existir nenhum, tem somente um aviso dizendo para ir para tab Organização para criar um local

**Organização no modal**
> Deve seguir a ordem e ser separado entre as seções. O resto faça de acordo com o que estiver combinando com o design, mantendo pick itens ou dropdown para itens que estiverem escolhas limitadas e combinarem com o design. Não se esqueça que os ícones usados devem combinar com o app, use sempre lucide react.

# Objetivo
Apenas ter um modal todo organizado da forma pedida, seguindo os padrões de `tech.md`, com linguagens no i18n para `en` e `pt` e seguindo todos os padrões de design do app. Essa task não se preocupa com o que o botão do modal `Criar Personagem` faz, no máximo se preocupa se ele está ativando e desativando da maneira correta com itens obrigatórios

# Pontos adicionais
- O botão `Criar Personagem` deve ter os mesmos estilos e design que outros botões semelhantes como o botõ `Novo Personagem` da própria tab `Personagens`
- Não desenvolva nada nos detalhes dos personagens nessa task