import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SQLiteErrorType } from '@/lib/db/error-handler';
import { DatabaseErrorModalView } from './view';

interface DatabaseErrorModalProps {
  isOpen: boolean;
  errorType: SQLiteErrorType;
  onClose: () => void;
}

/**
 * Modal de erro do banco de dados
 *
 * Exibe erros críticos do SQLite de forma padronizada:
 * - Disco cheio
 * - Banco corrompido
 * - Banco bloqueado
 * - Erros genéricos
 *
 * Este modal é renderizado globalmente no App.tsx e controlado
 * via useErrorModalStore.
 */
export function DatabaseErrorModal({
  isOpen,
  errorType,
  onClose
}: DatabaseErrorModalProps) {
  const { t } = useTranslation('errors');

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <DatabaseErrorModalView
      isOpen={isOpen}
      errorType={errorType}
      onClose={handleClose}
      t={t}
    />
  );
}
