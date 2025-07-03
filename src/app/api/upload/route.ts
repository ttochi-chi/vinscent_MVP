import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import busboy from 'busboy';
import { Readable } from 'stream';

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 파일 정보를 저장할 인터페이스
interface FileData {
  filename: string;
  mimetype: string;
  buffer: Buffer;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== busboy 파일 업로드 시작 ===');
    
    //Content-Type 헤더 확인
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    //request.body를 Node.js Readable 스트림으로 변환
    const body = request.body;
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Request body is empty' },
        { status: 400 }
      );
    }

    // ReadableStream을 Node.js Readable로 변환
    const reader = body.getReader();
    const stream = new Readable({
      async read() {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null); // 스트림 종료
        } else {
          this.push(Buffer.from(value)); // 데이터 추가
        }
      }
    });

    //busboy 파서 생성 및 설정
    const bb = busboy({
      headers: Object.fromEntries(request.headers.entries()),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB 제한
        files: 1, // 파일 1개만 허용
      }
    });

    console.log('busboy 파서 생성 완료');

    //파일 데이터를 저장할 Promise 생성
    const filePromise = new Promise<FileData>((resolve, reject) => {
      let fileData: FileData | null = null;
      const chunks: Buffer[] = [];

      //파일 이벤트: 파일 스트림이 시작될 때
      bb.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;
        console.log('파일 감지:', { fieldname, filename, mimeType });

        // 파일 타입 검증
        if (!mimeType.startsWith('image/')) {
          reject(new Error('Only image files are allowed'));
          return;
        }

        // 파일 기본 정보 저장
        fileData = {
          filename: filename || 'unknown',
          mimetype: mimeType,
          buffer: Buffer.alloc(0) // 임시로 빈 버퍼
        };

        // 파일 데이터 청크 수신
        file.on('data', (chunk: Buffer) => {
          console.log('데이터 청크 수신:', chunk.length, 'bytes');
          chunks.push(chunk);
        });

        // 파일 스트림 종료
        file.on('end', () => {
          if (fileData) {
            // 모든 청크를 하나의 버퍼로 합치기
            fileData.buffer = Buffer.concat(chunks);
            console.log('파일 수신 완료. 총 크기:', fileData.buffer.length, 'bytes');
          }
        });

        // 파일 스트림 에러
        file.on('error', (err) => {
          console.error('파일 스트림 에러:', err);
          reject(err);
        });
      });

      // 모든 필드 처리 완료
      bb.on('finish', () => {
        console.log('busboy 파싱 완료');
        if (fileData && fileData.buffer.length > 0) {
          resolve(fileData);
        } else {
          reject(new Error('No valid file received'));
        }
      });

      // busboy 에러 처리
      bb.on('error', (err) => {
        console.error('busboy 에러:', err);
        reject(err);
      });

      // 파일 크기 초과 에러
      bb.on('filesLimit', () => {
        reject(new Error('Too many files'));
      });

      bb.on('fieldsLimit', () => {
        reject(new Error('Too many fields'));
      });

      bb.on('partsLimit', () => {
        reject(new Error('Too many parts'));
      });
    });

    //스트림을 busboy에 파이프
    console.log('스트림을 busboy에 연결 중...');
    stream.pipe(bb);

    //파일 처리 완료 대기
    const file = await filePromise;
    console.log('파일 처리 완료:', {
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.buffer.length
    });

    //Cloudinary 업로드
    console.log('Cloudinary 업로드 시작...');
    const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'vinscent-mvp',
      public_id: `${Date.now()}-${file.filename.split('.')[0]}`,
      transformation: { 
        width: 800, 
        height: 600, 
        crop: 'limit',
        quality: 'auto',
        format: 'auto'
      }
    });

    console.log('Cloudinary 업로드 성공:', result.secure_url);

    //성공 응답
    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      fileInfo: {
        originalName: file.filename,
        size: file.buffer.length,
        type: file.mimetype,
        cloudinaryId: result.public_id
      },
      timestamp: new Date().toISOString(),
    }, { status: 201 });

  } catch (error) {
    console.error('Upload API 에러:', error);
    
    // 에러 타입별 응답
    if (error instanceof Error) {
      if (error.message.includes('Only image files')) {
        return NextResponse.json(
          { success: false, error: 'Only image files are allowed' },
          { status: 400 }
        );
      }
      if (error.message.includes('Too many')) {
        return NextResponse.json(
          { success: false, error: 'File upload limits exceeded' },
          { status: 413 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}