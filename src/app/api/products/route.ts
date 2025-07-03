import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllProducts, 
  createProduct,
  getProductsByBrand,
  getProductCount 
} from '../../../lib/db/operations/products';

// GET: 모든 제품 조회 (브랜드별 필터링 가능)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const countOnly = searchParams.get('count');

    console.log('Product GET 요청 받음:', { brandId, countOnly });

    // 개수만 조회하는 경우
    if (countOnly === 'true') {
      const result = await getProductCount();
      
      if (result.success && result.data) {
        return NextResponse.json({
          success: true,
          count: result.data.count,
        });
      } else {
        return NextResponse.json(
          { success: false, error: result.error || 'Failed to get count' },
          { status: 500 }
        );
      }
    }

    // 브랜드별 제품 조회
    if (brandId) {
      const brandIdNum = parseInt(brandId);
      if (isNaN(brandIdNum)) {
        return NextResponse.json(
          { success: false, error: 'Invalid brand ID' },
          { status: 400 }
        );
      }

      const result = await getProductsByBrand(brandIdNum);
      
      if (result.success && result.data) {
        return NextResponse.json({
          success: true,
          products: result.data,
          brandId: brandIdNum,
          count: result.data.length,
          timestamp: new Date().toISOString(),
        });
      } else {
        return NextResponse.json(
          { success: false, error: result.error || 'Failed to get products' },
          { status: 500 }
        );
      }
    }

    // 모든 제품 조회 (이미지 포함)
    const result = await getAllProducts();
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        products: result.data,
        count: result.data.length,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to get products' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Product GET API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: 제품 생성 (메인 이미지 + 다중 설명 이미지 포함)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Product POST 요청 받음:', body);
    
    // 기본 데이터 검증
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Product title is required' },
        { status: 400 }
      );
    }

    if (!body.price || body.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid product price is required' },
        { status: 400 }
      );
    }

    if (!body.brandId) {
      return NextResponse.json(
        { success: false, error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    // 이미지 데이터 구조화
    const productData = {
      title: body.title,
      description: body.description || null,
      topNote: body.topNote || null,
      middleNote: body.middleNote || null,
      baseNote: body.baseNote || null,
      price: parseInt(body.price),
      mainImageUrl: body.mainImageUrl || null,
      brandId: parseInt(body.brandId),
      images: body.images || [], 
    };

    const result = await createProduct(productData);
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        message: 'Product created successfully',
        product: result.data,
        mainImage: result.data.mainImageUrl ? 'included' : 'none',
        imageCount: result.data.images?.length || 0,
        timestamp: new Date().toISOString(),
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create product' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Product POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}