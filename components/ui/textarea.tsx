import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-green-500/20 focus-visible:border-green-500 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 border-0 bg-gray-100 dark:bg-zinc-800 flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base text-gray-900 dark:text-zinc-200 transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:bg-white dark:focus-visible:bg-zinc-700",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
