import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto  {
  
  @ApiProperty({ required: false })  
  @IsOptional()
  full_name?: string; 

  // chỗ này
  @ApiProperty({ required: false })  
  @IsOptional()
  email?: string; 

  @ApiProperty({ required: false })  
  @IsOptional()
 
  phone_number?: string;

  @ApiProperty({ required: false })  
  @IsOptional()
  @IsString()
  password?: string; 

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional() 
  img: any;

  @ApiHideProperty() 
  avartar_url: string;
}
