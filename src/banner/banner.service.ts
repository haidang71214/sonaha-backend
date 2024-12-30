import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { getBannerDto } from './dto/get-banner.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { Response } from 'express';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class BannerService {
  prisma = new PrismaClient()
  constructor(
    private jwtService : JwtService,
    private cloudUploadService : CloudUploadService
  ){}
  async create(createBannerDto: CreateBannerDto,
    id:number
  ):Promise<string> {
    try {
      const checkAmin = await this.prisma.users.findFirst({
        where:{user_id:id}
      })
      // này đang để cho 3 cái role là admin, manager với employee là người có quyền thay đổi 
      if(checkAmin.role_name === 'user' || checkAmin.role_name === 'moderator'){
        throw new Error('không có quyền')
      }
      const { tittle, img_url, link_url, end_date_hide } = createBannerDto;
      await this.prisma.banners.create({
        data: {
          title:tittle,
          image_url:img_url,
          link_url,
          end_date:end_date_hide,
        },
      });
      
      return 'oce'
    } catch (error) {
      throw new Error(error.message || "An error occurred while creating the banner");
    }
  }
  
  
  async findAllBanner():Promise<getBannerDto[]> {
    try {
      const bannerOut = await this.prisma.banners.findMany()
      return bannerOut.map((banner)=>plainToClass(getBannerDto,banner))

    } catch (error) {
      throw new Error(error)
    }
  }

  async update(id: number, updateBannerDto: UpdateBannerDto, userId: number) {
    try {
      const checkUser = await this.prisma.users.findFirst({
        where: { user_id: userId },
      });
  
      if (!checkUser || (checkUser.role_name !== 'admin' && checkUser.role_name !== 'manager' && checkUser.role_name !== 'employee')) {
        throw new Error('Không xác thực');
      }
  
       const currentBanner = await this.prisma.banners.findFirst({
        where: { banner_id: Number(id)},
      });
  
      if (!currentBanner) {
        throw new Error('Banner không tồn tại');
      }
  
         const { tittle, img_url, link_url, end_date_hide } = updateBannerDto;
      const updatedData = {
        title: tittle || currentBanner.title,
        image_url: img_url || currentBanner.image_url,
        link_url: link_url || currentBanner.link_url,
        end_date: end_date_hide || currentBanner.end_date,
      };
      if (img_url && img_url !== currentBanner.image_url) {
        const publicId = currentBanner.image_url.split('/').slice(-2).join('/').split('.')[0].replace('%20', ' ');
        await this.cloudUploadService.deleteImage(publicId);
     }
      
      await this.prisma.banners.update({
        where: { banner_id: Number(id) },
        data: updatedData,
      });
  
      return 'Update thành công';
    } catch (error) {
      throw new Error(error.message || 'Có lỗi xảy ra');
    }
  }
  

  async remove(id: number,checkAdmin:number): Promise<any> {
    const checUser = await this.prisma.users.findFirst({
      where:{user_id:Number(checkAdmin)}
    })
    if(checUser.role_name === 'user' || checUser.role_name === 'moderator'){
      throw new Error('Không có quyền')
    }
    try {
       const banner = await this.prisma.banners.findFirst({
          where: { banner_id: Number(id) },
       });
 
       if (!banner) {
          throw new Error('Banner không tồn tại');
       }
       
       const publicId = banner.image_url.split('/').slice(-2).join('/').split('.')[0];;
       await this.cloudUploadService.deleteImage(publicId);
        await this.prisma.banners.delete({
          where: { banner_id: Number(id) },
       });
       return 'xóa thành công';
    } catch (error) {
       throw new Error(error.message || 'Có lỗi xảy ra');
    }
 }
  async checkExpiredBanners(): Promise<void> {
    const currentDate = new Date();
  
    // Lấy danh sách các banner đã hết hạn
    const expiredBanners = await this.prisma.banners.findMany({
      where: {
        end_date: { lte: currentDate }
      },
    });
    

    for (const banner of expiredBanners) {
      await this.prisma.banners.delete({
        where: { banner_id: banner.banner_id },
      });
    const publicId = banner.image_url.split('/').slice(-2).join('/').split('.')[0];;
    await this.cloudUploadService.deleteImage(publicId);
    }
  
    console.log(`${expiredBanners.length} banners have been deleted.`);
  }
  // định nghĩa để tự động xóa theo lịch
  @Cron('* * * * *') 
  async handleExpiredBanners() {
    console.log('Checking expired banners...');
    await this.checkExpiredBanners();
  }
  
}
