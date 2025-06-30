import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllMagazines, 
  createMagazine,
  getMagazinesByBrand,
  getMagazineCount 
} from '../../../lib/db/operations/magazines';

// GET: 모든 매거진 조회 (브랜드별 필터링 가능)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const countOnly = searchParams.get('count');

    // 개수만 조회하는 경우
    if (countOnly === 'true') {
      const result = await getMagazineCount();
      
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

    // 브랜드별 매거진 조회
    if (brandId) {
      const brandIdNum = parseInt(brandId);
      if (isNaN(brandIdNum)) {
        return NextResponse.json(
          { success: false, error: 'Invalid brand ID' },
          { status: 400 }
        );
      }

      const result = await getMagazinesByBrand(brandIdNum);
      
      if (result.success && result.data) {
        return NextResponse.json({
          success: true,
          magazines: result.data,
          brandId: brandIdNum,
          count: result.data.length,
          timestamp: new Date().toISOString(),
        });
      } else {
        return NextResponse.json(
          { success: false, error: result.error || 'Failed to get magazines' },
          { status: 500 }
        );
      }
    }

    // 모든 매거진 조회
    const result = await getAllMagazines();
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        magazines: result.data,
        count: result.data.length,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to get magazines' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Magazine GET API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: 매거진 생성 (다중 이미지 포함)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 기본 데이터 검증
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Magazine title is required' },
        { status: 400 }
      );
    }

    if (!body.brandId) {
      return NextResponse.json(
        { success: false, error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    const magazineData = {
      title: body.title,
      content: body.content || null,
      brandId: parseInt(body.brandId),
      images: body.images || [], // 이미지 URL 배열
    };

    const result = await createMagazine(magazineData);
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        message: 'Magazine created successfully',
        magazine: result.data,
        imageCount: result.data.images?.length || 0,
        timestamp: new Date().toISOString(),
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create magazine' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Magazine POST API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}