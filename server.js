const express = require('express');
const cors = require('cors');
const path = require('path');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Campus Data
const campusData = {
  buildings: {
    'library': { name: 'Main Library', hours: '8:00 AM - 10:00 PM', location: 'Building A, Room 101' },
    'cafeteria': { name: 'Student Cafeteria', hours: '7:00 AM - 9:00 PM', location: 'Building B, Ground Floor' },
    'gym': { name: 'Fitness Center', hours: '6:00 AM - 11:00 PM', location: 'Building C, Floor 2' },
    'admin': { name: 'Administration Office', hours: '9:00 AM - 5:00 PM', location: 'Building D, Room 205' }
  },
  
  courses: [
    { code: 'CS101', name: 'Introduction to Programming', time: '9:00 AM', room: 'Room 201', professor: 'Dr. Smith' },
    { code: 'MATH201', name: 'Calculus II', time: '11:00 AM', room: 'Room 105', professor: 'Dr. Johnson' },
    { code: 'ENG101', name: 'English Composition', time: '2:00 PM', room: 'Room 301', professor: 'Prof. Davis' },
    { code: 'PHYS101', name: 'Physics I', time: '3:30 PM', room: 'Room 401', professor: 'Dr. Wilson' }
  ],
  
  events: [
    { name: 'Tech Fest 2024', date: '2024-03-15', time: '10:00 AM', location: 'Main Auditorium' },
    { name: 'Career Fair', date: '2024-03-20', time: '9:00 AM', location: 'Student Center' },
    { name: 'Sports Day', date: '2024-03-25', time: '8:00 AM', location: 'Sports Complex' },
    { name: 'Science Exhibition', date: '2024-03-30', time: '2:00 PM', location: 'Lab Building' }
  ],
  
  dining: {
    menu: {
      breakfast: ['Pancakes & Syrup', 'Scrambled Eggs', 'Toast & Butter', 'Fresh Coffee', 'Orange Juice'],
      lunch: ['Margherita Pizza', 'Chicken Burger', 'Caesar Salad', 'Pasta Alfredo', 'Club Sandwich'],
      dinner: ['Grilled Chicken', 'Fried Rice', 'Mixed Vegetables', 'Tomato Soup', 'Chocolate Cake']
    },
    hours: 'Breakfast: 7-10 AM | Lunch: 12-3 PM | Dinner: 6-9 PM'
  }
};

// Simple keyword-based response system
function processMessage(message) {
  const msg = message.toLowerCase().trim();
  
  // Greetings
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! 👋 I'm your Campus Helper Bot. I can help you with campus navigation, schedules, dining, and events. What would you like to know?";
  }
  
  // Library
  if (msg.includes('library')) {
    if (msg.includes('hours') || msg.includes('time') || msg.includes('open')) {
      return `📚 **Library Hours:** ${campusData.buildings.library.hours}\n\nLocation: ${campusData.buildings.library.location}`;
    }
    return `📚 **${campusData.buildings.library.name}**\n📍 Location: ${campusData.buildings.library.location}\n⏰ Hours: ${campusData.buildings.library.hours}`;
  }
  
  // Cafeteria/Dining
  if (msg.includes('cafeteria') || msg.includes('dining') || msg.includes('food') || msg.includes('eat')) {
    if (msg.includes('menu')) {
      return formatDiningMenu();
    }
    if (msg.includes('hours')) {
      return `🍽️ **Dining Hours:**\n${campusData.dining.hours}`;
    }
    return `🍽️ **${campusData.buildings.cafeteria.name}**\n📍 Location: ${campusData.buildings.cafeteria.location}\n⏰ Hours: ${campusData.buildings.cafeteria.hours}`;
  }
  
  // Gym
  if (msg.includes('gym') || msg.includes('fitness') || msg.includes('workout')) {
    return `💪 **${campusData.buildings.gym.name}**\n📍 Location: ${campusData.buildings.gym.location}\n⏰ Hours: ${campusData.buildings.gym.hours}`;
  }
  
  // Classes/Schedule
  if (msg.includes('class') || msg.includes('schedule') || msg.includes('course')) {
    return formatCourseSchedule();
  }
  
  // Events
  if (msg.includes('event') || msg.includes('happening') || msg.includes('activities')) {
    return formatUpcomingEvents();
  }
  
  // Emergency
  if (msg.includes('emergency') || msg.includes('help') || msg.includes('urgent')) {
    return `🚨 **Emergency Contacts:**\n\n🔒 Campus Security: (555) 123-4567\n🏥 Health Center: (555) 123-4568\n💬 Counseling: (555) 123-4569\n\n**For immediate emergencies, call 911**`;
  }
  
  // Admin
  if (msg.includes('admin') || msg.includes('office') || msg.includes('registration')) {
    return `🏢 **${campusData.buildings.admin.name}**\n📍 Location: ${campusData.buildings.admin.location}\n⏰ Hours: ${campusData.buildings.admin.hours}`;
  }
  
  // Default response
  return `I can help you with:\n\n📍 **Campus Locations** - "Where is the library?"\n📅 **Class Schedule** - "My classes today"\n🍽️ **Dining Info** - "Dining menu"\n🎉 **Campus Events** - "Upcoming events"\n🚨 **Emergency** - "Emergency contacts"\n\nTry asking about any of these topics!`;
}

// Helper functions
function formatCourseSchedule() {
  let schedule = "📅 **Today's Class Schedule:**\n\n";
  campusData.courses.forEach((course, index) => {
    schedule += `${index + 1}. **${course.code}** - ${course.name}\n`;
    schedule += `   ⏰ ${course.time} | 📍 ${course.room}\n`;
    schedule += `   👨‍🏫 ${course.professor}\n\n`;
  });
  return schedule;
}

function formatUpcomingEvents() {
  let events = "🎉 **Upcoming Campus Events:**\n\n";
  campusData.events.forEach((event, index) => {
    events += `${index + 1}. **${event.name}**\n`;
    events += `   📅 ${event.date} at ${event.time}\n`;
    events += `   📍 ${event.location}\n\n`;
  });
  return events;
}

function formatDiningMenu() {
  const currentHour = new Date().getHours();
  let mealType = 'breakfast';
  
  if (currentHour >= 12 && currentHour < 18) mealType = 'lunch';
  else if (currentHour >= 18) mealType = 'dinner';
  
  let menu = `🍽️ **Current ${mealType.toUpperCase()} Menu:**\n\n`;
  campusData.dining.menu[mealType].forEach((item, index) => {
    menu += `${index + 1}. ${item}\n`;
  });
  menu += `\n⏰ ${campusData.dining.hours}`;
  return menu;
}

// API Routes
app.post('/api/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const botResponse = processMessage(message);
    
    res.json({
      success: true,
      response: botResponse,
      timestamp: new Date().toLocaleString()
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Quick actions endpoint
app.get('/api/quick-actions', (req, res) => {
  res.json([
    { id: 1, text: "Where is the library?", icon: "📚" },
    { id: 2, text: "Dining menu", icon: "🍽️" },
    { id: 3, text: "My classes today", icon: "📅" },
    { id: 4, text: "Upcoming events", icon: "🎉" },
    { id: 5, text: "Emergency contacts", icon: "🚨" }
  ]);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Campus Helper Bot is running on http://localhost:${PORT}`);
  console.log(`📱 Open your browser and go to: http://localhost:${PORT}`);
});
