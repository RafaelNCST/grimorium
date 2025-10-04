import { Settings, Moon, Sun, Globe, Shield, FileText } from "lucide-react";

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
import { useThemeStore } from "@/stores/theme-store";

interface PropsSettingsModal {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: PropsSettingsModal) {
  const { language, setLanguage, t } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            {t("settings.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              {t("settings.theme")}
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="bottom">
                <SelectItem value="dark" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    {t("settings.dark_mode")}
                  </div>
                </SelectItem>
                <SelectItem value="light" className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    {t("settings.light_mode")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t("settings.language")}
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
            <h3 className="font-medium text-sm text-muted-foreground">Legal</h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => {
                  // TODO: Implement privacy policy
                  console.log("Privacy Policy");
                }}
              >
                <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {t("settings.privacy_policy")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Como seus dados são tratados
                  </div>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => {
                  // TODO: Implement terms of use
                  console.log("Terms of Use");
                }}
              >
                <FileText className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {t("settings.terms_of_use")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Termos e condições de uso
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* App Info */}
          <Separator />
          <div className="text-center text-xs text-muted-foreground">
            <p>Grimorium v1.0.0</p>
            <p className="mt-1">Feito com ✨ para escritores de fantasia</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
