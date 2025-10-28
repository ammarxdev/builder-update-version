import { Template } from '../models/Template.js';

export const listTemplates = async (req, res) => {
  try {
    const items = await Template.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (e) {
    console.error('Error fetching templates:', e);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
};

export const getTemplate = async (req, res) => {
  try {
    const t = await Template.findById(req.params.id);
    if (!t) return res.status(404).json({ message: 'Template not found' });
    
    // Increment views
    t.views += 1;
    await t.save();
    
    res.json({ data: t });
  } catch (e) {
    console.error('Error fetching template:', e);
    res.status(500).json({ message: 'Failed to fetch template' });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const { title, description, category, thumbnailUrl, colors, layout, style, preview, html } = req.body;
    if (!title || !html) return res.status(400).json({ message: 'Missing required fields: title and html' });
    
    const t = await Template.create({ 
      title, 
      description, 
      category, 
      thumbnailUrl, 
      colors: colors || [], 
      layout, 
      style, 
      preview, 
      html 
    });
    
    res.status(201).json({ message: 'Template created successfully', data: t });
  } catch (e) {
    console.error('Error creating template:', e);
    res.status(500).json({ message: 'Failed to create template' });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const t = await Template.findByIdAndDelete(req.params.id);
    if (!t) return res.status(404).json({ message: 'Template not found' });
    res.json({ message: 'Template deleted successfully' });
  } catch (e) {
    console.error('Error deleting template:', e);
    res.status(500).json({ message: 'Failed to delete template' });
  }
};
