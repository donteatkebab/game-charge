"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.success("سانر توست با موفقیت نمایش داده شد.")
      }
    >
      نمایش سانر
    </Button>
  )
}
