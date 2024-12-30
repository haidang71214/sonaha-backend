import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/stratergy/jwt.guard';
import { Response } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // người dùng comment, có đẩy lên cái notification của người morderator để họ trả lời
  // comment xong update trong cái noti, cho chính cái moderator đó
  
  @Post('/cmProperties/:id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
async create(
  @Body() createCommentDto: CreateCommentDto,
  @Param('id') id: number,
  @Req() req,
  @Res() res: Response,
): Promise<void> {
  try {
    const userId = req.user.userId;
    console.log('createCommentDto:', createCommentDto); // Log để debug
    console.log('userId:', userId);
    const result = await this.commentService.create(+id, +userId, createCommentDto);
    res.status(HttpStatus.OK).json({ message: result });
  } catch (error) {
    console.error('Error:', error); // Log lỗi
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
}

}
