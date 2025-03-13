import { Request, Response } from "express";
import { UploadService } from "../services/upload.service";

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  uploadImage = (req: Request, res: Response) => {
    try {
      const upload = this.uploadService.upload.single("image");

      upload(req, res, (err: any) => {
        if (err) {
          return res.status(400).json({ message: err });
        }

        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        // Process the uploaded file and get the URL
        const result = this.uploadService.processUploadedFile(req.file);

        // Return the file information including URL
        return res.status(200).json(result);
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Error uploading file", error: error.message });
    }
  };

  uploadMultipleImages = (req: Request, res: Response) => {
    try {
      const upload = this.uploadService.upload.array("images", 10); // Allow up to 10 images

      upload(req, res, (err: any) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        if (
          !req.files ||
          (Array.isArray(req.files) && req.files.length === 0)
        ) {
          return res.status(400).json({ message: "No files uploaded" });
        }

        // Process each uploaded file and get URLs
        const files = Array.isArray(req.files)
          ? req.files.map((file) =>
              this.uploadService.processUploadedFile(file)
            )
          : [];

        // Return the files information including URLs
        return res.status(200).json(files);
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Error uploading files", error: error.message });
    }
  };
}

export default new UploadController();
