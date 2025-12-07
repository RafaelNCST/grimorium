import { useState } from "react";

import { ListChecks, Plus, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { PropsChecklistCard } from "../types/overview-types";

const MAX_TASK_LENGTH = 200;

export function ChecklistCard({
  checklistItems,
  isCustomizing,
  onAddItem,
  onToggleItem,
  onEditItem,
  onDeleteItem,
}: PropsChecklistCard) {
  const { t } = useTranslation("overview");
  const [newItemText, setNewItemText] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText);
      setNewItemText("");
    }
  };

  const handleStartEdit = (id: string, currentText: string) => {
    setEditingItemId(id);
    setEditingText(currentText);
  };

  const handleSaveEdit = (id: string) => {
    if (editingText.trim()) {
      onEditItem(id, editingText);
    }
    setEditingItemId(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <Card className="card-magical w-full h-fit animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            {t("checklist.title")}
          </CardTitle>
          <CardDescription>{t("checklist.description")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4 mb-4">
          <div className="space-y-2">
            {checklistItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t("checklist.empty_state")}
              </p>
            )}
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => onToggleItem(item.id)}
                  disabled={isCustomizing}
                  className="flex-shrink-0"
                />
                {editingItemId === item.id ? (
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => handleSaveEdit(item.id))
                        }
                        autoFocus
                        maxLength={MAX_TASK_LENGTH}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="magical"
                        onClick={() => handleSaveEdit(item.id)}
                      >
                        {t("checklist.save")}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleCancelEdit}
                      >
                        {t("checklist.cancel")}
                      </Button>
                    </div>
                    <div className="flex justify-end">
                      <span className="text-xs text-muted-foreground">
                        {editingText.length}/{MAX_TASK_LENGTH}
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 text-sm select-text ${
                        item.checked ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.text}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStartEdit(item.id, item.text)}
                        disabled={isCustomizing}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost-destructive"
                        onClick={() => onDeleteItem(item.id)}
                        disabled={isCustomizing}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="space-y-1">
          <div className="flex gap-2">
            <Input
              placeholder={t("checklist.add_item_placeholder")}
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, handleAddItem)}
              disabled={isCustomizing}
              maxLength={MAX_TASK_LENGTH}
            />
            <Button
              variant="secondary"
              onClick={handleAddItem}
              disabled={isCustomizing || !newItemText.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {newItemText.length}/{MAX_TASK_LENGTH}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
