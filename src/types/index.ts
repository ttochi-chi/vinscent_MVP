export interface Brand {
  id: number;
  title: string;
  description?: string;
  profileImageUrl?: string;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface Product {
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
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  imageOrder: number;
  description?: string;
  productId: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface ProductWithImages extends Product {
  images?: ProductImage[];
}

export interface Magazine {
  id: number;
  title: string;
  content?: string;
  brandId: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface MagazinePhoto {
  id: number;
  imageUrl: string;
  imageOrder: number;
  magazineId: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface MagazineWithImages extends Magazine {
  images?: MagazinePhoto[];
}

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

export interface CreateBrandData {
  title: string;
  description?: string;
  profileImageUrl?: string;
}

export interface UpdateBrandData {
  title?: string;
  description?: string;
  profileImageUrl?: string;
}

export interface CreateMagazineData {
  title: string;
  content?: string;
  brandId: number;
  images?: string[];
}

export interface UpdateMagazineData {
  title?: string;
  content?: string;
  brandId?: number;
  images?: string[];
}

// API 응답 타입들
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}