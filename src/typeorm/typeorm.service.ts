import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      schema: process.env.DB_SCHEMA,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: false,
      extra: {
        trustServerCertificate: true,
        validateConnection: false
      },
      requestTimeout: Number(process.env.DB_REQUEST_TIMEOUT),
      logging: true,
    };
  }
}
