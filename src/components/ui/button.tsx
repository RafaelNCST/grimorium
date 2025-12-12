import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-accent-glow hover:-translate-y-0.5 transition-all duration-300",
        magical:
          "relative overflow-visible bg-gradient-primary text-primary-foreground transition-all duration-300 hover:shadow-magical-glow hover:brightness-125 hover:saturate-150 animate-glow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-red-500 hover:brightness-125 transition-colors duration-200 animate-glow-red",
        secondary:
          "border border-border bg-card text-card-foreground hover:bg-primary-glow hover:text-white hover:border-primary-glow hover:shadow-glow transition-all duration-300",
        ghost:
          "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
        "ghost-bright":
          "hover:bg-black/10 dark:hover:bg-black/20 transition-colors duration-200",
        "ghost-destructive":
          "hover:bg-destructive/10 hover:text-destructive transition-colors duration-200",
        "ghost-active":
          "hover:bg-accent hover:text-accent-foreground transition-colors duration-200 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent:
          "bg-gradient-accent text-accent-foreground hover:shadow-accent-glow hover:-translate-y-0.5 font-semibold transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  active?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, active, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-active={active}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
