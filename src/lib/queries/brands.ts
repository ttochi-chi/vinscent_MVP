import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateBrandData, UpdateBrandData } from '../db/operations/brands'

const brandsApi = {
    //모든 브랜드 조회
    getAll: async () => {
        const response = await fetch('/api/brands')
        if (!response.ok) throw new Error('Failed to fetch brands')
        return response.json()
    },
    
    //특정 브랜드 조회
    getById: async (id: number) => {
        const response = await fetch(`/api/brands/${id}`)
        if(!response.ok) throw new Error('Failed to fetch brand')
        return response.json()
    },

    //브랜드 생성
    create: async (data: CreateBrandData) => {
        const response = await fetch('/api/brands', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
        if(!response.ok) throw new Error('Failed to create brand')
        return response.json()
    },

    //브랜드 수정
    update: async ({id, data}: {id: number; data: UpdateBrandData}) => {
        const response = await fetch(`/api/brands/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
        if(!response.ok) throw new Error('Failed to update brand')
        return response.json()
    },

    //브랜드 삭제
    delete: async (id: number) => {
        const response = await fetch(`/api/brands/${id}`, {
            method: 'DELETE',
        })
        if(!response.ok) throw new Error('Failed to delete brand')
        return response.json()
    },
}

    //Query Hooks
    export const useBrands = () => {
        return useQuery({
            queryKey: ['brands'],
            queryFn: brandsApi.getAll,
        })
    }

    export const useBrand = (id: number) => {
        return useQuery({
            queryKey: ['brands', id],
            queryFn: () => brandsApi.getById(id),
            enabled: !!id,
        })
    }

    //Mutation Hooks
    export const useCreateBrand = () => {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: brandsApi.create,
            onSuccess: () => {
            // 성공 시 브랜드 목록 다시 가져오기
            queryClient.invalidateQueries({ queryKey: ['brands'] })
            },
        })
    }

    export const useUpdateBrand = () => {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: brandsApi.update,
            onSuccess: (data, variables) => {
            // 성공 시 브랜드 목록과 개별 브랜드 데이터 갱신
            queryClient.invalidateQueries({ queryKey: ['brands'] })
            queryClient.invalidateQueries({ queryKey: ['brands', variables.id] })
            },
        })
    }

    export const useDeleteBrand = () => {
        const queryClient = useQueryClient()

        return useMutation({
            mutationFn: brandsApi.delete,
            onSuccess: () => {
            // 성공 시 브랜드 목록 다시 가져오기
            queryClient.invalidateQueries({ queryKey: ['brands'] })
            },
        })
    }

    //브랜드 개수만 조회 Hooks
    export const useBrandCount = () => {
        return useQuery({
            queryKey: ['brands', 'count'],
            queryFn: async () => {
            const response = await fetch('/api/brands?count=true')
            if (!response.ok) throw new Error('Failed to fetch brand count')
            return response.json()
            },
        })
    }