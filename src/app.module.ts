import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PinEntity } from './pin/entity/Pin.entity';
import { PinModule } from './pin/pin.module';
import { UserEntity } from './user/entity/User.entity';
import { UserModule } from './user/user.module';
import { WalkEntity } from './walkway/entity/Walk.entity';
import { WalkwayEntity } from './walkway/entity/Walkway.entity';
import { WalkwayModule } from './walkway/walkway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod',
        isGlobal: true,
        validationSchema: Joi.object({
            NODE_ENV: Joi.string().valid('prod', 'dev'),
            DB_HOST: Joi.string().required(),
            DB_PORT: Joi.string().required(),
            DB_USER: Joi.string().required(),
            DB_PASSWORD: Joi.string().required(),
            DB_NAME: Joi.string().required(),
        }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [
        UserEntity,
        PinEntity,
        WalkwayEntity,
        WalkEntity,
      ],
    }),
    UserModule,
    PinModule,
    WalkwayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
