import { db } from '../index';
import { brands } from '../schema';
import { eq } from 'drizzle-orm';

//Brand 타입 정의
export interface CreateBrandData {
    title : string;
    description?: string;
    profileImageURL?: string;
}

export interface UpdateBrandData {
    title?: string;
    description?: string;
    profileImageUrl?: string;
}

//모든 브랜드 조회
export async function getAllBrands(){
    try
    {
        const result = await db.select().from(brands);
        return {success: true, data: result};
    }catch(error)
    {
        console.error('getAllBrands error:', error);
        return {success: false, error: error instanceof Error ? error.message:'Unknown error'};
    }
}

//브랜드 ID로 조회
export async function getBrandById(id:number) {
    try
    {
        const result = await db.select().from(brands).where(eq(brands.id, id));
        if(result.length === 0)
        {
            return {success: false, error: 'Brand not found'};
        }
        return {success: true, data: result[0]};
    } catch(error)
    {
        console.error('getBrandById error: ', error);
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
    }
}

//브랜드 등록
export async function createBrand(brandData: CreateBrandData) {
    try
    {
        if(!brandData.title?.trim())
        {
            return {success: false, error: 'Brand title is required'};
        }

        const result = await db.insert(brands).values({
            title: brandData.title.trim(),
            description: brandData.description?.trim() || null,
            profileImageUrl: brandData.profileImageURL?.trim() || null,
        });

        return {success: true, data: {id: result[0].insertId, ...brandData}};
    } catch(error)
    {
        console.error('createBrand error:', error);
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
    }
}

//브랜드 수정
export async function updateBrand(id: number, brandData: UpdateBrandData) {
    try
    {
        //브랜드 확인
        const existingBrand = await getBrandById(id);
        if(!existingBrand.success)
        {
            return {success: false, error: 'Brand not found'};
        }

        //수정할 데이터
        const updateData: any = {};
        if(brandData.title?.trim()) updateData.title = brandData.title.trim();
        if(brandData.description != undefined) updateData.description = brandData.description?.trim() || null;
        if(brandData.profileImageUrl != undefined) updateData.profileImageUrl = brandData.profileImageUrl?.trim() || null;

        if(Object.keys(updateData).length === 0)
        {
            return {success: false, error: 'No valid date to update'};
        }

        const result = await db.update(brands)
        .set(updateData)
        .where(eq(brands.id, id));

        return {success: true, data: {id, updateData}};
    }catch(error)
    {
        console.error('updateBrand error:', error);
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
    }
    
}

//브랜드 삭제
export async function deleteBrand(id: number) {
    try
    {
        //브랜드 확인
        const existingBrand = await getBrandById(id);
        if(!existingBrand.success)
        {
            return {success: false, error: 'Brand not found'};
        }

        const result = await db.delete(brands).where(eq(brands.id, id));

        return {success: true, data: {id, deleted: true}};
    }catch(error)
    {
        console.error('deleteBrand error:', error);
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
    }
}

//브랜드 개수 조회
export async function getBrandCount(){
    try
    {
        const result = await db.select().from(brands);
        return {success: true, data: {count: result.length}};
    } catch (error)
    {
        console.error('getBrandCount error:', error);
        return {success: false, error: error instanceof Error ? error.message : 'Unknown error'};
    }
}