import { ProductCard } from "./product-card"
import { ProductAttributes } from "@/types/product"

export function ProductGrid({ products }: { products: ProductAttributes[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.documentId} product={product} />
      ))}
    </div>
  )
}
