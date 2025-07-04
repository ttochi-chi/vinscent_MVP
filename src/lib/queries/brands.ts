import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateBrandData, UpdateBrandData } from '../db/operations/brands'
import { queryKeys, getErrorMessage } from '../queryClient'

//Brand API 클라이언트 함수들
const brandsApi = {
  // 모든 브랜드 조회
  getAll: async () => {
    const response = await fetch('/api/brands')
    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`)
    }
    return response.json()
  },
  
  // 특정 브랜드 조회
  getById: async (id: number) => {
    const response = await fetch(`/api/brands/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch brand: ${response.status}`)
    }
    return response.json()
  },

  // 브랜드 개수 조회
  getCount: async () => {
    const response = await fetch('/api/brands?count=true')
    if (!response.ok) {
      throw new Error(`Failed to fetch brand count: ${response.status}`)
    }
    return response.json()
  },

  // 브랜드 생성
  create: async (data: CreateBrandData) => {
    const response = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to create brand: ${response.status}`)
    }
    return response.json()
  },

  // 브랜드 수정
  update: async ({ id, data }: { id: number; data: UpdateBrandData }) => {
    const response = await fetch(`/api/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to update brand: ${response.status}`)
    }
    return response.json()
  },

  // 브랜드 삭제
  delete: async (id: number) => {
    const response = await fetch(`/api/brands/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to delete brand: ${response.status}`)
    }
    return response.json()
  },
}

//Query Hooks
export const useBrands = () => {
  return useQuery({
    queryKey: queryKeys.brands.lists(),
    queryFn: brandsApi.getAll,
    select: (data) => data.brands || [], // API 응답에서 brands 배열 추출
  })
}

export const useBrand = (id: number) => {
  return useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: () => brandsApi.getById(id),
    enabled: !!id && id > 0,
    select: (data) => data.brand, // API 응답에서 brand 객체 추출
  })
}

export const useBrandCount = () => {
  return useQuery({
    queryKey: queryKeys.brands.count(),
    queryFn: brandsApi.getCount,
    select: (data) => data.count || 0,
  })
}

//Mutation Hooks
export const useCreateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: brandsApi.create,
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.count() })
      
      // 새로 생성된 브랜드를 캐시에 추가 (낙관적 업데이트)
      if (data.brand?.id) {
        queryClient.setQueryData(
          queryKeys.brands.detail(data.brand.id),
          { brand: data.brand }
        )
      }
    },
    onError: (error) => {
      console.error('Brand creation failed:', getErrorMessage(error))
    },
  })
}

export const useUpdateBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: brandsApi.update,
    onMutate: async ({ id, data }) => {
      //실제 업데이트 전에 UI를 먼저 업데이트
      await queryClient.cancelQueries({ queryKey: queryKeys.brands.detail(id) })
      
      const previousBrand = queryClient.getQueryData(queryKeys.brands.detail(id))
      
      queryClient.setQueryData(queryKeys.brands.detail(id), (old: any) => ({
        ...old,
        brand: { ...old?.brand, ...data }
      }))
      
      return { previousBrand }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context?.previousBrand) {
        queryClient.setQueryData(queryKeys.brands.detail(variables.id), context.previousBrand)
      }
      console.error('Brand update failed:', getErrorMessage(error))
    },
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(variables.id) })
      
      // 연관된 제품, 매거진 쿼리도 갱신 (브랜드 정보 변경 시)
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byBrand(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.magazines.byBrand(variables.id) })
    },
  })
}

export const useDeleteBrand = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: brandsApi.delete,
    onMutate: async (id) => {
      //삭제할 브랜드를 목록에서 제거
      await queryClient.cancelQueries({ queryKey: queryKeys.brands.lists() })
      
      const previousBrands = queryClient.getQueryData(queryKeys.brands.lists())
      
      queryClient.setQueryData(queryKeys.brands.lists(), (old: any) => ({
        ...old,
        brands: old?.brands?.filter((brand: any) => brand.id !== id) || []
      }))
      
      return { previousBrands }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context?.previousBrands) {
        queryClient.setQueryData(queryKeys.brands.lists(), context.previousBrands)
      }
      console.error('Brand deletion failed:', getErrorMessage(error))
    },
    onSuccess: (data, deletedId) => {
      // 성공 시 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.count() })
      
      // 삭제된 브랜드 상세 정보 캐시 제거
      queryClient.removeQueries({ queryKey: queryKeys.brands.detail(deletedId) })
      
      // 연관된 제품, 매거진 쿼리도 갱신
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byBrand(deletedId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.magazines.byBrand(deletedId) })
    },
  })
}

//복합 데이터 훅스 (브랜드와 관련 데이터 함께 조회)
export const useBrandWithStats = (id: number) => {
  const brandQuery = useBrand(id)
  
  const productsQuery = useQuery({
    queryKey: queryKeys.products.byBrand(id),
    queryFn: async () => {
      const response = await fetch(`/api/products?brandId=${id}`)
      if (!response.ok) throw new Error('Failed to fetch brand products')
      return response.json()
    },
    enabled: !!id && id > 0,
  })
  
  const magazinesQuery = useQuery({
    queryKey: queryKeys.magazines.byBrand(id),
    queryFn: async () => {
      const response = await fetch(`/api/magazines?brandId=${id}`)
      if (!response.ok) throw new Error('Failed to fetch brand magazines')
      return response.json()
    },
    enabled: !!id && id > 0,
  })

  return {
    brand: brandQuery.data,
    products: productsQuery.data?.products || [],
    magazines: magazinesQuery.data?.magazines || [],
    stats: {
      productCount: productsQuery.data?.count || 0,
      magazineCount: magazinesQuery.data?.count || 0,
    },
    isLoading: brandQuery.isLoading || productsQuery.isLoading || magazinesQuery.isLoading,
    error: brandQuery.error || productsQuery.error || magazinesQuery.error,
  }
}