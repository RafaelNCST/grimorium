import { useCallback, useMemo, useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    async (data: RaceFormSchema) => {
      setIsSubmitting(true);
      try {
        onConfirm(data);
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
    <CreateRaceModalView
      open={open}
      form={form}
      onClose={handleClose}
      onSubmit={onSubmit}
      isValid={isValid}
      isSubmitting={isSubmitting}
      availableRaces={availableRaces}
    />
  );
}
