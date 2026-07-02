import mongoose from 'mongoose';
import 'dotenv/config';
import Contact from '../models/Contact.js';

// Sample contact data
const contactsData = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 801 234 5678",
    subject: "Website Inquiry",
    message: "I'm interested in learning more about your services and pricing options.",
    category: "general",
    priority: "medium"
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+234 802 345 6789",
    subject: "Technical Support",
    message: "I'm experiencing issues with the product download feature. Please assist.",
    category: "support",
    priority: "high"
  },
  {
    name: "Michael Chen",
    email: "michael.chen@business.com",
    phone: "+234 803 456 7890",
    subject: "Business Partnership",
    message: "We would like to explore a partnership opportunity with your company.",
    category: "partnership",
    priority: "high"
  },
  {
    name: "Amara Williams",
    email: "amara.w@email.com",
    phone: "+234 804 567 8901",
    subject: "Product Feedback",
    message: "Great products! Here are some suggestions for improvement...",
    category: "feedback",
    priority: "medium"
  },
  {
    name: "David Smith",
    email: "david.smith@company.com",
    phone: "+234 805 678 9012",
    subject: "Sales Inquiry",
    message: "We want to discuss bulk orders for our organization.",
    category: "sales",
    priority: "high"
  },
  {
    name: "Elizabeth Brown",
    email: "elizabeth.b@email.com",
    phone: "+234 806 789 0123",
    subject: "General Question",
    message: "Can you provide more information about your refund policy?",
    category: "general",
    priority: "low"
  },
  {
    name: "James Wilson",
    email: "james.w@example.com",
    phone: "+234 807 890 1234",
    subject: "Account Access Issue",
    message: "I'm unable to reset my password. Can you help?",
    category: "support",
    priority: "high"
  },
  {
    name: "Chioma Okafor",
    email: "chioma.okafor@email.com",
    phone: "+234 808 901 2345",
    subject: "Feature Request",
    message: "Could you add a wishlist feature to the mobile app?",
    category: "feedback",
    priority: "medium"
  }
];

async function seedContacts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing contacts
    await Contact.deleteMany({});
    console.log('🗑️  Cleared existing contacts');

    // Insert contacts
    const result = await Contact.insertMany(contactsData);
    console.log(`✅ Successfully seeded ${result.length} contacts`);

    // Display summary by category
    const categories = await Contact.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Contacts Summary by Category:');
    let totalCount = 0;
    for (const cat of categories) {
      console.log(`   - ${cat._id}: ${cat.count}`);
      totalCount += cat.count;
    }
    console.log(`   - Total: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding contacts:', error);
    process.exit(1);
  }
}

seedContacts();
