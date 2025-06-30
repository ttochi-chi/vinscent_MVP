import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// MySQL 연결 설정
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
  // 연결 풀 설정 (성능 최적화)
  connectionLimit: 10,
  queueLimit: 0,
});

// Drizzle 인스턴스 생성
export const db = drizzle(connection, { schema, mode: 'default' });