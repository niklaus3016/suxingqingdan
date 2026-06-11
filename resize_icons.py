#!/usr/bin/env python3
import sys
try:
    from PIL import Image
except ImportError:
    # Try to install Pillow
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

import os

# Android launcher icon sizes
# mdpi: 48x48 (baseline)
# hdpi: 72x72 (1.5x)
# xhdpi: 96x96 (2x)
# xxhdpi: 144x144 (3x)
# xxxhdpi: 192x192 (4x)

sizes = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
}

def resize_icon(input_path, output_dir, size):
    try:
        with Image.open(input_path) as img:
            img = img.resize((size, size), Image.LANCZOS)
            os.makedirs(output_dir, exist_ok=True)
            
            # Save ic_launcher.png
            launcher_path = os.path.join(output_dir, 'ic_launcher.png')
            img.save(launcher_path, 'PNG')
            print(f"Created: {launcher_path}")
            
            # Save ic_launcher_round.png (same image, just rounded corners handled by Android)
            round_path = os.path.join(output_dir, 'ic_launcher_round.png')
            img.save(round_path, 'PNG')
            print(f"Created: {round_path}")
            
    except Exception as e:
        print(f"Error processing {output_dir}: {e}")

def main():
    input_file = 'sxqd512.png'
    
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' not found!")
        sys.exit(1)
    
    for density, size in sizes.items():
        output_dir = f'android/app/src/main/res/mipmap-{density}'
        resize_icon(input_file, output_dir, size)
    
    print("\n✅ All icons generated successfully!")

if __name__ == '__main__':
    main()