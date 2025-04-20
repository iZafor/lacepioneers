import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const spinnerVariants = cva("", {
    variants: {
        variant: {
            default: "border-gray-200 border-t-gray-600",
            primary: "border-blue-200 border-t-blue-500",
            success: "border-green-200 border-t-green-500",
            warning: "border-amber-200 border-t-amber-500",
            error: "border-red-200 border-t-red-500",
            gradient: "border-purple-200 border-t-blue-500",
        },
        size: {
            sm: "h-6 w-6 border-2",
            md: "h-10 w-10 border-3",
            lg: "h-16 w-16 border-4",
            xl: "h-24 w-24 border-[6px]",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "sm",
    },
});

export default function LoadingSpinner({
    className,
    variant,
    size,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof spinnerVariants>) {
    return (
        <div
            {...props}
            className={cn(
                "absolute top-1/2 left-1/2 -translate-1/2 animate-spin rounded-full",
                spinnerVariants({ variant, size }),
                className
            )}
        ></div>
    );
}
