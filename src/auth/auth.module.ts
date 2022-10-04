import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: ['jwt', 'jwt-refresh'] }),
  ],
  providers: [],
})
export class AuthModule {}
