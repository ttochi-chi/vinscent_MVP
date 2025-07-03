import { db } from '../index';
import { products, productImages } from '../schema';
import { eq } from 'drizzle-orm';

export interface CreateProductData {
  title: string;
  description?: string;
  topNote?: string;
  middleNote?: string;
  baseNote?: string;
  price: number;
  mainImageUrl?: string;
  brandId: number;
  images?: string[];
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  topNote?: string;
  middleNote?: string;
  baseNote?: string;
  price?: number;
  mainImageUrl?: string;
  brandId?: number;
  images?: string[];
}

export interface ProductWithImages {
  id: number;
  title: string;
  description?: string;
  topNote?: string;
  middleNote?: string;
  baseNote?: string;
  price: number;
  mainImageUrl?: string;
  brandId: number;
  createdDate?: Date;
  updatedDate?: Date;
  images?: Array<{
    id: number;
    imageUrl: string;
    imageOrder: number;
    description?: string;
  }>;
}

//모든 제품 조회 (이미지 포함) - 타입 오류 수정
export async function getAllProducts() {
  try {
    // 제품 기본 정보 조회
    const productResult = await db.select().from(products);

    // 각 제품의 이미지들 조회
    const productsWithImages: ProductWithImages[] = [];

    for (const product of productResult) {
      const images = await db.select()
        .from(productImages)
        .where(eq(productImages.productId, product.id))
        .orderBy(productImages.imageOrder);

      const productWithImages: ProductWithImages = {
        id: product.id,
        title: product.title,
        description: product.description || undefined,
        topNote: product.topNote || undefined,
        middleNote: product.middleNote || undefined,
        baseNote: product.baseNote || undefined,
        price: product.price,
        mainImageUrl: product.mainImageUrl || undefined,
        brandId: product.brandId,
        createdDate: product.createdDate,
        updatedDate: product.updatedDate,
        images: images.map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
          imageOrder: img.imageOrder,
          description: img.description || undefined,
        }))
      };

      productsWithImages.push(productWithImages);
    }

    return { success: true, data: productsWithImages };
  } catch (error) {
    console.error('getAllProducts error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//제품 ID로 조회 (이미지 포함) - 타입 오류 수정
export async function getProductById(id: number) {
  try {
    const productResult = await db.select()
      .from(products)
      .where(eq(products.id, id));
    
    if (productResult.length === 0) {
      return { success: false, error: 'Product not found' };
    }

    const product = productResult[0];

    // 제품 이미지들 조회
    const images = await db.select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(productImages.imageOrder);

    //명시적 타입 매핑으로 오류 해결
    const productWithImages: ProductWithImages = {
      id: product.id,
      title: product.title,
      description: product.description || undefined,
      topNote: product.topNote || undefined,
      middleNote: product.middleNote || undefined,
      baseNote: product.baseNote || undefined,
      price: product.price,
      mainImageUrl: product.mainImageUrl || undefined,
      brandId: product.brandId,
      createdDate: product.createdDate,
      updatedDate: product.updatedDate,
      images: images.map(img => ({
        id: img.id,
        imageUrl: img.imageUrl,
        imageOrder: img.imageOrder,
        description: img.description || undefined,
      }))
    };
    
    return { success: true, data: productWithImages };
  } catch (error) {
    console.error('getProductById error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//브랜드별 제품 조회 (이미지 포함) - 타입 오류 수정
export async function getProductsByBrand(brandId: number) {
  try {
    // 브랜드별 제품 기본 정보 조회
    const productResult = await db.select()
      .from(products)
      .where(eq(products.brandId, brandId));

    // 각 제품의 이미지들 조회
    const productsWithImages: ProductWithImages[] = [];

    for (const product of productResult) {
      const images = await db.select()
        .from(productImages)
        .where(eq(productImages.productId, product.id))
        .orderBy(productImages.imageOrder);

      const productWithImages: ProductWithImages = {
        id: product.id,
        title: product.title,
        description: product.description || undefined,
        topNote: product.topNote || undefined,
        middleNote: product.middleNote || undefined,
        baseNote: product.baseNote || undefined,
        price: product.price,
        mainImageUrl: product.mainImageUrl || undefined,
        brandId: product.brandId,
        createdDate: product.createdDate,
        updatedDate: product.updatedDate,
        images: images.map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
          imageOrder: img.imageOrder,
          description: img.description || undefined,
        }))
      };

      productsWithImages.push(productWithImages);
    }

    return { success: true, data: productsWithImages };
  } catch (error) {
    console.error('getProductsByBrand error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//제품 생성 (이미지 포함)
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

    // 제품 기본 정보 생성
    const productResult = await db.insert(products).values({
      title: productData.title.trim(),
      description: productData.description?.trim() || null,
      topNote: productData.topNote?.trim() || null,
      middleNote: productData.middleNote?.trim() || null,
      baseNote: productData.baseNote?.trim() || null,
      price: productData.price,
      mainImageUrl: productData.mainImageUrl?.trim() || null,
      brandId: productData.brandId,
    });

    const productId = productResult[0].insertId;

    //설명 이미지들 생성 (있는 경우)
    if (productData.images && productData.images.length > 0) {
      for (let i = 0; i < productData.images.length; i++) {
        const imageUrl = productData.images[i];
        if (imageUrl.trim()) {
          await db.insert(productImages).values({
            imageUrl: imageUrl.trim(),
            imageOrder: i + 1,
            productId: Number(productId),
          });
        }
      }
    }

    // 생성된 제품 조회 (이미지 포함)
    const createdProduct = await getProductById(Number(productId));
    
    return { success: true, data: createdProduct.data };
  } catch (error) {
    console.error('createProduct error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//제품 수정 (이미지 포함)
export async function updateProduct(id: number, productData: UpdateProductData) {
  try {
    // 제품 존재 확인
    const existingProduct = await getProductById(id);
    if (!existingProduct.success) {
      return { success: false, error: 'Product not found' };
    }

    // 제품 기본 정보 업데이트
    const updateValues: any = {};
    
    if (productData.title?.trim()) updateValues.title = productData.title.trim();
    if (productData.description !== undefined) updateValues.description = productData.description?.trim() || null;
    if (productData.topNote !== undefined) updateValues.topNote = productData.topNote?.trim() || null;
    if (productData.middleNote !== undefined) updateValues.middleNote = productData.middleNote?.trim() || null;
    if (productData.baseNote !== undefined) updateValues.baseNote = productData.baseNote?.trim() || null;
    if (productData.price !== undefined) updateValues.price = productData.price;
    if (productData.mainImageUrl !== undefined) updateValues.mainImageUrl = productData.mainImageUrl?.trim() || null;
    if (productData.brandId !== undefined) updateValues.brandId = productData.brandId;

    if (Object.keys(updateValues).length > 0) {
      await db.update(products)
        .set(updateValues)
        .where(eq(products.id, id));
    }

    // 이미지 업데이트 (있는 경우)
    if (productData.images !== undefined) {
      // 기존 이미지들 삭제
      await db.delete(productImages).where(eq(productImages.productId, id));

      // 새 이미지들 추가
      if (productData.images.length > 0) {
        for (let i = 0; i < productData.images.length; i++) {
          const imageUrl = productData.images[i];
          if (imageUrl.trim()) {
            await db.insert(productImages).values({
              imageUrl: imageUrl.trim(),
              imageOrder: i + 1,
              productId: id,
            });
          }
        }
      }
    }

    // 업데이트된 제품 조회 (이미지 포함)
    const updatedProduct = await getProductById(id);
    
    return { success: true, data: updatedProduct.data };
  } catch (error) {
    console.error('updateProduct error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//제품 삭제 (이미지도 함께 삭제)
export async function deleteProduct(id: number) {
  try {
    // 제품 존재 확인
    const existingProduct = await getProductById(id);
    if (!existingProduct.success) {
      return { success: false, error: 'Product not found' };
    }

    // 관련 이미지들 먼저 삭제
    await db.delete(productImages).where(eq(productImages.productId, id));

    // 제품 삭제
    const result = await db.delete(products).where(eq(products.id, id));

    return { 
      success: true, 
      data: { 
        deletedId: id,
        message: 'Product and all related images deleted successfully'
      } 
    };
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