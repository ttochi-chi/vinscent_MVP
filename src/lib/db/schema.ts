import { mysqlTable, varchar, text, int, bigint, timestamp } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Brand 테이블
export const brands = mysqlTable('brand', {
  id: bigint('brand_id', { mode: 'number' }).primaryKey().autoincrement(),
  title: varchar('brand_title', { length: 100 }).notNull(),
  description: varchar('brand_description', { length: 500 }),
  profileImageUrl: varchar('brand_profile_image_url', { length: 255 }),
  createdDate: timestamp('created_date').defaultNow().notNull(),
  updatedDate: timestamp('updated_date').defaultNow().onUpdateNow().notNull(),
});

// Product 테이블
export const products = mysqlTable('product', {
  id: bigint('product_id', { mode: 'number' }).primaryKey().autoincrement(),
  title: varchar('product_title', { length: 100 }).notNull(),
  description: varchar('product_description', { length: 500 }),
  topNote: varchar('top_note', { length: 100 }),
  middleNote: varchar('middle_note', { length: 100 }),
  baseNote: varchar('base_note', { length: 100 }),
  price: int('product_price').notNull(),
  mainImageUrl: varchar('main_image_url', { length: 255 }),
  brandId: bigint('brand_id', { mode: 'number' }).notNull(),
  createdDate: timestamp('created_date').defaultNow().notNull(),
  updatedDate: timestamp('updated_date').defaultNow().onUpdateNow().notNull(),
});

export const productImages = mysqlTable('product_image', {
  id: bigint('image_id', { mode: 'number' }).primaryKey().autoincrement(),
  imageUrl: varchar('image_url', { length: 255 }).notNull(),
  imageOrder: int('image_order').notNull(),
  description: varchar('image_description', { length: 200 }),
  productId: bigint('product_id', { mode: 'number' }).notNull(),
  createdDate: timestamp('created_date').defaultNow().notNull(),
  updatedDate: timestamp('updated_date').defaultNow().onUpdateNow().notNull(),
});

// Magazine 테이블
export const magazines = mysqlTable('magazine', {
  id: bigint('magazine_id', { mode: 'number' }).primaryKey().autoincrement(),
  title: varchar('magazine_title', { length: 100 }).notNull(),
  content: text('magazine_content'),
  brandId: bigint('brand_id', { mode: 'number' }).notNull(),
  createdDate: timestamp('created_date').defaultNow().notNull(),
  updatedDate: timestamp('updated_date').defaultNow().onUpdateNow().notNull(),
});

// Magazine Photo 테이블
export const magazineImages = mysqlTable('magazine_image', {
  id: bigint('image_id', { mode: 'number' }).primaryKey().autoincrement(),
  imageUrl: varchar('image_url', { length: 255 }).notNull(),
  imageOrder: int('image_order').notNull(),
  magazineId: bigint('magazine_id', { mode: 'number' }).notNull(),
  createdDate: timestamp('created_date').defaultNow().notNull(),
  updatedDate: timestamp('updated_date').defaultNow().onUpdateNow().notNull(),
});

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
  magazines: many(magazines),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const magazinesRelations = relations(magazines, ({ one, many }) => ({
  brand: one(brands, {
    fields: [magazines.brandId],
    references: [brands.id],
  }),
  photos: many(magazineImages),
}));

export const magazineImagesRelations = relations(magazineImages, ({ one }) => ({
  magazine: one(magazines, {
    fields: [magazineImages.magazineId],
    references: [magazines.id],
  }),
}));