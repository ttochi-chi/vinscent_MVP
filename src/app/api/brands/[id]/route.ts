import { NextRequest, NextResponse } from 'next/server';
import { 
  getBrandById, 
  updateBrand, 
  deleteBrand 
} from '../../../../lib/db/operations/brands';

// GET: 특정 브랜드 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const brandId = parseInt(id);
    
    if (isNaN(brandId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid brand ID' },
        { status: 400 }
      );
    }

    const result = await getBrandById(brandId);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        brand: result.data,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Brand GET [id] API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: 브랜드 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('DELETE 요청 받음, ID:', id);
    
    const brandId = parseInt(id);
    
    if (isNaN(brandId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid brand ID' },
        { status: 400 }
      );
    }

    const result = await deleteBrand(brandId);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Brand deleted successfully',
        deletedId: brandId,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === 'Brand not found' ? 404 : 500 }
      );
    }
  } catch (error) {
    console.error('Brand DELETE API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: 브랜드 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const brandId = parseInt(id);
    
    if (isNaN(brandId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid brand ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const updateData = {
      title: body.title,
      description: body.description,
      profilePhotoUrl: body.profilePhotoUrl,
    };

    const result = await updateBrand(brandId, updateData);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Brand updated successfully',
        brand: result.data,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === 'Brand not found' ? 404 : 400 }
      );
    }
  } catch (error) {
    console.error('Brand PUT API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}