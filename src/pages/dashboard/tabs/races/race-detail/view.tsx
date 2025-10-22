import React, { useState } from "react";

import {
  ArrowLeft,
  Edit2,
  Trash2,
  Menu,
  Eye,
  EyeOff,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { RaceNavigationSidebar } from "./components/race-navigation-sidebar";
import { RACE_DOMAINS } from "@/components/modals/create-race-modal/constants/domains";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { AlternativeNamesDisplay } from "./components/alternative-names-display";
import { RaceViewsDisplay } from "./components/race-views-display";
import { HabitatDisplay } from "./components/habitat-display";
import { CommunicationDisplay } from "./components/communication-display";
import { RaceRelationshipsSection } from "./components/race-relationships-section";
import { RaceVersionManager } from "./components/race-version-manager";
import { DomainPicker } from "@/components/modals/create-race-modal/components/domain-picker";
import { DietPicker } from "@/components/modals/create-race-modal/components/diet-picker";
import { MoralTendencyPicker } from "@/components/modals/create-race-modal/components/moral-tendency-picker";
import { PhysicalCapacityPicker } from "@/components/modals/create-race-modal/components/physical-capacity-picker";
import { HabitsPicker } from "@/components/modals/create-race-modal/components/habits-picker";
import { ReproductiveCyclePicker } from "@/components/modals/create-race-modal/components/reproductive-cycle-picker";

import type { IRace, IRaceGroup } from "../../types/race-types";
import type { IRaceRelationship, IRaceVersion, IFieldVisibility } from "./types/race-detail-types";

interface RaceDetailViewProps {
  race: IRace;
  editData: IRace;
  isEditing: boolean;
  versions: IRaceVersion[];
  currentVersion: IRaceVersion | null;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  allRaces: IRace[];
  raceGroups: IRaceGroup[];
  fieldVisibility: IFieldVisibility;
  advancedSectionOpen: boolean;
  relationships: IRaceRelationship[];
  onBack: () => void;
  onNavigationSidebarToggle: () => void;
  onNavigationSidebarClose: () => void;
  onRaceSelect: (raceId: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDeleteModalOpen: () => void;
  onDeleteModalClose: () => void;
  onConfirmDelete: () => void;
  onVersionChange: (versionId: string | null) => void;
  onVersionCreate: (data: { name: string; description: string; raceData: IRace }) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (versionId: string, name: string, description?: string) => void;
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: unknown) => void;
  onFieldVisibilityToggle: (fieldName: string) => void;
  onAdvancedSectionToggle: () => void;
  onRelationshipsChange: (relationships: IRaceRelationship[]) => void;
}

// ===== Helper Components =====

// RaceDeleteConfirmationDialog component
interface RaceDeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  raceName: string;
  totalVersions: number;
  onConfirmDelete: () => void;
}

