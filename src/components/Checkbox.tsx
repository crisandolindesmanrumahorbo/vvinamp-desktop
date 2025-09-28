import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { ComponentProps } from "react";

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root>;

export const Checkbox = ({ ...props }: CheckboxProps) => (
  <CheckboxPrimitive.Root
    className="h-5 w-5 bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:bg-primary"
    {...props}
  >
    <CheckboxPrimitive.Indicator className="h-full w-full">
      <Check className="h-full w-full" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
