import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateMagazineData, UpdateMagazineData } from '../db/operations/magazines'

// API 호출 함수들
const magazinesApi = {
  // 모든 매거진 조회
  getAll: async () => {
    const response = await fetch('/api/magazines')
    if (!response.ok) throw new Error('Failed to fetch magazines')
    return response.json()
  },

  // 브랜드별 매거진 조회
  getByBrand: async (brandId: number) => {
    const response = await fetch(`/api/magazines?brandId=${brandId}`)
    if (!response.ok) throw new Error('Failed to fetch magazines by brand')
    return response.json()
  },

  // 특정 매거진 조회 (이미지 포함)
  getById: async (id: number) => {
    const response = await fetch(`/api/magazines/${id}`)
    if (!response.ok) throw new Error('Failed to fetch magazine')
    return response.json()
  },

  // 매거진 생성 (다중 이미지)
  create: async (data: CreateMagazineData) => {
    const response = await fetch('/api/magazines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create magazine')
    return response.json()
  },

  // 매거진 수정 (이미지 포함)
  update: async ({ id, data }: { id: number; data: UpdateMagazineData }) => {
    const response = await fetch(`/api/magazines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update magazine')
    return response.json()
  },

  // 매거진 삭제 (이미지도 함께)
  delete: async (id: number) => {
    const response = await fetch(`/api/magazines/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete magazine')
    return response.json()
  },

  // 매거진 개수 조회
  getCount: async () => {
    const response = await fetch('/api/magazines?count=true')
    if (!response.ok) throw new Error('Failed to fetch magazine count')
    return response.json()
  },
}

// Query 훅스들
export const useMagazines = () => {
  return useQuery({
    queryKey: ['magazines'],
    queryFn: magazinesApi.getAll,
  })
}

export const useMagazinesByBrand = (brandId: number) => {
  return useQuery({
    queryKey: ['magazines', 'brand', brandId],
    queryFn: () => magazinesApi.getByBrand(brandId),
    enabled: !!brandId, // brandId가 있을 때만 실행
  })
}

export const useMagazine = (id: number) => {
  return useQuery({
    queryKey: ['magazines', id],
    queryFn: () => magazinesApi.getById(id),
    enabled: !!id, // id가 있을 때만 실행
  })
}

export const useMagazineCount = () => {
  return useQuery({
    queryKey: ['magazines', 'count'],
    queryFn: magazinesApi.getCount,
  })
}

// Mutation 훅스들
export const useCreateMagazine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: magazinesApi.create,
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ['magazines'] })
      queryClient.invalidateQueries({ queryKey: ['magazines', 'brand', variables.brandId] })
      queryClient.invalidateQueries({ queryKey: ['magazines', 'count'] })
    },
  })
}

export const useUpdateMagazine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: magazinesApi.update,
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ['magazines'] })
      queryClient.invalidateQueries({ queryKey: ['magazines', variables.id] })
      // 브랜드별 쿼리도 갱신 (브랜드가 변경될 수 있음)
      queryClient.invalidateQueries({ queryKey: ['magazines', 'brand'] })
    },
  })
}

export const useDeleteMagazine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: magazinesApi.delete,
    onSuccess: () => {
      // 성공 시 모든 매거진 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ['magazines'] })
    },
  })
}

// 브랜드와 매거진 연동 훅스
export const useBrandWithMagazines = (brandId: number) => {
  const brandQuery = useQuery({
    queryKey: ['brands', brandId],
    queryFn: async () => {
      const response = await fetch(`/api/brands/${brandId}`)
      if (!response.ok) throw new Error('Failed to fetch brand')
      return response.json()
    },
    enabled: !!brandId,
  })

  const magazinesQuery = useMagazinesByBrand(brandId)

  return {
    brand: brandQuery.data,
    magazines: magazinesQuery.data,
    isLoading: brandQuery.isLoading || magazinesQuery.isLoading,
    error: brandQuery.error || magazinesQuery.error,
  }
}