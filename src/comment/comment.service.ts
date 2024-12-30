import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
  prisma = new PrismaClient()

  async create(id:number,userId:number,createCommentDto:CreateCommentDto) {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where:{user_id:userId}
      })
      if(checkAdmin.role_name){
        await this.prisma.comments.create({
          data:{
            user_id:checkAdmin.user_id,
            property_id:id,
            comment_text:createCommentDto.comment
          }
        })
      }
      return 'done'
    } catch (error) {
      return error
    }
  }
}
