import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

// Block ghost clicks leaking to underlying elements after interacting with Popover content
let __popoverGhostInstalled = false
let __lastPopoverPointerDownAt = 0
const __POPOVER_GHOST_TIMEOUT__ = 250

// Create getter/setter functions to allow dialog to control the timer
const getPopoverPointerDownTime = () => {
  return (window as any).__lastPopoverPointerDownAt !== undefined
    ? (window as any).__lastPopoverPointerDownAt
    : __lastPopoverPointerDownAt;
};

const setPopoverPointerDownTime = (time: number) => {
  __lastPopoverPointerDownAt = time;
  (window as any).__lastPopoverPointerDownAt = time;
};

if (typeof window !== "undefined" && !__popoverGhostInstalled) {
  // Expose timer to global scope for dialog cleanup
  (window as any).__lastPopoverPointerDownAt = __lastPopoverPointerDownAt;

  window.addEventListener(
    "click",
    (e) => {
      const currentTime = Date.now();
      const lastTime = getPopoverPointerDownTime();
      if (currentTime - lastTime < __POPOVER_GHOST_TIMEOUT__) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    true
  )
  __popoverGhostInstalled = true
}

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 max-h-[calc(100vh-10vh)] overflow-y-auto rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      style={{
        maxHeight: 'min(calc(100vh - 10vh), var(--radix-popover-content-available-height, 100vh))',
        scrollBehavior: 'smooth'
      } as React.CSSProperties}
      onPointerDownCapture={() => {
        setPopoverPointerDownTime(Date.now())
      }}
      onMouseDownCapture={() => {
        setPopoverPointerDownTime(Date.now())
      }}
      onTouchStartCapture={() => {
        setPopoverPointerDownTime(Date.now())
      }}
      onOpenAutoFocus={() => {
        setPopoverPointerDownTime(0)
      }}
      onCloseAutoFocus={() => {
        setPopoverPointerDownTime(0)
      }}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
