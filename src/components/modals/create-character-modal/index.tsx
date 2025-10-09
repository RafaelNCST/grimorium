import { useCallback, useMemo } from "react";
import { type ICharacterFormData } from "@/types/character-types";
import { useCharacterForm } from "./hooks/use-character-form";
import { CreateCharacterModalView } from "./view";

interface PropsCreateCharacterModal {
  open: boolean;
  onClose: () => void;
  onConfirm: (characterData: ICharacterFormData) => void;
  species?: Array<{ id: string; name: string }>;
  locations?: Array<{ id: string; name: string }>;
  organizations?: Array<{ id: string; name: string }>;
}

export function CreateCharacterModal({
  open,
  onClose,
  onConfirm,
  species = [],
  locations = [],
  organizations = [],
}: PropsCreateCharacterModal) {
  const form = useCharacterForm();
  const { handleSubmit, formState, reset } = form;

  const hasSpecies = useMemo(() => species.length > 0, [species]);
  const hasLocations = useMemo(() => locations.length > 0, [locations]);
  const hasOrganizations = useMemo(() => organizations.length > 0, [organizations]);

  const watchedFields = form.watch(["name", "role", "age", "gender", "description"]);

  const isValid = useMemo(() => {
    const [name, role, age, gender, description] = watchedFields;
    return Boolean(
      name?.trim() &&
      role &&
      age?.trim() &&
      gender &&
      description?.trim()
    );
  }, [watchedFields]);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleFormSubmit = useCallback(
    (data: ICharacterFormData) => {
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
    <CreateCharacterModalView
      open={open}
      form={form}
      onClose={handleClose}
      onSubmit={onSubmit}
      isValid={isValid}
      hasSpecies={hasSpecies}
      hasLocations={hasLocations}
      hasOrganizations={hasOrganizations}
      species={species}
      locations={locations}
      organizations={organizations}
    />
  );
}
