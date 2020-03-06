import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Joi from 'joi';
import mime from 'mime-types';
import { BAD_REQUEST, CONTENT_TYPE } from '../../../config/exection';
import File from '../../../entity/File';
import { getRepository } from 'typeorm';

type FileType = 'animation' | 'profile' | 'episode';
type ResourceType = 'video' | 'image';
type SignedImageUrlType = {
  public_id: string;
  version: any;
  width: number;
  height: number;
  format: string;
  created_at: string;
  resource_type: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  url: string;
  secure_url: string;
  signature: string;
  original_filename: string;
};
type SignedVideoUrlType = {
  public_id: string;
  version: any;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  url: string;
  secure_url: string;
  audio: {
    codec: string;
    bit_rate: string;
    frequency: number;
    channels: number;
    channel_layout: string;
  };
  video: {
    pix_format: string;
    codec: string;
    level: number;
    bit_rate: string;
  };
  frame_rate: number;
  bit_rate: number;
  duration: number;
};

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_APIKEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_APIKEY || !CLOUDINARY_API_SECRET) {
  const error = new Error('Invalid Cloudinary Error');
  error.message = 'cloudinary env value is missing.';
  throw error;
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_APIKEY,
  api_secret: CLOUDINARY_API_SECRET
});

const generateSignedUrl = async (
  path: string,
  filename: string,
  resource_type: ResourceType
): Promise<SignedImageUrlType & SignedVideoUrlType> => {
  const contentType = mime.lookup(filename);
  if (!contentType) {
    const error = new Error('Failed to parse Content-Type from filename');
    error.name = 'ContentTypeError';
    throw error;
  }

  if (!contentType.includes('image') || !contentType.includes('video')) {
    const error = new Error('Given file is not a image and video');
    error.name = 'ContentTypeError';
    throw error;
  }

  const uploadPath = `${path}/${filename}`;
  if (resource_type === 'image') {
    const response = await cloudinary.uploader.upload(filename, {
      public_id: `lafu/${uploadPath}`,
      eager_async: true
    });
    return response;
  } else {
    const response = await cloudinary.uploader.upload_large(filename, {
      resource_type: 'video',
      public_id: `lafu/${uploadPath}`,
      eager_async: true
    });
    return response;
  }
};

const generateUploadPath = (id: string, type: FileType, resource_type: ResourceType) => {
  switch (resource_type) {
    case 'image':
      return `images/${type}/${id}`;
    case 'video':
      return `videos/${type}/${id}`;
    default:
      return null;
  }
};

const file = Router();

file.post('/create-url', async (req, res) => {
  interface Body {
    resource_type: ResourceType;
    type: FileType;
    filename: string;
    refId?: any;
  }

  const schema = Joi.object().keys({
    type: Joi.string().valid('animation', 'profile', 'episode'),
    resource_type: Joi.string().valid('video', 'image'),
    filename: Joi.string().required(),
    refId: Joi.any()
  });

  const result = Joi.validate(req.body, schema);
  if (result.error) {
    return res.status(BAD_REQUEST.status).json({
      payload: {
        name: BAD_REQUEST.name,
        status: result.error.name,
        message: result.error.message
      }
    });
  }

  const { type, filename, refId, resource_type } = req.body as Body;

  try {
    const file = new File();
    file.type = type;
    file.resource_type = resource_type;
    file.ref_id = refId || null;

    const fileRepo = getRepository(File);
    await fileRepo.save(file);

    const path = generateUploadPath(file.id, type, resource_type);
    if (!path) {
      return res.status(CONTENT_TYPE.status).json({
        payload: {
          name: CONTENT_TYPE.name,
          status: CONTENT_TYPE.status,
          message: '파일 업로드 에러'
        }
      });
    }

    const response = await generateSignedUrl(path, filename, resource_type);
    file.name = filename;
    file.path = response.secure_url;
    await fileRepo.save(file);

    if (resource_type === 'image') {
      const { original_filename } = response;
      return res.status(200).json({
        fileId: file.id,
        filename: original_filename,
        signed_url: response.secure_url
      });
    } else {
      const { duration } = response;
      return res.status(200).json({
        fileId: file.id,
        duration,
        signed_url: response.secure_url
      });
    }
  } catch (e) {
    console.error(e);
    if (e.naem === 'ContentTypeError') {
      return res.status(CONTENT_TYPE.status).json({
        payload: {
          name: CONTENT_TYPE.name,
          status: CONTENT_TYPE.status,
          message: '파일 업로드 에러'
        }
      });
    }

    return res.status(500);
  }
});

export default file;
