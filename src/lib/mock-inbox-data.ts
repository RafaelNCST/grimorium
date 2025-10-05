import { useInboxStore } from "@/stores/inbox-store";

export const initializeMockInboxData = () => {
  const { messages, addMessage } = useInboxStore.getState();

  // Only add mock messages if there are no messages (first time)
  if (messages.length === 0) {
    // Mensagem de boas vindas
    addMessage({
      title: "Bem-vindo ao Grimorium! 🎉",
      type: "news",
      content:
        "Olá, escritor(a)! Seja muito bem-vindo(a) ao Grimorium, sua ferramenta completa para criar mundos de fantasia extraordinários. Aqui você encontrará tudo o que precisa para organizar personagens, raças, itens mágicos, sistemas de poder, cronologias e muito mais. Esta caixa de entrada será usada para notificações importantes, atualizações do sistema e dicas úteis. Explore todas as funcionalidades e libere sua criatividade! Bom trabalho e ótimas histórias! ✨",
      date: new Date(2025, 9, 4, 12, 0),
    });

    // Mensagem 1 - Atualização
    addMessage({
      title: "Nova atualização disponível v2.5.0",
      type: "update",
      content:
        "Estamos felizes em anunciar a versão 2.5.0 do Grimorium! Esta atualização inclui melhorias significativas no editor de texto, nova funcionalidade de backup automático e correções de bugs reportados pela comunidade. Confira as notas de versão completas em nosso site.",
      date: new Date(2025, 9, 4, 10, 30),
    });

    // Mensagem 2 - Resposta da equipe
    addMessage({
      title: "Resposta ao seu feedback sobre exportação",
      type: "team_response",
      content:
        "Olá! Agradecemos muito pelo seu feedback sobre a funcionalidade de exportação. Nossa equipe analisou sua sugestão de adicionar suporte para EPUB e estamos felizes em informar que isso está planejado para a próxima versão. Esperamos lançar isso em breve!",
      date: new Date(2025, 9, 3, 15, 45),
    });

    // Mensagem 3 - Pesquisa de dados
    addMessage({
      title: "Pesquisa concluída: Sistemas de magia medievais",
      type: "data_research",
      content:
        "Sua pesquisa sobre 'sistemas de magia em contextos medievais' foi concluída. Encontramos 47 referências relevantes que podem ajudar no desenvolvimento do seu sistema mágico. Os dados incluem sistemas históricos, mitológicos e de fantasia clássica. Acesse a biblioteca de pesquisa para visualizar os resultados completos.",
      date: new Date(2025, 9, 3, 9, 15),
    });

    // Mensagem 4 - Novidades
    addMessage({
      title: "Novo recurso: Gerador de mapas interativos",
      type: "news",
      content:
        "Descubra nosso mais novo recurso! Agora você pode criar mapas interativos para seus mundos de fantasia diretamente no Grimorium. O gerador permite adicionar marcadores personalizados, rotas de viagem, e até mesmo simular mudanças geográficas ao longo da linha do tempo da sua história.",
      date: new Date(2025, 9, 2, 14, 20),
    });

    // Mensagem 5 - Atualização com conteúdo curto
    addMessage({
      title: "Manutenção programada",
      type: "update",
      content:
        "Informamos que haverá uma breve manutenção nos servidores no dia 10/10 às 3h da manhã. Tempo estimado: 30 minutos.",
      date: new Date(2025, 9, 1, 18, 0),
    });

    // Mensagem 6 - Novidades longa
    addMessage({
      title: "Grimorium Community: Junte-se à nossa comunidade de escritores!",
      type: "news",
      content:
        "Estamos empolgados em apresentar o Grimorium Community - um espaço dedicado para escritores de fantasia compartilharem ideias, receberem feedback e colaborarem em projetos criativos. Participe de discussões sobre construção de mundos, desenvolvimento de personagens, sistemas de magia e muito mais. Nossa comunidade já conta com mais de 5.000 escritores ativos de todo o mundo! Acesse através do menu principal e crie seu perfil hoje mesmo. Não perca a chance de conectar-se com outros autores apaixonados por fantasia!",
      date: new Date(2025, 8, 30, 11, 0),
    });

    // Mensagem 7 - Pesquisa de dados
    addMessage({
      title: "Análise de consistência do seu mundo concluída",
      type: "data_research",
      content:
        "A análise automática de consistência encontrou 3 possíveis inconsistências na linha do tempo do seu livro 'Crônicas do Reino Esquecido'. Revise as sugestões na seção de análise.",
      date: new Date(2025, 8, 29, 16, 30),
    });
  }
};
