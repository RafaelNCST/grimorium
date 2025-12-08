/**
 * Account Section
 *
 * Gerenciamento de perfil, assinatura, pagamento e autenticação
 */

import {
  Crown,
  CreditCard,
  LogOut,
  Mail,
  Calendar,
  Check,
  Camera,
  X,
  User,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/language-store";
import { useUserAccountStore } from "@/stores/user-account-store";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AccountSection() {
  const { t } = useTranslation("advanced-settings");
  const { user, logout, updateDisplayName, updateAvatar } = useUserAccountStore();
  const { language, setLanguage } = useLanguageStore();
  const [displayName, setDisplayName] = useState(user?.displayName || "");

  if (!user) return null;

  const hasNameChanged = displayName !== user.displayName && displayName.trim() !== "";

  const isPremium = user.subscription.tier === "realeza";
  const isActive = user.subscription.status === "active";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "pt" ? "pt-BR" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const handleSaveName = () => {
    if (displayName.trim() && hasNameChanged) {
      updateDisplayName(displayName.trim());
    }
  };

  const handleAvatarClick = () => {
    // Abrir seletor de arquivo imediatamente
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: Implementar upload real do arquivo com Tauri
        // Por enquanto, criando uma URL temporária
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          updateAvatar(url);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateAvatar("");
  };

  return (
    <div className="space-y-8 w-full max-w-full">
      {/* Profile Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("account.profile.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("account.profile.description")}
          </p>
        </div>

        <div className="space-y-4">
          {/* Avatar with Name and Email */}
          <div className="flex items-center gap-4">
            <div className="relative group flex-shrink-0">
              <div
                className="relative cursor-pointer"
                onClick={handleAvatarClick}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-20 h-20 rounded-full object-cover transition-opacity group-hover:opacity-50"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/[0.15] flex items-center justify-center transition-opacity group-hover:opacity-50 select-none">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                )}
                {isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1.5 transition-opacity group-hover:opacity-50 z-10">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Botão X para remover foto - aparece embaixo do avatar quando tem foto */}
              {user.avatarUrl && (
                <div className="absolute top-[84px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 rounded-full shadow-lg"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              {/* Display Name */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t("account.profile.display_name")}
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1"
                    maxLength={50}
                  />
                  <Button
                    variant="magical"
                    size="sm"
                    onClick={handleSaveName}
                    disabled={!hasNameChanged}
                  >
                    {t("user_profile.save")}
                  </Button>
                </div>
              </div>

              {/* Email */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t("account.profile.email")}
                </Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50 border text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t("account.profile.password")}
            </Label>
            <Button variant="secondary" size="sm" className="w-full">
              {t("account.profile.change_password")}
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Subscription Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("account.subscription.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("account.subscription.description")}
          </p>
        </div>

        <div
          className={cn(
            "border rounded-lg p-4",
            isPremium
              ? "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800"
              : "bg-muted/50"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                {isPremium && <Crown className="w-5 h-5 text-amber-600" />}
                <h4 className="font-bold text-lg">
                  {isPremium ? t("account.subscription.tier_premium") : t("account.subscription.tier_free")}
                </h4>
                {isActive && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                    <Check className="w-3 h-3" />
                    {t("account.subscription.status_active")}
                  </span>
                )}
              </div>

              {isPremium && user.subscription.renewalDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t("account.subscription.renewal_date")}:{" "}
                    {formatDate(user.subscription.renewalDate)}
                  </span>
                </div>
              )}

              {!isPremium && (
                <p className="text-sm text-muted-foreground">
                  {t("account.subscription.free_description")}
                </p>
              )}
            </div>

            {!isPremium && (
              <Button variant="magical" size="sm" className="ml-4">
                <Crown className="w-4 h-4 mr-2" />
                {t("account.subscription.upgrade_button")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Info (only for premium) */}
      {isPremium && user.subscription.paymentInfo && (
        <>
          <Separator />
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                {t("account.payment.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("account.payment.description")}
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("account.payment.method")}
                  </span>
                  <span className="text-sm font-medium">
                    {user.subscription.paymentInfo.method === "credit_card"
                      ? t("account.payment.method_credit_card")
                      : user.subscription.paymentInfo.method === "pix"
                        ? t("account.payment.method_pix")
                        : t("account.payment.method_paypal")}
                  </span>
                </div>

                {user.subscription.paymentInfo.lastFourDigits && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("account.payment.card_number")}
                    </span>
                    <span className="text-sm font-medium font-mono">
                      •••• {user.subscription.paymentInfo.lastFourDigits}
                    </span>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-3">
                {t("account.payment.manage_button")}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Language */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("account.language.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("account.language.description")}
          </p>
        </div>

        <div className="max-w-xs">
          <Label className="text-sm font-medium mb-2 block">
            {t("account.language.select_label")}
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
      </div>

      {/* Logout */}
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            {t("account.auth.title")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("account.auth.description")}
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
          <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              {user.authProvider === "google"
                ? t("account.auth.provider_google")
                : t("account.auth.provider_email")}
            </p>
          </div>
        </div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            if (
              window.confirm(t("account.auth.logout_confirm"))
            ) {
              logout();
              // TODO: Redirect to login page
            }
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t("account.auth.logout_button")}
        </Button>
      </div>
    </div>
  );
}
