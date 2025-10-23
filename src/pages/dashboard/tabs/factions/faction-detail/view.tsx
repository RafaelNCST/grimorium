import React from "react";

import {
  ArrowLeft,
  Edit2,
  Trash2,
  Menu,
  Eye,
  EyeOff,
  Upload,
  Shield,
  Info,
  Building2,
  Users,
  Heart,
  Clock,
  Zap,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { FactionNavigationSidebar } from "@/components/faction-navigation-sidebar";
import { FACTION_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-status";
import { FACTION_TYPES_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-types";
import { FACTION_INFLUENCE_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-influence";
import { FACTION_REPUTATION_CONSTANT } from "@/components/modals/create-faction-modal/constants/faction-reputation";
import { StatusPicker } from "@/components/modals/create-faction-modal/components/status-picker";
import { FactionTypePicker } from "@/components/modals/create-faction-modal/components/faction-type-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  type IFactionVersion,
  type IFactionFormData,
  type IFaction,
  type FactionStatus,
  type FactionType,
  type FactionInfluence,
  type FactionReputation,
  type ITimelineEvent,
} from "@/types/faction-types";

import { AlignmentMatrix } from "./components/alignment-matrix";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";
import { VersionManager } from "./components/version-manager";

interface IFieldVisibility {
  [key: string]: boolean;
}

interface FactionDetailViewProps {
  faction: IFaction;
  editData: IFaction;
  isEditing: boolean;
  versions: IFactionVersion[];
  currentVersion: IFactionVersion | null;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  mockCharacters: Array<{ id: string; name: string }>;
  mockRaces: Array<{ id: string; name: string }>;
  mockFactions: Array<{ id: string; name: string; image?: string }>;
  statuses: typeof FACTION_STATUS_CONSTANT;
  types: typeof FACTION_TYPES_CONSTANT;
  influences: typeof FACTION_INFLUENCE_CONSTANT;
  reputations: typeof FACTION_REPUTATION_CONSTANT;
  currentStatus: typeof FACTION_STATUS_CONSTANT[0] | undefined;
  currentType: typeof FACTION_TYPES_CONSTANT[0] | undefined;
  currentInfluence: typeof FACTION_INFLUENCE_CONSTANT[0] | undefined;
  currentReputation: typeof FACTION_REPUTATION_CONSTANT[0] | undefined;
  StatusIcon: LucideIcon;
  TypeIcon: LucideIcon;
  fieldVisibility: IFieldVisibility;
  advancedSectionOpen: boolean;
  onBack: () => void;
  onNavigationSidebarToggle: () => void;
  onNavigationSidebarClose: () => void;
  onFactionSelect: (factionId: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onConfirmDelete: () => void;
  onVersionChange: (versionId: string | null) => void;
  onVersionCreate: (versionData: {
    name: string;
    description: string;
    factionData: IFactionFormData;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (
    versionId: string,
    name: string,
    description?: string
  ) => void;
  onImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: unknown) => void;
  onFieldVisibilityToggle: (field: string) => void;
  onAdvancedSectionToggle: () => void;
}

// Helper component for field wrapper with visibility toggle
const FieldWrapper = ({
  fieldName,
  label,
  children,
  isOptional = true,
  fieldVisibility,
  isEditing,
  onFieldVisibilityToggle,
  t: _t,
}: {
  fieldName: string;
  label: string;
  children: React.ReactNode;
  isOptional?: boolean;
  fieldVisibility: IFieldVisibility;
  isEditing: boolean;
  onFieldVisibilityToggle: (field: string) => void;
  t: (_key: string) => string;
}) => {
  const isVisible = fieldVisibility[fieldName] !== false;

  return (
    <div
      className={`space-y-2 transition-all duration-200 ${
        !isVisible && !isEditing
          ? "hidden"
          : !isVisible && isEditing
            ? "opacity-50 bg-muted/30 p-3 rounded-lg border border-dashed border-muted-foreground/30"
            : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} {!isOptional && "*"}
        </Label>
        {isEditing && isOptional && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onFieldVisibilityToggle(fieldName)}
            className="h-6 w-6 p-0"
          >
            {isVisible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};

// Helper component for empty state
const EmptyFieldState = ({
  hint,
  t,
}: {
  hint?: string;
  t: (key: string) => string;
}) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("faction-detail:empty_states.no_data")}</p>
    {hint && (
      <p className="text-xs mt-1">
        {hint || t("faction-detail:empty_states.no_data_hint")}
      </p>
    )}
  </div>
);

export function FactionDetailView({
  faction,
  editData,
  isEditing,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  fileInputRef,
  mockCharacters,
  mockRaces,
  mockFactions,
  statuses,
  types,
  influences,
  reputations,
  currentStatus,
  currentType,
  currentInfluence,
  currentReputation,
  StatusIcon,
  TypeIcon,
  fieldVisibility,
  advancedSectionOpen,
  onBack,
  onNavigationSidebarToggle,
  onNavigationSidebarClose,
  onFactionSelect,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onConfirmDelete,
  onVersionChange,
  onVersionCreate,
  onVersionDelete,
  onVersionUpdate: _onVersionUpdate,
  onImageFileChange,
  onEditDataChange,
  onFieldVisibilityToggle,
  onAdvancedSectionToggle,
}: FactionDetailViewProps) {
  const { t } = useTranslation(["faction-detail", "create-faction"] as any);

  return (
    <div className="relative min-h-screen">
      <FactionNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={onNavigationSidebarClose}
        factions={mockFactions.map((faction) => ({
          id: faction.id,
          name: faction.name,
          image: faction.image,
        }))}
        currentFactionId={faction.id}
        onFactionSelect={onFactionSelect}
      />

      <div className="w-full overflow-hidden">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!isEditing && (
                  <>
                    <Button variant="ghost" onClick={onBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t("faction-detail:header.back")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onNavigationSidebarToggle}
                      className="hover:bg-muted"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={onCancel}>
                      {t("faction-detail:header.cancel")}
                    </Button>
                    <Button
                      variant="magical"
                      className="animate-glow"
                      onClick={onSave}
                    >
                      {t("faction-detail:header.save")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="icon" onClick={onEdit}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={onDeleteModalOpen}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content - 3 columns */}
            <div
              className={`${isEditing ? "lg:col-span-4" : "lg:col-span-3"} space-y-6`}
            >
              {/* Basic Information Card */}
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>
                    {t("faction-detail:sections.basic_info")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="flex gap-6">
                        {/* Faction Image Upload */}
                        <div className="space-y-2">
                          <Label>{t("faction-detail:fields.image")}</Label>
                          <div
                            className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                          >
                            {imagePreview ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <Upload className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-1" />
                                <p className="text-xs text-muted-foreground">
                                  {t("faction-detail:upload.click")}
                                </p>
                              </div>
                            )}
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onImageFileChange}
                            className="hidden"
                          />
                        </div>

                        {/* Name */}
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium">
                            {t("faction-detail:fields.name")} *
                          </Label>
                          <Input
                            id="name"
                            value={editData.name}
                            onChange={(e) =>
                              onEditDataChange("name", e.target.value)
                            }
                            placeholder={t(
                              "create-faction:modal.name_placeholder"
                            )}
                            maxLength={200}
                            required
                          />
                          <div className="flex justify-end text-xs text-muted-foreground">
                            <span>{editData.name?.length || 0}/200</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Picker */}
                      <StatusPicker
                        value={editData.status || ""}
                        onChange={(value) => onEditDataChange("status", value)}
                      />

                      {/* Faction Type Picker */}
                      <FactionTypePicker
                        value={editData.factionType || ""}
                        onChange={(value) => onEditDataChange("factionType", value)}
                      />

                      {/* Summary */}
                      <div className="space-y-2">
                        <Label htmlFor="summary" className="text-sm font-medium">
                          {t("faction-detail:fields.summary")} *
                        </Label>
                        <Textarea
                          id="summary"
                          value={editData.summary}
                          onChange={(e) =>
                            onEditDataChange("summary", e.target.value)
                          }
                          placeholder={t(
                            "create-faction:modal.summary_placeholder"
                          )}
                          rows={8}
                          maxLength={500}
                          className="resize-none"
                          required
                        />
                        <div className="flex justify-end text-xs text-muted-foreground">
                          <span>{editData.summary?.length || 0}/500</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start gap-6">
                        <Avatar className="w-24 h-24 rounded-lg">
                          <AvatarImage
                            src={faction.image}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-xl rounded-lg">
                            <Shield className="w-12 h-12" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h2 className="text-3xl font-bold mb-3">
                            {faction.name}
                          </h2>

                          {/* Status and Type badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {currentStatus && StatusIcon && (
                              <Badge
                                className={`flex items-center gap-1.5 ${currentStatus.bgColorClass} ${currentStatus.colorClass} border px-2 py-1 pointer-events-none`}
                              >
                                <StatusIcon className="w-3.5 h-3.5" />
                                <span className="text-xs">
                                  {t(`create-faction:status.${faction.status}`)}
                                </span>
                              </Badge>
                            )}
                            {currentType && TypeIcon && (
                              <Badge
                                className={`flex items-center gap-1.5 ${currentType.bgColorClass} ${currentType.colorClass} border px-2 py-1 pointer-events-none`}
                              >
                                <TypeIcon className="w-3.5 h-3.5" />
                                <span className="text-xs">
                                  {t(`create-faction:faction_type.${faction.factionType}`)}
                                </span>
                              </Badge>
                            )}
                          </div>

                          <p className="text-foreground text-base">
                            {faction.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Advanced Section - Collapsible */}
              <Collapsible
                open={advancedSectionOpen}
                onOpenChange={onAdvancedSectionToggle}
              >
                <Card className="card-magical">
                  <CardHeader>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer">
                        <CardTitle>
                          {t("faction-detail:sections.advanced_info")}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          {advancedSectionOpen
                            ? t("faction-detail:actions.close")
                            : t("faction-detail:actions.open")}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      {/* Internal Structure Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          {t("faction-detail:sections.internal_structure")}
                        </h4>

                        {/* Government Form - Full width */}
                        <FieldWrapper
                          fieldName="governmentForm"
                          label={t("faction-detail:fields.government_form")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.governmentForm || ""}
                                onChange={(e) =>
                                  onEditDataChange("governmentForm", e.target.value)
                                }
                                placeholder={t(
                                  "create-faction:modal.government_form_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.governmentForm?.length || 0}/500</span>
                              </div>
                            </>
                          ) : faction.governmentForm ? (
                            <p className="text-sm whitespace-pre-wrap">{faction.governmentForm}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Economy - Full width */}
                        <FieldWrapper
                          fieldName="economy"
                          label={t("faction-detail:fields.economy")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.economy || ""}
                                onChange={(e) =>
                                  onEditDataChange("economy", e.target.value)
                                }
                                placeholder={t(
                                  "create-faction:modal.economy_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.economy?.length || 0}/500</span>
                              </div>
                            </>
                          ) : faction.economy ? (
                            <p className="text-sm whitespace-pre-wrap">{faction.economy}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Symbols and Secrets - Full width */}
                        <FieldWrapper
                          fieldName="symbolsAndSecrets"
                          label={t("faction-detail:fields.symbols_and_secrets")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.symbolsAndSecrets || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "symbolsAndSecrets",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "create-faction:modal.symbols_and_secrets_placeholder"
                                )}
                                rows={6}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.symbolsAndSecrets?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : faction.symbolsAndSecrets ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {faction.symbolsAndSecrets}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* Culture Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          {t("faction-detail:sections.culture")}
                        </h4>

                        {/* Faction Motto */}
                        <FieldWrapper
                          fieldName="factionMotto"
                          label={t("faction-detail:fields.faction_motto")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.factionMotto || ""}
                                onChange={(e) =>
                                  onEditDataChange("factionMotto", e.target.value)
                                }
                                placeholder={t(
                                  "create-faction:modal.faction_motto_placeholder"
                                )}
                                rows={3}
                                maxLength={300}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.factionMotto?.length || 0}/300</span>
                              </div>
                            </>
                          ) : faction.factionMotto ? (
                            <p className="text-sm italic whitespace-pre-wrap">
                              &quot;{faction.factionMotto}&quot;
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Uniform and Aesthetics */}
                        <FieldWrapper
                          fieldName="uniformAndAesthetics"
                          label={t("faction-detail:fields.uniform_and_aesthetics")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.uniformAndAesthetics || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "uniformAndAesthetics",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "create-faction:modal.uniform_and_aesthetics_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.uniformAndAesthetics?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : faction.uniformAndAesthetics ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {faction.uniformAndAesthetics}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* History Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          {t("faction-detail:sections.history")}
                        </h4>

                        {/* Foundation Date */}
                        <FieldWrapper
                          fieldName="foundationDate"
                          label={t("faction-detail:fields.foundation_date")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Input
                                value={editData.foundationDate || ""}
                                onChange={(e) =>
                                  onEditDataChange("foundationDate", e.target.value)
                                }
                                placeholder={t(
                                  "create-faction:modal.foundation_date_placeholder"
                                )}
                                maxLength={200}
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.foundationDate?.length || 0}/200
                                </span>
                              </div>
                            </>
                          ) : faction.foundationDate ? (
                            <p className="text-sm">{faction.foundationDate}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Foundation History Summary */}
                        <FieldWrapper
                          fieldName="foundationHistorySummary"
                          label={t("faction-detail:fields.foundation_history_summary")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.foundationHistorySummary || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "foundationHistorySummary",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "create-faction:modal.foundation_history_summary_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.foundationHistorySummary?.length || 0}/
                                  500
                                </span>
                              </div>
                            </>
                          ) : faction.foundationHistorySummary ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {faction.foundationHistorySummary}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* Relationships Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          {t("faction-detail:sections.relationships")}
                        </h4>

                        {/* Influence */}
                        <FieldWrapper
                          fieldName="influence"
                          label={t("faction-detail:fields.influence")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <Select
                              value={editData.influence || ""}
                              onValueChange={(value) =>
                                onEditDataChange("influence", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "create-faction:modal.influence_placeholder"
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {influences.map((influence) => (
                                  <SelectItem
                                    key={influence.value}
                                    value={influence.value}
                                  >
                                    {t(
                                      `create-faction:${influence.translationKey}`
                                    )}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : faction.influence ? (
                            <Badge className={currentInfluence?.bgColor}>
                              {t(`create-faction:influence.${faction.influence}`)}
                            </Badge>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Public Reputation */}
                        <FieldWrapper
                          fieldName="publicReputation"
                          label={t("faction-detail:fields.public_reputation")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <Select
                              value={editData.publicReputation || ""}
                              onValueChange={(value) =>
                                onEditDataChange("publicReputation", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "create-faction:modal.reputation_placeholder"
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {reputations.map((reputation) => (
                                  <SelectItem
                                    key={reputation.value}
                                    value={reputation.value}
                                  >
                                    {t(
                                      `create-faction:${reputation.translationKey}`
                                    )}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : faction.publicReputation ? (
                            <Badge className={currentReputation?.bgColor}>
                              {t(
                                `create-faction:reputation.${faction.publicReputation}`
                              )}
                            </Badge>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* External Influence */}
                        <FieldWrapper
                          fieldName="externalInfluence"
                          label={t("faction-detail:fields.external_influence")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.externalInfluence || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "externalInfluence",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "create-faction:modal.external_influence_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.externalInfluence?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : faction.externalInfluence ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {faction.externalInfluence}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* Power Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                          <Zap className="w-5 h-5" />
                          {t("faction-detail:sections.power")}
                        </h4>

                        <p className="text-sm text-muted-foreground">
                          {t("create-faction:modal.power_description")}
                        </p>

                        {/* Military Power */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              {t("faction-detail:fields.military_power")}
                            </Label>
                            <span
                              className={`text-sm font-bold transition-colors ${
                                (isEditing ? editData.militaryPower || 5 : faction.militaryPower || 5) === 10
                                  ? "text-amber-500"
                                  : "text-primary"
                              }`}
                            >
                              {isEditing ? editData.militaryPower || 5 : faction.militaryPower || 5}/10
                            </span>
                          </div>
                          {isEditing ? (
                            <Slider
                              value={[editData.militaryPower || 5]}
                              onValueChange={(value) =>
                                onEditDataChange("militaryPower", value[0])
                              }
                              min={1}
                              max={10}
                              step={1}
                              className={`w-full cursor-pointer ${
                                (editData.militaryPower || 5) === 10
                                  ? "[&_.bg-primary]:!bg-gradient-to-r [&_.bg-primary]:from-amber-600 [&_.bg-primary]:via-yellow-400 [&_.bg-primary]:to-amber-600 [&_.bg-primary]:bg-[length:200%_100%] [&_.bg-primary]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:bg-gradient-to-r [&_span[data-radix-collection-item]]:from-amber-600 [&_span[data-radix-collection-item]]:via-yellow-400 [&_span[data-radix-collection-item]]:to-amber-600 [&_span[data-radix-collection-item]]:bg-[length:200%_100%] [&_span[data-radix-collection-item]]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:shadow-lg [&_span[data-radix-collection-item]]:shadow-amber-500/50 [&_span[data-radix-collection-item]]:border-amber-500"
                                  : ""
                              }`}
                            />
                          ) : (
                            <div className="flex gap-1">
                              {Array.from({ length: 10 }, (_, i) => {
                                const powerValue = faction.militaryPower || 5;
                                const isFilled = i < powerValue;
                                const isMaxPower = powerValue === 10;
                                return (
                                  <div
                                    key={i}
                                    className={`h-2 flex-1 rounded-sm ${
                                      isFilled
                                        ? isMaxPower
                                          ? "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 bg-[length:200%_100%] animate-[flowingEnergy_2s_ease-in-out_infinite]"
                                          : "bg-primary"
                                        : "bg-muted"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Political Power */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              {t("faction-detail:fields.political_power")}
                            </Label>
                            <span
                              className={`text-sm font-bold transition-colors ${
                                (isEditing ? editData.politicalPower || 5 : faction.politicalPower || 5) === 10
                                  ? "text-amber-500"
                                  : "text-primary"
                              }`}
                            >
                              {isEditing ? editData.politicalPower || 5 : faction.politicalPower || 5}/10
                            </span>
                          </div>
                          {isEditing ? (
                            <Slider
                              value={[editData.politicalPower || 5]}
                              onValueChange={(value) =>
                                onEditDataChange("politicalPower", value[0])
                              }
                              min={1}
                              max={10}
                              step={1}
                              className={`w-full cursor-pointer ${
                                (editData.politicalPower || 5) === 10
                                  ? "[&_.bg-primary]:!bg-gradient-to-r [&_.bg-primary]:from-amber-600 [&_.bg-primary]:via-yellow-400 [&_.bg-primary]:to-amber-600 [&_.bg-primary]:bg-[length:200%_100%] [&_.bg-primary]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:bg-gradient-to-r [&_span[data-radix-collection-item]]:from-amber-600 [&_span[data-radix-collection-item]]:via-yellow-400 [&_span[data-radix-collection-item]]:to-amber-600 [&_span[data-radix-collection-item]]:bg-[length:200%_100%] [&_span[data-radix-collection-item]]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:shadow-lg [&_span[data-radix-collection-item]]:shadow-amber-500/50 [&_span[data-radix-collection-item]]:border-amber-500"
                                  : ""
                              }`}
                            />
                          ) : (
                            <div className="flex gap-1">
                              {Array.from({ length: 10 }, (_, i) => {
                                const powerValue = faction.politicalPower || 5;
                                const isFilled = i < powerValue;
                                const isMaxPower = powerValue === 10;
                                return (
                                  <div
                                    key={i}
                                    className={`h-2 flex-1 rounded-sm ${
                                      isFilled
                                        ? isMaxPower
                                          ? "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 bg-[length:200%_100%] animate-[flowingEnergy_2s_ease-in-out_infinite]"
                                          : "bg-primary"
                                        : "bg-muted"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Cultural Power */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              {t("faction-detail:fields.cultural_power")}
                            </Label>
                            <span
                              className={`text-sm font-bold transition-colors ${
                                (isEditing ? editData.culturalPower || 5 : faction.culturalPower || 5) === 10
                                  ? "text-amber-500"
                                  : "text-primary"
                              }`}
                            >
                              {isEditing ? editData.culturalPower || 5 : faction.culturalPower || 5}/10
                            </span>
                          </div>
                          {isEditing ? (
                            <Slider
                              value={[editData.culturalPower || 5]}
                              onValueChange={(value) =>
                                onEditDataChange("culturalPower", value[0])
                              }
                              min={1}
                              max={10}
                              step={1}
                              className={`w-full cursor-pointer ${
                                (editData.culturalPower || 5) === 10
                                  ? "[&_.bg-primary]:!bg-gradient-to-r [&_.bg-primary]:from-amber-600 [&_.bg-primary]:via-yellow-400 [&_.bg-primary]:to-amber-600 [&_.bg-primary]:bg-[length:200%_100%] [&_.bg-primary]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:bg-gradient-to-r [&_span[data-radix-collection-item]]:from-amber-600 [&_span[data-radix-collection-item]]:via-yellow-400 [&_span[data-radix-collection-item]]:to-amber-600 [&_span[data-radix-collection-item]]:bg-[length:200%_100%] [&_span[data-radix-collection-item]]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:shadow-lg [&_span[data-radix-collection-item]]:shadow-amber-500/50 [&_span[data-radix-collection-item]]:border-amber-500"
                                  : ""
                              }`}
                            />
                          ) : (
                            <div className="flex gap-1">
                              {Array.from({ length: 10 }, (_, i) => {
                                const powerValue = faction.culturalPower || 5;
                                const isFilled = i < powerValue;
                                const isMaxPower = powerValue === 10;
                                return (
                                  <div
                                    key={i}
                                    className={`h-2 flex-1 rounded-sm ${
                                      isFilled
                                        ? isMaxPower
                                          ? "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 bg-[length:200%_100%] animate-[flowingEnergy_2s_ease-in-out_infinite]"
                                          : "bg-primary"
                                        : "bg-muted"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Economic Power */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              {t("faction-detail:fields.economic_power")}
                            </Label>
                            <span
                              className={`text-sm font-bold transition-colors ${
                                (isEditing ? editData.economicPower || 5 : faction.economicPower || 5) === 10
                                  ? "text-amber-500"
                                  : "text-primary"
                              }`}
                            >
                              {isEditing ? editData.economicPower || 5 : faction.economicPower || 5}/10
                            </span>
                          </div>
                          {isEditing ? (
                            <Slider
                              value={[editData.economicPower || 5]}
                              onValueChange={(value) =>
                                onEditDataChange("economicPower", value[0])
                              }
                              min={1}
                              max={10}
                              step={1}
                              className={`w-full cursor-pointer ${
                                (editData.economicPower || 5) === 10
                                  ? "[&_.bg-primary]:!bg-gradient-to-r [&_.bg-primary]:from-amber-600 [&_.bg-primary]:via-yellow-400 [&_.bg-primary]:to-amber-600 [&_.bg-primary]:bg-[length:200%_100%] [&_.bg-primary]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:bg-gradient-to-r [&_span[data-radix-collection-item]]:from-amber-600 [&_span[data-radix-collection-item]]:via-yellow-400 [&_span[data-radix-collection-item]]:to-amber-600 [&_span[data-radix-collection-item]]:bg-[length:200%_100%] [&_span[data-radix-collection-item]]:animate-[flowingEnergy_2s_ease-in-out_infinite] [&_span[data-radix-collection-item]]:shadow-lg [&_span[data-radix-collection-item]]:shadow-amber-500/50 [&_span[data-radix-collection-item]]:border-amber-500"
                                  : ""
                              }`}
                            />
                          ) : (
                            <div className="flex gap-1">
                              {Array.from({ length: 10 }, (_, i) => {
                                const powerValue = faction.economicPower || 5;
                                const isFilled = i < powerValue;
                                const isMaxPower = powerValue === 10;
                                return (
                                  <div
                                    key={i}
                                    className={`h-2 flex-1 rounded-sm ${
                                      isFilled
                                        ? isMaxPower
                                          ? "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 bg-[length:200%_100%] animate-[flowingEnergy_2s_ease-in-out_infinite]"
                                          : "bg-primary"
                                        : "bg-muted"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Alignment Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("faction-detail:sections.alignment")}
                        </h4>

                        <AlignmentMatrix
                          value={
                            isEditing ? editData.alignment : faction.alignment
                          }
                          onChange={(value) =>
                            onEditDataChange("alignment", value)
                          }
                          isEditable={isEditing}
                        />
                      </div>

                      <Separator />

                      {/* Narrative Section */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          {t("faction-detail:sections.narrative")}
                        </h4>

                        {/* Organization Objectives */}
                        <FieldWrapper
                          fieldName="organizationObjectives"
                          label={t("faction-detail:fields.organization_objectives")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.organizationObjectives || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "organizationObjectives",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "create-faction:modal.organization_objectives_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.organizationObjectives?.length || 0}/
                                  500
                                </span>
                              </div>
                            </>
                          ) : faction.organizationObjectives ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {faction.organizationObjectives}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Narrative Importance */}
                        <FieldWrapper
                          fieldName="narrativeImportance"
                          label={t("faction-detail:fields.narrative_importance")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.narrativeImportance || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "narrativeImportance",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "create-faction:modal.narrative_importance_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.narrativeImportance?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : faction.narrativeImportance ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {faction.narrativeImportance}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Inspirations */}
                        <FieldWrapper
                          fieldName="inspirations"
                          label={t("faction-detail:fields.inspirations")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.inspirations || ""}
                                onChange={(e) =>
                                  onEditDataChange("inspirations", e.target.value)
                                }
                                placeholder={t(
                                  "create-faction:modal.inspirations_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.inspirations?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : faction.inspirations ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {faction.inspirations}
                            </p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>

            {/* Sidebar - Versions - 1 column */}
            {!isEditing && (
              <div className="lg:col-span-1 space-y-6">
                <Card className="card-magical sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {t("faction-detail:sections.versions")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[600px]">
                    <VersionManager
                      versions={versions}
                      currentVersion={currentVersion}
                      onVersionChange={onVersionChange}
                      onVersionCreate={onVersionCreate}
                      onVersionDelete={onVersionDelete}
                      isEditMode={isEditing}
                      mainFactionData={faction}
                      translationNamespace="faction-detail"
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        factionName={faction.name}
        currentVersion={currentVersion}
        versionName={currentVersion?.name}
        totalVersions={versions.length}
        onConfirmDelete={onConfirmDelete}
      />
    </div>
  );
}
