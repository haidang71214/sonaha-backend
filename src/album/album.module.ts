import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ShareModule } from 'src/shared/sharedModule';
import { KeyModule } from 'src/key/key.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[AuthModule,ShareModule,KeyModule,JwtModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports:[AlbumService]
})
export class AlbumModule {}
