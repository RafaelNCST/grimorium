import { Textarea } from "@/components/ui/textarea";

interface PropsRaceSection {
  title: string;
  content?: string;
  isEditing: boolean;
  editValue: string;
  fieldName: string;
  placeholder: string;
  minHeight?: string;
  onEditFormChange: (field: string, value: string) => void;
}

export function RaceSection({
  title,
  content,
  isEditing,
  editValue,
  fieldName,
  placeholder,
  minHeight = "min-h-[80px]",
  onEditFormChange,
}: PropsRaceSection) {
  if (!content && !isEditing) return null;

  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      {isEditing ? (
        <Textarea
          value={editValue}
          onChange={(e) => onEditFormChange(fieldName, e.target.value)}
          placeholder={placeholder}
          className={minHeight}
        />
      ) : (
        <p className="text-muted-foreground leading-relaxed">{content}</p>
      )}
    </div>
  );
}
