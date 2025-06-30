'use client'

import { useState } from 'react'
import { 
  useBrands, 
  useCreateBrand, 
  useDeleteBrand 
} from '../../lib/queries/brands'
import { 
  useProducts, 
  useCreateProduct, 
  useDeleteProduct 
} from '../../lib/queries/products'
import { 
  useMagazines, 
  useCreateMagazine, 
  useDeleteMagazine 
} from '../../lib/queries/magazines'

export default function TestCompletePage() {
  const [selectedBrandId, setSelectedBrandId] = useState<number>(0)

  // 모든 데이터 Query
  const { data: brandsData, isLoading: brandsLoading } = useBrands()
  const { data: productsData, isLoading: productsLoading } = useProducts()
  const { data: magazinesData, isLoading: magazinesLoading } = useMagazines()

  // Mutations
  const createBrandMutation = useCreateBrand()
  const deleteBrandMutation = useDeleteBrand()
  const createProductMutation = useCreateProduct()
  const deleteProductMutation = useDeleteProduct()
  const createMagazineMutation = useCreateMagazine()
  const deleteMagazineMutation = useDeleteMagazine()

  // 빠른 테스트 데이터 생성
  const handleQuickTest = async () => {
    try {
      // 1. 브랜드 생성
      const brandResult = await createBrandMutation.mutateAsync({
        title: `Test Brand ${Date.now()}`,
        description: "Test brand for demonstration",
      })

      console.log('Brand created:', brandResult)

      // 2. 제품 생성 (생성된 브랜드 ID 사용)
      if (brandResult.brand?.id) {
        const productResult = await createProductMutation.mutateAsync({
          title: "Test Product",
          description: "Test product for demonstration",
          topNote: "Citrus",
          middleNote: "Floral",
          baseNote: "Woody",
          price: 99000,
          brandId: brandResult.brand.id,
        })

        console.log('Product created:', productResult)

        // 3. 매거진 생성 (같은 브랜드 ID 사용)
        const magazineResult = await createMagazineMutation.mutateAsync({
          title: "Test Magazine",
          content: "This is a test magazine content for demonstration.",
          brandId: brandResult.brand.id,
          images: [
            "https://example.com/test1.jpg",
            "https://example.com/test2.jpg"
          ]
        })

        console.log('Magazine created:', magazineResult)

        alert('전체 테스트 데이터 생성 완료!\n브랜드 → 제품 → 매거진 연동 확인하세요.')
      }
    } catch (error) {
      console.error('Quick test failed:', error)
      alert('테스트 실패: ' + (error as Error).message)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('정말 모든 테스트 데이터를 삭제하시겠습니까?')) return

    try {
      // 매거진부터 삭제 (외래키 때문에)
      for (const magazine of magazinesData?.magazines || []) {
        await deleteMagazineMutation.mutateAsync(magazine.id)
      }

      // 제품 삭제
      for (const product of productsData?.products || []) {
        await deleteProductMutation.mutateAsync(product.id)
      }

      // 브랜드 삭제
      for (const brand of brandsData?.brands || []) {
        await deleteBrandMutation.mutateAsync(brand.id)
      }

      alert('모든 테스트 데이터 삭제 완료!')
    } catch (error) {
      console.error('Delete all failed:', error)
      alert('삭제 실패: ' + (error as Error).message)
    }
  }

  if (brandsLoading || productsLoading || magazinesLoading) {
    return <div className="p-8">Loading all data...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🧪 Complete System Test
        </h1>

        {/* 빠른 테스트 버튼들 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">빠른 테스트</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleQuickTest}
              disabled={createBrandMutation.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createBrandMutation.isPending ? '생성 중...' : '전체 테스트 데이터 생성'}
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={deleteBrandMutation.isPending}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deleteBrandMutation.isPending ? '삭제 중...' : '모든 데이터 삭제'}
            </button>
          </div>
        </div>

        {/* 데이터 현황 대시보드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 브랜드 현황 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">브랜드</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {brandsData?.count || 0}개
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {brandsData?.brands?.slice(0, 3).map((brand: any) => (
                <div key={brand.id}>• {brand.title}</div>
              ))}
            </div>
          </div>

          {/* 제품 현황 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">제품</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {productsData?.count || 0}개
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {productsData?.products?.slice(0, 3).map((product: any) => (
                <div key={product.id}>• {product.title}</div>
              ))}
            </div>
          </div>

          {/* 매거진 현황 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-green-600 mb-2">매거진</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {magazinesData?.count || 0}개
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {magazinesData?.magazines?.slice(0, 3).map((magazine: any) => (
                <div key={magazine.id}>
                  • {magazine.title} ({magazine.images?.length || 0}장)
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 상세 데이터 리스트 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">전체 데이터 현황</h2>
          
          {/* 브랜드별 제품/매거진 표시 */}
          {brandsData?.brands?.map((brand: any) => {
            const brandProducts = productsData?.products?.filter((p: any) => p.brandId === brand.id) || []
            const brandMagazines = magazinesData?.magazines?.filter((m: any) => m.brandId === brand.id) || []
            
            return (
              <div key={brand.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-lg text-purple-600 mb-2">
                  🏢 {brand.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{brand.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 제품들 */}
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">
                      제품 ({brandProducts.length}개)
                    </h4>
                    {brandProducts.map((product: any) => (
                      <div key={product.id} className="text-sm text-gray-700 ml-2">
                        • {product.title} - ₩{product.price?.toLocaleString()}
                      </div>
                    ))}
                  </div>
                  
                  {/* 매거진들 */}
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">
                      매거진 ({brandMagazines.length}개)
                    </h4>
                    {brandMagazines.map((magazine: any) => (
                      <div key={magazine.id} className="text-sm text-gray-700 ml-2">
                        • {magazine.title} ({magazine.images?.length || 0}장)
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* React Query DevTools 안내 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>React Query DevTools</strong>: 화면 우하단의 꽃 모양 아이콘을 클릭하면 
            모든 쿼리 상태를 실시간으로 확인할 수 있습니다!
          </p>
        </div>
      </div>
    </div>
  )
}