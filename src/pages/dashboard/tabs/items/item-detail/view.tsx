import { useState } from "react";

import { ArrowLeft, Edit2, Trash2, Menu, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ItemNavigationSidebar } from "@/components/item-navigation-sidebar";
import { AlternativeNamesInput } from "@/components/modals/create-item-modal/components/alternative-names-input";
import { CategorySelector } from "@/components/modals/create-item-modal/components/category-selector";
import { RarityPicker } from "@/components/modals/create-item-modal/components/rarity-picker";
import { StatusPicker } from "@/components/modals/create-item-modal/components/status-picker";
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
import { IItem, IItemVersion } from "@/lib/db/items.service";

import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";
import { VersionManager } from "./components/version-manager";
import { type IItemCategory } from "./constants/item-categories-constant";
import { type IItemStatus } from "./constants/item-statuses-constant";
import { type IStoryRarity } from "./constants/story-rarities-constant";

interface ItemDetailViewProps {
  item: IItem;
  editData: IItem;
  isEditing: boolean;
  versions: IItemVersion[];
  currentVersion: IItemVersion | null;
  showDeleteModal: boolean;
  isNavigationSidebarOpen: boolean;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  allItems: IItem[];
  categories: IItemCategory[];
  statuses: IItemStatus[];
  rarities: IStoryRarity[];
  currentCategory: IItemCategory | undefined;
  currentStatus: IItemStatus | undefined;
  currentRarity: IStoryRarity | undefined;
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
    itemData: IItem;
  }) => void;
  onVersionDelete: (versionId: string) => void;
  onVersionUpdate: (
    versionId: string,
    name: string,
    description?: string
  ) => void;
  onImageFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEditDataChange: (field: string, value: unknown) => void;
}

