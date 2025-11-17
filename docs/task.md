# O que vamos fazer
> Terminar de refatorar a tab detalhes de personagem

# Como?
> Para isso, iremos fazer os seguintes ajustes, faça uma checklist e implemente cada um em ordem:

1. **Sessão especial relacionamentos**
- Adicionar a ocultação
- Ao editar, verificar quais botões tem a variant antiga "outline" e trocar para "secondary"
- No modal de escolher personagem que abre ao clicar em criar relacionamento, mude todo o hover e active para o hover igual aos cards de versão
- Nos cards de tipo de relacionamento no modal de escolher o tipo, mude todo o hover e active para o hover igual aos cards de versão
- Mudar texto do tipo de relacionamento de "Estudante" para "Aprendiz"
- Adicione 7 novos tipos de relacionamento: "Subordinado", "Amor Familiar", "Relacionamento Amoroso", "Melhor Amigo", "ódio", "Neutro", "Devoção"
- Troque esse grid antigo de relacionamentos pelo novo FormSimpleGrid colocando cores iguais para cada relacionamento (Lembre-se de seguir o padrão de hover/active)
- Faça com que o grid tenha 4 cards por fileira
- Permita adicionar em cada relacionamento uma pequena descrição de no máx 200 linhas que ficará disponível para visualizar depois na visualização, use o textArea grande nele, veja mais em `C:\Users\rafae\Desktop\dev\grimorium\docs\build\forms.md`

2. **Sessão especial Relações familiares**
- Mude o nome da sessão de "Relações familiares" para "Familia"
- Adicionar a ocultação
- Mude **TODOS** os dropdowns e substitua eles pelo FormEntityMultiSelectAuto e deixe todos cobrindo apenas uma linha mesmo.
- Remova Família Extendida
- Remova apenas o texto "Família Direta" e deixe agora o seu conteúdo sem esse título
- Reestruture **TODOS** os campos da seguinte forma em ordem: Avós, Pais, Conjuges, tios, primos, filhos, irmãos, meio-irmãos
- O modo visualização, mostrará a família com os componentes seguindo o padrão de FormEntityMultiSelectAuto para o seu modo visualização visto em `C:\Users\rafae\Desktop\dev\grimorium\docs\build\create-tab.md`
- A feature árvore genealogica, ainda deve se manter, criando fileiras de acordo com a ordem de pais, conjuges e etc, sempre mantendo o personagem atual como centro.