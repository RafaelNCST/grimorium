import { useCallback, useMemo, useState } from "react";

import { type IFactionFormData } from "@/types/faction-types";

import { useFactionForm } from "./hooks/use-faction-form";
import { CreateFactionModalView } from "./view";

interface PropsCreateFactionModal {
  open: boolean;
  onClose: () => void;
  onConfirm: (factionData: IFactionFormData) => void;
  bookId: string;
}

export function CreateFactionModal({
  open,
  onClose,
  onConfirm,
  bookId,
}: PropsCreateFactionModal) {
  const form = useFactionForm();
  const { handleSubmit, reset } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const watchedFields = form.watch([
    "name",
    "summary",
    "status",
    "factionType",
  ]);

  const isValid = useMemo(() => {
    const [name, summary, status, factionType] = watchedFields;
    return Boolean(name?.trim() && summary?.trim() && status && factionType);
  }, [watchedFields]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleFormSubmit = useCallback(
    async (data: IFactionFormData) => {
      setIsSubmitting(true);
      try {
        await onConfirm(data);
        reset();
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    },
    [onConfirm, reset, onClose]
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(handleFormSubmit)();
    },
    [handleSubmit, handleFormSubmit]
  );

  return (
    <CreateFactionModalView
      open={open}
      form={form}
      onClose={handleClose}
      onSubmit={onSubmit}
      isValid={isValid}
      isSubmitting={isSubmitting}
      bookId={bookId}
    />
  );
}
