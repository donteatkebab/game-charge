"use client"

import * as React from "react"

type CategoryCartState = {
  categorySlug: string | null
  productId: string | null
  productTitle?: string
  unitPrice?: number
  quantity: number
}

type SelectProductInput = {
  productId: string
  productTitle?: string
  unitPrice?: number
}

type CategoryCartContextValue = {
  state: CategoryCartState
  setCategory: (slug: string) => void
  selectProduct: (input: SelectProductInput) => void
  setQuantity: (qty: number) => void
  reset: () => void
}

const initialState: CategoryCartState = {
  categorySlug: null,
  productId: null,
  productTitle: undefined,
  unitPrice: undefined,
  quantity: 1,
}

const CategoryCartContext = React.createContext<CategoryCartContextValue | undefined>(
  undefined
)

function getResetState(categorySlug: string | null): CategoryCartState {
  return { ...initialState, categorySlug }
}

export function CategoryCartProvider({
  categorySlug,
  children,
}: {
  categorySlug: string
  children: React.ReactNode
}) {
  const [state, setState] = React.useState<CategoryCartState>(() =>
    getResetState(categorySlug ?? null)
  )

  const setCategory = React.useCallback((slug: string) => {
    setState((prev) => {
      if (prev.categorySlug === slug) return prev
      return getResetState(slug)
    })
  }, [])

  const selectProduct = React.useCallback(
    ({ productId, productTitle, unitPrice }: SelectProductInput) => {
      setState((prev) => ({
        ...prev,
        productId,
        productTitle,
        unitPrice,
        quantity: 1,
      }))
    },
    []
  )

  const setQuantity = React.useCallback((qty: number) => {
    const nextQty =
      Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 1
    setState((prev) => ({ ...prev, quantity: nextQty }))
  }, [])

  const reset = React.useCallback(() => {
    setState((prev) => getResetState(prev.categorySlug))
  }, [])

  React.useEffect(() => {
    setCategory(categorySlug)
  }, [categorySlug, setCategory])

  const value = React.useMemo(
    () => ({ state, setCategory, selectProduct, setQuantity, reset }),
    [state, setCategory, selectProduct, setQuantity, reset]
  )

  return (
    <CategoryCartContext.Provider value={value}>
      {children}
    </CategoryCartContext.Provider>
  )
}

export function useCategoryCart() {
  const context = React.useContext(CategoryCartContext)
  if (!context) {
    throw new Error("useCategoryCart must be used within CategoryCartProvider")
  }
  return context
}
