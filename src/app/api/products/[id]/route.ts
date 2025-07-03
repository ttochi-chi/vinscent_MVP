import { NextRequest, NextResponse } from 'next/server';
import { 
  getProductById,
  updateProduct,
  deleteProduct 
} from '../../../../lib/db/operations/products';

// GET: 특정 제품 조회 (이미지 포함)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log('Product GET by ID 요청 받음, ID:', id);
    
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const result = await getProductById(productId);
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        product: result.data,
        mainImage: result.data.mainImageUrl ? 'included' : 'none',
        imageCount: result.data.images?.length || 0,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Product not found' },
        { status: result.error === 'Product not found' ? 404 : 500 }
      );
    }
  } catch (error) {
    console.error('Product GET by ID API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: 제품 수정 (메인 이미지 + 설명 이미지들)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('Product PUT 요청 받음, ID:', id, 'Body:', body);
    
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    //업데이트 데이터 구조화
    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.topNote !== undefined) updateData.topNote = body.topNote;
    if (body.middleNote !== undefined) updateData.middleNote = body.middleNote;
    if (body.baseNote !== undefined) updateData.baseNote = body.baseNote;
    if (body.price !== undefined) updateData.price = parseInt(body.price);
    if (body.mainImageUrl !== undefined) updateData.mainImageUrl = body.mainImageUrl;
    if (body.brandId !== undefined) updateData.brandId = parseInt(body.brandId);
    if (body.images !== undefined) updateData.images = body.images;

    const result = await updateProduct(productId, updateData);
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        message: 'Product updated successfully',
        product: result.data,
        mainImage: result.data.mainImageUrl ? 'updated' : 'none',
        imageCount: result.data.images?.length || 0,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update product' },
        { status: result.error === 'Product not found' ? 404 : 400 }
      );
    }
  } catch (error) {
    console.error('Product PUT API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: 제품 삭제 (이미지도 함께 삭제)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log('Product DELETE 요청 받음, ID:', id);
    
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const result = await deleteProduct(productId);
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        message: 'Product and all related images deleted successfully',
        deletedId: productId,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to delete product' },
        { status: result.error === 'Product not found' ? 404 : 500 }
      );
    }
  } catch (error) {
    console.error('Product DELETE API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}