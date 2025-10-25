import { useCallback, useMemo } from "react";

import { type IFactionFormData } from "@/types/faction-types";

import { useFactionForm } from "./hooks/use-faction-form";
import { CreateFactionModalView } from "./view";

interface PropsCreateFactionModal {
  open: boolean;
  onClose: () => void;
  onConfirm: (factionData: IFactionFormData) => void;
  races?: Array<{ id: string; name: string }>;
  characters?: Array<{ id: string; name: string }>;
}

export function CreateFactionModal({
  open,
  onClose,
  onConfirm,
  races = [],
  characters = [],
}: PropsCreateFactionModal) {
  const form = useFactionForm();
  const { handleSubmit, reset } = form;

  const hasRaces = useMemo(() => races.length > 0, [races]);
  const hasCharacters = useMemo(() => characters.length > 0, [characters]);

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
    (data: IFactionFormData) => {
      onConfirm(data);
      reset();
      onClose();
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
      hasRaces={hasRaces}
      hasCharacters={hasCharacters}
      races={races}
      characters={characters}
    />
  );
}
