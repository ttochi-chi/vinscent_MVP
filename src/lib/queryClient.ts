import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () => {
    return new QueryClient({
        defaultOptions:
        {
            queries:
            {
                // 캐싱 정량: 5분간 데이터를 fresh로 간주
                staleTime: 1000 * 60 * 10,
                //캐시 유지 시간 : 10분
                gcTime: 1000 * 60 * 10,
                //에러 발생 시 재시도 횟수
                retry: 3,
                //재시도 간격
                retryDelay: (attemptIndex) => Math.min(1000* 2 ** attemptIndex, 30000),
                //윈도우 포커스 시 자동 refetch
                refetchOnWindowFocus: false,
                //마운트 시 자동 refetch
                refetchOnMount: true,
                //네트워크 재연결 시 refetch
                refetchOnReconnect: true,
                //백그라운드에서 자동 reftech 간격 
                refetchInterval: false,
            },
            mutations:
            {
                //Mutation 에러 시 재시도 횟수 최소화
                retry: 1,
                //Mutation 재시도 간격 1초
                retryDelay: 1000,
            },
        },
    })
}

export const queryKeys = {
    //브랜드 Query keys
    brands: 
    {
        all: ['brands'] as const,
        lists: () => [...queryKeys.brands.all, 'list'] as const,
        list: (filters?: any) => [...queryKeys.brands.lists(), filters] as const,
        details: () => [...queryKeys.brands.all, 'detail'] as const,
        detail: (id: number) => [...queryKeys.brands.details(), id] as const,
        count: () => [...queryKeys.brands.all, 'count'] as const,
    },

    //제품 Query Keys
    products: 
    {
        all: ['products'] as const,
        lists: () => [...queryKeys.products.all, 'list'] as const,
        list: (filters?: any) => [...queryKeys.products.lists(), filters] as const,
        details: () => [...queryKeys.products.all, 'detail'] as const,
        detail: (id: number) => [...queryKeys.products.details(), id] as const,
        byBrand: (brandId: number) => [...queryKeys.products.all, 'brand', brandId] as const,
        count: () => [...queryKeys.products.all, 'count'] as const,
    },
    
    //매거진 Query Keys
    magazines: 
    {
        all: ['magazines'] as const,
        lists: () => [...queryKeys.magazines.all, 'list'] as const,
        list: (filters?: any) => [...queryKeys.magazines.lists(), filters] as const,
        details: () => [...queryKeys.magazines.all, 'detail'] as const,
        detail: (id: number) => [...queryKeys.magazines.details(), id] as const,
        byBrand: (brandId: number) => [...queryKeys.magazines.all, 'brand', brandId] as const,
        count: () => [...queryKeys.magazines.all, 'count'] as const,
    },

    //이미지 업로드
    upload: 
    {
        all: ['upload'] as const,
    },
}as const

//에러 핸들링 util
export const getErrorMessage = (error: unknown): string => {
    if(error instanceof Error)
    {
        if(error.message.includes('Failed to fetch'))
        {
            return '네트워크 연결을 확인해주세요.'
        }
        if(error.message.includes('404'))
        {
            return '요청하신 데이터를 찾을 수 없습니다.'
        }
        if(error.message.includes('401'))
        {
            return '인증이 필요합니다.'
        }
        if(error.message.includes('403'))
        {
            return '접근 권한이 없습니다.'
        }
        if(error.message.includes('500'))
        {
            return '서버 오류가 발생했습니다.'
        }
    }
    return '알 수 없는 오류가 발생했습니다.'
}

// 캐시 utils
export const cacheUtils = {
    //특정 Query Key의 캐시 무효화
    invalidateQueries: (queryClient: QueryClient, queryKey: readonly unknown[]) => {
        return queryClient.invalidateQueries({queryKey})
    },
    
    //모든 캐시 제거
    clearAll: (queryClient: QueryClient) => {
        return queryClient.clear()
    },

    //특정 Query Key의 캐시 제거
    removeQueries: (queryclient: QueryClient, queryKey: readonly unknown[]) => {
        return queryclient.removeQueries({queryKey})
    },
}

//성능 최적화 설정
export const performanceConfig = {
    development: 
    {
        //개발 환경 : 빠른 피드백
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 2,
        retry: 1,
    },
    production: {
        //프로덕션 환경: 성능 최적화
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 3,
    },
}

const getCurrentConfig = () => {
  return process.env.NODE_ENV === 'development' 
    ? performanceConfig.development 
    : performanceConfig.production
}