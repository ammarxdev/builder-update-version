import { Project } from '../models/Project.js';

export const listProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
};

export const getProject = async (req, res) => {
  try {
    const p = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch project' });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, html, templateId } = req.body;
    if (!name || !html) return res.status(400).json({ message: 'Missing fields' });
    const p = await Project.create({ owner: req.user.id, name, html, sourceTemplate: templateId });
    res.status(201).json(p);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { name, html } = req.body;
    const p = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: { ...(name && { name }), ...(html && { html }) } },
      { new: true }
    );
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const p = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
};

export const downloadProject = async (req, res) => {
  try {
    const p = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!p) return res.status(404).json({ message: 'Project not found' });
    const filename = `${p.name || 'project'}.html`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename.replace(/"/g, '')}"`);
    return res.send(p.html);
  } catch (e) {
    res.status(500).json({ message: 'Failed to download project' });
  }
};