export function ItemDetailView({
  item,
  editData,
  isEditing,
  versions,
  currentVersion,
  showDeleteModal,
  isNavigationSidebarOpen,
  imagePreview,
  fileInputRef,
  allItems,
  categories,
  statuses,
  rarities,
  currentCategory,
  currentStatus,
  currentRarity,
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
  onImageFileChange,
  onEditDataChange,
}: ItemDetailViewProps) {
  const { t } = useTranslation(["item-detail", "create-item"]);
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);

  const CategoryIcon = currentCategory?.icon;
  const StatusIcon = currentStatus?.icon;
  const RarityIcon = currentRarity?.icon;

  return (
    <div className="relative">
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

      <div className="w-full overflow-hidden">
        <div className="container mx-auto py-8 px-4 pb-16 max-w-7xl">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!isEditing && (
                  <>
                    <Button variant="ghost" onClick={onBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t("item-detail:header.back")}
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
                      {t("item-detail:header.cancel")}
                    </Button>
                    <Button
                      variant="magical"
                      className="animate-glow"
                      onClick={onSave}
                    >
                      {t("item-detail:header.save")}
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
            <div
              className={`${isEditing ? "lg:col-span-4" : "lg:col-span-3"} space-y-6`}
            >
              <Card className="card-magical">
                <CardHeader>
                  <CardTitle>{t("item-detail:sections.basic_info")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label>{t("item-detail:fields.image")}</Label>
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
                                  {t("item-detail:upload.click")}
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

                      <div className="space-y-2">
                        <Label>{t("item-detail:fields.name")} *</Label>
                        <Input
                          value={editData.name}
                          onChange={(e) =>
                            onEditDataChange("name", e.target.value)
                          }
                          placeholder={t("create-item:modal.name_placeholder")}
                          maxLength={150}
                          required
                        />
                        <div className="flex justify-end text-xs text-muted-foreground">
                          <span>{editData.name?.length || 0}/150</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <StatusPicker
                          value={editData.status || ""}
                          onChange={(value) =>
                            onEditDataChange("status", value)
                          }
                        />
                        <CategorySelector
                          value={editData.category || ""}
                          customCategory={editData.customCategory || ""}
                          onChange={(value) =>
                            onEditDataChange("category", value)
                          }
                          onCustomCategoryChange={(value) =>
                            onEditDataChange("customCategory", value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {t("item-detail:fields.basic_description")} *
                        </Label>
                        <Textarea
                          value={editData.basicDescription || ""}
                          onChange={(e) =>
                            onEditDataChange("basicDescription", e.target.value)
                          }
                          placeholder={t(
                            "create-item:modal.basic_description_placeholder"
                          )}
                          rows={4}
                          maxLength={500}
                          className="resize-none"
                          required
                        />
                        <div className="flex justify-end text-xs text-muted-foreground">
                          <span>
                            {editData.basicDescription?.length || 0}/500
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
                        {item.image || imagePreview ? (
                          <img
                            src={item.image || imagePreview}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl text-muted-foreground/50">
                              {item.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h2 className="text-3xl font-bold">{item.name}</h2>
                        <div className="flex items-center gap-3 flex-wrap">
                          {CategoryIcon && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CategoryIcon className="w-4 h-4 text-primary" />
                              <span>
                                {t(
                                  `create-item:${currentCategory?.translationKey}`
                                )}
                              </span>
                            </div>
                          )}
                          {StatusIcon && (
                            <div
                              className={`flex items-center gap-2 text-sm ${currentStatus?.activeColor || ""}`}
                            >
                              <StatusIcon className="w-4 h-4" />
                              <span>
                                {t(
                                  `create-item:${currentStatus?.translationKey}`
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-foreground text-base mt-4">
                          {item.basicDescription}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Collapsible
                open={advancedSectionOpen}
                onOpenChange={setAdvancedSectionOpen}
              >
                <Card className="card-magical">
                  <CardHeader>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer">
                        <CardTitle>
                          {t("item-detail:sections.advanced_info")}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          {advancedSectionOpen
                            ? t("item-detail:actions.close")
                            : t("item-detail:actions.open")}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>{t("item-detail:fields.appearance")}</Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.appearance || ""}
                                onChange={(e) =>
                                  onEditDataChange("appearance", e.target.value)
                                }
                                placeholder={t(
                                  "create-item:modal.appearance_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.appearance?.length || 0}/500
                                </span>
                              </div>
                            </>
                          ) : item.appearance ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {item.appearance}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t("item-detail:empty_states.no_data")}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>{t("item-detail:fields.origin")}</Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.origin || ""}
                                onChange={(e) =>
                                  onEditDataChange("origin", e.target.value)
                                }
                                placeholder={t(
                                  "create-item:modal.origin_placeholder"
                                )}
                                rows={4}
                                maxLength={500}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>{editData.origin?.length || 0}/500</span>
                              </div>
                            </>
                          ) : item.origin ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {item.origin}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t("item-detail:empty_states.no_data")}
                            </p>
                          )}
                        </div>
                      </div>

                      {!isEditing && (
                        <>
                          <Separator />

                          <div className="space-y-2">
                            <Label>{t("item-detail:fields.rarity")}</Label>
                            {currentRarity ? (
                              <div
                                className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 ${currentRarity.bgColorClass}`}
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <RarityIcon
                                    className={`w-5 h-5 ${currentRarity.color}`}
                                  />
                                  <span
                                    className={`text-sm font-medium ${currentRarity.color}`}
                                  >
                                    {t(
                                      `create-item:${currentRarity.translationKey}`
                                    )}
                                  </span>
                                </div>
                                <p className="text-xs text-foreground/80">
                                  {t(
                                    `create-item:${currentRarity.descriptionKey}`
                                  )}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {t("item-detail:empty_states.no_data")}
                              </p>
                            )}
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <Label>Nomes Alternativos</Label>
                            {item.alternativeNames &&
                            item.alternativeNames.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {item.alternativeNames.map((name, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {t("item-detail:empty_states.no_data")}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      <Separator />

                      {isEditing && (
                        <>
                          <RarityPicker
                            value={editData.storyRarity || ""}
                            onChange={(value) =>
                              onEditDataChange("storyRarity", value)
                            }
                          />

                          <Separator />

                          <AlternativeNamesInput
                            names={editData.alternativeNames || []}
                            onChange={(names) =>
                              onEditDataChange("alternativeNames", names)
                            }
                          />

                          <Separator />
                        </>
                      )}

                      <div className="space-y-2">
                        <Label>
                          {t("item-detail:fields.narrative_purpose")}
                        </Label>
                        {isEditing ? (
                          <>
                            <Textarea
                              value={editData.narrativePurpose || ""}
                              onChange={(e) =>
                                onEditDataChange(
                                  "narrativePurpose",
                                  e.target.value
                                )
                              }
                              placeholder={t(
                                "create-item:modal.narrative_purpose_placeholder"
                              )}
                              rows={4}
                              maxLength={500}
                              className="resize-none"
                            />
                            <div className="flex justify-end text-xs text-muted-foreground">
                              <span>
                                {editData.narrativePurpose?.length || 0}/500
                              </span>
                            </div>
                          </>
                        ) : item.narrativePurpose ? (
                          <p className="text-sm whitespace-pre-wrap">
                            {item.narrativePurpose}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {t("item-detail:empty_states.no_data")}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>
                            {t("item-detail:fields.usage_requirements")}
                          </Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.usageRequirements || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "usageRequirements",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "create-item:modal.usage_requirements_placeholder"
                                )}
                                rows={3}
                                maxLength={250}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.usageRequirements?.length || 0}/250
                                </span>
                              </div>
                            </>
                          ) : item.usageRequirements ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {item.usageRequirements}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t("item-detail:empty_states.no_data")}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>
                            {t("item-detail:fields.usage_consequences")}
                          </Label>
                          {isEditing ? (
                            <>
                              <Textarea
                                value={editData.usageConsequences || ""}
                                onChange={(e) =>
                                  onEditDataChange(
                                    "usageConsequences",
                                    e.target.value
                                  )
                                }
                                placeholder={t(
                                  "create-item:modal.usage_consequences_placeholder"
                                )}
                                rows={3}
                                maxLength={250}
                                className="resize-none"
                              />
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span>
                                  {editData.usageConsequences?.length || 0}/250
                                </span>
                              </div>
                            </>
                          ) : item.usageConsequences ? (
                            <p className="text-sm whitespace-pre-wrap">
                              {item.usageConsequences}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t("item-detail:empty_states.no_data")}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </div>

            {!isEditing && (
              <div className="lg:col-span-1 space-y-6">
                <Card className="card-magical sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {t("item-detail:sections.versions")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[600px]">
                    <VersionManager
                      versions={versions}
                      currentVersion={currentVersion}
                      onVersionChange={onVersionChange}
                      onVersionCreate={onVersionCreate}
                      onVersionDelete={onVersionDelete}
                      onVersionUpdate={onVersionUpdate}
                      isEditMode={isEditing}
                      mainItemData={item}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

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
}
