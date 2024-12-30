import { Body, Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { CloudUploadService } from 'src/shared/cloudUpload.service';
import { Response } from 'express';
import { registerDto } from './dto/register.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { sendMailDto } from './dto/sendMail.dto';
import { changePassDto } from './dto/resetPass.dto';
import { LoginFacebookDto } from './dto/loginface.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
      private readonly cloudUploadService : CloudUploadService
  ){}
  @Post("/login")
  
  async Login(
     @Body() body:loginDto, 
     @Res() res:Response,
  ):Promise<Response<string>>{
     const result = await this.authService.Login(body);
     return res.status(200).json({message:'oce oce oce', result})
  }
  // register
  @Post('/register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  @ApiBody({
   type:registerDto,
  })
  async register(
   @Body() registerDto: registerDto, 
   @UploadedFile() file: Express.Multer.File, 
   @Res() res: Response
 ) {
   if (file) {
     try {
       const uploadResult = await this.cloudUploadService.uploadImage(file, 'avatars');
       registerDto.avartar_url = uploadResult.secure_url; 
        
     } catch (error) {
       return res.status(500).json(
      error.message,
       );
     }
   }
   const newUser =  await this.authService.Register(registerDto)
   return res.status(200).json( newUser);
 }
 //resetpass
 @Post('/send_mail_reset_token')
 async sendMail(
   @Body() body :sendMailDto,
   @Res() res: Response
 ):Promise<Response<any>>{
   await this.authService.sendResetKey(body.email)
   return res.status(200).json({message:'Đã gửi token, check mail để nhận token'})
 }
 @Post('/reset_pass')
 async resetPass(
   @Body() body:changePassDto,
   @Res() res: Response
 ):Promise<Response<string>>{
   await this.authService.resetPass(body.password,body.reset_token)
   return res.status(200).json({message:'Thay đổi thành công mật khẩu'})
 }
 // login FaceBook;
 @Post('/loginFacebook')
async LoginFacebook(
   @Body() body:LoginFacebookDto,
   @Res() res:Response
):Promise<Response<string>>{
   await this.authService.LoginFacebook(body.id,body.email,body.full_name,body.avartar_url);
   return res.status(200).json({message:'Đăng nhập thành công'})
}
}
