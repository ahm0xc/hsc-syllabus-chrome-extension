import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "~/lib/utils";

const CircularProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const circumference = 2 * Math.PI * 20; // radius of 20
  const offset = circumference - (value! / 100) * circumference;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-5 w-5", className)}
      {...props}
    >
      <svg className="h-full w-full" viewBox="0 0 44 44">
        <circle
          className="stroke-muted"
          strokeWidth="4"
          fill="none"
          cx="22"
          cy="22"
          r="20"
        />
        <circle
          className="stroke-primary transition-all duration-300 ease-in-out"
          strokeWidth="4"
          fill="none"
          cx="22"
          cy="22"
          r="20"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
      </svg>
    </ProgressPrimitive.Root>
  );
});
CircularProgress.displayName = ProgressPrimitive.Root.displayName;

export { CircularProgress };
