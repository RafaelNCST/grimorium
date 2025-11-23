import { useCallback, useMemo, useState } from "react";

import type { IPlotArc, IPlotArcFormData } from "@/types/plot-types";

import { usePlotArcForm } from "./hooks/use-plot-arc-form";
import { CreatePlotArcModalView } from "./view";

interface PropsCreatePlotArcModal {
  open: boolean;
  onClose: () => void;
  onConfirm: (arcData: IPlotArcFormData) => void;
  bookId: string;
  existingArcs: IPlotArc[];
}

export function CreatePlotArcModal({
  open,
  onClose,
  onConfirm,
  bookId,
  existingArcs,
}: PropsCreatePlotArcModal) {
  const form = usePlotArcForm();
  const { handleSubmit, reset } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const watchedFields = form.watch([
    "name",
    "description",
    "status",
    "size",
    "focus",
    "events",
  ]);

  const hasCurrentArc = useMemo(
    () => existingArcs.some((arc) => arc.status === "atual"),
    [existingArcs]
  );

  const isValid = useMemo(() => {
    const [name, description, status, size, focus, events] = watchedFields;
    return Boolean(
      name?.trim() &&
        description?.trim() &&
        status &&
        size &&
        focus?.trim() &&
        events?.length > 0
    );
  }, [watchedFields]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleFormSubmit = useCallback(
    async (data: IPlotArcFormData) => {
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
    <CreatePlotArcModalView
      open={open}
      form={form}
      onClose={handleClose}
      onSubmit={onSubmit}
      isValid={isValid}
      isSubmitting={isSubmitting}
      bookId={bookId}
      hasCurrentArc={hasCurrentArc}
    />
  );
}
