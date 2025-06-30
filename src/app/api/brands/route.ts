import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllBrands, 
  createBrand, 
  getBrandCount 
} from '../../../lib/db/operations/brands';

//GET: 모든 브랜드 조회
export async function GET(request: NextRequest){
    try
    {
        const {searchParams} = new URL(request.url);
        const countOnly = searchParams.get('count');

        //브랜드 개수 조회
        if(countOnly === 'true')
        {
            const result = await getBrandCount();

            if(result.success)
            {
                return NextResponse.json({
                    success: true,
                    count: result.data?.count
                });
            }
            else
            {
                return NextResponse.json(
                    {success: false, error: result.error},
                    {status: 500}
                );
            }
        }

        //모든 브랜드 조회
        const result = await getAllBrands();

        if(result.success) 
        {
            return NextResponse.json({
                success: true,
                brands: result.data,
                count: result.data?.length,
                timestamp: new Date().toISOString(),
            });
        }
        else
        {
            return NextResponse.json(
                {success: false, error: result.error},
                {status: 500}
            );
        }
    }
    catch(error)
    {
        console.error('Brand Get API error:', error);
        return NextResponse.json(
            {success: false, error: 'Internal server error'},
            {status: 500}
        );
    }
}

export async function POST(request:NextRequest) {
    try
    {
        const body = await request.json();

        //기본 데이터 확인
        if(!body.title?.trim())
        {
            return NextResponse.json(
                { success: false, error: 'Brand title is required'},
                {status: 400}
            );
        }

        const brandData = {
            title: body.title,
            description: body.description || null,
            profilePhotoUrl: body.profilePhotoUrl || null,
        };

        const result = await createBrand(brandData);

        if(result.success)
        {
            return NextResponse.json({
                success: true,
                message: 'Brand created successfully',
                brand: result.data,
                timestamp: new Date().toISOString,
            }, {status: 201});
        }
        else
        {
            return NextResponse.json(
                {success: false, error: result.error},
                {status: 400}
            );
        }
    }
    catch (error)
    {
        console.error('Brand POST API error:', error);
        return NextResponse.json(
            {success: false, error: 'Internal server error'},
            {status: 500}
        );
    }
    
}