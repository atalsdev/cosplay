import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export async function optimizeImage(inputPath: string, outputPath: string) {
  try {
    await sharp(inputPath)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
      
    console.log(`✅ Optimized: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`❌ Failed to optimize: ${path.basename(inputPath)}`, error);
  }
} 