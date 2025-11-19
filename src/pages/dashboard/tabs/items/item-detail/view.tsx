import React from "react";

import { AlertCircle, Info, Menu, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormListInput } from "@/components/forms/FormListInput";
import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { FormSimplePicker } from "@/components/forms/FormSimplePicker";
import { ItemNavigationSidebar } from "@/components/item-navigation-sidebar";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import { CategorySelector } from "@/components/modals/create-item-modal/components/category-selector";
import {
  ITEM_CATEGORIES_CONSTANT,
  type IItemCategory,
} from "@/components/modals/create-item-modal/constants/item-categories";
import {
  ITEM_STATUSES_CONSTANT,
  type IItemStatus,
} from "@/components/modals/create-item-modal/constants/item-statuses";
import {
  STORY_RARITIES_CONSTANT,
  type IStoryRarity,
} from "@/components/modals/create-item-modal/constants/story-rarities";
import { type ItemFormSchema } from "@/components/modals/create-item-modal/hooks/use-item-validation";
import { CreateItemModal } from "@/components/modals/create-item-modal/index";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  EntityVersionManager,
  CreateVersionWithEntityDialog,
  VersionsPanel,
} from "@/components/version-system";
import { type IItem, type IItemVersion } from "@/lib/db/items.service";
import { type IFieldVisibility } from "@/types/character-types";

import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";
import { VersionCard } from "./components/version-card";

// Helper component for empty state
const EmptyFieldState = ({ t }: { t: (key: string) => string }) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("item-detail:empty_states.no_data")}</p>
  </div>
);

// Info Alert component
const InfoAlert = ({
  icon: Icon,
  message,
}: {
  icon: React.ElementType;
  message: string;
}) => (
  <Alert className="bg-primary/5 border-primary/20">
    <Icon className="h-4 w-4 text-primary" />
    <AlertDescription className="text-xs">{message}</AlertDescription>
  </Alert>
);

interface ItemDetailViewProps {
  item: IItem;
  editData: IItem;
  isEditing: boolean;
  versions: IItemVersion[];
  currentVersion: IItemVersion | null;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  allItems: IItem[];
  categories: IItemCategory[];
  statuses: IItemStatus[];
  rarities: IStoryRarity[];
  currentCategory: IItemCategory | undefined;
  currentStatus: IItemStatus | undefined;
  currentRarity: IStoryRarity | undefined;
  hasChanges: boolean;
  hasRequiredFieldsEmpty: boolean;
  missingFields: string[];
  errors: Record<string, string>;
  fieldVisibility: IFieldVisibility;
  advancedSectionOpen: boolean;
  openSections: Record<string, boolean>;
  customCategoryError?: string;
  isValid: boolean;
  onBack: () => void;
  onNavigationSidebarToggle: () => void;
  onNavigationSidebarClose: () => void;
  onItemSelect: (itemId: string) => void;
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
    entityData: ItemFormSchema;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (
    versionId: string,
    name: string,
    description?: string
  ) => void;
  onEditDataChange: (field: string, value: unknown) => void;
  validateField: (field: string, value: any) => void;
  onFieldVisibilityToggle: (field: string) => void;
  onAdvancedSectionToggle: () => void;
  toggleSection: (sectionName: string) => void;
}

