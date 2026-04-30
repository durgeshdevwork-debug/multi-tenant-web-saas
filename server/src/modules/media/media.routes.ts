import { Router } from 'express';
import multer from 'multer';
import { requireTenantUser } from '@shared/middlewares/roleMiddleware';
import * as mediaController from './media.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const isAllowed =
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype.startsWith('audio/');

    if (!isAllowed) {
      cb(new Error('Only image, video, or audio uploads are allowed'));
      return;
    }
    cb(null, true);
  }
});

export const mediaRouter = Router();

mediaRouter.use(requireTenantUser);

mediaRouter.get('/', mediaController.listMedia);
mediaRouter.post('/', upload.single('file'), mediaController.uploadMedia);
mediaRouter.delete('/:id', mediaController.deleteMedia);
