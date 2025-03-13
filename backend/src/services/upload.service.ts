import { BaseService } from "./base.service";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export class UploadService extends BaseService {
  private uploadDir: string;
  private allowedFileTypes: string[];
  private maxFileSize: number = 5 * 1024 * 1024;
  private baseUrl: string;

  constructor() {
    super();
    this.uploadDir = path.join(process.cwd(), "uploads");
    this.ensureDirectoryExists(this.uploadDir);
    this.allowedFileTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    this.baseUrl = process.env.BASE_URL || "http://localhost:8080";
  }

  private storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, this.uploadDir);
    },
    filename: (_, file, cb) => {
      // Generate unique filename with original extension
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      cb(null, fileName);
    },
  });

  private fileFilter = (
    _: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (this.allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file type. Allowed types: ${this.allowedFileTypes.join(
            ", "
          )}`
        )
      );
    }
  };

  public upload = multer({
    storage: this.storage,
    limits: {
      fileSize: this.maxFileSize,
    },
    fileFilter: this.fileFilter,
  });

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  getFileUrl(file: Express.Multer.File): string {
    return `${this.baseUrl}/uploads/${file.filename}`;
  }

  processUploadedFile(file: Express.Multer.File) {
    const url = this.getFileUrl(file);
    return {
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url,
    };
  }

  deleteFile(filename: string): boolean {
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }
}