export const ItemDetailView = React.memo(function ItemDetailView({
  item,
  editData,
  isEditing,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  allItems,
  currentCategory,
  currentStatus,
  currentRarity,
  hasChanges,
  hasRequiredFieldsEmpty,
  missingFields,
  errors,
  fieldVisibility,
  advancedSectionOpen,
  openSections,
  customCategoryError,
  isValid,
  onBack,
  onNavigationSidebarToggle,
  onNavigationSidebarClose,
  onItemSelect,
  onEdit,
  onSave,
  onCancel,
  onDeleteModalOpen,
  onDeleteModalClose,
  onConfirmDelete,
  onVersionChange,
  onVersionCreate,
  onVersionDelete,
  onVersionUpdate,
  onEditDataChange,
  validateField,
  onFieldVisibilityToggle,
  onAdvancedSectionToggle,
  toggleSection,
}: ItemDetailViewProps) {
  const { t } = useTranslation(["item-detail", "create-item"]);

  // Get current status icon for badge display
  const statusData = ITEM_STATUSES_CONSTANT.find(
    (s) => s.value === item.status
  );
  const StatusIcon = statusData?.icon;

  // Get current category icon for display
  const categoryData = ITEM_CATEGORIES_CONSTANT.find(
    (c) => c.value === item.category
  );
  const CategoryIcon = categoryData?.icon;

  // Display category (handle "other" with custom category)
  const displayCategory =
    item.category === "other" && item.customCategory
      ? item.customCategory
      : t(`create-item:category.${item.category}`);

  // ==================
  // BASIC FIELDS (following create-item modal layout)
  // ==================
  const basicFields = (
    <>
      {/* Image covering the top with full width */}
      {isEditing ? (
        <div className="space-y-6">
          {/* Item Image */}
          <div className="max-w-[534px] mx-auto">
            <FormImageUpload
              value={editData.image || ""}
              onChange={(value) => onEditDataChange("image", value)}
              label={t("create-item:modal.image")}
              helperText={t("create-item:modal.upload_image")}
              height="h-96"
              shape="rounded"
              imageFit="cover"
              placeholderIcon={Package}
              id="item-image-upload"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-primary">
              {t("create-item:modal.item_name")}{" "}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="name"
              value={editData.name}
              onChange={(e) => onEditDataChange("name", e.target.value)}
              onBlur={() => validateField("name", editData.name)}
              className={errors.name ? "border-destructive" : ""}
              required
              maxLength={150}
              placeholder={t("create-item:modal.name_placeholder")}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {errors.name && (
                <p className="text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
              <span className="ml-auto">{editData.name?.length || 0}/150</span>
            </div>
          </div>

          {/* Status Picker */}
          <FormSimplePicker
            value={editData.status || ""}
            onChange={(value) => onEditDataChange("status", value)}
            label={t("create-item:modal.item_status")}
            required
            options={ITEM_STATUSES_CONSTANT}
            error={errors.status}
            translationNamespace="create-item"
          />

          {/* Category Selector */}
          <CategorySelector
            value={editData.category || ""}
            customCategory={editData.customCategory || ""}
            onChange={(value) => onEditDataChange("category", value)}
            onCustomCategoryChange={(value) =>
              onEditDataChange("customCategory", value)
            }
            error={errors.category}
            customCategoryError={customCategoryError}
          />

          {/* Basic Description */}
          <div className="space-y-2">
            <Label
              htmlFor="basicDescription"
              className="text-sm font-medium text-primary"
            >
              {t("create-item:modal.basic_description")}{" "}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="basicDescription"
              value={editData.basicDescription}
              onChange={(e) =>
                onEditDataChange("basicDescription", e.target.value)
              }
              onBlur={() =>
                validateField("basicDescription", editData.basicDescription)
              }
              className={`resize-none ${
                errors.basicDescription ? "border-destructive" : ""
              }`}
              rows={4}
              maxLength={500}
              required
              placeholder={t("create-item:modal.basic_description_placeholder")}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {errors.basicDescription && (
                <p className="text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.basicDescription}
                </p>
              )}
              <span className="ml-auto">
                {editData.basicDescription?.length || 0}/500
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* View mode - keep original layout */}
          {item.image ? (
            <div className="relative w-full max-w-[534px] mx-auto h-96">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="max-w-[534px] mx-auto h-96">
              <FormImageDisplay
                icon={Package}
                height="h-full"
                width="w-full"
                shape="rounded"
              />
            </div>
          )}

          <div className="space-y-3 mt-4">
            {/* Name */}
            <h3 className="font-semibold text-lg leading-tight select-text">
              {item.name}
            </h3>

            {/* Category and Status side by side */}
            <div className="flex items-center gap-2 flex-wrap">
              {currentCategory && CategoryIcon && (
                <Badge
                  className={`${currentCategory.bgColorClass} ${currentCategory.colorClass} border px-3 py-1 pointer-events-none select-none`}
                >
                  <CategoryIcon className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-xs font-medium">{displayCategory}</span>
                </Badge>
              )}
              {currentStatus && StatusIcon && (
                <Badge
                  className={`${currentStatus.bgColorClass} ${currentStatus.colorClass} border px-3 py-1 pointer-events-none select-none`}
                >
                  <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-xs font-medium">
                    {t(`create-item:${currentStatus.translationKey}`)}
                  </span>
                </Badge>
              )}
            </div>

            {/* Basic Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed select-text">
              {item.basicDescription}
            </p>

            {/* Alternative names */}
            {item.alternativeNames && item.alternativeNames.length > 0 && (
              <p className="text-xs text-muted-foreground select-text">
                Também conhecido como: {item.alternativeNames.join(", ")}
              </p>
            )}
          </div>
        </>
      )}
    </>
  );

  // ==================
  // ADVANCED FIELDS (with FieldWithVisibilityToggle)
  // ==================
  const advancedFields = (
    <>
      {/* Detailed Descriptions Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("item-detail:sections.detailed_descriptions")}
        </h4>

        {/* Appearance */}
        <FieldWithVisibilityToggle
          fieldName="appearance"
          label={t("item-detail:fields.appearance")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editData.appearance || ""}
                onChange={(e) => onEditDataChange("appearance", e.target.value)}
                className="resize-none"
                rows={4}
                maxLength={1000}
                placeholder={t("item-detail:placeholders.appearance")}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.appearance?.length || 0}/1000</span>
              </div>
            </>
          ) : item.appearance ? (
            <p className="text-sm whitespace-pre-wrap">{item.appearance}</p>
          ) : (
            <EmptyFieldState t={t} />
          )}
        </FieldWithVisibilityToggle>

        {/* Origin */}
        <FieldWithVisibilityToggle
          fieldName="origin"
          label={t("item-detail:fields.origin")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editData.origin || ""}
                onChange={(e) => onEditDataChange("origin", e.target.value)}
                className="resize-none"
                rows={4}
                maxLength={1000}
                placeholder={t("item-detail:placeholders.origin")}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.origin?.length || 0}/1000</span>
              </div>
            </>
          ) : item.origin ? (
            <p className="text-sm whitespace-pre-wrap">{item.origin}</p>
          ) : (
            <EmptyFieldState t={t} />
          )}
        </FieldWithVisibilityToggle>

        {/* Alternative Names */}
        <FieldWithVisibilityToggle
          fieldName="alternativeNames"
          label={t("item-detail:fields.alternative_names")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <FormListInput
              value={editData.alternativeNames || []}
              onChange={(names) => onEditDataChange("alternativeNames", names)}
              label=""
              placeholder={t("item-detail:placeholders.alternative_name")}
              buttonText={t("item-detail:buttons.add_alternative_name")}
              maxLength={100}
              inputSize="small"
            />
          ) : item.alternativeNames && item.alternativeNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {item.alternativeNames.map((name, index) => (
                <EntityTagBadge key={index} variant="outline">
                  {name}
                </EntityTagBadge>
              ))}
            </div>
          ) : (
            <EmptyFieldState t={t} />
          )}
        </FieldWithVisibilityToggle>
      </div>

      <Separator className="my-6" />

      {/* Narrative Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("item-detail:sections.narrative")}
        </h4>

        {/* Story Rarity */}
        <FieldWithVisibilityToggle
          fieldName="storyRarity"
          label={t("item-detail:fields.story_rarity")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <InfoAlert
                icon={Info}
                message={t("item-detail:warnings.story_rarity")}
              />
              <FormSelectGrid
                value={editData.storyRarity || ""}
                onChange={(value) => onEditDataChange("storyRarity", value)}
                label=""
                columns={4}
                options={STORY_RARITIES_CONSTANT.map((rarity) => ({
                  value: rarity.value,
                  label: t(`create-item:${rarity.translationKey}`),
                  description: t(`create-item:${rarity.descriptionKey}`),
                  icon: rarity.icon,
                  baseColorClass: rarity.baseColorClass,
                  hoverColorClass: rarity.hoverColorClass,
                  activeColorClass: rarity.activeColorClass,
                }))}
              />
            </>
          ) : currentRarity ? (
            (() => {
              const RarityIcon = currentRarity.icon;
              return (
                <div
                  className={`w-full relative p-4 rounded-lg border-2 transition-all text-left ${currentRarity.activeColorClass}`}
                >
                  <div className="flex items-start gap-3">
                    <RarityIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        {t(`create-item:${currentRarity.translationKey}`)}
                      </p>
                      <p className="text-xs mt-1 opacity-80">
                        {t(`create-item:${currentRarity.descriptionKey}`)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <EmptyFieldState t={t} />
          )}
        </FieldWithVisibilityToggle>

        {/* Narrative Purpose */}
        <FieldWithVisibilityToggle
          fieldName="narrativePurpose"
          label={t("item-detail:fields.narrative_purpose")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editData.narrativePurpose || ""}
                onChange={(e) =>
                  onEditDataChange("narrativePurpose", e.target.value)
                }
                className="resize-none"
                rows={4}
                maxLength={1000}
                placeholder={t("item-detail:placeholders.narrative_purpose")}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.narrativePurpose?.length || 0}/1000</span>
              </div>
            </>
          ) : item.narrativePurpose ? (
            <p className="text-sm whitespace-pre-wrap">
              {item.narrativePurpose}
            </p>
          ) : (
            <EmptyFieldState t={t} />
          )}
        </FieldWithVisibilityToggle>
      </div>

      <Separator className="my-6" />

      {/* Mechanics Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("item-detail:sections.mechanics")}
        </h4>

        {/* Usage Requirements */}
        <FieldWithVisibilityToggle
          fieldName="usageRequirements"
          label={t("item-detail:fields.usage_requirements")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editData.usageRequirements || ""}
                onChange={(e) =>
                  onEditDataChange("usageRequirements", e.target.value)
                }
                className="resize-none"
                rows={4}
                maxLength={1000}
                placeholder={t("item-detail:placeholders.usage_requirements")}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.usageRequirements?.length || 0}/1000</span>
              </div>
            </>
          ) : item.usageRequirements ? (
            <p className="text-sm whitespace-pre-wrap">
              {item.usageRequirements}
            </p>
          ) : (
            <EmptyFieldState t={t} />
          )}
        </FieldWithVisibilityToggle>

        {/* Usage Consequences */}
        <FieldWithVisibilityToggle
          fieldName="usageConsequences"
          label={t("item-detail:fields.usage_consequences")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editData.usageConsequences || ""}
                onChange={(e) =>
                  onEditDataChange("usageConsequences", e.target.value)
                }
                className="resize-none"
                rows={4}
                maxLength={1000}
                placeholder={t("item-detail:placeholders.usage_consequences")}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.usageConsequences?.length || 0}/1000</span>
              </div>
            </>
          ) : item.usageConsequences ? (
            <p className="text-sm whitespace-pre-wrap">
              {item.usageConsequences}
            </p>
          ) : (
            <EmptyFieldState t={t} />
          )}
        </FieldWithVisibilityToggle>

        {/* Item Usage */}
        <FieldWithVisibilityToggle
          fieldName="itemUsage"
          label={t("item-detail:fields.item_usage")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          {isEditing ? (
            <>
              <Textarea
                value={editData.itemUsage || ""}
                onChange={(e) => onEditDataChange("itemUsage", e.target.value)}
                className="resize-none"
                rows={4}
                maxLength={500}
                placeholder={t("item-detail:placeholders.item_usage")}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{editData.itemUsage?.length || 0}/500</span>
              </div>
            </>
          ) : item.itemUsage ? (
            <p className="text-sm whitespace-pre-wrap">{item.itemUsage}</p>
          ) : (
            <EmptyFieldState t={t} />
          )}
        </FieldWithVisibilityToggle>
      </div>
    </>
  );

  // ==================
  // VERSIONS PANEL
  // ==================
  const versionsPanel = (
    <VersionsPanel title={t("item-detail:sections.versions")}>
      <EntityVersionManager<IItemVersion, IItem, ItemFormSchema>
        versions={versions}
        currentVersion={currentVersion}
        onVersionChange={onVersionChange}
        onVersionCreate={onVersionCreate}
        baseEntity={item}
        i18nNamespace="item-detail"
        renderVersionCard={({ version, isSelected, onClick }) => {
          // Check if version has valid data
          const hasValidData = !!version.itemData;

          return (
            <div className="relative">
              <div
                className={!hasValidData ? "opacity-50 cursor-not-allowed" : ""}
              >
                <VersionCard
                  version={version}
                  isSelected={isSelected}
                  onClick={hasValidData ? onClick : () => {}}
                  onDelete={onVersionDelete}
                  onUpdate={onVersionUpdate}
                />
              </div>
              {!hasValidData && !version.isMain && (
                <div className="text-xs text-destructive mt-1 px-2">
                  Dados corrompidos
                </div>
              )}
            </div>
          );
        }}
        renderCreateDialog={({ open, onClose, onConfirm, baseEntity }) => (
          <CreateVersionWithEntityDialog<IItem, ItemFormSchema>
            open={open}
            onClose={onClose}
            onConfirm={onConfirm}
            baseEntity={baseEntity}
            i18nNamespace="item-detail"
            renderEntityModal={({ open, onOpenChange, onConfirm }) => (
              <CreateItemModal
                open={open}
                onClose={() => onOpenChange(false)}
                onConfirm={onConfirm}
              />
            )}
          />
        )}
      />
    </VersionsPanel>
  );

  // ==================
  // RENDER
  // ==================
  return (
    <div className="relative min-h-screen">
      <ItemNavigationSidebar
        isOpen={isNavigationSidebarOpen}
        onClose={onNavigationSidebarClose}
        items={allItems.map((i) => ({
          id: i.id,
          name: i.name,
          image: i.image,
        }))}
        currentItemId={item.id}
        onItemSelect={onItemSelect}
      />

      <div className="w-full">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <EntityDetailLayout
            icon={Package}
            title={item.name}
            isEditMode={isEditing}
            hasChanges={hasChanges}
            onBack={onBack}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            onDelete={onDeleteModalOpen}
            hasRequiredFieldsEmpty={!isValid}
            validationMessage={
              !isValid ? (
                <p className="text-xs text-destructive">
                  {missingFields.length > 0 ? (
                    <>
                      {t("item-detail:missing_fields")}:{" "}
                      {missingFields
                        .map((field) => {
                          const fieldNames: Record<string, string> = {
                            name: t("item-detail:fields.name"),
                            status: t("item-detail:fields.status"),
                            category: t("item-detail:fields.category"),
                            basicDescription: t(
                              "item-detail:fields.basic_description"
                            ),
                          };
                          return fieldNames[field] || field;
                        })
                        .join(", ")}
                    </>
                  ) : customCategoryError ? (
                    customCategoryError
                  ) : (
                    t("item-detail:fill_required_fields")
                  )}
                </p>
              ) : undefined
            }
            basicFields={basicFields}
            advancedFields={advancedFields}
            advancedSectionTitle={t("item-detail:sections.advanced_info")}
            advancedSectionOpen={advancedSectionOpen}
            onAdvancedSectionToggle={onAdvancedSectionToggle}
            versionsPanel={versionsPanel}
            showMenuButton
            onMenuToggle={onNavigationSidebarToggle}
            backLabel={t("item-detail:header.back")}
            editLabel={t("item-detail:header.edit")}
            deleteLabel={t("item-detail:header.delete")}
            saveLabel={t("item-detail:header.save")}
            cancelLabel={t("item-detail:header.cancel")}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteModal}
        onClose={onDeleteModalClose}
        itemName={item.name}
        currentVersion={currentVersion}
        versionName={currentVersion?.name}
        totalVersions={versions.length}
        onConfirmDelete={onConfirmDelete}
      />
    </div>
  );
});