function RaceDeleteConfirmationDialog({
  isOpen,
  onClose,
  raceName,
  totalVersions,
  onConfirmDelete,
}: RaceDeleteConfirmationDialogProps) {
  const { t } = useTranslation("race-detail");
  const [step, setStep] = useState<1 | 2>(1);
  const [nameInput, setNameInput] = useState("");

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setNameInput("");
    }
  }, [isOpen]);

  // Validate name input (case-sensitive exact match)
  const isNameValid = nameInput.trim() === raceName;

  const handleConfirm = () => {
    if (step === 1) {
      if (!isNameValid) {
        return;
      }
      // Move to step 2
      setStep(2);
    } else {
      // Final confirmation - delete race
      onConfirmDelete();
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    setStep(1);
    setNameInput("");
  };

  // Step 1: Name confirmation
  if (step === 1) {
    return (
      <AlertDialog open={isOpen} onOpenChange={handleCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>
                {t("delete.race.title")}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-4">
              <p>
                {t("delete.race.step1.message", { raceName })}
              </p>
              <div className="space-y-2">
                <Label htmlFor="race-name-confirm">
                  {t("delete.race.step1.input_label")}
                </Label>
                <Input
                  id="race-name-confirm"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={t("delete.race.step1.input_placeholder")}
                  className={!isNameValid && nameInput ? "border-destructive" : ""}
                />
                {!isNameValid && nameInput && (
                  <p className="text-sm text-destructive">
                    {t("delete.race.step1.name_mismatch")}
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {t("delete.race.step1.cancel")}
            </AlertDialogCancel>
            <Button
              onClick={handleConfirm}
              disabled={!isNameValid}
              variant="destructive"
            >
              {t("delete.race.step1.continue")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Step 2: Final confirmation
  return (
    <AlertDialog open={isOpen} onOpenChange={handleCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>
              {t("delete.race.step2.title")}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {totalVersions > 1
              ? t("delete.race.step2.message", { raceName, totalVersions })
              : t("delete.race.step2.message_single", { raceName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {t("delete.race.step2.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("delete.race.step2.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// FieldWrapper component - IGUAL ao do character-detail
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
  t: (key: string) => string;
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

// EmptyFieldState component - IGUAL ao do character-detail
const EmptyFieldState = ({
  hint,
  t,
}: {
  hint?: string;
  t: (key: string) => string;
}) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("race-detail:empty_states.no_data")}</p>
    {hint && (
      <p className="text-xs mt-1">
        {hint || t("race-detail:empty_states.no_data_hint")}
      </p>
    )}
  </div>
);

// ===== Main Component =====

export function RaceDetailView({
  race,
  editData,
  isEditing,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  fileInputRef,
  allRaces,
  raceGroups,
  fieldVisibility,
  advancedSectionOpen,
  relationships,
  onBack,
  onNavigationSidebarToggle,
  onNavigationSidebarClose,
  onRaceSelect,
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
  onRelationshipsChange,
}: RaceDetailViewProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { t } = useTranslation(["race-detail", "create-race"] as any);

  return (
    <div className="relative">
      {/* Navigation Sidebar */}
      <RaceNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={onNavigationSidebarClose}
        currentRaceId={race.id}
        allRaces={allRaces}
        raceGroups={raceGroups}
        onRaceSelect={onRaceSelect}
      />

      <div className="w-full overflow-hidden">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* FIXED HEADER - STICKY */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!isEditing && (
                  <>
                    <Button variant="ghost" onClick={onBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t("race-detail:buttons.back")}
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
                      {t("race-detail:buttons.cancel")}
                    </Button>
                    <Button
                      variant="magical"
                      className="animate-glow"
                      onClick={onSave}
                    >
                      {t("race-detail:buttons.save")}
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

          {/* GRID LAYOUT - 4 colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* MAIN CONTENT - 3 colunas quando não está editando, 4 quando está */}
            <div className={`${isEditing ? "lg:col-span-4" : "lg:col-span-3"} space-y-6`}>

              {/* BASIC INFORMATION CARD */}
              <Card className="card-magical overflow-hidden">
                <CardHeader>
                  <CardTitle>
                    {t("race-detail:sections.basic_info")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label>{t("race-detail:fields.image")}</Label>
                        <div
                          className="w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
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
                                <Upload className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center">
                                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  {t("race-detail:buttons.upload_image")}
                                </p>
                              </div>
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

                      {/* NOME, NOME CIENTÍFICO, DOMÍNIO */}
                      <div className="space-y-4">
                        {/* Nome */}
                        <FieldWrapper
                          fieldName="name"
                          label={t("race-detail:fields.name")}
                          isOptional={false}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          <Input
                            value={editData.name || ""}
                            onChange={(e) => onEditDataChange("name", e.target.value)}
                            placeholder={t("create-race:modal.name_placeholder")}
                            maxLength={150}
                            required
                          />
                          <div className="flex justify-end text-xs text-muted-foreground">
                            <span>{(editData.name || "").length}/150</span>
                          </div>
                        </FieldWrapper>

                        {/* Nome Científico */}
                        <FieldWrapper
                          fieldName="scientificName"
                          label={t("race-detail:fields.scientific_name")}
                          isOptional={false}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          <Input
                            value={editData.scientificName || ""}
                            onChange={(e) => onEditDataChange("scientificName", e.target.value)}
                            placeholder={t("create-race:modal.scientific_name_placeholder")}
                            maxLength={150}
                          />
                          <div className="flex justify-end text-xs text-muted-foreground">
                            <span>{(editData.scientificName || "").length}/150</span>
                          </div>
                        </FieldWrapper>

                        {/* Domínio */}
                        <FieldWrapper
                          fieldName="domain"
                          label={t("race-detail:fields.domain")}
                          isOptional={false}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          <DomainPicker
                            value={editData.domain || []}
                            onChange={(value) => onEditDataChange("domain", value)}
                          />
                        </FieldWrapper>

                        {/* Resumo - Full width */}
                        <FieldWrapper
                          fieldName="summary"
                          label={t("race-detail:fields.summary")}
                          isOptional={false}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          <Textarea
                            value={editData.summary || ""}
                            onChange={(e) => onEditDataChange("summary", e.target.value)}
                            placeholder={t("create-race:modal.summary_placeholder")}
                            rows={4}
                            maxLength={500}
                            className="resize-none"
                            required
                          />
                          <div className="flex justify-end text-xs text-muted-foreground">
                            <span>{(editData.summary || "").length}/500</span>
                          </div>
                        </FieldWrapper>
                      </div>
                    </div>
                  ) : (
                    // MODO VISUALIZAÇÃO
                    <div className="space-y-6">
                      <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
                        {race.image || imagePreview ? (
                          <img
                            src={race.image || imagePreview}
                            alt={race.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-6xl font-bold text-primary/30">
                              {race.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CONTEÚDO */}
                      <div className="space-y-4">
                        {/* NOME + NOME CIENTÍFICO */}
                        <div>
                          <h2 className="text-3xl font-bold">{race.name}</h2>
                          {race.scientificName && (
                            <p className="text-sm italic text-muted-foreground mt-1">
                              {race.scientificName}
                            </p>
                          )}
                        </div>

                        {/* BADGES DE DOMÍNIO */}
                        {race.domain && race.domain.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {race.domain.map((d) => {
                              // Find by label (Portuguese) instead of value (English)
                              const domainConfig = RACE_DOMAINS.find((dc) => dc.label === d);
                              if (!domainConfig) {
                                console.warn('Domain config not found for:', d);
                                return null;
                              }
                              const DomainIcon = domainConfig.icon;
                              return (
                                <Badge key={d} className={`${domainConfig.color} ${domainConfig.bgColor}`}>
                                  <DomainIcon className="w-3 h-3 mr-1" />
                                  {domainConfig.label}
                                </Badge>
                              );
                            })}
                          </div>
                        )}

                        {/* RESUMO */}
                        <p className="text-foreground text-base">
                          {race.summary}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ADVANCED SECTION - COLLAPSIBLE */}
              <Collapsible
                open={advancedSectionOpen}
                onOpenChange={onAdvancedSectionToggle}
              >
                <Card className="card-magical">
                  <CardHeader>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer">
                        <CardTitle>
                          {t("race-detail:sections.advanced_info")}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          {advancedSectionOpen
                            ? t("race-detail:buttons.hide_advanced")
                            : t("race-detail:buttons.show_advanced")}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">

                      {/* CULTURA E MITOS */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("race-detail:sections.culture")}
                        </h4>

                        {/* Alternative Names */}
                        <FieldWrapper
                          fieldName="alternativeNames"
                          label={t("race-detail:fields.alternative_names")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <AlternativeNamesDisplay
                              names={editData.alternativeNames || []}
                              isEditing={isEditing}
                              onNamesChange={(names) => onEditDataChange("alternativeNames", names)}
                            />
                          ) : race.alternativeNames && race.alternativeNames.length > 0 ? (
                            <AlternativeNamesDisplay
                              names={race.alternativeNames}
                              isEditing={false}
                              onNamesChange={() => {}}
                            />
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Race Views */}
                        <FieldWrapper
                          fieldName="raceViews"
                          label={t("race-detail:fields.race_views")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <RaceViewsDisplay
                              views={editData.raceViews || []}
                              isEditing={isEditing}
                              allRaces={allRaces}
                              onViewsChange={(views) => onEditDataChange("raceViews", views)}
                            />
                          ) : race.raceViews && race.raceViews.length > 0 ? (
                            <RaceViewsDisplay
                              views={race.raceViews}
                              isEditing={false}
                              allRaces={allRaces}
                              onViewsChange={() => {}}
                            />
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Cultural Notes (Ritos/Tabus) */}
                        <FieldWrapper
                          fieldName="culturalNotes"
                          label={t("race-detail:fields.cultural_notes")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <Textarea
                              value={editData.culturalNotes || ""}
                              onChange={(e) => onEditDataChange("culturalNotes", e.target.value)}
                              placeholder={t("create-race:modal.cultural_notes_placeholder")}
                              rows={6}
                              maxLength={1500}
                              className="resize-none"
                            />
                          ) : race.culturalNotes ? (
                            <p className="text-sm whitespace-pre-wrap">{race.culturalNotes}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                          {isEditing && (
                            <div className="flex justify-end text-xs text-muted-foreground">
                              <span>{(editData.culturalNotes || "").length}/1500</span>
                            </div>
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* APARÊNCIA E CARACTERÍSTICAS */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("race-detail:sections.appearance")}
                        </h4>

                        {/* General Appearance */}
                        <FieldWrapper
                          fieldName="generalAppearance"
                          label={t("race-detail:fields.general_appearance")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.generalAppearance || ""}
                                onChange={(e) => onEditDataChange("generalAppearance", e.target.value)}
                                placeholder={t("create-race:modal.general_appearance_placeholder")}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{(editData.generalAppearance || "").length}/500</span>
                              </div>
                            </>
                          ) : race.generalAppearance ? (
                            <p className="text-sm whitespace-pre-wrap">{race.generalAppearance}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Life Expectancy, Height, Weight - 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FieldWrapper
                            fieldName="lifeExpectancy"
                            label={t("race-detail:fields.life_expectancy")}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              <>
                                <Input
                                  value={editData.lifeExpectancy || ""}
                                  onChange={(e) => onEditDataChange("lifeExpectancy", e.target.value)}
                                  placeholder={t("create-race:modal.life_expectancy_placeholder")}
                                  maxLength={100}
                                />
                                <div className="flex justify-end text-xs text-muted-foreground">
                                  <span>{(editData.lifeExpectancy || "").length}/100</span>
                                </div>
                              </>
                            ) : race.lifeExpectancy ? (
                              <p className="text-sm">{race.lifeExpectancy}</p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="averageHeight"
                            label={t("race-detail:fields.average_height")}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              <>
                                <Input
                                  value={editData.averageHeight || ""}
                                  onChange={(e) => onEditDataChange("averageHeight", e.target.value)}
                                  placeholder={t("create-race:modal.average_height_placeholder")}
                                  maxLength={100}
                                />
                                <div className="flex justify-end text-xs text-muted-foreground">
                                  <span>{(editData.averageHeight || "").length}/100</span>
                                </div>
                              </>
                            ) : race.averageHeight ? (
                              <p className="text-sm">{race.averageHeight}</p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>

                          <FieldWrapper
                            fieldName="averageWeight"
                            label={t("race-detail:fields.average_weight")}
                            fieldVisibility={fieldVisibility}
                            isEditing={isEditing}
                            onFieldVisibilityToggle={onFieldVisibilityToggle}
                            t={t}
                          >
                            {isEditing ? (
                              <>
                                <Input
                                  value={editData.averageWeight || ""}
                                  onChange={(e) => onEditDataChange("averageWeight", e.target.value)}
                                  placeholder={t("create-race:modal.average_weight_placeholder")}
                                  maxLength={100}
                                />
                                <div className="flex justify-end text-xs text-muted-foreground">
                                  <span>{(editData.averageWeight || "").length}/100</span>
                                </div>
                              </>
                            ) : race.averageWeight ? (
                              <p className="text-sm">{race.averageWeight}</p>
                            ) : (
                              <EmptyFieldState t={t} />
                            )}
                          </FieldWrapper>
                        </div>

                        {/* Special Physical Characteristics */}
                        <FieldWrapper
                          fieldName="specialPhysicalCharacteristics"
                          label={t("race-detail:fields.special_physical_characteristics")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.specialPhysicalCharacteristics || ""}
                                onChange={(e) => onEditDataChange("specialPhysicalCharacteristics", e.target.value)}
                                placeholder={t("create-race:modal.special_physical_characteristics_placeholder")}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{(editData.specialPhysicalCharacteristics || "").length}/500</span>
                              </div>
                            </>
                          ) : race.specialPhysicalCharacteristics ? (
                            <p className="text-sm whitespace-pre-wrap">{race.specialPhysicalCharacteristics}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* COMPORTAMENTOS */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("race-detail:sections.behaviors")}
                        </h4>

                        {/* Habits */}
                        <FieldWrapper
                          fieldName="habits"
                          label={t("race-detail:fields.habits")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <HabitsPicker
                              value={editData.habits || ""}
                              onChange={(value) => onEditDataChange("habits", value)}
                            />
                          ) : race.habits ? (
                            <p className="text-sm whitespace-pre-wrap">{race.habits}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Reproductive Cycle */}
                        <FieldWrapper
                          fieldName="reproductiveCycle"
                          label={t("race-detail:fields.reproductive_cycle")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <ReproductiveCyclePicker
                              value={editData.reproductiveCycle || ""}
                              onChange={(value) => onEditDataChange("reproductiveCycle", value)}
                              otherCycleDescription={editData.otherCycleDescription || ""}
                              onOtherCycleDescriptionChange={(value) => onEditDataChange("otherCycleDescription", value)}
                            />
                          ) : race.reproductiveCycle ? (
                            <p className="text-sm whitespace-pre-wrap">{race.reproductiveCycle}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Diet */}
                        <FieldWrapper
                          fieldName="diet"
                          label={t("race-detail:fields.diet")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <DietPicker
                              value={editData.diet || ""}
                              onChange={(value) => onEditDataChange("diet", value)}
                              elementalDiet={editData.elementalDiet || ""}
                              onElementalDietChange={(value) => onEditDataChange("elementalDiet", value)}
                            />
                          ) : race.diet ? (
                            <p className="text-sm whitespace-pre-wrap">{race.diet}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Communication */}
                        <FieldWrapper
                          fieldName="communication"
                          label={t("race-detail:fields.communication")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <CommunicationDisplay
                              communication={editData.communication}
                              isEditing={isEditing}
                              onCommunicationChange={(communication) =>
                                onEditDataChange("communication", communication)
                              }
                            />
                          ) : race.communication && race.communication.length > 0 ? (
                            <CommunicationDisplay
                              communication={race.communication}
                              isEditing={false}
                              onCommunicationChange={() => {}}
                            />
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Moral Tendency */}
                        <FieldWrapper
                          fieldName="moralTendency"
                          label={t("race-detail:fields.moral_tendency")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <MoralTendencyPicker
                              value={editData.moralTendency || ""}
                              onChange={(value) => onEditDataChange("moralTendency", value)}
                            />
                          ) : race.moralTendency ? (
                            <p className="text-sm">{race.moralTendency}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Social Organization */}
                        <FieldWrapper
                          fieldName="socialOrganization"
                          label={t("race-detail:fields.social_organization")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.socialOrganization || ""}
                                onChange={(e) => onEditDataChange("socialOrganization", e.target.value)}
                                placeholder={t("create-race:modal.social_organization_placeholder")}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{(editData.socialOrganization || "").length}/500</span>
                              </div>
                            </>
                          ) : race.socialOrganization ? (
                            <p className="text-sm whitespace-pre-wrap">{race.socialOrganization}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Habitat */}
                        <FieldWrapper
                          fieldName="habitat"
                          label={t("race-detail:fields.habitat")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <HabitatDisplay
                              habitat={editData.habitat}
                              isEditing={isEditing}
                              onHabitatChange={(habitat) => onEditDataChange("habitat", habitat)}
                            />
                          ) : race.habitat && race.habitat.length > 0 ? (
                            <HabitatDisplay
                              habitat={race.habitat}
                              isEditing={false}
                              onHabitatChange={() => {}}
                            />
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* PODER */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("race-detail:sections.power")}
                        </h4>

                        {/* Physical Capacity */}
                        <FieldWrapper
                          fieldName="physicalCapacity"
                          label={t("race-detail:fields.physical_capacity")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <PhysicalCapacityPicker
                              value={editData.physicalCapacity || ""}
                              onChange={(value) => onEditDataChange("physicalCapacity", value)}
                            />
                          ) : race.physicalCapacity ? (
                            <p className="text-sm whitespace-pre-wrap">{race.physicalCapacity}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Special Characteristics */}
                        <FieldWrapper
                          fieldName="specialCharacteristics"
                          label={t("race-detail:fields.special_characteristics")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.specialCharacteristics || ""}
                                onChange={(e) => onEditDataChange("specialCharacteristics", e.target.value)}
                                placeholder={t("create-race:modal.special_characteristics_placeholder")}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{(editData.specialCharacteristics || "").length}/500</span>
                              </div>
                            </>
                          ) : race.specialCharacteristics ? (
                            <p className="text-sm whitespace-pre-wrap">{race.specialCharacteristics}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Weaknesses */}
                        <FieldWrapper
                          fieldName="weaknesses"
                          label={t("race-detail:fields.weaknesses")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.weaknesses || ""}
                                onChange={(e) => onEditDataChange("weaknesses", e.target.value)}
                                placeholder={t("create-race:modal.weaknesses_placeholder")}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{(editData.weaknesses || "").length}/500</span>
                              </div>
                            </>
                          ) : race.weaknesses ? (
                            <p className="text-sm whitespace-pre-wrap">{race.weaknesses}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                      <Separator />

                      {/* NARRATIVA */}
                      <div className="space-y-4">
                        <h4 className="text-base font-bold text-primary uppercase tracking-wide">
                          {t("race-detail:sections.narrative")}
                        </h4>

                        {/* Story Motivation */}
                        <FieldWrapper
                          fieldName="storyMotivation"
                          label={t("race-detail:fields.story_motivation")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.storyMotivation || ""}
                                onChange={(e) => onEditDataChange("storyMotivation", e.target.value)}
                                placeholder={t("create-race:modal.story_motivation_placeholder")}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{(editData.storyMotivation || "").length}/500</span>
                              </div>
                            </>
                          ) : race.storyMotivation ? (
                            <p className="text-sm whitespace-pre-wrap">{race.storyMotivation}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>

                        {/* Inspirations */}
                        <FieldWrapper
                          fieldName="inspirations"
                          label={t("race-detail:fields.inspirations")}
                          fieldVisibility={fieldVisibility}
                          isEditing={isEditing}
                          onFieldVisibilityToggle={onFieldVisibilityToggle}
                          t={t}
                        >
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.inspirations || ""}
                                onChange={(e) => onEditDataChange("inspirations", e.target.value)}
                                placeholder={t("create-race:modal.inspirations_placeholder")}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{(editData.inspirations || "").length}/500</span>
                              </div>
                            </>
                          ) : race.inspirations ? (
                            <p className="text-sm whitespace-pre-wrap">{race.inspirations}</p>
                          ) : (
                            <EmptyFieldState t={t} />
                          )}
                        </FieldWrapper>
                      </div>

                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* RELATIONSHIPS CARD */}
              <FieldWrapper
                fieldName="relationships"
                label={t("race-detail:sections.relationships")}
                isOptional={true}
                fieldVisibility={fieldVisibility}
                isEditing={isEditing}
                onFieldVisibilityToggle={onFieldVisibilityToggle}
                t={t}
              >
                <Card className="card-magical">
                  <CardContent className="pt-6">
                    <RaceRelationshipsSection
                      relationships={isEditing ? relationships : relationships}
                      allRaces={allRaces}
                      currentRaceId={race.id}
                      currentRaceName={race.name}
                      isEditMode={isEditing}
                      onRelationshipsChange={onRelationshipsChange}
                    />
                  </CardContent>
                </Card>
              </FieldWrapper>

            </div>

            {/* SIDEBAR - Version Manager (só aparece quando não está editando) */}
            {!isEditing && (
              <div className="lg:col-span-1 space-y-6">
                <Card className="card-magical sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {t("race-detail:sections.versions")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[600px]">
                    <RaceVersionManager
                      versions={versions}
                      currentVersion={currentVersion}
                      onVersionChange={onVersionChange}
                      onVersionCreate={onVersionCreate}
                      onVersionDelete={onVersionDelete}
                      isEditMode={isEditing}
                      mainRaceData={race}
                      translationNamespace="race-detail"
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {currentVersion && !currentVersion.isMain ? (
        // Version deletion
        <AlertDialog open={showDeleteModal} onOpenChange={onDeleteModalClose}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("race-detail:delete.version.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("race-detail:delete.version.message", { versionName: currentVersion.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={onDeleteModalClose}>
                {t("race-detail:delete.version.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("race-detail:delete.version.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        // Race deletion
        <RaceDeleteConfirmationDialog
          isOpen={showDeleteModal}
          onClose={onDeleteModalClose}
          raceName={race.name}
          totalVersions={versions.length}
          onConfirmDelete={onConfirmDelete}
        />
      )}
    </div>
  );
}
