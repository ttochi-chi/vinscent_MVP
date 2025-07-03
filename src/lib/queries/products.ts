import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// 🔧 Product API 클라이언트 함수들
const productsApi = {
  // 모든 제품 조회
  getAll: async () => {
    const response = await fetch('/api/products')
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  // 브랜드별 제품 조회
  getByBrand: async (brandId: number) => {
    const response = await fetch(`/api/products?brandId=${brandId}`)
    if (!response.ok) throw new Error('Failed to fetch products by brand')
    return response.json()
  },

  // 특정 제품 조회
  getById: async (id: number) => {
    const response = await fetch(`/api/products/${id}`)
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  },

  // 제품 개수 조회
  getCount: async () => {
    const response = await fetch('/api/products?count=true')
    if (!response.ok) throw new Error('Failed to fetch product count')
    return response.json()
  },

  // 제품 생성 (메인 이미지 + 설명 이미지들)
  create: async (data: {
    title: string
    description?: string
    topNote?: string
    middleNote?: string
    baseNote?: string
    price: number
    mainImageUrl?: string
    brandId: number
    images?: string[]
  }) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create product')
    return response.json()
  },

  // 제품 수정
  update: async (data: {
    id: number
    title?: string
    description?: string
    topNote?: string
    middleNote?: string
    baseNote?: string
    price?: number
    mainImageUrl?: string
    brandId?: number
    images?: string[]
  }) => {
    const response = await fetch(`/api/products/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update product')
    return response.json()
  },

  // 제품 삭제
  delete: async (id: number) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete product')
    return response.json()
  },
}

//Query Hooks
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  })
}

export const useProductsByBrand = (brandId: number) => {
  return useQuery({
    queryKey: ['products', 'brand', brandId],
    queryFn: () => productsApi.getByBrand(brandId),
    enabled: !!brandId, // brandId가 있을 때만 실행
  })
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id, // id가 있을 때만 실행
  })
}

export const useProductCount = () => {
  return useQuery({
    queryKey: ['products', 'count'],
    queryFn: productsApi.getCount,
  })
}

//Mutation Hooks
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', 'brand', variables.brandId] })
      queryClient.invalidateQueries({ queryKey: ['products', 'count'] })
      
      // 브랜드 관련 쿼리도 갱신 (제품이 추가됨)
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.update,
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] })
      // 브랜드별 쿼리도 갱신 (브랜드가 변경될 수 있음)
      queryClient.invalidateQueries({ queryKey: ['products', 'brand'] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      // 성공 시 모든 제품 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
  })
}

//브랜드와 제품 연동 훅스
export const useBrandWithProducts = (brandId: number) => {
  const brandQuery = useQuery({
    queryKey: ['brands', brandId],
    queryFn: async () => {
      const response = await fetch(`/api/brands/${brandId}`)
      if (!response.ok) throw new Error('Failed to fetch brand')
      return response.json()
    },
    enabled: !!brandId,
  })

  const productsQuery = useProductsByBrand(brandId)

  return {
    brand: brandQuery.data,
    products: productsQuery.data,
    isLoading: brandQuery.isLoading || productsQuery.isLoading,
    error: brandQuery.error || productsQuery.error,
  }
}

//이미지 업로드 지원 훅
export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) throw new Error('Failed to upload image')
      return response.json()
    },
  })
}