import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { Portfolio } from './src/models/Portfolio.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Built-in templates from frontend
const builtInTemplates = [
  {
    title: 'Modern Minimalist',
    description: 'A clean and minimal portfolio design perfect for showcasing your work with elegance',
    category: 'template',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Minimalist Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { text-align: center; padding: 50px 0; }
        h1 { font-size: 3em; margin-bottom: 10px; }
        .subtitle { color: #666; font-size: 1.2em; }
        .section { margin: 50px 0; }
        .section h2 { font-size: 2em; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { background: #f4f4f4; padding: 20px; border-radius: 8px; }
        .card h3 { margin-bottom: 10px; }
        footer { text-align: center; padding: 30px 0; background: #333; color: white; margin-top: 50px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Your Name</h1>
            <p class="subtitle">Developer | Designer | Creator</p>
        </header>
        
        <section class="section">
            <h2>About</h2>
            <p>Welcome to my portfolio. I create beautiful and functional web experiences.</p>
        </section>
        
        <section class="section">
            <h2>Projects</h2>
            <div class="grid">
                <div class="card">
                    <h3>Project 1</h3>
                    <p>Description of your amazing project</p>
                </div>
                <div class="card">
                    <h3>Project 2</h3>
                    <p>Another great project showcase</p>
                </div>
                <div class="card">
                    <h3>Project 3</h3>
                    <p>More of your excellent work</p>
                </div>
            </div>
        </section>
    </div>
    
    <footer>
        <p>&copy; 2024 Your Name. All rights reserved.</p>
    </footer>
</body>
</html>`
  },
  {
    title: 'Creative Showcase',
    description: 'Bold and colorful design ideal for artists and creative professionals',
    category: 'template',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Showcase Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { text-align: center; padding: 80px 0; }
        h1 { font-size: 4em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .tagline { font-size: 1.5em; opacity: 0.9; }
        .portfolio-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 50px 0; }
        .portfolio-item { background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); transition: transform 0.3s; }
        .portfolio-item:hover { transform: translateY(-10px); background: rgba(255,255,255,0.2); }
        .portfolio-item h3 { margin-bottom: 15px; font-size: 1.8em; }
        .cta { text-align: center; margin: 50px 0; }
        .cta button { background: white; color: #667eea; padding: 15px 40px; border: none; border-radius: 30px; font-size: 1.2em; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Creative Mind</h1>
            <p class="tagline">Bringing Ideas to Life</p>
        </header>
        
        <div class="portfolio-grid">
            <div class="portfolio-item">
                <h3>Design Project</h3>
                <p>Innovative design solutions</p>
            </div>
            <div class="portfolio-item">
                <h3>Art Gallery</h3>
                <p>Visual storytelling</p>
            </div>
            <div class="portfolio-item">
                <h3>Brand Identity</h3>
                <p>Complete brand packages</p>
            </div>
        </div>
        
        <div class="cta">
            <button>Get In Touch</button>
        </div>
    </div>
</body>
</html>`
  },
  {
    title: 'Professional Corporate',
    description: 'Clean corporate design perfect for business professionals and consultants',
    category: 'template',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Corporate Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', serif; color: #2c3e50; background: #ecf0f1; }
        nav { background: #34495e; color: white; padding: 20px 0; }
        nav .container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
        nav h1 { font-size: 1.5em; }
        nav ul { list-style: none; display: flex; gap: 30px; }
        .hero { background: white; text-align: center; padding: 100px 20px; }
        .hero h2 { font-size: 3em; margin-bottom: 20px; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .services { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin: 50px 0; }
        .service-card { background: white; padding: 40px; text-align: center; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .service-card h3 { margin-bottom: 15px; color: #34495e; }
        footer { background: #34495e; color: white; text-align: center; padding: 30px 0; margin-top: 50px; }
    </style>
</head>
<body>
    <nav>
        <div class="container">
            <h1>Professional Name</h1>
            <ul>
                <li>Home</li>
                <li>Services</li>
                <li>Contact</li>
            </ul>
        </div>
    </nav>
    
    <div class="hero">
        <h2>Business Consultant</h2>
        <p>Helping businesses grow and succeed</p>
    </div>
    
    <div class="container">
        <div class="services">
            <div class="service-card">
                <h3>Strategy</h3>
                <p>Business strategy consulting</p>
            </div>
            <div class="service-card">
                <h3>Management</h3>
                <p>Project management services</p>
            </div>
            <div class="service-card">
                <h3>Growth</h3>
                <p>Business growth solutions</p>
            </div>
        </div>
    </div>
    
    <footer>
        <p>&copy; 2024 Professional Services</p>
    </footer>
</body>
</html>`
  },
  {
    title: 'Portfolio Artist',
    description: 'Artistic and expressive layout for visual artists and photographers',
    category: 'example',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Artist Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: #1a1a1a; color: white; }
        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect fill="%23667eea" width="1200" height="800"/></svg>'); background-size: cover; }
        .hero h1 { font-size: 5em; text-align: center; }
        .gallery { padding: 50px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .gallery-item { aspect-ratio: 1; background: #333; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .about { padding: 100px 50px; text-align: center; max-width: 800px; margin: 0 auto; }
        .about h2 { font-size: 2.5em; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Artist Name</h1>
    </div>
    
    <div class="gallery">
        <div class="gallery-item">Artwork 1</div>
        <div class="gallery-item">Artwork 2</div>
        <div class="gallery-item">Artwork 3</div>
        <div class="gallery-item">Artwork 4</div>
    </div>
    
    <div class="about">
        <h2>About My Art</h2>
        <p>I create visual experiences that inspire and captivate. My work explores themes of color, form, and emotion.</p>
    </div>
</body>
</html>`
  },
  {
    title: 'Tech Developer',
    description: 'Dark themed technical portfolio for developers and engineers',
    category: 'template',
    htmlContent: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Developer Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; background: #0d1117; color: #c9d1d9; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        header { border-bottom: 1px solid #30363d; padding-bottom: 30px; margin-bottom: 40px; }
        h1 { font-size: 2.5em; color: #58a6ff; margin-bottom: 10px; }
        .terminal { background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 20px; margin: 20px 0; }
        .terminal::before { content: '$ '; color: #58a6ff; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; margin: 30px 0; }
        .skill { background: #21262d; padding: 8px 16px; border-radius: 20px; border: 1px solid #30363d; }
        .projects { margin: 40px 0; }
        .project { background: #161b22; padding: 20px; border-radius: 6px; border: 1px solid #30363d; margin-bottom: 20px; }
        .project h3 { color: #58a6ff; margin-bottom: 10px; }
        a { color: #58a6ff; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Developer Name</h1>
            <p>Full Stack Developer | Open Source Contributor</p>
        </header>
        
        <div class="terminal">
            console.log("Welcome to my portfolio");
        </div>
        
        <section>
            <h2>Skills</h2>
            <div class="skills">
                <span class="skill">JavaScript</span>
                <span class="skill">React</span>
                <span class="skill">Node.js</span>
                <span class="skill">Python</span>
                <span class="skill">Docker</span>
            </div>
        </section>
        
        <section class="projects">
            <h2>Projects</h2>
            <div class="project">
                <h3>Project Alpha</h3>
                <p>A full-stack web application built with modern technologies</p>
                <a href="#">View on GitHub →</a>
            </div>
            <div class="project">
                <h3>Project Beta</h3>
                <p>Open source library for developers</p>
                <a href="#">View on GitHub →</a>
            </div>
        </section>
    </div>
</body>
</html>`
  }
];

async function migrateTemplates() {
  try {
    console.log('🔄 Connecting to MongoDB...\n');
    await connectDB(process.env.MONGODB_URI);
    
    console.log('📋 Checking existing templates...\n');
    const existingCount = await Portfolio.countDocuments();
    console.log(`Found ${existingCount} existing portfolios\n`);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads', 'portfolios');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory\n');
    }
    
    console.log('📤 Migrating built-in templates...\n');
    
    for (const template of builtInTemplates) {
      try {
        // Check if template already exists
        const existing = await Portfolio.findOne({ title: template.title });
        
        if (existing) {
          console.log(`⏭️  Skipping "${template.title}" - already exists`);
          continue;
        }
        
        // Save HTML to file
        const filename = `${Date.now()}-${template.title.toLowerCase().replace(/\s+/g, '-')}.html`;
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, template.htmlContent);
        
        // Create portfolio entry
        const portfolio = new Portfolio({
          title: template.title,
          description: template.description,
          category: template.category,
          filename: filename,
          originalName: `${template.title}.html`,
          path: filepath,
          url: `/uploads/portfolios/${filename}`,
          size: Buffer.byteLength(template.htmlContent)
        });
        
        await portfolio.save();
        console.log(`✅ Migrated: ${template.title}`);
        
      } catch (error) {
        console.error(`❌ Error migrating "${template.title}":`, error.message);
      }
    }
    
    const finalCount = await Portfolio.countDocuments();
    console.log(`\n✨ Migration complete!`);
    console.log(`📊 Total portfolios in database: ${finalCount}`);
    console.log(`📁 Files stored in: ${uploadsDir}\n`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateTemplates();
