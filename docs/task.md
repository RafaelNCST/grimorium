# O que vamos fazer
> Terminar de refatorar a tab detalhes de personagem

# Como?
> Para isso, iremos fazer os seguintes ajustes, faça uma checklist e implemente cada um em ordem:

**Sessão especial Relações familiares**
- Mude o nome da sessão de "Relações familiares" para "Familia"
- Adicionar a ocultação da sessão no modo edição com `FieldWithVisibilityToggle` para esconder da visualização
- Remova Família Extendida e seu conteudo
- Remova apenas o texto "Família Direta" e deixe agora o seu conteúdo sem esse título
- Reestruture **TODOS** os campos da seguinte forma em ordem: Avós, Pais, Conjuges, tios, primos, filhos, irmãos, meio-irmãos
- Mude **TODOS** os dropdowns e substitua eles pelo FormEntityMultiSelectAuto e deixe todos cobrindo apenas uma linha mesmo.
- O modo visualização, mostrará a família com os componentes seguindo o padrão de FormEntityMultiSelectAuto para o seu modo visualização visto em `C:\Users\rafae\Desktop\dev\grimorium\docs\build\create-tab.md`
- A feature árvore genealogica, ainda deve se manter, criando fileiras de acordo com a ordem de pais, conjuges e etc, sempre mantendo o personagem atual como centro.