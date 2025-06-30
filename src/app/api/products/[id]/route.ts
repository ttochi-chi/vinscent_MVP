import { NextRequest, NextResponse } from 'next/server';
import { 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../../../../lib/db/operations/products';

// GET: 특정 제품 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
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
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Product not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Product GET [id] API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: 제품 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const updateData = {
      title: body.title,
      description: body.description,
      topNote: body.topNote,
      middleNote: body.middleNote,
      baseNote: body.baseNote,
      price: body.price ? parseInt(body.price) : undefined,
      brandId: body.brandId ? parseInt(body.brandId) : undefined,
    };

    const result = await updateProduct(productId, updateData);
    
    if (result.success && result.data) {
      return NextResponse.json({
        success: true,
        message: 'Product updated successfully',
        product: result.data,
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

// DELETE: 제품 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log('DELETE Product 요청 받음, ID:', id);
    
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
        message: 'Product deleted successfully',
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