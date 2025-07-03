import { db } from '../index';
import { magazines, magazineImages } from '../schema';
import { eq } from 'drizzle-orm';

// Magazine 타입 정의
export interface CreateMagazineData 
{
  title: string;
  content?: string;
  brandId: number;
  images?: string[]; // 이미지 URL 배열
}

export interface UpdateMagazineData 
{
  title?: string;
  content?: string;
  brandId?: number;
  images?: string[]; // 이미지 URL 배열
}

export interface MagazineWithImages 
{
  id: number;
  title: string;
  content: string | null; 
  brandId: number;
  createdDate: Date | null;
  updatedDate: Date | null;
  images: Array<{
    id: number;
    imageUrl: string;
    imageOrder: number;
  }>;
}

// 모든 매거진 조회 (이미지 포함)
export async function getAllMagazines() 
{
    try
    {
        //매거진 기본 정보 조회
        const magazineResult = await db.select().from(magazines);

        //이미지 조회
        const magazinesWithImages: MagazineWithImages[] = [];

        for(const magazine of magazineResult)
        {
            const images = await db.select()
            .from(magazineImages)
            .where(eq(magazineImages.magazineId, magazine.id));

            magazinesWithImages.push({
                ...magazine,
                images: images.map(img => ({
                id: img.id,
                imageUrl: img.imageUrl,
                imageOrder: img.imageOrder,
                }))
            });
        }
        return{ success: true, data: magazinesWithImages};
    }
    catch(error)
    {
        console.error('getAllMagazines error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

//Id로 조회 (이미지 포함)
export async function getMagazineById(id: number)
{
    try
    {
        // 매거진 기본 정보 조회
        const magazineResult = await db.select().from(magazines).where(eq(magazines.id, id));
        
        if (magazineResult.length === 0) {
            return { success: false, error: 'Magazine not found' };
        }

        //이미지 조회
        const images = await db.select()
        .from(magazineImages)
        .where(eq(magazineImages.magazineId, id));

        const magazineWithImages: MagazineWithImages = {
            ...magazineResult[0],
            images: images.map(img => ({
                id: img.id,
                imageUrl: img.imageUrl,
                imageOrder: img.imageOrder,
            }))
        };
        return { success: true, data: magazineWithImages };
  } 
  catch (error) 
  {
    console.error('getMagazineById error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//브랜드별 매거진 조회
export async function getMagazinesByBrand(brandId: number)
{
    try
    {
        //브랜드별 매거진 기본 정보 조회
        const magazineResult = await db.select()
        .from(magazines)
        .where(eq(magazines.brandId, brandId));

        //이미지 조회
        const magazinesWithImages: MagazineWithImages[] = [];

        for(const magazine of magazineResult)
        {
            const images = await db.select()
            .from(magazineImages)
            .where(eq(magazineImages.magazineId, magazine.id));

            magazinesWithImages.push({
                ...magazine,
                images: images.map(img => ({
                    id: img.id,
                    imageUrl: img.imageUrl,
                    imageOrder: img.imageOrder,
                }))
            });
        }
        return { success: true, data: magazinesWithImages };
    } catch (error) {
        console.error('getMagazinesByBrand error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

//매거진 등록
export async function createMagazine(magazineData: CreateMagazineData) {
  try {
    //데이터 검증
    if (!magazineData.title?.trim()) {
      return { success: false, error: 'Magazine title is required' };
    }
    
    if (!magazineData.brandId) {
      return { success: false, error: 'Brand ID is required' };
    }

    //매거진 기본 정보 생성
    const magazineResult = await db.insert(magazines).values({
      title: magazineData.title.trim(),
      content: magazineData.content?.trim() || null,
      brandId: magazineData.brandId,
    });

    const magazineId = magazineResult[0].insertId;

    //이미지들 생성 (있는 경우)
    if (magazineData.images && magazineData.images.length > 0) {
      for (let i = 0; i < magazineData.images.length; i++) {
        const imageUrl = magazineData.images[i];
        if (imageUrl.trim()) {
          await db.insert(magazineImages).values({
            imageUrl: imageUrl.trim(),
            imageOrder: i + 1,
            magazineId: Number(magazineId),
          });
        }
      }
    }

    //생성된 매거진 조회 (이미지 포함)
    const createdMagazine = await getMagazineById(Number(magazineId));
    
    return { success: true, data: createdMagazine.data };
  } catch (error) {
    console.error('createMagazine error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//매거진 수정 (이미지 포함)
export async function updateMagazine(id: number, magazineData: UpdateMagazineData)
{
    try
    {
        //매거진 확인
        const existingMagazine = await getMagazineById(id);
        if(!existingMagazine.success)
        {
            return {success: false, error: 'Magazine not found'};
        }

        //매거진 정보 수정
        const updateData: any = {};
        if(magazineData.title?.trim()) updateData.title = magazineData.title.trim();
        if (magazineData.content !== undefined) updateData.content = magazineData.content?.trim() || null;
        if (magazineData.brandId !== undefined) updateData.brandId = magazineData.brandId;
        if (Object.keys(updateData).length > 0) {
        await db.update(magazines)
            .set(updateData)
            .where(eq(magazines.id, id));
        }

        //이미지 수정 (있는 경우)
        if(magazineData.images !== undefined)
        {
            //기존 이미지 전체 삭제
            await db.delete(magazineImages).where(eq(magazineImages.magazineId, id));

            //새 이미지 등록
            if(magazineData.images.length > 0)
            {
                for(let i = 0; i < magazineData.images.length; i++)
                {
                    const imageUrl = magazineData.images[i];
                    if(imageUrl.trim())
                    {
                        await db.insert(magazineImages).values({
                            imageUrl: imageUrl.trim(),
                            imageOrder: i + 1,
                            magazineId: id,
                        });
                    }
                }
            }
        }
        // 수정된 매거진 조회 (이미지 포함)
        const updatedMagazine = await getMagazineById(id);
        
        return { success: true, data: updatedMagazine.data };
    }
    catch(error)
    {
        console.error('updateMagazine error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

//매거진 삭제 (이미지 포함)
export async function deleteMagazine(id: number) {
  try {
    // 매거진 확인
    const existingMagazine = await getMagazineById(id);
    if (!existingMagazine.success) {
      return { success: false, error: 'Magazine not found' };
    }

    // 관련 이미지들 먼저 삭제 (외래키 제약조건)
    await db.delete(magazineImages).where(eq(magazineImages.magazineId, id));
    
    // 매거진 삭제
    await db.delete(magazines).where(eq(magazines.id, id));

    return { success: true, data: { id, deleted: true } };
  } catch (error) {
    console.error('deleteMagazine error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

//매거진 개수 조회
export async function getMagazineCount() {
  try {
    const result = await db.select().from(magazines);
    return { success: true, data: { count: result.length } };
  } catch (error) {
    console.error('getMagazineCount error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}