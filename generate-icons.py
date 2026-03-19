#!/usr/bin/env python3
"""
Generate PWA icons for StoreSync POS
Creates all required icon sizes using PIL/Pillow
"""

import os

try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

def create_icon(size, output_path):
    """Create a StoreSync icon at the given size."""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background with rounded corners
    bg_color = (79, 70, 229)   # #4f46e5 indigo
    accent = (124, 58, 237)    # #7c3aed purple
    
    # Draw rounded rect background
    margin = int(size * 0.05)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=int(size * 0.22),
        fill=bg_color
    )
    
    # Gradient overlay (simulate with second rect)
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=int(size * 0.22),
        fill=None,
        outline=accent,
        width=max(1, int(size * 0.02))
    )
    
    # Draw store emoji / symbol
    center = size // 2
    
    # Simple store icon: roof triangle
    roof_h = int(size * 0.25)
    roof_top = int(size * 0.2)
    roof_left = int(size * 0.15)
    roof_right = int(size * 0.85)
    roof_bottom = roof_top + roof_h
    
    draw.polygon(
        [(center, roof_top), (roof_right, roof_bottom), (roof_left, roof_bottom)],
        fill=(255, 255, 255)
    )
    
    # Building body
    body_left = int(size * 0.22)
    body_right = int(size * 0.78)
    body_top = roof_bottom - 2
    body_bottom = int(size * 0.82)
    draw.rectangle([body_left, body_top, body_right, body_bottom], fill=(255, 255, 255))
    
    # Door
    door_w = int(size * 0.2)
    door_h = int(size * 0.2)
    door_left = center - door_w // 2
    door_right = center + door_w // 2
    door_top = body_bottom - door_h
    draw.rectangle(
        [door_left, door_top, door_right, body_bottom],
        fill=bg_color
    )
    
    # Windows
    win_size = int(size * 0.1)
    win_top = int(size * 0.52)
    # Left window
    draw.rectangle(
        [body_left + int(size*0.05), win_top,
         body_left + int(size*0.05) + win_size, win_top + win_size],
        fill=bg_color
    )
    # Right window
    draw.rectangle(
        [body_right - int(size*0.05) - win_size, win_top,
         body_right - int(size*0.05), win_top + win_size],
        fill=bg_color
    )
    
    img.save(output_path, 'PNG', optimize=True)
    print(f"✅ Created: {output_path} ({size}x{size})")

def main():
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
    os.makedirs(icons_dir, exist_ok=True)
    
    if not HAS_PIL:
        print("⚠️  Pillow not installed. Run: pip install Pillow")
        print("📝 Generating placeholder SVG icons instead...")
        generate_svg_icons(sizes, icons_dir)
        return
    
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon-{size}.png')
        create_icon(size, output_path)
    
    print(f"\n🎉 All {len(sizes)} icons generated in {icons_dir}/")

def generate_svg_icons(sizes, icons_dir):
    """Generate SVG-based placeholder icons."""
    svg_template = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{size}" height="{size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5"/>
      <stop offset="100%" style="stop-color:#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#bg)"/>
  <polygon points="50,18 82,40 18,40" fill="white"/>
  <rect x="22" y="38" width="56" height="42" fill="white"/>
  <rect x="40" y="62" width="20" height="18" fill="#4f46e5"/>
  <rect x="26" y="50" width="12" height="12" fill="#4f46e5"/>
  <rect x="62" y="50" width="12" height="12" fill="#4f46e5"/>
</svg>'''
    
    for size in sizes:
        svg_path = os.path.join(icons_dir, f'icon-{size}.svg')
        with open(svg_path, 'w') as f:
            f.write(svg_template.format(size=size))
        print(f"✅ Created SVG: {svg_path}")
    
    print("\n⚠️  SVG icons created. For PNG icons, install Pillow and run again.")
    print("   npm install -g svg2png OR pip install Pillow cairosvg")

if __name__ == '__main__':
    main()
