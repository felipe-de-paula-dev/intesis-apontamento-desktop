import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min],
    [value, defaultValue, min]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className="
          relative w-full grow overflow-hidden rounded-md bg-gray-200
          data-[orientation=horizontal]:h-3
          data-[orientation=vertical]:w-3 data-[orientation=vertical]:h-full
        "
      >
        <SliderPrimitive.Range
          className="
            absolute bg-blue-500
            data-[orientation=horizontal]:h-full
            data-[orientation=vertical]:w-full
          "
        />
      </SliderPrimitive.Track>

      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="
            block size-4 shrink-0 rounded-md border border-gray-400 bg-white shadow
            hover:ring-1 focus-visible:ring-1 focus-visible:outline-none
          "
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }