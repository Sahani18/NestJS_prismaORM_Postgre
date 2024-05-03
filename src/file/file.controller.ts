import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import * as path from 'path';


@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
 
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filePath = path.join(__dirname, '..', 'uploads', file.originalname);
    return await this.fileService.uploadFile(file,filePath);
  }
}
