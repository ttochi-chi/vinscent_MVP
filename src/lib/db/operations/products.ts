import { db } from '../index';
import { products } from '../schema';
import { eq } from 'drizzle-orm';

// Product 타입 정의
export interface CreateProductData {
  title: string;
  description?: string;
  topNote?: string;
  middleNote?: string;
  baseNote?: string;
  price: number;
  brandId: number;
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  topNote?: string;
  middleNote?: string;
  baseNote?: string;
  price?: number;
  brandId?: number;
}

//모든 제품 조회
export async function getAllProducts() {
  try {
    const result = await db.select().from(products);
    return { success: true, data: result };
  } catch (error) {
    console.error('getAllProducts error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//제품 ID로 조회
export async function getProductById(id: number) {
  try {
    const result = await db.select().from(products).where(eq(products.id, id));
    
    if (result.length === 0) {
      return { success: false, error: 'Product not found' };
    }
    
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('getProductById error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//브랜드별 제품 조회
export async function getProductsByBrand(brandId: number) {
  try {
    const result = await db.select().from(products).where(eq(products.brandId, brandId));
    return { success: true, data: result };
  } catch (error) {
    console.error('getProductsByBrand error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//제품 생성
export async function createProduct(productData: CreateProductData) {
  try {
    // 데이터 검증
    if (!productData.title?.trim()) {
      return { success: false, error: 'Product title is required' };
    }
    
    if (!productData.price || productData.price <= 0) {
      return { success: false, error: 'Valid product price is required' };
    }
    
    if (!productData.brandId) {
      return { success: false, error: 'Brand ID is required' };
    }

    const result = await db.insert(products).values({
      title: productData.title.trim(),
      description: productData.description?.trim() || null,
      topNote: productData.topNote?.trim() || null,
      middleNote: productData.middleNote?.trim() || null,
      baseNote: productData.baseNote?.trim() || null,
      price: productData.price,
      brandId: productData.brandId,
    });

    return { success: true, data: { id: result[0].insertId, ...productData } };
  } catch (error) {
    console.error('createProduct error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//제품 수정
export async function updateProduct(id: number, productData: UpdateProductData) {
  try {
    //제품 존재 확인
    const existingProduct = await getProductById(id);
    if (!existingProduct.success) {
      return { success: false, error: 'Product not found' };
    }

    //업데이트할 데이터 준비
    const updateData: any = {};
    if (productData.title?.trim()) updateData.title = productData.title.trim();
    if (productData.description !== undefined) updateData.description = productData.description?.trim() || null;
    if (productData.topNote !== undefined) updateData.topNote = productData.topNote?.trim() || null;
    if (productData.middleNote !== undefined) updateData.middleNote = productData.middleNote?.trim() || null;
    if (productData.baseNote !== undefined) updateData.baseNote = productData.baseNote?.trim() || null;
    if (productData.price !== undefined && productData.price > 0) updateData.price = productData.price;
    if (productData.brandId !== undefined) updateData.brandId = productData.brandId;

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: 'No valid data to update' };
    }

    const result = await db.update(products)
      .set(updateData)
      .where(eq(products.id, id));

    return { success: true, data: { id, ...updateData } };
  } catch (error) {
    console.error('updateProduct error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//제품 삭제
export async function deleteProduct(id: number) {
  try {
    //제품 존재 확인
    const existingProduct = await getProductById(id);
    if (!existingProduct.success) {
      return { success: false, error: 'Product not found' };
    }

    const result = await db.delete(products).where(eq(products.id, id));

    return { success: true, data: { id, deleted: true } };
  } catch (error) {
    console.error('deleteProduct error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//제품 개수 조회
export async function getProductCount() {
  try {
    const result = await db.select().from(products);
    return { success: true, data: { count: result.length } };
  } catch (error) {
    console.error('getProductCount error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}