import { AlertTriangle } from "lucide-react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface StandardWarningDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void | Promise<void>;
	title: string;
	description: string;
	cancelText?: string;
	confirmText?: string;
	isProcessing?: boolean;
	children?: React.ReactNode;
	variant?: "warning" | "destructive";
	multipleActions?: boolean;
}

export function StandardWarningDialog({
	open,
	onOpenChange,
	onConfirm,
	title,
	description,
	cancelText = "Cancelar",
	confirmText = "Confirmar",
	isProcessing = false,
	children,
	variant = "warning",
	multipleActions = false,
}: StandardWarningDialogProps) {
	const handleConfirm = async () => {
		if (!isProcessing) {
			await onConfirm();
		}
	};

	const iconColor =
		variant === "warning"
			? "text-yellow-600 dark:text-yellow-500"
			: "text-destructive";
	const iconBg =
		variant === "warning" ? "bg-yellow-500/10" : "bg-destructive/10";

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader className="text-left">
					{/* Ícone e Título lado a lado */}
					<div className="flex items-center gap-3">
						<div className={`rounded-lg ${iconBg} p-2 flex-shrink-0`}>
							<AlertTriangle className={`h-5 w-5 ${iconColor}`} />
						</div>
						{/* Título */}
						<AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
					</div>

					{/* Descrição */}
					<AlertDialogDescription className="pt-4 text-left font-medium text-foreground">
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>

				{/* Conteúdo Customizado (opcional) */}
				{children && (
					<div className="space-y-2 rounded-md bg-muted p-4">{children}</div>
				)}

				{/* Footer - Layout Responsivo */}
				<AlertDialogFooter
					className={`flex gap-2 ${multipleActions ? "flex-col sm:flex-row" : "justify-end"}`}
				>
					<AlertDialogCancel
						className={multipleActions ? "m-0 flex-1" : ""}
						disabled={isProcessing}
					>
						{cancelText}
					</AlertDialogCancel>
					<Button
						variant={variant === "warning" ? "destructive" : "default"}
						size="lg"
						className={`animate-glow-red ${multipleActions ? "flex-1" : ""}`}
						onClick={handleConfirm}
						disabled={isProcessing}
					>
						{isProcessing ? (
							<>
								<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
								Processando...
							</>
						) : (
							confirmText
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
