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

export interface MagazineWithImages {
  id: number;
  title: string;
  content?: string;
  brandId: number;
  createdDate?: Date;
  updatedDate?: Date;
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