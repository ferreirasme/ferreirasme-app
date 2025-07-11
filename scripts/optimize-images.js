const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

const sizes = [
  { width: 640, suffix: 'sm' },
  { width: 1024, suffix: 'md' },
  { width: 1920, suffix: 'lg' },
  { width: 3840, suffix: 'xl' }
];

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error);
  }
}

async function processImage(inputPath, outputBasePath) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  console.log(`Processing ${filename}...`);
  
  try {
    // Original format optimization
    const originalExt = path.extname(inputPath).toLowerCase();
    if (originalExt === '.jpg' || originalExt === '.jpeg') {
      await sharp(inputPath)
        .jpeg({ quality: 85, progressive: true })
        .toFile(`${outputBasePath}/${filename}-optimized.jpg`);
    }
    
    // Generate WebP versions
    for (const size of sizes) {
      await sharp(inputPath)
        .resize(size.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 80 })
        .toFile(`${outputBasePath}/${filename}-${size.suffix}.webp`);
    }
    
    // Generate AVIF versions for smaller sizes
    for (const size of sizes.slice(0, 2)) { // Only small and medium
      await sharp(inputPath)
        .resize(size.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .avif({ quality: 70 })
        .toFile(`${outputBasePath}/${filename}-${size.suffix}.avif`);
    }
    
    // Generate blur placeholder
    const blurDataURL = await generateBlurDataURL(inputPath);
    
    console.log(`✓ Processed ${filename}`);
    return { filename, blurDataURL };
    
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
    return null;
  }
}

async function generateBlurDataURL(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10, { fit: 'inside' })
      .blur()
      .toBuffer();
    
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error('Error generating blur data URL:', error);
    return null;
  }
}

async function optimizeImages() {
  try {
    // Create output directories
    await ensureDir(outputDir);
    await ensureDir(`${outputDir}/modelos`);
    await ensureDir(`${outputDir}/semijoias`);
    
    // Process modelos
    const modelosDir = `${inputDir}/modelos`;
    const modelosFiles = await fs.readdir(modelosDir);
    const modelosBlurData = {};
    
    for (const file of modelosFiles) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const result = await processImage(
          `${modelosDir}/${file}`,
          `${outputDir}/modelos`
        );
        if (result) {
          modelosBlurData[result.filename] = result.blurDataURL;
        }
      }
    }
    
    // Process semijoias
    const semijoiasDir = `${inputDir}/semijoias`;
    const semijoiasFiles = await fs.readdir(semijoiasDir);
    const semijoiasBlurData = {};
    
    for (const file of semijoiasFiles) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const result = await processImage(
          `${semijoiasDir}/${file}`,
          `${outputDir}/semijoias`
        );
        if (result) {
          semijoiasBlurData[result.filename] = result.blurDataURL;
        }
      }
    }
    
    // Save blur data URLs to a JSON file
    const blurData = {
      modelos: modelosBlurData,
      semijoias: semijoiasBlurData
    };
    
    await fs.writeFile(
      `${outputDir}/blur-data.json`,
      JSON.stringify(blurData, null, 2)
    );
    
    console.log('\n✅ Image optimization complete!');
    console.log(`Optimized images saved to: ${outputDir}`);
    
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Run the optimization
optimizeImages();