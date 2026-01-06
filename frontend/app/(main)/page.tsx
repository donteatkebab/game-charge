import { SonnerDemo } from "@/components/sonner-demo"
import { AlertDialogDemo } from "@/components/alert-dialog-demo"
import { strapiFetch } from "@/lib/strapi-fetch"
import { CategoryGrid } from "@/components/category/category-grid"

export default async function Page() {
  const categories: any = await strapiFetch("categories", {
    qs: { populate: "*" },
    revalidate: 60,
  })

  console.log(categories)

  return (
    <>
      <section><SonnerDemo /></section>
      <section><AlertDialogDemo /></section>
      <section>
        <CategoryGrid categories={categories.data} />
      </section>
    </>
  )
}