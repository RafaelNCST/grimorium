import { useCallback, useMemo } from "react";

import { useItemForm } from "./hooks/use-item-form";
import { type ItemFormSchema } from "./hooks/use-item-validation";
import { CreateItemModalView } from "./view";

interface PropsCreateItemModal {
  open: boolean;
  onClose: () => void;
  onConfirm: (itemData: ItemFormSchema) => void;
}

export function CreateItemModal({
  open,
  onClose,
  onConfirm,
}: PropsCreateItemModal) {
  const form = useItemForm();
  const { handleSubmit, reset } = form;

  const watchedFields = form.watch([
    "name",
    "status",
    "category",
    "basicDescription",
    "customCategory",
  ]);

  const isValid = useMemo(() => {
    const [name, status, category, basicDescription, customCategory] =
      watchedFields;

    // If category is "other", we need customCategory to be filled
    if (category === "other") {
      return Boolean(
        name?.trim() &&
          status &&
          customCategory?.trim() &&
          basicDescription?.trim()
      );
    }

    return Boolean(
      name?.trim() && status && category && basicDescription?.trim()
    );
  }, [watchedFields]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleFormSubmit = useCallback(
    (data: ItemFormSchema) => {
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
    <CreateItemModalView
      open={open}
      form={form}
      onClose={handleClose}
      onSubmit={onSubmit}
      isValid={isValid}
    />
  );
}
