# O que vamos fazer?
> Vamos adicionar campos avançados para cada região, ela seguirá o padrão de campos avançados vistos na tab `Personagens`, adicionando tanto ao modal quanto nos detalhes

## Novos campos

**Ambiente**
- Clima: Input simples de uma linha com limite de 200 caracteres
- Estação atual: Picker com icone e texto contendo as 4 estações em suas respectivas cores para hover e active mais uma quarta na proxima linha chamada "Outra" que permite adicionar uma estação personalizada
- Descrição geral: Input grande com 1000 caracteres, permitindo descrever flora, flauna e qualquer coisa na região no geral
- Anomálias da região: Input que ao escrever, permitie adicionar a uma lista cada inspiração, o input tem 2 linhas e não tem limite de caracteres, podendo o usuário escolher o quanto quer escrever e adicionar em cada parte da linha. Cada item da lista pode ser por exemplo, gravidade aumentada, rios que correm ao contrário, mana mais forte no local etc

**Informações**
> Todos serão Dropdown múltiplo que cria tags com foto e nome a cada opção escolhido
- Facção(s) residente(s): seus dados são as fações cadastradas no app
- Facçõe(s) dominante(s): seus dados são as fações cadastradas no app
- Personagens importantes no local: seus dados são as fações cadastradas no app
- Raças encontradas: seus dados são as raças cadastradas no app
- Itens encontrados: seus dados são os itens cadastradas no app

**Narrativa**
- Proposito narrativo: Input grande com 500 linhas máximas
- Características únicas do local: Input grande com 500 linhas máximas (Sons, cheiros, sensações que ajudem o autor a escrever narrativas interessantes pra obra)
- Importância política: Input grande com 500 linhas máximas
- Importância religiosa: Input grande com 500 linhas máximas
- Como é visto pelo resto do mundo: Input grande com 500 linhas máximas
- Inspirações: Input que ao escrever, permitie adicionar a uma lista cada inspiração, o input tem 2 linhas e não tem limite de caracteres, podendo o usuário escolher o quanto quer escrever e adicionar em cada parte da linha

## Importante lembrar
- Lembre-se de conferir se está usando i18n corretamente configurado para as linguagens do app, e se tudo está importado da maneira correta
- Não fazer placeholders explicando, e sim faça um placeholder imaginando que está cadastrando uma região (Evite colocar "ex:" so coloque o exemplo direito)
