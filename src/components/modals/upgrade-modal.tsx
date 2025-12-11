/**
 * Upgrade Modal
 *
 * Modal para exibir os benefícios e preços do plano Realeza
 */

import { useState } from "react";

import {
  Crown,
  Check,
  BookOpen,
  Edit3,
  Star,
  Zap,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

type PlanType = "monthly" | "annual";

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const { t } = useTranslation("upgrade");
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");

  const benefits = [
    {
      icon: BookOpen,
      titleKey: "benefits.unlimited_books.title",
      descriptionKey: "benefits.unlimited_books.description",
    },
    {
      icon: Edit3,
      titleKey: "benefits.unlimited_chapters.title",
      descriptionKey: "benefits.unlimited_chapters.description",
    },
    {
      icon: Star,
      titleKey: "benefits.priority_support.title",
      descriptionKey: "benefits.priority_support.description",
    },
    {
      icon: Zap,
      titleKey: "benefits.early_access.title",
      descriptionKey: "benefits.early_access.description",
    },
  ];

  const plans = {
    monthly: {
      price: "$10",
      period: t("pricing.per_month"),
      savings: null,
    },
    annual: {
      price: "$100",
      period: t("pricing.per_year"),
      savings: t("pricing.save_20"),
    },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 overflow-hidden max-w-2xl">
        {/* Header com gradiente roxo */}
        <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-violet-800 p-8 pt-12 text-white overflow-hidden">
          {/* Padrões decorativos */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          {/* Conteúdo do header */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              {t("title")}
              <Sparkles className="w-6 h-6" />
            </h2>
            <p className="text-purple-100 text-lg">{t("subtitle")}</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-8 space-y-8">
          {/* Benefícios */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">
              {t("benefits.title")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-3 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">
                        {t(benefit.titleKey)}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {t(benefit.descriptionKey)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seleção de plano */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">
              {t("pricing.title")}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Mensal */}
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left",
                  selectedPlan === "monthly"
                    ? "border-purple-500 bg-purple-500/10 dark:bg-purple-500/20"
                    : "border-border hover:border-purple-300"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{t("pricing.monthly")}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold">
                        {plans.monthly.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {plans.monthly.period}
                      </span>
                    </div>
                  </div>
                  {selectedPlan === "monthly" && (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </button>

              {/* Anual */}
              <button
                onClick={() => setSelectedPlan("annual")}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-left relative",
                  selectedPlan === "annual"
                    ? "border-purple-500 bg-purple-500/10 dark:bg-purple-500/20"
                    : "border-border hover:border-purple-300"
                )}
              >
                {plans.annual.savings && (
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {plans.annual.savings}
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{t("pricing.annual")}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold">
                        {plans.annual.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {plans.annual.period}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("pricing.monthly_equivalent")}
                    </p>
                  </div>
                  {selectedPlan === "annual" && (
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Botão de upgrade */}
            <Button
              variant="magical"
              size="lg"
              className="w-full text-lg h-12"
              onClick={() => {
                // TODO: Implementar processo de pagamento
                console.log("Upgrade to:", selectedPlan);
              }}
            >
              <Crown className="w-5 h-5 mr-2" />
              {t("cta_button")}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {t("footer_note")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
