import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatasetModule } from './dataset/dataset.module';
import { Dataset } from './dataset/entities/dataset.entity';
import { Field } from './dataset/entities/field.entity';
import { SalesData } from './dataset/entities/sales-data.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'db.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          SalesData,
          Dataset,
          Field,
          User,
        ],
        synchronize: true,
        connectorPackage: 'mysql2',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    DatasetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
