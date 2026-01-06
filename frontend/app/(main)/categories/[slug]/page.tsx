import { strapiFetch } from "@/lib/strapi-fetch"
import { ProductGrid } from "@/components/product/product-grid"
import type { SubCategoryAttributes } from "@/types/sub-category"
import type { OrderMethodAttributes } from "@/types/order-method"
import { CategoryCartProvider } from "@/components/cart/category-cart-context"
import { CategoryCartCard } from "@/components/cart/category-cart-card"
import { CategoryCheckoutCard } from "@/components/cart/category-checkout-card"
import { OrderInfoPanel } from "@/components/cart/order-info-panel"
import { ArticleSection } from "@/components/content/article-section"
import { FaqSection } from "@/components/content/faq-section"
import { CommentsSection } from "@/components/comment/comments-section"
import type { StrapiCollectionResponse } from "@/types/strapi-collection-response"



export default async function Page({ params }: { params: Promise<any> }) {
  const { slug } = await params

  const [subCategories, orderMethods] = await Promise.all([
    strapiFetch<StrapiCollectionResponse<SubCategoryAttributes>>(
      "sub-categories",
      {
        qs: {
          populate: {
            products: {
              populate: "*",
            },
          },
          filters: {
            category: {
              slug: {
                $eq: slug,
              },
            },
          },
        },
        revalidate: 60,
      }
    ),
    strapiFetch<StrapiCollectionResponse<OrderMethodAttributes>>(
      "order-methods",
      {
        qs: {
          populate: {
            order_method_fields: { sort: ["sort_order:asc"] },
            category: { populate: "*" },
          },
          filters: {
            category: {
              slug: {
                $eq: slug,
              },
            },
          },
          sort: ["sort_order:asc"],
        },
        revalidate: 60,
      }
    ),
  ])

  return (
    <CategoryCartProvider categorySlug={slug}>
      <>
        <div className="flex flex-col">
          {subCategories.data.map((subCategory) => (
            <section
              key={subCategory.documentId}
              className="w-full flex flex-col pt-4 space-y-4"
              id="products"
            >
              <h2 className="text-lg font-semibold text-center">{subCategory.title}</h2>
              <ProductGrid products={subCategory.products} />
            </section>
          ))}
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-center">سبد انتخاب</h2>
                <CategoryCartCard />
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-center">تسویه حساب</h2>
                <CategoryCheckoutCard orderMethods={orderMethods.data} />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            <OrderInfoPanel />
          </div>
        </div>
        <div className="space-y-6">
          <ArticleSection />
          <FaqSection />
          <CommentsSection />
        </div>
      </>
    </CategoryCartProvider>
  )
}
