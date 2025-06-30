import { NextRequest, NextResponse } from 'next/server';
import { 
  getMagazineById, 
  updateMagazine, 
  deleteMagazine 
} from '../../../../lib/db/operations/magazines';

// GET: 특정 매거진 조회 (이미지 포함)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const magazineId = parseInt(id);
    
    if (isNaN(magazineId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid magazine ID' },
        { status: 400 }
      );
    }

    const result = await getMagazineById(magazineId);
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        magazine: result.data,
        imageCount: result.data.images?.length || 0,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Magazine not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Magazine GET [id] API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: 매거진 수정 (이미지 포함)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const magazineId = parseInt(id);
    
    if (isNaN(magazineId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid magazine ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const updateData = {
      title: body.title,
      content: body.content,
      brandId: body.brandId ? parseInt(body.brandId) : undefined,
      images: body.images, // 이미지 URL 배열 (undefined면 이미지 수정 안함)
    };

    const result = await updateMagazine(magazineId, updateData);
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        message: 'Magazine updated successfully',
        magazine: result.data,
        imageCount: result.data.images?.length || 0,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update magazine' },
        { status: result.error === 'Magazine not found' ? 404 : 400 }
      );
    }
  } catch (error) {
    console.error('Magazine PUT API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: 매거진 삭제 (이미지도 함께 삭제)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log('DELETE Magazine 요청 받음, ID:', id);
    
    const magazineId = parseInt(id);
    
    if (isNaN(magazineId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid magazine ID' },
        { status: 400 }
      );
    }

    const result = await deleteMagazine(magazineId);
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        message: 'Magazine and all related images deleted successfully',
        deletedId: magazineId,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to delete magazine' },
        { status: result.error === 'Magazine not found' ? 404 : 500 }
      );
    }
  } catch (error) {
    console.error('Magazine DELETE API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}