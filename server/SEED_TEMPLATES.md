# Seed Templates Script

This script populates the MongoDB database with template data from the HTML files in the `uploads/portfolios` folder.

## Usage

1. Make sure MongoDB is running
2. Ensure you have template HTML files in `server/uploads/portfolios/`
3. Run the seed script:

```bash
cd server
node seed-templates.js
```

## What it does

The script will:
- Connect to MongoDB using the connection string from `.env`
- Clear all existing templates
- Read HTML files from `uploads/portfolios/`
- Create new template documents with metadata (title, description, category, colors, etc.)
- Store the HTML content in the database

## Template Files

The script looks for these template files:
- `1761564484615-modern-minimalist.html` - Modern Minimalist template
- `1761564484754-creative-showcase.html` - Creative Showcase template
- `1761564484884-professional-corporate.html` - Professional Corporate template
- `1761564485015-portfolio-artist.html` - Portfolio Artist template

## After Seeding

Once seeded, templates will be available via the API at:
- GET `/api/templates` - List all templates
- GET `/api/templates/:id` - Get specific template

The frontend will automatically fetch and display these templates in the template selection screen.
