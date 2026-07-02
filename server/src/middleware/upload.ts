/**
 * Cloudinary + Multer Middleware
 * Handles secure image uploads to Cloudinary
 */

import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
 secure: true,
});

// Configure Multer to use memory storage
const storage = multer.memoryStorage();

// File filter to only accept images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type. Only JPEG, PNG, and WebP images are allowed."));
  }
};

// Configure Multer
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

/**
 * Upload file to Cloudinary
 */
async function uploadToCloudinary(
 file: Express.Multer.File,
 folder: string = "portfolio",
): Promise<string> {
 return new Promise((resolve, reject) => {
 const uploadStream = cloudinary.uploader.upload_stream(
 {
 folder,
 resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
 },
 (error, result) => {
 if (error) {
 reject(error);
 } else {
 resolve(result?.secure_url || "");
 }
 },
 );

 // Create a readable stream from the buffer
 const readableStream = new Readable();
 readableStream.push(file.buffer);
 readableStream.push(null);
 readableStream.pipe(uploadStream);
 });
}

/**
 * Middleware to handle single file upload
 */
export const uploadSingle = (fieldName: string, folder: string = "portfolio") => {
 return async (req: Request, res: Response, next: NextFunction) => {
 const uploadHandler = upload.single(fieldName);

 uploadHandler(req, res, async (err) => {
 if (err) {
 if (err instanceof multer.MulterError) {
 if (err.code === "LIMIT_FILE_SIZE") {
 return res.status(400).json({
 success: false,
 message: "File size too large. Maximum size is 5MB.",
 });
 }
 return res.status(400).json({
 success: false,
 message: err.message,
 });
 }
 return res.status(400).json({
 success: false,
 message: err.message,
 });
 }

 // If no file was uploaded, continue without upload
 if (!req.file) {
 return next();
 }

 try {
 // Upload to Cloudinary
 const cloudinaryUrl = await uploadToCloudinary(req.file, folder);
 
 // Attach the URL to the request body
 req.body[fieldName + "_url"] = cloudinaryUrl;
 
 next();
 } catch (error) {
 console.error("Cloudinary upload error:", error);
 return res.status(500).json({
 success: false,
 message: "Failed to upload file to Cloudinary",
 });
 }
 });
 };
};

/**
 * Middleware to handle multiple file uploads
 */
export const uploadMultiple = (fieldName: string, maxCount: number = 5, folder: string = "portfolio") => {
 return async (req: Request, res: Response, next: NextFunction) => {
 const uploadHandler = upload.array(fieldName, maxCount);

 uploadHandler(req, res, async (err) => {
 if (err) {
 if (err instanceof multer.MulterError) {
 if (err.code === "LIMIT_FILE_SIZE") {
 return res.status(400).json({
 success: false,
 message: "File size too large. Maximum size is 5MB.",
 });
 }
 if (err.code === "LIMIT_UNEXPECTED_FILE") {
 return res.status(400).json({
 success: false,
 message: `Maximum ${maxCount} files allowed.`,
 });
 }
 return res.status(400).json({
 success: false,
 message: err.message,
 });
 }
 return res.status(400).json({
 success: false,
 message: err.message,
 });
 }

 // If no files were uploaded, continue without upload
 if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
 return next();
 }

 try {
 const files = req.files as Express.Multer.File[];
 const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
 const urls = await Promise.all(uploadPromises);
 
 // Attach the URLs to the request body
 req.body[fieldName + "_urls"] = urls;
 
 next();
 } catch (error) {
 console.error("Cloudinary upload error:", error);
 return res.status(500).json({
 success: false,
 message: "Failed to upload files to Cloudinary",
 });
 }
 });
 };
};

/**
 * Middleware to handle multiple file fields (e.g. image and video)
 */
export const uploadFields = (fields: { name: string; maxCount: number }[], folder: string = "portfolio") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const uploadHandler = upload.fields(fields);

    uploadHandler(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // If req.files is not populated, continue
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      if (!files) {
        return next();
      }

      try {
        // Upload each field's file to Cloudinary if it exists
        for (const field of fields) {
          const fieldFiles = files[field.name];
          if (fieldFiles && fieldFiles.length > 0) {
            const cloudinaryUrl = await uploadToCloudinary(fieldFiles[0], folder);
            req.body[field.name + "_url"] = cloudinaryUrl;
          }
        }
        next();
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload files to Cloudinary",
        });
      }
    });
  };
};

export const uploadCV = (fieldName: string, folder: string = "portfolio/cv") => {
  const cvFileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type. Only PDF, JPEG, PNG, and WebP files are allowed for CV."));
    }
  };

  const uploadCVInstance = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit for CV
    },
    fileFilter: cvFileFilter,
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    const uploadHandler = uploadCVInstance.single(fieldName);

    uploadHandler(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      if (!req.file) {
        return next();
      }

      try {
        const isPdf = req.file.mimetype === "application/pdf";
        const cloudinaryUrl = await new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: isPdf ? "raw" : "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result?.secure_url || "");
            }
          );
          const readableStream = new Readable();
          readableStream.push(req.file!.buffer);
          readableStream.push(null);
          readableStream.pipe(uploadStream);
        });

        req.body[fieldName + "_url"] = cloudinaryUrl;
        next();
      } catch (error) {
        console.error("Cloudinary CV upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload CV to Cloudinary",
        });
      }
    });
  };
};

export { cloudinary, upload };
