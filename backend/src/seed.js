import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ─── Create Users ────────────────────────────────────────────────
    // Use insertMany with pre-hashed passwords to bypass the pre-save double-hash
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.default.genSalt(10);
    const hash = await bcrypt.default.hash('password123', salt);

    const [alice, bob, carol, dave] = await User.insertMany([
      { name: 'Alice Johnson', email: 'admin@taskflow.com', password: hash, role: 'Admin' },
      { name: 'Bob Smith', email: 'member@taskflow.com', password: hash, role: 'Member' },
      { name: 'Carol Williams', email: 'carol@taskflow.com', password: hash, role: 'Member' },
      { name: 'Dave Brown', email: 'dave@taskflow.com', password: hash, role: 'Member' },
    ]);

    console.log('👥 Created 4 users');

    // ─── Create Projects ─────────────────────────────────────────────

    const project1 = await Project.create({
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern UI/UX design and improved performance.',
      owner: alice._id,
      priority: 'High',
      status: 'Active',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      members: [
        { userId: alice._id, role: 'Admin' },
        { userId: bob._id, role: 'Member' },
        { userId: carol._id, role: 'Member' },
      ],
    });

    const project2 = await Project.create({
      name: 'Mobile App Development',
      description: 'Build a cross-platform mobile app for iOS and Android using React Native.',
      owner: alice._id,
      priority: 'High',
      status: 'Active',
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      members: [
        { userId: alice._id, role: 'Admin' },
        { userId: bob._id, role: 'Admin' },
        { userId: dave._id, role: 'Member' },
      ],
    });

    const project3 = await Project.create({
      name: 'Marketing Campaign Q3',
      description: 'Plan and execute the Q3 digital marketing campaign across all social media platforms.',
      owner: alice._id,
      priority: 'Medium',
      status: 'Active',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      members: [
        { userId: alice._id, role: 'Admin' },
        { userId: carol._id, role: 'Admin' },
        { userId: dave._id, role: 'Member' },
      ],
    });

    const project4 = await Project.create({
      name: 'Database Migration',
      description: 'Migrate legacy PostgreSQL database to MongoDB with zero downtime.',
      owner: alice._id,
      priority: 'High',
      status: 'On Hold',
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      members: [
        { userId: alice._id, role: 'Admin' },
        { userId: bob._id, role: 'Member' },
      ],
    });

    console.log('📁 Created 4 projects');

    // ─── Create Tasks for Website Redesign ───────────────────────────

    await Task.create([
      {
        title: 'Design new homepage mockup',
        description: 'Create Figma mockups for the new homepage with hero section, features, and CTA.',
        project: project1._id,
        assignedTo: carol._id,
        createdBy: alice._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedHours: 12,
      },
      {
        title: 'Set up React project structure',
        description: 'Initialize the React project with Vite, configure ESLint, Prettier, and folder structure.',
        project: project1._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        estimatedHours: 4,
        actualHours: 3,
      },
      {
        title: 'Implement responsive navigation',
        description: 'Build mobile-first responsive navigation with hamburger menu for small screens.',
        project: project1._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        priority: 'Medium',
        status: 'Review',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        estimatedHours: 6,
      },
      {
        title: 'Write SEO meta tags',
        description: 'Add proper meta tags, Open Graph tags, and structured data for all pages.',
        project: project1._id,
        assignedTo: carol._id,
        createdBy: alice._id,
        priority: 'Low',
        status: 'To Do',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        estimatedHours: 3,
      },
      {
        title: 'Performance optimization',
        description: 'Achieve 90+ Lighthouse score — optimize images, lazy loading, and code splitting.',
        project: project1._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        priority: 'Medium',
        status: 'To Do',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        estimatedHours: 8,
      },
      {
        title: 'Cross-browser testing',
        description: 'Test on Chrome, Firefox, Safari, and Edge. Fix any compatibility issues.',
        project: project1._id,
        assignedTo: carol._id,
        createdBy: alice._id,
        priority: 'High',
        status: 'To Do',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // overdue
        estimatedHours: 5,
      },
    ]);

    // ─── Create Tasks for Mobile App ─────────────────────────────────

    await Task.create([
      {
        title: 'Set up React Native environment',
        description: 'Configure development environment for iOS and Android builds.',
        project: project2._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        priority: 'Urgent',
        status: 'Completed',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        estimatedHours: 6,
        actualHours: 8,
      },
      {
        title: 'Design authentication screens',
        description: 'Login, register, forgot password screens with smooth animations.',
        project: project2._id,
        assignedTo: dave._id,
        createdBy: alice._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        estimatedHours: 10,
      },
      {
        title: 'Integrate push notifications',
        description: 'Set up Firebase Cloud Messaging for push notifications on both platforms.',
        project: project2._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        priority: 'Medium',
        status: 'To Do',
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        estimatedHours: 12,
      },
      {
        title: 'Build offline mode',
        description: 'Implement local storage and sync mechanism for offline functionality.',
        project: project2._id,
        assignedTo: dave._id,
        createdBy: alice._id,
        priority: 'Low',
        status: 'To Do',
        dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        estimatedHours: 20,
      },
    ]);

    // ─── Create Tasks for Marketing Campaign ─────────────────────────

    await Task.create([
      {
        title: 'Create social media content calendar',
        description: 'Plan 90 days of content across Instagram, Twitter, LinkedIn, and Facebook.',
        project: project3._id,
        assignedTo: carol._id,
        createdBy: alice._id,
        priority: 'Urgent',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        estimatedHours: 8,
      },
      {
        title: 'Design campaign banner ads',
        description: 'Create banner ads in 5 sizes for Google Display Network.',
        project: project3._id,
        assignedTo: dave._id,
        createdBy: alice._id,
        priority: 'High',
        status: 'Review',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        estimatedHours: 6,
      },
      {
        title: 'Set up Google Analytics 4',
        description: 'Configure GA4 with conversion tracking and custom events.',
        project: project3._id,
        assignedTo: carol._id,
        createdBy: alice._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        estimatedHours: 4,
        actualHours: 4,
      },
      {
        title: 'Write email newsletter copy',
        description: 'Draft 3 email newsletters for the campaign launch sequence.',
        project: project3._id,
        assignedTo: dave._id,
        createdBy: alice._id,
        priority: 'Medium',
        status: 'To Do',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // overdue
        estimatedHours: 5,
      },
    ]);

    // ─── Create Tasks for Database Migration ─────────────────────────

    await Task.create([
      {
        title: 'Audit existing database schema',
        description: 'Document all tables, relationships, and stored procedures in the current PostgreSQL DB.',
        project: project4._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        estimatedHours: 16,
        actualHours: 18,
      },
      {
        title: 'Design MongoDB schema',
        description: 'Design the new document-based schema optimized for MongoDB.',
        project: project4._id,
        assignedTo: alice._id,
        createdBy: alice._id,
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        estimatedHours: 12,
      },
      {
        title: 'Write data migration scripts',
        description: 'Python scripts to transform and migrate data from PostgreSQL to MongoDB.',
        project: project4._id,
        assignedTo: bob._id,
        createdBy: alice._id,
        priority: 'Urgent',
        status: 'To Do',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        estimatedHours: 24,
      },
    ]);

    console.log('✅ Created tasks for all projects');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📧 Login credentials (all passwords: password123)');
    console.log('┌─────────────────────────────┬──────────────────────────┬────────┐');
    console.log('│ Name                        │ Email                    │ Role   │');
    console.log('├─────────────────────────────┼──────────────────────────┼────────┤');
    console.log('│ Alice Johnson               │ admin@taskflow.com       │ Admin  │');
    console.log('│ Bob Smith                   │ member@taskflow.com      │ Member │');
    console.log('│ Carol Williams              │ carol@taskflow.com       │ Member │');
    console.log('│ Dave Brown                  │ dave@taskflow.com        │ Member │');
    console.log('└─────────────────────────────┴──────────────────────────┴────────┘');
    console.log('\n📁 Projects created: 4');
    console.log('✅ Tasks created: 17');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
