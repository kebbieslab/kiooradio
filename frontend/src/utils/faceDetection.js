import * as faceapi from 'face-api.js';
import smartcrop from 'smartcrop';

class FaceDetectionService {
  constructor() {
    this.modelsLoaded = false;
  }

  async loadModels() {
    if (this.modelsLoaded) return;
    
    try {
      // Load face-api.js models from CDN
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      this.modelsLoaded = true;
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.warn('Face detection models failed to load:', error);
      this.modelsLoaded = false;
    }
  }

  async detectFace(imageElement) {
    try {
      if (!this.modelsLoaded) {
        await this.loadModels();
      }

      if (!this.modelsLoaded) {
        throw new Error('Face detection models not available');
      }

      const detection = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detection) {
        const box = detection.detection.box;
        const landmarks = detection.landmarks;
        
        // Calculate face center with small upward adjustment for better framing
        const faceCenter = {
          x: (box.x + box.width / 2) / imageElement.width,
          y: Math.max(0.15, (box.y + box.height * 0.3) / imageElement.height) // 15% margin from top minimum
        };

        return {
          success: true,
          confidence: detection.detection.score,
          focalPoint: `${faceCenter.x * 100}% ${faceCenter.y * 100}%`,
          boundingBox: {
            x: box.x / imageElement.width,
            y: box.y / imageElement.height,
            width: box.width / imageElement.width,
            height: box.height / imageElement.height
          },
          landmarks: landmarks ? landmarks.positions.map(p => ({
            x: p.x / imageElement.width,
            y: p.y / imageElement.height
          })) : null
        };
      }

      throw new Error('No face detected');
    } catch (error) {
      console.warn('Face detection failed:', error);
      return await this.fallbackSmartCrop(imageElement);
    }
  }

  async fallbackSmartCrop(imageElement) {
    try {
      // Use smartcrop as fallback
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      ctx.drawImage(imageElement, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const result = await smartcrop.crop(imageData, { 
        width: Math.min(imageElement.width, 400), 
        height: Math.min(imageElement.height, 400) 
      });

      const crop = result.topCrop;
      const focalPoint = {
        x: (crop.x + crop.width / 2) / imageElement.width,
        y: Math.max(0.25, (crop.y + crop.height * 0.3) / imageElement.height) // 25% margin from top
      };

      return {
        success: true,
        confidence: 0.7, // Moderate confidence for smartcrop
        focalPoint: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
        method: 'smartcrop',
        boundingBox: {
          x: crop.x / imageElement.width,
          y: crop.y / imageElement.height,
          width: crop.width / imageElement.width,
          height: crop.height / imageElement.height
        }
      };
    } catch (error) {
      console.warn('Smartcrop fallback failed:', error);
      
      // Final fallback - center with slight upward bias
      return {
        success: false,
        confidence: 0.3,
        focalPoint: '50% 30%', // Default face-forward positioning
        method: 'default',
        warning: 'Please upload a clearer headshot for better positioning'
      };
    }
  }

  async processImageFile(file) {
    return new Promise((resolve, reject) => {
      // Validate file
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        reject(new Error('Please upload a JPG, PNG, or WebP image'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Image file too large. Please keep under 5MB'));
        return;
      }

      const img = new Image();
      img.onload = async () => {
        // Check minimum resolution
        if (img.width < 400 || img.height < 400) {
          reject(new Error('Image too small. Minimum 400x400 pixels required for good quality headshots'));
          return;
        }

        try {
          const detection = await this.detectFace(img);
          
          resolve({
            ...detection,
            originalWidth: img.width,
            originalHeight: img.height,
            aspectRatio: img.width / img.height,
            fileSize: file.size,
            fileType: file.type
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image. Please try a different file'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  generateResponsiveSizes(imageUrl, focalPoint) {
    // In a real implementation, this would generate different sized images
    // For now, return the same image with different sizing hints
    return {
      large: imageUrl,   // 800px
      medium: imageUrl,  // 400px  
      small: imageUrl,   // 200px
      webp_large: imageUrl,
      webp_medium: imageUrl,
      webp_small: imageUrl,
      focalPoint: focalPoint
    };
  }

  generateOGImage(partner, focalPoint = '50% 30%') {
    // In a real implementation, this would generate a custom OG image using node-canvas
    // with the partner's face centered and brand overlay
    return {
      url: partner.photoUrl || 'https://customer-assets.emergentagent.com/job_ab37571b-81ea-4716-830b-4dd3875c42b0/artifacts/3n0kpvfn_KIOO%20RADIO.png',
      width: 1200,
      height: 630,
      focalPoint: focalPoint
    };
  }
}

export const faceDetection = new FaceDetectionService();
export default faceDetection;