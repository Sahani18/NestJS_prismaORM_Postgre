import { DatabaseService } from './../database/database.service';
import { Injectable } from '@nestjs/common';


@Injectable()
export class FileService {
  constructor(private readonly databaseService: DatabaseService) {}

  async uploadFile(file:any,filePath:string) {
 console.log("-------",file)
    const uploadedFile = await this.databaseService.file.create({
      data: {
        filename: file.originalname,
        path: filePath,
        mimetype: file.mimetype,
      },
    });
    return uploadedFile;
  }
}
