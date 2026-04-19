declare module 'multer' {
  interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }

  type FileFilterCallback = (error: Error | null, acceptFile?: boolean) => void;

  interface Multer {
    single(fieldName: string): import('express').RequestHandler;
  }

  interface Options {
    storage?: unknown;
    limits?: {
      fileSize?: number;
    };
    fileFilter?: (req: unknown, file: File, cb: FileFilterCallback) => void;
  }

  interface MulterStatic {
    (options?: Options): Multer;
    memoryStorage(): unknown;
  }

  const multer: MulterStatic;
  export = multer;
}

declare namespace Express {
  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    }
  }
}
