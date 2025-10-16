
# Task: Refatorar modal de criação de itens na tab itens

# Local
- `src\components\modals\create-item-modal.tsx`

# Problema
> O modal de criação de itens não está do jeito que quero, precisamos refatorar e refaze-lo para ficar da forma que eu desejo

# Solução
> Ainda será um modal da mesma forma que atual, mas com novos campos e nova estrutura
- Será divididos em duas grandes seções: 

## Campos Básicos
- Imagem (Não obrigatória): Deve ocupar a width toda do topo, com uma altura consideravel, permitindo colocar imagens que demonstrem o corpo todo do item. Deve estar pronta para ter uma imagem default para casos onde a imagem não é passada
- Nome (Obrigatório): Deve ocupar a width inteira e ter uma linha só pra ela no modal, nela estará o nome do item em um input de texto com máximo de 150 caracteres
- Status (Obrigatório): Aqui é onde terá o status atual da arma sendo eles completa, incompleta, destruida, selada, enfraquecida, fortalecida, Ápice. Deve ser um pick com ícone e nome podendo escolher um entre todos, esse escolhido ficará ativado até que escolha outro. Todos os picks devem ter hover. Todas as opções devem ter ícones e cores diferentes combinando com o seu nome
- Categoria: Aqui mostra o tipo de item podendo ser arma, armadura, acessório, relíquia, consumível, recurso, artefato, outro. Esse cara vai ser um dropdown, mas quando a opção outro é escolhida ele vira um input com 50 caracteres no máximo permitido, deve ter uma forma de voltar pra dropdown caso volte a escolher alguma categoria já feita. Lembre-se que qualquer categoria colocada como outro deve ser salvo não só que ela é outro como também qual é esse outro, para que em filtros futuros possamos saber quais são outros.
- Descrição básica: Uma simples descrição do item. Formato de input grande com 500 caracteres permitidos no máximo

## Campos avançados
- Aparência: Input grande de 500 caracteres máximos, usuário irá descrever a aparência do item
- Origem: Input grande de 500 caracteres máximos, usuário irá descrever a origem do item
- Nomes alternativos: Um input de texto de linha única com 100 caracteres máximos, nele o usuário poderá colocar nomes alternativos, cada nome que ele bota e aperta em um botão "adicionar" cria uma tag com o nome e adiciona como nome alternativo. É possível apenas excluir uma tag e adicionar uma tag.
- Raridade na história: É separado em comum, incomum, raro, lendário, único. Coloque em forma de pick one, com ícone e o nome da raridade, cada ícone deve ser diferente e cada raridade deve ter uma cor de diferente, onde a cor vai se fortalecendo até ficar dourada na raridade única, coloque um texto explicativo em cima desse campo, explicando que essa raridade é o quão raro é o item na sua história, estimando com base nas raridades proporcionadas.
- Proposito narrativo: Usado para que o usuário possa sempre se lembrar do motivo da existência do item caso seja algo mais profundo. Input grande de 500 caracteres no máximo.
- Requisitos de uso: Caso precise de algum requisito para usar o item, colocar aqui. Input médio de 250 caracteres máximos
- Consequências ou custo de uso: Caso haja consequencias para usar o item, colocar aqui. Input médio de 250 caracteres máximos

# Objetivo
> Ter um modal para criar itens organizado e estruturado, pronto para as próximas etapas na tab personagens

# Pontos adicionais
- O objetivo é apenas criar o modal, sua lógica, design e estrutura, não crie nada além disso
- Use i18n para textos e não esqueça as traduções para pt e en.
- Use o modal `C:\Users\rafae\Desktop\dev\grimorium\src\components\modals\create-character-modal` como base, ele é o único dos modais de criação que está finalizado e você pode usar de base para design e estrutura do modal, botões e etc, padronizando os modais com o mesmo formato