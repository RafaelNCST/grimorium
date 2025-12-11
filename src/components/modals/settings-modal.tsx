import { Settings, Globe, Shield, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLanguageStore } from "@/stores/language-store";

interface PropsSettingsModal {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: PropsSettingsModal) {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation("settings");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Language Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t("language")}
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="bottom">
                <SelectItem value="pt">🇧🇷 Português</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">
              {t("legal")}
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => {
                  // TODO: Implement privacy policy
                }}
              >
                <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium">{t("privacy_policy")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("privacy_policy_description")}
                  </div>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => {
                  // TODO: Implement terms of use
                }}
              >
                <FileText className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium">{t("terms_of_use")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("terms_of_use_description")}
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* App Info */}
          <Separator />
          <div className="text-center text-xs text-muted-foreground">
            <p>{t("app_version")}</p>
            <p className="mt-1">{t("app_tagline")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
