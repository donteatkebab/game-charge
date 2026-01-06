import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SiteHeader() {
  return (
    <header className="container max-w-7xl mx-auto flex items-center justify-end px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

      <Button asChild variant="outline" size="sm">
        <Link href="/auth">ورود / ثبت‌نام</Link>
      </Button>
    </header>
  )
}