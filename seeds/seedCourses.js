import mongoose from 'mongoose';
import 'dotenv/config';
import Course from '../models/Course.js';

// Define the courses data (from frontend - ALL 41 COURSES with complete details)
const coursesData = [
  {
    title: "UI/UX Design Masterclass (Beginner → Advanced)",
    slug: "uiux-design-masterclass",
    category: "Design",
    level: "beginner",
    price: 18000,
    duration: 720,
    thumbnail: "/courses/uiux.jpg",
    description: "Master modern UI/UX design using Figma and industry design principles. Learn how to design beautiful and user-friendly mobile and web interfaces.",
    excerpt: "Design beautiful and user-friendly interfaces",
    tags: ["design", "figma", "uiux", "web-design"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "UI/UX Designer & Product Design Instructor",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["UI Design Principles", "UX Research", "Wireframing", "Figma Prototyping", "Design Systems"],
    requirements: ["Basic computer knowledge", "Interest in design", "Laptop with Figma installed"],
    includes: ["12+ hours on-demand video", "UI design projects", "Lifetime access", "Certificate of completion"],
    lessons: [
      { id: 1, title: "Module 1 - Introduction to UI/UX", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Design Principles & Color Theory", duration: "1:05:00", video: "#", preview: false },
      { id: 3, title: "Wireframing Fundamentals", duration: "1:20:00", video: "#", preview: false },
      { id: 4, title: "Figma & Design Tools", duration: "1:30:00", video: "#", preview: false },
      { id: 5, title: "User Research & Personas", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Design Systems & Components", duration: "1:05:00", video: "#", preview: false },
      { id: 7, title: "Prototyping & Interaction Design", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "Mobile App Design", duration: "1:20:00", video: "#", preview: false },
      { id: 9, title: "Web Interface Design", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "UI/UX Portfolio Project", duration: "1:30:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.8,
      count: 890
    },
    slug: "uiux-design-masterclass",
    category: "Design",
    level: "beginner",
    price: 18000,
    duration: 720,
    thumbnail: "/courses/uiux.jpg",
    description: "Master modern UI/UX design using Figma and industry design principles. Learn how to design beautiful and user-friendly mobile and web interfaces.",
    excerpt: "Design beautiful and user-friendly interfaces",
    tags: ["design", "figma", "uiux", "web-design"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "UI/UX Designer & Product Design Instructor",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["UI Design Principles", "UX Research", "Wireframing", "Figma Prototyping", "Design Systems"],
    requirements: ["Basic computer knowledge", "Interest in design", "Laptop with Figma installed"],
    includes: ["12+ hours on-demand video", "UI design projects", "Lifetime access", "Certificate of completion"],
    lessons: [
      { id: 1, title: "Module 1 - Introduction to UI/UX", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Design Principles & Color Theory", duration: "1:05:00", video: "#", preview: false },
      { id: 3, title: "Wireframing Fundamentals", duration: "1:20:00", video: "#", preview: false },
      { id: 4, title: "Figma & Design Tools", duration: "1:30:00", video: "#", preview: false },
      { id: 5, title: "User Research & Personas", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Design Systems & Components", duration: "1:05:00", video: "#", preview: false },
      { id: 7, title: "Prototyping & Interaction Design", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "Mobile App Design", duration: "1:20:00", video: "#", preview: false },
      { id: 9, title: "Web Interface Design", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "UI/UX Portfolio Project", duration: "1:30:00", video: "#", preview: false }
    ],
  
  },
  {
    title: "Digital Marketing (SEO + Social Media)",
    slug: "digital-marketing-seo-social-media",
    category: "Marketing",
    level: "beginner",
    price: 15000,
    duration: 600,
    thumbnail: "/courses/digital-marketing.jpg",
    description: "Learn digital marketing strategies including SEO, social media marketing, content marketing and online advertising to grow businesses online.",
    excerpt: "Master SEO and social media marketing",
    tags: ["marketing", "seo", "social-media"],
    status: "published",
    isActive: true,
    badge: "Hot",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Digital Marketing Specialist",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Search Engine Optimization", "Keyword Research", "Social Media Marketing", "Content Marketing", "Marketing Analytics"],
    requirements: ["Internet access", "Basic computer skills"],
    includes: ["10+ hours video lessons", "Marketing templates", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Module 1 - Introduction to Digital Marketing", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "SEO Fundamentals", duration: "1:05:00", video: "#", preview: false },
      { id: 3, title: "Keyword Research Strategies", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "On-Page SEO Optimization", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Social Media Marketing", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Facebook & Instagram Ads", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Content Marketing Strategy", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Email Marketing Campaigns", duration: "1:05:00", video: "#", preview: false },
      { id: 9, title: "Marketing Analytics & Tools", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "Real Marketing Project", duration: "1:20:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 960
    }
  },
  {
    title: "Business & E-commerce Mastery",
    slug: "business-ecommerce-mastery",
    category: "Business",
    level: "intermediate",
    price: 20000,
    duration: 900,
    thumbnail: "/courses/ecommerce.jpg",
    description: "Learn how to start and grow a profitable online business using Shopify, WooCommerce and modern e-commerce marketing strategies.",
    excerpt: "Start and scale your online business",
    tags: ["business", "ecommerce", "shopify"],
    status: "published",
    isActive: true,
    badge: "Trending",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "E-commerce Entrepreneur & Instructor",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Online Store Creation", "Product Research", "Dropshipping", "E-commerce Marketing", "Scaling Online Stores"],
    requirements: ["Laptop or computer", "Internet connection"],
    includes: ["15+ hours video lessons", "Business templates", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Module 1 - Introduction to E-commerce", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Choosing Profitable Products", duration: "1:00:00", video: "#", preview: false },
      { id: 3, title: "Building an Online Store", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "Payment Gateways & Checkout", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "Shopify & WooCommerce", duration: "1:10:00", video: "#", preview: false },
      { id: 6, title: "E-commerce Marketing", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Dropshipping Business Model", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Scaling Online Stores", duration: "1:05:00", video: "#", preview: false },
      { id: 9, title: "Real Store Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Business Growth Strategies", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 720
    }
  },
  {
    title: "Mobile App Development (React Native)",
    slug: "mobile-app-development-react-native",
    category: "Mobile Development",
    level: "intermediate",
    price: 22000,
    duration: 1200,
    thumbnail: "/courses/react-native.jpg",
    description: "Build cross-platform mobile apps using React Native and modern JavaScript frameworks.",
    excerpt: "Build iOS and Android apps with React Native",
    tags: ["mobile", "react-native", "javascript"],
    status: "published",
    isActive: true,
    badge: "New",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Mobile App Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["React Native Development", "Mobile UI Components", "API Integration", "App Navigation", "Publishing Mobile Apps"],
    requirements: ["JavaScript basics", "Laptop with Node.js installed"],
    includes: ["20+ hours video", "Mobile app projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Module 1 - Introduction to React Native", duration: "1:20:00", video: "#", preview: true },
      { id: 2, title: "Setting Up Development Environment", duration: "1:05:00", video: "#", preview: false },
      { id: 3, title: "Core Components & Layouts", duration: "1:15:00", video: "#", preview: false },
      { id: 4, title: "Navigation in React Native", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "State Management", duration: "1:05:00", video: "#", preview: false },
      { id: 6, title: "Working with APIs", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Authentication System", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Publishing Apps", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Mobile App Project", duration: "1:30:00", video: "#", preview: false },
      { id: 10, title: "Career Support & Freelancing", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 540
    }
  },
  {
    title: "Full-Stack Development Masterclass",
    slug: "fullstack-development-masterclass",
    category: "Web Development",
    level: "advanced",
    price: 28000,
    duration: 1800,
    thumbnail: "/courses/fullstack.jpg",
    description: "Build advanced full-stack web applications using modern frontend and backend technologies.",
    excerpt: "Master full-stack web development",
    tags: ["fullstack", "javascript", "mern"],
    status: "published",
    isActive: true,
    badge: "Best Seller",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Senior Full-Stack Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Advanced JavaScript", "React Architecture", "Backend APIs", "Authentication & Security", "Deployment & DevOps"],
    requirements: ["Basic web development knowledge"],
    includes: ["30+ hours video lessons", "Full-stack projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Module 1 - Modern Web Development Overview", duration: "1:20:00", video: "#", preview: true },
      { id: 2, title: "Advanced HTML & CSS", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "JavaScript Deep Dive", duration: "1:15:00", video: "#", preview: false },
      { id: 4, title: "React Frontend Architecture", duration: "1:20:00", video: "#", preview: false },
      { id: 5, title: "Node.js & Express Backend", duration: "1:10:00", video: "#", preview: false },
      { id: 6, title: "Authentication & Security", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Database Integration", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Deployment & DevOps Basics", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Advanced Fullstack Projects", duration: "1:40:00", video: "#", preview: false },
      { id: 10, title: "Career Preparation", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.9,
      count: 1100
    }
  },
  {
    title: "Cloud & DevOps with AWS",
    slug: "cloud-devops-with-aws",
    category: "Cloud Computing",
    level: "intermediate",
    price: 20000,
    duration: 960,
    thumbnail: "/courses/aws-devops.jpg",
    description: "Learn modern cloud infrastructure and DevOps workflows using AWS, Docker and CI/CD pipelines.",
    excerpt: "Master AWS and DevOps practices",
    tags: ["cloud", "aws", "devops", "docker"],
    status: "published",
    isActive: true,
    badge: "Trending",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Cloud & DevOps Engineer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["AWS Core Services", "Docker Containers", "CI/CD Pipelines", "Cloud Infrastructure", "DevOps Automation"],
    requirements: ["Basic Linux knowledge", "Computer with internet"],
    includes: ["16+ hours video", "Cloud labs", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Module 1 - Introduction to Cloud Computing", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "AWS Core Services", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "EC2 & Virtual Machines", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Storage with S3", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "CI/CD Pipelines", duration: "1:10:00", video: "#", preview: false },
      { id: 6, title: "Docker Containers", duration: "1:15:00", video: "#", preview: false },
      { id: 7, title: "Kubernetes Basics", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "Monitoring & Logging", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "DevOps Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Cloud Career Path", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 480
    }
  },
  {
    title: "Python for Data Science & AI",
    slug: "python-data-science-ai",
    category: "Artificial Intelligence",
    level: "beginner",
    price: 19000,
    duration: 1080,
    thumbnail: "/courses/python-ai.jpg",
    description: "Learn Python programming for data science, machine learning and artificial intelligence projects.",
    excerpt: "Master Python for AI and ML",
    tags: ["python", "ai", "machine-learning", "data-science"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "AI & Data Science Instructor",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Python Programming", "Data Analysis", "Machine Learning", "Data Visualization", "AI Projects"],
    requirements: ["Basic computer knowledge"],
    includes: ["18+ hours video", "AI projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Module 1 - Python Fundamentals", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Python Data Structures", duration: "1:05:00", video: "#", preview: false },
      { id: 3, title: "NumPy for Data Analysis", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "Pandas Data Processing", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Data Visualization", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Machine Learning Basics", duration: "1:15:00", video: "#", preview: false },
      { id: 7, title: "AI Model Training", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "Deep Learning Introduction", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "AI Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Career Guidance", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 670
    }
  },
  {
    title: "WordPress Mastery & Site Building",
    slug: "wordpress-mastery-site-building",
    category: "Web Development",
    level: "beginner",
    price: 12000,
    duration: 480,
    thumbnail: "/courses/wordpress.jpg",
    description: "Master WordPress and build professional websites from scratch.",
    excerpt: "Build professional WordPress sites",
    tags: ["wordpress", "web-design", "cms"],
    status: "published",
    isActive: true,
    badge: "Best Seller",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "WordPress Instructor",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["WordPress Development", "Theme Customization", "Plugin Management", "Website Optimization"],
    requirements: ["Basic computer knowledge", "Laptop or desktop", "Internet connection"],
    includes: ["8+ hours video", "Hands-on projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Introduction to WordPress", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Installing WordPress", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "Themes & Customization", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Plugins & Features", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "SEO Optimization", duration: "0:50:00", video: "#", preview: false },
      { id: 6, title: "Building Business Websites", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "E-commerce with WooCommerce", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Website Security", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Real Website Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Freelancing & Client Work", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.8,
      count: 1500
    }
  },
  {
    title: "JavaScript Advanced Patterns",
    slug: "javascript-advanced-patterns",
    category: "Web Development",
    level: "advanced",
    price: 18000,
    duration: 750,
    thumbnail: "/courses/javascript-advanced.jpg",
    description: "Master advanced JavaScript patterns, async programming, and functional programming concepts.",
    excerpt: "Learn advanced JavaScript patterns",
    tags: ["javascript", "programming", "patterns"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Senior JavaScript Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["JavaScript Fundamentals", "ES6+ Features", "Closures & Scope", "Asynchronous Programming"],
    requirements: ["Basic JavaScript knowledge", "Laptop or desktop", "Internet connection"],
    includes: ["14+ hours video", "Hands-on projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Module 1 - JavaScript Refresher", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "ES6+ Syntax & Features", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Closures & Scope", duration: "1:05:00", video: "#", preview: false },
      { id: 4, title: "Asynchronous JavaScript", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Promises & Async/Await", duration: "1:05:00", video: "#", preview: false },
      { id: 6, title: "JavaScript Design Patterns", duration: "1:05:00", video: "#", preview: false },
      { id: 7, title: "Working with APIs", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Error Handling", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Advanced JavaScript Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Interview Preparation", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.8,
      count: 620
    }
  },
  {
    title: "Cybersecurity Fundamentals",
    slug: "cybersecurity-fundamentals",
    category: "Cybersecurity",
    level: "beginner",
    price: 16000,
    duration: 720,
    thumbnail: "/courses/cybersecurity.jpg",
    description: "Learn the fundamentals of cybersecurity, including network security, ethical hacking and system hardening to protect against cyber threats.",
    excerpt: "Secure your digital presence",
    tags: ["security", "hacking", "protection"],
    status: "published",
    isActive: true,
    badge: "Hot",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Cybersecurity Expert",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Cybersecurity Basics", "Network Security", "Ethical Hacking", "System Hardening"],
    requirements: ["Basic computer knowledge", "Laptop or desktop", "Internet connection"],
    includes: ["36+ hours video", "Hands-on projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Introduction to Cybersecurity", duration: "1:20:00", video: "#", preview: true },
      { id: 2, title: "Network Security Basics", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Types of Cyber Attacks", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "Encryption & Cryptography", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Ethical Hacking Overview", duration: "1:10:00", video: "#", preview: false },
      { id: 6, title: "Security Tools", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "System Hardening", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "Penetration Testing Basics", duration: "1:10:00", video: "#", preview: false },
      { id: 9, title: "Security Lab Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Cybersecurity Career Path", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 420
    }
  },
  {
    title: "Next.js & Modern React Patterns",
    slug: "nextjs-modern-react-patterns",
    category: "Web Development",
    level: "intermediate",
    price: 21000,
    duration: 900,
    thumbnail: "/courses/nextjs.jpg",
    description: "Learn Next.js framework and modern React patterns for building scalable web applications.",
    excerpt: "Master Next.js and React",
    tags: ["react", "nextjs", "javascript"],
    status: "published",
    isActive: true,
    badge: "Trending",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Senior Frontend Engineer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Advanced React", "Modern JavaScript", "Component Architecture", "Performance Optimization"],
    requirements: ["Basic React knowledge", "JavaScript proficiency", "Laptop or desktop", "Internet connection"],
    includes: ["18+ hours video", "Hands-on projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Module 1 - Modern React Overview", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "React Hooks Deep Dive", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Component Architecture", duration: "1:05:00", video: "#", preview: false },
      { id: 4, title: "State Management Patterns", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Performance Optimization", duration: "1:05:00", video: "#", preview: false },
      { id: 6, title: "Advanced Routing", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "API Integration", duration: "1:05:00", video: "#", preview: false },
      { id: 8, title: "Testing React Applications", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Frontend Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Frontend Career Preparation", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.8,
      count: 550
    }
  },
  {
    title: "Node.js Backend Development",
    slug: "nodejs-backend-development",
    category: "Web Development",
    level: "intermediate",
    price: 21000,
    duration: 1200,
    thumbnail: "/courses/nodejs.jpg",
    description: "Learn to build scalable backend applications with Node.js and Express.js.",
    excerpt: "Master Node.js backend development",
    tags: ["nodejs", "express", "backend"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Backend Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Node.js Fundamentals", "Express.js Framework", "RESTful APIs", "Middleware & Authentication"],
    requirements: ["JavaScript knowledge", "Basic backend concepts", "Laptop or desktop"],
    includes: ["20+ hours video", "Backend projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Introduction to Node.js", duration: "1:15:00", video: "#", preview: true },
      { id: 2, title: "Node Modules & NPM", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Express.js Basics", duration: "1:15:00", video: "#", preview: false },
      { id: 4, title: "Routing & Middleware", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "RESTful API Design", duration: "1:10:00", video: "#", preview: false },
      { id: 6, title: "Database Integration", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Authentication & Security", duration: "1:05:00", video: "#", preview: false },
      { id: 8, title: "Error Handling", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Backend Project", duration: "1:30:00", video: "#", preview: false },
      { id: 10, title: "Deployment & Hosting", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 620
    }
  },
  {
    title: "Database Design with MongoDB & SQL",
    slug: "database-design-mongodb-sql",
    category: "Database",
    level: "intermediate",
    price: 16000,
    duration: 720,
    thumbnail: "/courses/database.jpg",
    description: "Learn database design principles and implementation with MongoDB and SQL.",
    excerpt: "Master database design and SQL",
    tags: ["database", "mongodb", "sql"],
    status: "published",
    isActive: true,
    badge: "Best Seller",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Database Expert",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["SQL Fundamentals", "MongoDB Design", "Database Optimization", "Data Modeling"],
    requirements: ["Basic database concepts", "Laptop with database tools"],
    includes: ["12+ hours video", "Database projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Database Fundamentals", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "SQL Basics", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Data Modeling", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Advanced SQL", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "MongoDB Fundamentals", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "MongoDB Operations", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Database Optimization", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Indexing & Performance", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Database Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Database Career Path", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 540
    }
  },
  {
    title: "Graphic Design Masterclass with Adobe Tools",
    slug: "graphic-design-adobe-tools",
    category: "Design",
    level: "beginner",
    price: 14000,
    duration: 660,
    thumbnail: "/courses/graphic-design.jpg",
    description: "Master the art of graphic design using Adobe Creative Suite.",
    excerpt: "Learn professional graphic design",
    tags: ["design", "adobe", "photoshop"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Graphic Designer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Adobe Photoshop", "Adobe Illustrator", "Design Theory", "Print & Digital Design"],
    requirements: ["No experience needed", "Adobe Creative Cloud"],
    includes: ["11+ hours video", "Design projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Adobe Suite Overview", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Photoshop Fundamentals", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Photoshop Advanced", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "Illustrator Basics", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "Vector Design", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "InDesign for Layouts", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Design Principles", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Portfolio Development", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Design Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Freelancing in Design", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 870
    }
  },
  {
    title: "Product Management & Startup Strategy",
    slug: "product-management-startup-strategy",
    category: "Business",
    level: "intermediate",
    price: 18500,
    duration: 780,
    thumbnail: "/courses/product-management.jpg",
    description: "Learn the fundamentals of product management and startup strategy.",
    excerpt: "Master product management",
    tags: ["product", "startup", "business"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Product Manager",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Product Strategy", "User Research", "Roadmap Planning", "Market Analysis"],
    requirements: ["Business understanding", "Laptop or desktop"],
    includes: ["13+ hours video", "Business projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Product Management Basics", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "User Research Methods", duration: "1:05:00", video: "#", preview: false },
      { id: 3, title: "Market Analysis", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Product Strategy", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Roadmap Planning", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Metrics & Analytics", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Startup Fundamentals", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Pitching & Funding", duration: "1:05:00", video: "#", preview: false },
      { id: 9, title: "Business Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Career Path in PM", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 460
    }
  },
  {
    title: "AI & Machine Learning Foundations",
    slug: "ai-machine-learning-foundations",
    category: "Artificial Intelligence",
    level: "beginner",
    price: 22000,
    duration: 1020,
    thumbnail: "/courses/machine-learning.jpg",
    description: "Learn the fundamentals of AI and machine learning.",
    excerpt: "Master AI and machine learning",
    tags: ["ai", "ml", "python"],
    status: "published",
    isActive: true,
    badge: "Hot",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "AI Researcher",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["ML Algorithms", "Supervised Learning", "Unsupervised Learning", "Model Evaluation"],
    requirements: ["Python basics", "Math foundation"],
    includes: ["17+ hours video", "ML projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "ML Fundamentals", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Supervised Learning", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Regression Models", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Classification Models", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Unsupervised Learning", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Clustering Algorithms", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Model Evaluation", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Deep Learning Intro", duration: "1:05:00", video: "#", preview: false },
      { id: 9, title: "ML Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "AI Career Path", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 520
    }
  },
  {
    title: "Blockchain & Web3 Development",
    slug: "blockchain-web3-development",
    category: "Blockchain",
    level: "intermediate",
    price: 26000,
    duration: 1260,
    thumbnail: "/courses/blockchain.jpg",
    description: "Learn to build decentralized applications and smart contracts on blockchain platforms.",
    excerpt: "Master blockchain and Web3",
    tags: ["blockchain", "web3", "solidity"],
    status: "published",
    isActive: true,
    badge: "Trending",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Blockchain Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Solidity Programming", "Smart Contracts", "DApp Development", "Web3.js Integration"],
    requirements: ["JavaScript knowledge", "Basic blockchain understanding"],
    includes: ["21+ hours video", "DApp projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Blockchain Basics", duration: "1:15:00", video: "#", preview: true },
      { id: 2, title: "Ethereum & EVM", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Smart Contract Development", duration: "1:15:00", video: "#", preview: false },
      { id: 4, title: "Solidity Programming", duration: "1:20:00", video: "#", preview: false },
      { id: 5, title: "Advanced Solidity", duration: "1:10:00", video: "#", preview: false },
      { id: 6, title: "Testing & Security", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "DApp Frontend", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "Web3.js Integration", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "DApp Project", duration: "1:30:00", video: "#", preview: false },
      { id: 10, title: "Web3 Career Path", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 390
    }
  },
  {
    title: "Software Testing & QA Automation",
    slug: "software-testing-qa-automation",
    category: "Software Engineering",
    level: "intermediate",
    price: 15500,
    duration: 600,
    thumbnail: "/courses/software-testing.jpg",
    description: "Learn the fundamentals of software testing and automation.",
    excerpt: "Master QA and testing automation",
    tags: ["testing", "qa", "automation"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "QA Engineer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Manual Testing", "Test Automation", "Selenium WebDriver", "Jest & Testing Frameworks"],
    requirements: ["Programming basics", "Basic software development knowledge"],
    includes: ["10+ hours video", "Testing projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Testing Fundamentals", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Test Planning & Strategy", duration: "1:00:00", video: "#", preview: false },
      { id: 3, title: "Manual Testing", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Automation Basics", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Selenium WebDriver", duration: "1:10:00", video: "#", preview: false },
      { id: 6, title: "JavaScript Testing", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "API Testing", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "CI/CD Integration", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Testing Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "QA Career Path", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.5,
      count: 430
    }
  },
  {
    title: "Data Analytics with Excel & Power BI",
    slug: "data-analytics-excel-power-bi",
    category: "Data Analytics",
    level: "beginner",
    price: 16500,
    duration: 720,
    thumbnail: "/courses/data-analytics.jpg",
    description: "Learn the fundamentals of data analytics with Excel and Power BI.",
    excerpt: "Master data analytics",
    tags: ["analytics", "excel", "powerbi"],
    status: "published",
    isActive: true,
    badge: "Best Seller",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Data Analyst",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Excel Advanced", "Pivot Tables", "Power BI Dashboards", "Data Visualization"],
    requirements: ["MS Office installed", "Basic computer knowledge"],
    includes: ["12+ hours video", "Analytics projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Excel Fundamentals", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Advanced Excel", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Pivot Tables", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Excel Formulas", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Power BI Basics", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Power BI Dashboards", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Data Modeling", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Analytics Project", duration: "1:20:00", video: "#", preview: false },
      { id: 9, title: "Real Datasets", duration: "1:10:00", video: "#", preview: false },
      { id: 10, title: "Analytics Career", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 740
    }
  },
  {
    title: "Ethical Hacking & Penetration Testing",
    slug: "ethical-hacking-penetration-testing",
    category: "Cybersecurity",
    level: "intermediate",
    price: 100000,
    duration: 1320,
    thumbnail: "/courses/ethical-hacking.jpg",
    description: "Learn ethical hacking techniques and penetration testing methodologies to identify and mitigate security vulnerabilities.",
    excerpt: "Master ethical hacking",
    tags: ["hacking", "security", "testing"],
    status: "published",
    isActive: true,
    badge: "Hot",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Security Researcher",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Penetration Testing", "Vulnerability Assessment", "Network Security", "Reporting & Compliance"],
    requirements: ["Cybersecurity basics", "Linux knowledge", "Laptop or desktop"],
    includes: ["22+ hours video", "Lab environments", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Ethical Hacking Overview", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Information Gathering", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Vulnerability Scanning", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "Enumeration", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Exploitation Techniques", duration: "1:15:00", video: "#", preview: false },
      { id: 6, title: "Post-Exploitation", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Report Writing", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Tools & Frameworks", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Lab Projects", duration: "1:30:00", video: "#", preview: false },
      { id: 10, title: "Security Career", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 480
    }
  },
  {
    title: "Mobile App UI Design with Figma",
    slug: "mobile-app-ui-design-figma",
    category: "Design",
    level: "beginner",
    price: 13000,
    duration: 540,
    thumbnail: "/courses/figma-ui.jpg",
    description: "Learn to design stunning mobile app interfaces using Figma.",
    excerpt: "Design beautiful mobile UIs",
    tags: ["figma", "ui", "mobile-design"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "UI Designer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Figma Fundamentals", "Mobile UI Design", "Prototyping", "Design Systems"],
    requirements: ["No design experience needed", "Figma account", "Laptop or desktop"],
    includes: ["9+ hours video", "Design projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Figma Basics", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Design Principles", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "Mobile Layout Design", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Components & Variants", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "Prototyping", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Design Systems", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "UI Animation", duration: "0:50:00", video: "#", preview: false },
      { id: 8, title: "Handoff to Dev", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Portfolio Project", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "Design Career", duration: "0:50:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 690
    }
  },
  {
    title: "Google Ads & Online Advertising",
    slug: "google-ads-online-advertising",
    category: "Marketing",
    level: "intermediate",
    price: 14500,
    duration: 480,
    thumbnail: "/courses/google-ads.jpg",
    description: "Learn to create and manage effective Google Ads campaigns.",
    excerpt: "Master Google Ads",
    tags: ["ads", "marketing", "google"],
    status: "published",
    isActive: true,
    badge: "Best Seller",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Digital Marketer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Google Ads Setup", "Campaign Management", "Bid Strategy", "Performance Analytics"],
    requirements: ["Marketing basics", "Internet access", "A Google account"],
    includes: ["8+ hours video", "Ad campaigns", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Google Ads Overview", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Campaign Setup", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "Search Campaigns", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Display Advertising", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "Bid Strategy", duration: "0:50:00", video: "#", preview: false },
      { id: 6, title: "Ad Groups & Keywords", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Analytics & Reporting", duration: "0:50:00", video: "#", preview: false },
      { id: 8, title: "Optimization Tips", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Live Campaign", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Marketing Career", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 560
    }
  },
  {
    title: "Startup Funding & Venture Building",
    slug: "startup-funding-venture-building",
    category: "Business",
    level: "intermediate",
    price: 19000,
    duration: 840,
    thumbnail: "/courses/startup.jpg",
    description: "Learn about startup funding and building a successful venture.",
    excerpt: "Master startup funding",
    tags: ["startup", "business", "funding"],
    status: "published",
    isActive: true,
    badge: "Hot",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Startup Advisor",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Business Planning", "Pitch Deck Creation", "Fundraising", "Investor Relations"],
    requirements: ["Business basics", "Entrepreneurial mindset"],
    includes: ["14+ hours video", "Business templates", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Startup Fundamentals", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Business Model Canvas", duration: "1:00:00", video: "#", preview: false },
      { id: 3, title: "Market Research", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Pitch Deck Creation", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Investor Types", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Fundraising Process", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Valuation & Terms", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Legal & Compliance", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Growth Hacking", duration: "1:10:00", video: "#", preview: false },
      { id: 10, title: "Post-Funding Strategy", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 350
    }
  },
  {
    title: "DevOps Engineering with Docker & Kubernetes",
    slug: "devops-docker-kubernetes",
    category: "Cloud Computing",
    level: "advanced",
    price: 27000,
    duration: 1440,
    thumbnail: "/courses/devops.jpg",
    description: "Learn DevOps engineering with Docker and Kubernetes.",
    excerpt: "Master DevOps with Docker and K8s",
    tags: ["devops", "docker", "kubernetes"],
    status: "published",
    isActive: true,
    badge: "Trending",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "DevOps Engineer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Docker Containerization", "Kubernetes Orchestration", "Infrastructure as Code", "CI/CD Pipeline"],
    requirements: ["Linux knowledge", "Cloud basics", "Laptop with Docker"],
    includes: ["24+ hours video", "Lab environments", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "DevOps Overview", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Docker Fundamentals", duration: "1:15:00", video: "#", preview: false },
      { id: 3, title: "Docker Advanced", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "Container Networking", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "Kubernetes Basics", duration: "1:15:00", video: "#", preview: false },
      { id: 6, title: "K8s Deployments", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Service Mesh Setup", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "Infrastructure as Code", duration: "1:10:00", video: "#", preview: false },
      { id: 9, title: "DevOps Project", duration: "1:30:00", video: "#", preview: false },
      { id: 10, title: "DevOps Career", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.8,
      count: 410
    }
  },
  {
    title: "Advanced CSS & Modern Responsive Design",
    slug: "advanced-css-responsive-design",
    category: "Web Development",
    level: "intermediate",
    price: 14000,
    duration: 660,
    thumbnail: "/courses/advanced-css.jpg",
    description: "Master advanced CSS techniques and modern responsive design principles.",
    excerpt: "Master advanced CSS",
    tags: ["css", "design", "responsive"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Frontend Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Advanced CSS", "Responsive Design", "CSS Grid & Flexbox", "CSS Animation"],
    requirements: ["HTML & CSS basics", "Code editor", "Laptop or desktop"],
    includes: ["11+ hours video", "Design projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "CSS Fundamentals Review", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Flexbox Deep Dive", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "CSS Grid Mastery", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "Responsive Design", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "Mobile First Approach", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "CSS Variables", duration: "0:50:00", video: "#", preview: false },
      { id: 7, title: "Advanced Animations", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "CSS Best Practices", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Responsive Project", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "CSS Career Tips", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 520
    }
  },
  {
    title: "Next.js Fullstack Development",
    slug: "nextjs-fullstack-development",
    category: "Web Development",
    level: "advanced",
    price: 23000,
    duration: 1140,
    thumbnail: "/courses/nextjs.jpg",
    description: "Learn to build fullstack applications with Next.js and modern web technologies.",
    excerpt: "Master Next.js fullstack",
    tags: ["nextjs", "react", "fullstack"],
    status: "published",
    isActive: true,
    badge: "Best Seller",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Full-Stack Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Next.js Framework", "API Routes", "Database Integration", "Authentication & Deployment"],
    requirements: ["React knowledge", "JavaScript proficiency", "Node.js installed"],
    includes: ["19+ hours video", "Fullstack projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Next.js Fundamentals", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "SSR & SSG", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "API Routes", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "Database Integration", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Authentication", duration: "1:05:00", video: "#", preview: false },
      { id: 6, title: "Image Optimization", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Performance Tuning", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Deployment", duration: "1:05:00", video: "#", preview: false },
      { id: 9, title: "Fullstack Project", duration: "1:30:00", video: "#", preview: false },
      { id: 10, title: "Production Ready", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.8,
      count: 470
    }
  },
  {
    title: "TypeScript for Modern Applications",
    slug: "typescript-modern-applications",
    category: "Web Development",
    level: "intermediate",
    price: 17500,
    duration: 780,
    thumbnail: "/courses/typescript.jpg",
    description: "Learn TypeScript and build modern, scalable web applications.",
    excerpt: "Master TypeScript",
    tags: ["typescript", "javascript", "programming"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Senior Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["TypeScript Fundamentals", "Type System", "Advanced Types", "Generics"],
    requirements: ["JavaScript knowledge", "Code editor", "Laptop or desktop"],
    includes: ["13+ hours video", "TypeScript projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "TypeScript Basics", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Type Annotations", duration: "1:00:00", video: "#", preview: false },
      { id: 3, title: "Interfaces & Types", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "Classes & OOP", duration: "1:05:00", video: "#", preview: false },
      { id: 5, title: "Advanced Types", duration: "1:05:00", video: "#", preview: false },
      { id: 6, title: "Generics", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "React with TypeScript", duration: "1:05:00", video: "#", preview: false },
      { id: 8, title: "API Integration", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "TypeScript Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Best Practices", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 610
    }
  },
  {
    title: "Advanced Git & GitHub Workflow",
    slug: "advanced-git-github-workflow",
    category: "Software Engineering",
    level: "intermediate",
    price: 11500,
    duration: 420,
    thumbnail: "/courses/git-github.jpg",
    description: "Master advanced Git techniques and GitHub workflow for collaborative software development.",
    excerpt: "Master Git and GitHub",
    tags: ["git", "github", "version-control"],
    status: "published",
    isActive: true,
    badge: "Best Seller",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "DevOps Engineer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Git Fundamentals", "Branching Strategies", "Collaboration", "PR Management"],
    requirements: ["Basic command line", "Git installed", "GitHub account"],
    includes: ["7+ hours video", "Git projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Git Basics", duration: "0:50:00", video: "#", preview: true },
      { id: 2, title: "Branches & Merging", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "Rebasing", duration: "0:50:00", video: "#", preview: false },
      { id: 4, title: "GitHub Features", duration: "0:50:00", video: "#", preview: false },
      { id: 5, title: "Pull Requests", duration: "0:50:00", video: "#", preview: false },
      { id: 6, title: "Collaboration Workflow", duration: "0:50:00", video: "#", preview: false },
      { id: 7, title: "Conflict Resolution", duration: "0:50:00", video: "#", preview: false },
      { id: 8, title: "Git Best Practices", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Team Projects", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "Advanced Git Tips", duration: "0:50:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 820
    }
  },
  {
    title: "Data Visualization with Tableau",
    slug: "data-visualization-tableau",
    category: "Data Analytics",
    level: "intermediate",
    price: 16500,
    duration: 600,
    thumbnail: "/courses/tableau.jpg",
    description: "Learn to create powerful data visualizations with Tableau.",
    excerpt: "Master data visualization",
    tags: ["tableau", "analytics", "visualization"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Tableau Expert",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Tableau Fundamentals", "Dashboard Creation", "Data Sources", "Calculations & Analytics"],
    requirements: ["Tableau Desktop", "Excel or database knowledge"],
    includes: ["10+ hours video", "Tableau projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Tableau Interface", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Data Connection", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "Creating Visualizations", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Dashboard Design", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "Calculations", duration: "0:50:00", video: "#", preview: false },
      { id: 6, title: "Interactivity", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Advanced Analytics", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Publishing & Sharing", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Analytics Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Tableau Career", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 420
    }
  },
  {
    title: "Android App Development with Kotlin",
    slug: "android-development-kotlin",
    category: "Mobile Development",
    level: "intermediate",
    price: 21000,
    duration: 1200,
    thumbnail: "/courses/kotlin-android.jpg",
    description: "Learn to build Android apps with Kotlin.",
    excerpt: "Master Android development",
    tags: ["android", "kotlin", "mobile"],
    status: "published",
    isActive: true,
    badge: "Hot",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Android Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Kotlin Programming", "Android Studio", "UI Development", "Firebase Integration"],
    requirements: ["Programming basics", "Android Studio installed"],
    includes: ["20+ hours video", "Android projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Kotlin Basics", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Android Studio Setup", duration: "1:00:00", video: "#", preview: false },
      { id: 3, title: "Android UI Components", duration: "1:15:00", video: "#", preview: false },
      { id: 4, title: "Activities & Fragments", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Data Storage", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Networking", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Firebase Setup", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Authentication", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "App Project", duration: "1:30:00", video: "#", preview: false },
      { id: 10, title: "Publish to Play Store", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 380
    }
  },
  {
    title: "iOS App Development with Swift",
    slug: "ios-development-swift",
    category: "Mobile Development",
    level: "intermediate",
    price: 24000,
    duration: 1320,
    thumbnail: "/courses/ios-swift.jpg",
    description: "Learn to build iOS apps with Swift.",
    excerpt: "Master iOS development",
    tags: ["ios", "swift", "mobile"],
    status: "published",
    isActive: true,
    badge: "Trending",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "iOS Developer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Swift Programming", "Xcode IDE", "SwiftUI", "Core Data & Networking"],
    requirements: ["Mac computer", "Xcode installed", "Programming basics"],
    includes: ["22+ hours video", "iOS projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Swift Fundamentals", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Xcode Environment", duration: "1:00:00", video: "#", preview: false },
      { id: 3, title: "UIKit Basics", duration: "1:15:00", video: "#", preview: false },
      { id: 4, title: "SwiftUI Introduction", duration: "1:15:00", video: "#", preview: false },
      { id: 5, title: "Storyboards & Segues", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Networking & APIs", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Core Data", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "Testing & Debugging", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "App Project", duration: "1:30:00", video: "#", preview: false },
      { id: 10, title: "App Store Publishing", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 310
    }
  },
  {
    title: "Advanced UI Animations with Framer Motion",
    slug: "ui-animations-framer-motion",
    category: "Design",
    level: "intermediate",
    price: 15500,
    duration: 540,
    thumbnail: "/courses/framer-motion.jpg",
    description: "Learn to create stunning animations with Framer Motion.",
    excerpt: "Master UI animations",
    tags: ["animation", "react", "design"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "UI Engineer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Framer Motion", "Animation Principles", "CSS Animations", "Performance Optimization"],
    requirements: ["React knowledge", "CSS basics", "Code editor"],
    includes: ["9+ hours video", "Animation projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Animation Principles", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Framer Motion Setup", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "Basic Animations", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Gestures", duration: "0:50:00", video: "#", preview: false },
      { id: 5, title: "Advanced Animations", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Layout Animations", duration: "0:50:00", video: "#", preview: false },
      { id: 7, title: "Performance Tips", duration: "0:50:00", video: "#", preview: false },
      { id: 8, title: "Complex Interactions", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Animation Project", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "Career in Animation", duration: "0:50:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 360
    }
  },
  {
    title: "Content Marketing Strategy",
    slug: "content-marketing-strategy",
    category: "Marketing",
    level: "beginner",
    price: 13500,
    duration: 480,
    thumbnail: "/courses/content.jpg",
    description: "Learn how to create powerful content marketing strategies that attract traffic, build authority, and generate leads for businesses.",
    excerpt: "Master content marketing",
    tags: ["marketing", "content", "seo"],
    status: "published",
    isActive: true,
    badge: "Best Seller",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Content Marketing Expert",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Content Planning", "SEO Writing", "Content Distribution", "Audience Engagement"],
    requirements: ["Basic marketing knowledge", "Internet access"],
    includes: ["8+ hours video", "Content templates", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Content Strategy", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Audience Research", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "Keyword Research", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Blog Writing", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "Content Formats", duration: "0:50:00", video: "#", preview: false },
      { id: 6, title: "SEO Optimization", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Distribution Channels", duration: "0:50:00", video: "#", preview: false },
      { id: 8, title: "Content Calendar", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Campaign Project", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "Measuring Success", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 580
    }
  },
  {
    title: "Affiliate Marketing & Passive Income",
    slug: "affiliate-marketing-passive-income",
    category: "Marketing",
    level: "beginner",
    price: 12500,
    duration: 420,
    thumbnail: "/courses/affiliate-marketing.jpg",
    description: "Learn how to create and manage successful affiliate marketing campaigns to generate passive income online.",
    excerpt: "Master affiliate marketing",
    tags: ["affiliate", "marketing", "passive-income"],
    status: "published",
    isActive: true,
    badge: "Hot",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Affiliate Marketer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Niche Selection", "Affiliate Programs", "Audience Building", "Conversion Optimization"],
    requirements: ["Basic marketing skills", "Internet access"],
    includes: ["7+ hours video", "Marketing templates", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Affiliate Basics", duration: "0:50:00", video: "#", preview: true },
      { id: 2, title: "Choosing Niches", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "Finding Programs", duration: "0:50:00", video: "#", preview: false },
      { id: 4, title: "Building Audience", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "Content Promotion", duration: "0:50:00", video: "#", preview: false },
      { id: 6, title: "Conversion Optimization", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Scaling Campaigns", duration: "0:50:00", video: "#", preview: false },
      { id: 8, title: "Tools & Tracking", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Launch Campaign", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "Passive Income", duration: "0:50:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.5,
      count: 720
    }
  },
  {
    title: "Financial Literacy & Investment Basics",
    slug: "financial-literacy-investment-basics",
    category: "Business",
    level: "beginner",
    price: 10000,
    duration: 360,
    thumbnail: "/courses/finance.jpg",
    description: "Learn the fundamentals of financial literacy and investment strategies to build a secure financial future.",
    excerpt: "Master personal finance",
    tags: ["finance", "investing", "business"],
    status: "published",
    isActive: true,
    badge: "Popular",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Financial Advisor",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Financial Planning", "Budgeting", "Investing Basics", "Wealth Building"],
    requirements: ["No experience needed", "Laptop or mobile device"],
    includes: ["6+ hours video", "Finance templates", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Money Basics", duration: "0:50:00", video: "#", preview: true },
      { id: 2, title: "Budgeting", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "Savings & Banking", duration: "0:50:00", video: "#", preview: false },
      { id: 4, title: "Credit & Debt", duration: "0:50:00", video: "#", preview: false },
      { id: 5, title: "Investing Fundamentals", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Stocks & Bonds", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Portfolio Management", duration: "0:50:00", video: "#", preview: false },
      { id: 8, title: "Retirement Planning", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Financial Goals", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "Wealth Building Tips", duration: "0:50:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 640
    }
  },
  {
    title: "Technical Writing for Developers",
    slug: "technical-writing-developers",
    category: "Career Development",
    level: "intermediate",
    price: 9500,
    duration: 360,
    thumbnail: "/courses/technical-writing.jpg",
    description: "Learn the art of technical writing to create clear and effective documentation for developers.",
    excerpt: "Master technical writing",
    tags: ["writing", "documentation", "career"],
    status: "published",
    isActive: true,
    badge: "New",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Technical Writer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Technical Documentation", "API Documentation", "Developer Blogs", "Communication Skills"],
    requirements: ["Writing basics", "Programming knowledge"],
    includes: ["6+ hours video", "Writing samples", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Technical Writing Basics", duration: "0:50:00", video: "#", preview: true },
      { id: 2, title: "Documentation Structure", duration: "0:50:00", video: "#", preview: false },
      { id: 3, title: "API Documentation", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Code Examples", duration: "0:50:00", video: "#", preview: false },
      { id: 5, title: "Developer Blogs", duration: "0:50:00", video: "#", preview: false },
      { id: 6, title: "Tools & Platforms", duration: "0:50:00", video: "#", preview: false },
      { id: 7, title: "Writing Style", duration: "0:50:00", video: "#", preview: false },
      { id: 8, title: "Editing & Review", duration: "0:50:00", video: "#", preview: false },
      { id: 9, title: "Documentation Project", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "Career Opportunities", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 410
    }
  },
  {
    title: "Linux Command Line Mastery",
    slug: "linux-command-line-mastery",
    category: "Cloud Computing",
    level: "intermediate",
    price: 12000,
    duration: 540,
    thumbnail: "/courses/linux.jpg",
    description: "Master the Linux command line and essential tools for cloud computing and server management.",
    excerpt: "Master Linux command line",
    tags: ["linux", "command-line", "devops"],
    status: "published",
    isActive: true,
    badge: "Best Seller",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Linux Administrator",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Linux Commands", "File Systems", "User Management", "Shell Scripting"],
    requirements: ["Linux system access", "Basic computer knowledge"],
    includes: ["9+ hours video", "Cheat sheets", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Linux Basics", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "Navigation Commands", duration: "1:00:00", video: "#", preview: false },
      { id: 3, title: "File Management", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Permissions & Ownership", duration: "0:50:00", video: "#", preview: false },
      { id: 5, title: "User & Group Management", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Text Processing", duration: "0:50:00", video: "#", preview: false },
      { id: 7, title: "Shell Scripting", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "System Administration", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Admin Project", duration: "1:00:00", video: "#", preview: false },
      { id: 10, title: "Linux Career Path", duration: "0:50:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.7,
      count: 530
    }
  },
  {
    title: "Big Data Fundamentals",
    slug: "big-data-fundamentals",
    category: "Data Science",
    level: "intermediate",
    price: 20500,
    duration: 1020,
    thumbnail: "/courses/big-data.jpg",
    description: "Learn the fundamentals of big data technologies and their applications in modern data-driven environments.",
    excerpt: "Master Big Data",
    tags: ["bigdata", "hadoop", "spark"],
    status: "published",
    isActive: true,
    badge: "Trending",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Big Data Engineer",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Big Data Concepts", "Hadoop Ecosystem", "Spark Framework", "Data Processing"],
    requirements: ["Programming basics", "Linux knowledge", "JVM installed"],
    includes: ["17+ hours video", "Big data labs", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Big Data Fundamentals", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Data Processing Concepts", duration: "1:00:00", video: "#", preview: false },
      { id: 3, title: "Hadoop Ecosystem", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "MapReduce", duration: "1:00:00", video: "#", preview: false },
      { id: 5, title: "HDFS", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Apache Spark", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Spark SQL", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Data Streaming", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Big Data Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Big Data Career", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.6,
      count: 300
    }
  },
  {
    title: "Generative AI & Prompt Engineering",
    slug: "generative-ai-prompt-engineering",
    category: "Artificial Intelligence",
    level: "beginner",
    price: 18000,
    duration: 720,
    thumbnail: "/courses/generate-ai.jpg",
    description: "Learn the fundamentals of generative AI and prompt engineering to create compelling content and applications.",
    excerpt: "Master generative AI",
    tags: ["ai", "prompting", "generative"],
    status: "published",
    isActive: true,
    badge: "New",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "AI Specialist",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Prompt Engineering", "ChatGPT API", "LLM Integration", "AI Applications"],
    requirements: ["Basic computer knowledge", "Internet access", "API account"],
    includes: ["12+ hours video", "AI projects", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Generative AI Basics", duration: "1:00:00", video: "#", preview: true },
      { id: 2, title: "LLM Fundamentals", duration: "1:00:00", video: "#", preview: false },
      { id: 3, title: "ChatGPT Basics", duration: "1:00:00", video: "#", preview: false },
      { id: 4, title: "Prompt Engineering", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Advanced Prompts", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "ChatGPT API", duration: "1:00:00", video: "#", preview: false },
      { id: 7, title: "Fine-tuning Models", duration: "1:00:00", video: "#", preview: false },
      { id: 8, title: "Apps & Integrations", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "AI App Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "AI Career Path", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.8,
      count: 910
    }
  },
  {
    title: "Cybersecurity Advanced Concepts",
    slug: "cybersecurity-advanced-concepts",
    category: "Cybersecurity",
    level: "advanced",
    price: 122000,
    duration: 1080,
    thumbnail: "/courses/cybersecurity.jpg",
    description: "Learn advanced cybersecurity concepts and techniques to protect systems and data from modern threats.",
    excerpt: "Master advanced cybersecurity",
    tags: ["security", "advanced", "threat-analysis"],
    status: "published",
    isActive: true,
    badge: "Hot",
    freeLesson: "#",
    instructor: {
      name: "Ify Wigatap",
      title: "Security Expert",
      avatar: "/instructors/ify.jpg"
    },
    skills: ["Threat Analysis", "SIEM Tools", "Incident Response", "Cloud Security"],
    requirements: ["Cybersecurity basics", "Linux knowledge", "Networking fundamentals"],
    includes: ["18+ hours video", "Lab environments", "Lifetime access", "Certificate"],
    lessons: [
      { id: 1, title: "Advanced Security Concepts", duration: "1:10:00", video: "#", preview: true },
      { id: 2, title: "Threat Intelligence", duration: "1:10:00", video: "#", preview: false },
      { id: 3, title: "Incident Response", duration: "1:10:00", video: "#", preview: false },
      { id: 4, title: "SIEM Systems", duration: "1:10:00", video: "#", preview: false },
      { id: 5, title: "Vulnerability Management", duration: "1:00:00", video: "#", preview: false },
      { id: 6, title: "Network Security", duration: "1:10:00", video: "#", preview: false },
      { id: 7, title: "Cloud Security", duration: "1:10:00", video: "#", preview: false },
      { id: 8, title: "Compliance & Standards", duration: "1:00:00", video: "#", preview: false },
      { id: 9, title: "Security Project", duration: "1:20:00", video: "#", preview: false },
      { id: 10, title: "Security Career", duration: "1:00:00", video: "#", preview: false }
    ],
    ratings: {
      average: 4.8,
      count: 910
    },

  }
]
    

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing courses
    const deletedCount = await Course.deleteMany({});
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing courses`);

    // Insert new courses
    const insertedCourses = await Course.insertMany(coursesData);
    console.log(`✅ Successfully imported ${insertedCourses.length} courses!`);

    // Display imported courses
    console.log('📚 Imported Courses:');
    insertedCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} - ₦${course.price} (${course.category})`);
    });

    // After seeding, display some statistics
    const totalCourses = await Course.countDocuments();
    const categories = await Course.distinct('category');
    const totalRating = await Course.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$ratings.average' } } }
    ]);

    console.log('📊 Database Statistics:');
    console.log(`Total Courses: ${totalCourses}`);
    console.log(`Categories: ${categories.join(', ')}`);
    console.log(`Average Course Rating: ${(totalRating[0]?.avgRating || 0).toFixed(2)}/5`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// This check ensures the seed function only runs when the script is executed directly
// e.g., `node server/seeds/seedCourses.js`
if (import.meta.url.startsWith('file:') && process.argv[1] === mongoose.path.normalize(import.meta.url.substring(7))) {
  seedDatabase();
}
