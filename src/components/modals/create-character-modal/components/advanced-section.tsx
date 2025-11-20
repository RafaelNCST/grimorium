import { useState, type ReactNode } from "react";

import { useTranslation } from "react-i18next";

import { CollapsibleSection } from "@/components/layouts/CollapsibleSection";

interface PropsAdvancedSection {
  children: ReactNode;
}

export function AdvancedSection({ children }: PropsAdvancedSection) {
  const { t } = useTranslation("create-character");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6">
      <CollapsibleSection
        title={t("modal.advanced_items")}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      >
        <div className="space-y-6">{children}</div>
      </CollapsibleSection>
    </div>
  );
}
