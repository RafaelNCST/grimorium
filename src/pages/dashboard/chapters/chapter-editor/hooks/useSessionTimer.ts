/**
 * Hook para rastrear tempo da sessão de escrita
 * Timer é GLOBAL para toda a sessão no editor (não reseta ao trocar de capítulo)
 */

import { useState, useEffect, useRef } from "react";

/**
 * Rastreia o tempo de sessão em minutos
 * @returns tempo em minutos desde que o editor foi aberto e ID único da sessão
 */
export function useSessionTimer() {
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const startTimeRef = useRef<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout>();

  // ID único da sessão (gerado uma vez na montagem do hook)
  // Usado para armazenar avisos de tempo globalmente (não por capítulo)
  const sessionIdRef = useRef<string>(`session-${Date.now()}`);

  useEffect(() => {
    // Atualiza a cada 30 segundos (para não sobrecarregar)
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - startTimeRef.current.getTime();
      const diffMinutes = Math.floor(diffMs / 1000 / 60);
      setSessionMinutes(diffMinutes);
    }, 30000); // 30 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  /**
   * Reseta o timer da sessão
   */
  const resetSession = () => {
    startTimeRef.current = new Date();
    setSessionMinutes(0);
  };

  return {
    sessionMinutes,
    sessionId: sessionIdRef.current,
    resetSession,
  };
}
