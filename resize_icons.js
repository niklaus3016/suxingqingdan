#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Android launcher icon sizes
// mdpi: 48x48 (baseline)
// hdpi: 72x72 (1.5x)
// xhdpi: 96x96 (2x)
// xxhdpi: 144x144 (3x)
// xxxhdpi: 192x192 (4x)

const sizes = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
};

const inputFile = 'sxqd512.png';

async function resizeIcon(size, outputDir) {
    const outputPath = path.join(outputDir, 'ic_launcher.png');
    const roundPath = path.join(outputDir, 'ic_launcher_round.png');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Resize and save
    await sharp(inputFile)
        .resize(size, size, {
            fit: 'cover',
            withoutEnlargement: false
        })
        .toFile(outputPath);
    
    // Also save as round version
    await sharp(inputFile)
        .resize(size, size, {
            fit: 'cover',
            withoutEnlargement: false
        })
        .toFile(roundPath);
    
    console.log(`Created ${outputPath} (${size}x${size})`);
    console.log(`Created ${roundPath} (${size}x${size})`);
}

async function main() {
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: Input file '${inputFile}' not found!`);
        process.exit(1);
    }
    
    console.log(`Processing icon: ${inputFile}`);
    
    for (const [density, size] of Object.entries(sizes)) {
        const outputDir = `android/app/src/main/res/mipmap-${density}`;
        await resizeIcon(size, outputDir);
    }
    
    console.log('\n✅ All icons generated successfully!');
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});