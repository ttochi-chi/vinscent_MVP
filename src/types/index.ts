// Brand 타입
export interface Brand {
  id: number;
  title: string;
  description?: string;
  profilePhotoUrl?: string;
  createdDate?: Date;
  updatedDate?: Date;
}

// Product 타입  
export interface Product {
  id: number;
  title: string;
  description?: string;
  topNote?: string;
  middleNote?: string;
  baseNote?: string;
  price: number;
  brandId: number;
  createdDate?: Date;
  updatedDate?: Date;
}

// Magazine 타입
export interface Magazine {
  id: number;
  title: string;
  content?: string;
  brandId: number;
  createdDate?: Date;
  updatedDate?: Date;
}

// Magazine Photo 타입
export interface MagazinePhoto {
  id: number;
  imageUrl: string;
  imageOrder: number;
  magazineId: number;
  createdDate?: Date;
  updatedDate?: Date;
}