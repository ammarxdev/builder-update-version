import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { Template } from '../models/Template.js';

dotenv.config();

const samples = [
  {
    title: 'Simple Landing',
    description: 'Minimal landing page',
    thumbnailUrl: '',
    html: `<!doctype html><html><head><meta charset="utf-8"><title>Landing</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:sans-serif;margin:0}header{padding:40px;text-align:center;background:#111;color:#fff}section{padding:24px}button{padding:10px 16px;border:0;background:#111;color:#fff;border-radius:6px}</style></head><body><header><h1>Product</h1><p>Best product ever</p><button>Get Started</button></header><section><h2>Features</h2><ul><li>Fast</li><li>Secure</li><li>Reliable</li></ul></section></body></html>`
  },
  {
    title: 'Portfolio',
    description: 'Personal portfolio page',
    thumbnailUrl: '',
    html: `<!doctype html><html><head><meta charset="utf-8"><title>Portfolio</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:system-ui;margin:0}nav{padding:16px;background:#f5f5f5}main{padding:24px}</style></head><body><nav><b>My Name</b></nav><main><h1>Projects</h1><div><p>Project A</p><p>Project B</p></div></main></body></html>`
  }
];

const run = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    const count = await Template.countDocuments();
    if (count === 0) {
      await Template.insertMany(samples);
      console.log('Seeded templates');
    } else {
      console.log('Templates already exist, skipping');
    }
    process.exit(0);
  } catch (e) {
    console.error('Seeding failed', e);
    process.exit(1);
  }
};

run();
