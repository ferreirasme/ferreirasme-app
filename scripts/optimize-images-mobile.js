const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configurações de otimização
const SIZES = {
  mobile: { width: 640, suffix: '-mobile' },
  tablet: { width: 1024, suffix: '-tablet' },
  desktop: { width: 1920, suffix: '-desktop' }
};

const QUALITY = {
  jpeg: 85,
  webp: 85
};

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const ext = path.extname(inputPath).toLowerCase();
  
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    console.log(`Ignorando ${inputPath} - formato não suportado`);
    return;
  }
  
  console.log(`Otimizando ${inputPath}...`);
  
  for (const [size, config] of Object.entries(SIZES)) {
    try {
      // Gerar versão JPEG otimizada
      await sharp(inputPath)
        .resize(config.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: QUALITY.jpeg, progressive: true })
        .toFile(path.join(outputDir, `${filename}${config.suffix}.jpg`));
      
      // Gerar versão WebP
      await sharp(inputPath)
        .resize(config.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: QUALITY.webp })
        .toFile(path.join(outputDir, `${filename}${config.suffix}.webp`));
      
      console.log(`✓ ${size} criado para ${filename}`);
    } catch (error) {
      console.error(`Erro ao processar ${filename} para ${size}:`, error.message);
    }
  }
}

async function processDirectory(dir, outputDir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const subOutputDir = path.join(outputDir, file);
      if (!fs.existsSync(subOutputDir)) {
        fs.mkdirSync(subOutputDir, { recursive: true });
      }
      await processDirectory(filePath, subOutputDir);
    } else {
      await optimizeImage(filePath, outputDir);
    }
  }
}

async function main() {
  const publicImagesDir = path.join(process.cwd(), 'public', 'images');
  const outputDir = path.join(process.cwd(), 'public', 'images', 'optimized');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('🖼️  Iniciando otimização de imagens para mobile...\n');
  
  // Processar diretórios específicos
  const dirsToProcess = ['modelos', 'semijoias'];
  
  for (const dir of dirsToProcess) {
    const inputDir = path.join(publicImagesDir, dir);
    const dirOutputDir = path.join(outputDir, dir);
    
    if (fs.existsSync(inputDir)) {
      if (!fs.existsSync(dirOutputDir)) {
        fs.mkdirSync(dirOutputDir, { recursive: true });
      }
      console.log(`\nProcessando ${dir}...`);
      await processDirectory(inputDir, dirOutputDir);
    }
  }
  
  console.log('\n✅ Otimização concluída!');
  console.log('\nPara usar as imagens otimizadas, use o componente OptimizedImage');
}

// Verificar se sharp está instalado
try {
  require.resolve('sharp');
  main().catch(console.error);
} catch (e) {
  console.error('❌ Sharp não está instalado. Execute: npm install sharp');
  process.exit(1);
}