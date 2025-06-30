import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    console.log('🔗 기존 MySQL80 연결 테스트 시작...');
    
    // 다양한 연결 옵션 시도 (일반적인 MySQL 설정들)
    const connectionOptions = [
      // 1. 비밀번호 없는 경우 (일반적)
      {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'mysql'
      },
      // 2. 'root' 비밀번호
      {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'mysql'
      },
      // 3. 'password' 비밀번호
      {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'mysql'
      },
      // 4. '123456' 비밀번호
      {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'mysql'
      }
    ];

    let connection = null;
    let usedConfig = null;

    // 각 설정으로 연결 시도
    for (const config of connectionOptions) {
      try {
        console.log(`🔄 시도 중: ${config.user}@${config.host} (password: ${config.password || 'empty'})`);
        connection = await mysql.createConnection(config);
        usedConfig = config;
        console.log(`✅ 연결 성공!`);
        break;
      } catch (error) {
        console.log(`❌ 연결 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
        continue;
      }
    }

    if (!connection) {
      throw new Error('모든 연결 옵션 실패');
    }

    // 데이터베이스 목록 조회
    const [rows] = await connection.execute('SHOW DATABASES');
    
    // vinscent_mvp 데이터베이스 존재 확인
    const databases = rows as any[];
    const hasVinscentDB = databases.some((row: any) => row.Database === 'vinscent_mvp');

    // MySQL 버전 확인
    const [versionRows] = await connection.execute('SELECT VERSION() as version');
    const version = (versionRows as any[])[0].version;

    await connection.end();

    return NextResponse.json({
      success: true,
      message: '🎉 기존 MySQL80 연결 성공!',
      connectionInfo: {
        user: usedConfig?.user,
        host: usedConfig?.host,
        port: usedConfig?.port,
        passwordUsed: usedConfig?.password ? '***' : 'empty',
        version: version
      },
      databases: databases.map((row: any) => row.Database),
      hasVinscentDB,
      needsDBCreation: !hasVinscentDB,
      nextSteps: hasVinscentDB 
        ? ['데이터베이스가 이미 존재합니다', 'Drizzle 마이그레이션 실행 가능']
        : ['vinscent_mvp 데이터베이스 생성 필요', '그 후 마이그레이션 실행'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ MySQL 연결 완전 실패:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      possibleCauses: [
        'MySQL 비밀번호가 일반적이지 않음',
        'MySQL이 다른 포트를 사용 중',
        'MySQL 권한 설정 문제'
      ],
      suggestions: [
        'MySQL Workbench 설치 고려',
        'MySQL 설치 시 설정한 비밀번호 확인',
        'Windows 서비스에서 MySQL80 재시작'
      ],
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}