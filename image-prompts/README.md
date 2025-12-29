# Image Generation Guide

## Files Overview

This folder contains individual prompt files for generating images for the AI Fitness Trainer README:

### Required Images:

1. **01-banner.txt** - Main header banner (1200x400px)
2. **02-dashboard.txt** - Dashboard interface preview (600x400px)
3. **03-workout-analysis.txt** - AI form analysis interface (600x400px)

### Optional Images:

4. **04-features-grid-OPTIONAL.txt** - Feature showcase grid (800x600px)
5. **05-mobile-app-OPTIONAL.txt** - Mobile app mockup (400x800px)
6. **06-exercise-library-OPTIONAL.txt** - Exercise cards grid (600x400px)

## How to Use

### For Each Image:

1. Open the `.txt` file
2. Copy the entire prompt
3. Paste into your AI image generator:
   - **ChatGPT Plus** (DALL-E 3)
   - **Midjourney** (Discord)
   - **Leonardo.ai**
   - **Stable Diffusion**
   - Any other AI generator

### Best Practices:

- Generate 2-3 variations of each image
- Pick the best one that matches the vision
- Ensure consistent dark theme and neon colors across all images
- Save with descriptive names: `banner.png`, `dashboard.png`, `analysis.png`

### After Generation:

1. Save images to `public/screenshots/` folder (create if needed)
2. Let me know when ready, I'll update README.md to use them
3. We'll commit and push to GitHub

## Color Reference

All prompts use the same color palette:

- **Background:** `#0a0e1a` (dark navy)
- **Primary:** `#00ffff` (neon cyan)
- **Secondary:** `#b000ff` (neon purple)
- **Text:** `#ffffff` (white)

## Tips

- Add "high quality, 4k, professional" to prompts for better output
- Use aspect ratio flags if available (e.g., `--ar 16:9` in Midjourney)
- For photorealistic style, add `photorealistic` or `--style raw`
- Generate the required images first (01-03) before optionals
