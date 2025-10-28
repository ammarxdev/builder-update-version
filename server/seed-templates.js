import mongoose from 'mongoose';
import { Template } from './src/models/Template.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedTemplates = [
  {
    title: 'Modern Minimalist',
    description: 'Clean and minimal design with smooth scrolling sections',
    category: 'Professional',
    colors: ['#667eea', '#764ba2', '#f093fb'],
    layout: 'Single Page',
    style: 'Minimal',
    preview: 'Perfect for professionals who appreciate clean aesthetics',
    filename: '1761564484615-modern-minimalist.html'
  },
  {
    title: 'Creative Showcase',
    description: 'Bold and vibrant design for creative portfolios',
    category: 'Creative',
    colors: ['#f093fb', '#f5576c', '#4facfe'],
    layout: 'Masonry Grid',
    style: 'Vibrant',
    preview: 'Stand out with asymmetrical layouts and bold colors',
    filename: '1761564484754-creative-showcase.html'
  },
  {
    title: 'Professional Corporate',
    description: 'Business-focused design with testimonials section',
    category: 'Business',
    colors: ['#2d3748', '#4a5568', '#718096'],
    layout: 'Multi-Section',
    style: 'Corporate',
    preview: 'Ideal for consultants and corporate professionals',
    filename: '1761564484884-professional-corporate.html'
  },
  {
    title: 'Portfolio Artist',
    description: 'Dark-themed visual showcase for artists',
    category: 'Creative',
    colors: ['#667eea', '#764ba2', '#f5576c'],
    layout: 'Gallery',
    style: 'Dark',
    preview: 'Showcase your visual work in a stunning dark theme',
    filename: '1761564485015-portfolio-artist.html'
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-builder');
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing templates...');
    await Template.deleteMany({});
    console.log('✅ Cleared existing templates');

    console.log('📝 Seeding templates...');
    
    for (const templateData of seedTemplates) {
      const filePath = path.join(__dirname, 'uploads', 'portfolios', templateData.filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${templateData.filename}, skipping...`);
        continue;
      }

      const html = fs.readFileSync(filePath, 'utf-8');
      
      const template = await Template.create({
        title: templateData.title,
        description: templateData.description,
        category: templateData.category,
        colors: templateData.colors,
        layout: templateData.layout,
        style: templateData.style,
        preview: templateData.preview,
        html: html,
        isActive: true
      });

      console.log(`✅ Created template: ${template.title}`);
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
