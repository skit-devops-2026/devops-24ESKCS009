const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');

const initialJobs = [
  {
    title: 'Cloud Engineer',
    company: 'Microsoft',
    location: 'Hyderabad',
    category: 'Programming',
    type: 'Full Time',
    salary: '$120,000 / yr',
    description: 'Build and deploy scalable cloud infrastructure and Kubernetes services.'
  },
  {
    title: 'Network Security Engineer',
    company: 'Samsung',
    location: 'Canada',
    category: 'Cybersecurity',
    type: 'Full Time',
    salary: '$110,000 / yr',
    description: 'Protect network perimeters, manage firewalls, and perform vulnerability assessments.'
  },
  {
    title: 'Frontend Developer',
    company: 'Amazon',
    location: 'Mumbai',
    category: 'Designing',
    type: 'Full Time',
    salary: '$95,000 / yr',
    description: 'Craft responsive, intuitive user interfaces with modern web frameworks.'
  },
  {
    title: 'DevOps Specialist',
    company: 'Accenture',
    location: 'Texas',
    category: 'Programming',
    type: 'Contract',
    salary: '$130,000 / yr',
    description: 'Automate CI/CD pipelines, Docker containerization, and Terraform deployment.'
  }
];

// Seed sample jobs helper
const seedJobsIfEmpty = async () => {
  if (Job.db.readyState === 1) {
    const count = await Job.countDocuments();
    if (count === 0) {
      await Job.insertMany(initialJobs);
      console.log('[Database] Seeded initial sample jobs into MongoDB');
    }
  }
};

// GET /api/jobs (with filtering)
router.get('/', async (req, res) => {
  try {
    const { keyword, location, category } = req.query;

    if (Job.db.readyState === 1) {
      await seedJobsIfEmpty();
      let query = {};
      if (keyword) {
        query.title = { $regex: keyword, $options: 'i' };
      }
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
      if (category) {
        query.category = { $regex: category, $options: 'i' };
      }

      const jobs = await Job.find(query).sort({ postedAt: -1 });
      return res.json(jobs);
    }

    // Fallback static jobs if database is offline
    let filtered = [...initialJobs];
    if (keyword) {
      filtered = filtered.filter(j => j.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    if (location) {
      filtered = filtered.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (category) {
      filtered = filtered.filter(j => j.category.toLowerCase().includes(category.toLowerCase()));
    }
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    if (Job.db.readyState === 1) {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      return res.json(job);
    }
    res.json(initialJobs[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/jobs (Create Job)
router.post('/', async (req, res) => {
  try {
    const { title, company, location, category, type, salary, description } = req.body;
    if (!title || !company || !location) {
      return res.status(400).json({ error: 'Title, company, and location are required' });
    }

    if (Job.db.readyState === 1) {
      const newJob = new Job({ title, company, location, category: category || 'General', type: type || 'Full Time', salary, description });
      await newJob.save();
      return res.status(201).json(newJob);
    }

    const mockJob = { _id: Date.now().toString(), title, company, location, category, type, salary, description };
    res.status(201).json(mockJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/jobs/:id/apply (Apply for Job)
router.post('/:id/apply', async (req, res) => {
  try {
    const { applicantName, applicantEmail, notes } = req.body;
    if (!applicantName || !applicantEmail) {
      return res.status(400).json({ error: 'Applicant name and email are required' });
    }

    if (Application.db.readyState === 1) {
      const application = new Application({
        jobId: req.params.id,
        applicantName,
        applicantEmail,
        notes: notes || ''
      });
      await application.save();
      return res.status(201).json({ message: 'Application submitted successfully', application });
    }

    res.status(201).json({ message: 'Application submitted successfully (mock mode)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    if (Job.db.readyState === 1) {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      return res.json({ message: 'Job deleted successfully' });
    }
    res.json({ message: 'Job deleted (mock mode)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
