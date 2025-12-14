import { AlertTriangle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

interface StandardDeleteModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void | Promise<void>;
	title: string;
	description: string;
	cancelText?: string;
	confirmText?: string;
	requireNameConfirmation?: boolean;
	itemName?: string;
	itemType?: string;
	isDeleting?: boolean;
	children?: React.ReactNode;
}

export function StandardDeleteModal({
	open,
	onOpenChange,
	onConfirm,
	title,
	description,
	cancelText = "Cancelar",
	confirmText = "Excluir",
	requireNameConfirmation = false,
	itemName,
	itemType = "item",
	isDeleting = false,
	children,
}: StandardDeleteModalProps) {
	const [confirmName, setConfirmName] = useState("");
	const isValid = !requireNameConfirmation || confirmName === itemName;

	useEffect(() => {
		if (!open) {
			setConfirmName("");
		}
	}, [open]);

	const handleConfirm = async () => {
		if (isValid && !isDeleting) {
			await onConfirm();
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader className="text-left">
					{/* Ícone e Título lado a lado */}
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-destructive/10 p-2 flex-shrink-0">
							<AlertTriangle className="h-5 w-5 text-destructive" />
						</div>
						{/* Título */}
						<AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
					</div>

					{/* Descrição */}
					<AlertDialogDescription className="pt-4 text-left font-medium text-foreground">
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>

				{/* Validação de Nome (opcional) */}
				{requireNameConfirmation && itemName && (
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							Esta ação não pode ser desfeita.
						</p>
						<div className="space-y-2">
							<Label htmlFor="confirm-name" className="text-sm font-medium">
								Digite <span className="font-mono">{itemName}</span> para
								confirmar:
							</Label>
							<Input
								id="confirm-name"
								value={confirmName}
								onChange={(e) => setConfirmName(e.target.value)}
								placeholder={itemName}
								className="font-mono"
								disabled={isDeleting}
							/>
						</div>
					</div>
				)}

				{/* Conteúdo Customizado (opcional) */}
				{children && (
					<div className="space-y-2 rounded-md bg-muted p-4">{children}</div>
				)}

				{/* Footer */}
				<AlertDialogFooter className="flex justify-end gap-2">
					<AlertDialogCancel disabled={isDeleting}>
						{cancelText}
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						size="lg"
						className="animate-glow-red"
						onClick={handleConfirm}
						disabled={!isValid || isDeleting}
					>
						{isDeleting ? (
							<>
								<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
								Excluindo...
							</>
						) : (
							confirmText
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
