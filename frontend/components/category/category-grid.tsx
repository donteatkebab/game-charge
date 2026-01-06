import { CategoryAttributes } from "@/types/category"
import { CategoryCard } from "./category-card"

export function CategoryGrid({ categories }: { categories: CategoryAttributes[] }) {

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.documentId}
          category={category}
        />
      ))}
    </div>
  )
}
