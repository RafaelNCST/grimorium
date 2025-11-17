import { useTranslation } from "react-i18next";

import { CHARACTER_ROLES_CONSTANT } from "../constants/character-roles";

interface PropsRolePicker {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RolePicker({ value, onChange, error }: PropsRolePicker) {
  const { t } = useTranslation("create-character");

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {t("modal.character_role")}
        <span className="text-destructive ml-1">*</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {CHARACTER_ROLES_CONSTANT.map((role) => {
          const Icon = role.icon;
          const isSelected = value === role.value;
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onChange(role.value)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${role.bgColorClass} border-2 scale-105 shadow-lg`
                  : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
              }`}
            >
              <Icon
                className={`w-8 h-8 ${isSelected ? role.colorClass : "text-muted-foreground"}`}
              />
              <span
                className={`text-xs font-medium ${isSelected ? role.colorClass : "text-muted-foreground"}`}
              >
                {t(role.translationKey)}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}
