/**
 * Hook para rastrear tempo da sessão de escrita
 */

import { useState, useEffect, useRef } from "react";

/**
 * Rastreia o tempo de sessão em minutos
 * @returns tempo em minutos desde que o editor foi aberto
 */
export function useSessionTimer() {
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const startTimeRef = useRef<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout>();

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
    resetSession,
  };
}
