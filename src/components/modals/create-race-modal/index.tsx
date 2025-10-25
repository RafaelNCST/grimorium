import { useCallback, useMemo } from "react";

import { useRaceForm } from "./hooks/use-race-form";
import { type RaceFormSchema } from "./hooks/use-race-validation";
import { CreateRaceModalView } from "./view";

interface PropsCreateRaceModal {
  open: boolean;
  onClose: () => void;
  onConfirm: (raceData: RaceFormSchema) => void;
  availableRaces?: Array<{ id: string; name: string }>;
}

export function CreateRaceModal({
  open,
  onClose,
  onConfirm,
  availableRaces = [],
}: PropsCreateRaceModal) {
  const form = useRaceForm();
  const { handleSubmit, reset } = form;

  const watchedFields = form.watch([
    "name",
    "domain",
    "summary",
    "diet",
    "elementalDiet",
  ]);

  const isValid = useMemo(() => {
    const [name, domain, summary, diet, elementalDiet] = watchedFields;

    // Basic required fields validation
    const basicValid = Boolean(name?.trim() && domain && summary?.trim());

    // If diet is elemental, elementalDiet is required
    if (diet === "elemental") {
      return basicValid && Boolean(elementalDiet?.trim());
    }

    return basicValid;
  }, [watchedFields]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleFormSubmit = useCallback(
    (data: RaceFormSchema) => {
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
    <CreateRaceModalView
      open={open}
      form={form}
      onClose={handleClose}
      onSubmit={onSubmit}
      isValid={isValid}
      availableRaces={availableRaces}
    />
  );
}
