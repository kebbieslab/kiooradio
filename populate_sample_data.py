#!/usr/bin/env python3
"""
Sample data population script for Kioo Radio
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

# MongoDB connection
mongo_url = "mongodb://localhost:27017"
client = AsyncIOMotorClient(mongo_url)
db = client["test_database"]

# Sample Programs Data
sample_programs = [
    {
        "id": str(uuid.uuid4()),
        "title": "Good Morning Kioo",
        "description": "Start your day with uplifting music, community news, and inspirational messages",
        "host": "Sarah Johnson",
        "language": "english",
        "category": "talk",
        "day_of_week": "monday",
        "start_time": "06:00",
        "duration_minutes": 180,
        "is_live": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Community Voice",
        "description": "Local discussions and community issues in Krio language",
        "host": "Emmanuel Kamara",
        "language": "krio",
        "category": "community",
        "day_of_week": "monday",
        "start_time": "09:00",
        "duration_minutes": 60,
        "is_live": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Farming Today",
        "description": "Agricultural tips, market prices, and farming techniques",
        "host": "John Bangura",
        "language": "english",
        "category": "farming",
        "day_of_week": "tuesday",
        "start_time": "10:00",
        "duration_minutes": 90,
        "is_live": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Word in Kissi",
        "description": "Biblical teachings and spiritual growth in Kissi language",
        "host": "Pastor Moses Konneh",
        "language": "kissi",
        "category": "religious",
        "day_of_week": "sunday",
        "start_time": "08:00",
        "duration_minutes": 60,
        "is_live": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Youth Pulse",
        "description": "Music, discussions, and opportunities for young people",
        "host": "Fatima Sesay",
        "language": "english",
        "category": "youth",
        "day_of_week": "friday",
        "start_time": "19:00",
        "duration_minutes": 60,
        "is_live": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Nouvelles en Français",
        "description": "French language news and current affairs",
        "host": "Marie Camara",
        "language": "french",
        "category": "news",
        "day_of_week": "wednesday",
        "start_time": "12:00",
        "duration_minutes": 30,
        "is_live": False,
        "created_at": datetime.utcnow()
    }
]

# Sample Impact Stories
sample_impact_stories = [
    {
        "id": str(uuid.uuid4()),
        "title": "Radio Saved My Marriage",
        "content": "I was about to leave my husband when I heard a program about forgiveness on Kioo Radio. The words spoke directly to my heart, and I decided to try one more time. Today, we are stronger than ever and even counsel other couples in our community.",
        "author_name": "Grace Kollie",
        "author_location": "Gbarnga, Liberia",
        "image_url": None,
        "is_featured": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Learned to Read at Age 45",
        "content": "Through the literacy programs broadcast on Kioo Radio, I finally learned to read and write. Now I can help my children with their homework and even started a small business keeping my own records.",
        "author_name": "Aminata Sesay",
        "author_location": "Bo, Sierra Leone",
        "image_url": None,
        "is_featured": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Farm Productivity Doubled",
        "content": "The farming tips from Kioo Radio helped me improve my rice yield by 100%. I learned about proper seed spacing and fertilizer use. Now I can feed my family and sell surplus at the market.",
        "author_name": "Ibrahim Diallo",
        "author_location": "Kankan, Guinea",
        "image_url": None,
        "is_featured": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Found Hope in Dark Times",
        "content": "After losing my job, I fell into depression. The daily devotions and encouraging messages on Kioo Radio gave me hope to keep going. I found new work and now volunteer to help others facing similar challenges.",
        "author_name": "Joseph Gbessay",
        "author_location": "Monrovia, Liberia",
        "image_url": None,
        "is_featured": True,
        "created_at": datetime.utcnow()
    }
]

# Sample News Updates
sample_news = [
    {
        "id": str(uuid.uuid4()),
        "title": "Kioo Radio Station Construction 95% Complete",
        "content": "Great progress has been made on our radio station construction project. The transmitter is installed, solar panels are operational, and we're conducting final equipment tests. We're on track for our November 13, 2025 launch date. Our engineering team reports that the signal strength tests have exceeded expectations, with clear coverage reaching all three target countries.",
        "excerpt": "Construction nears completion with transmitter installed and solar panels operational. Launch remains on schedule for November 13, 2025.",
        "author": "Technical Team",
        "image_url": None,
        "is_published": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Community Advisory Board Formed",
        "content": "We're excited to announce the formation of our Community Advisory Board, representing listeners from Liberia, Sierra Leone, and Guinea. The board will provide guidance on programming content and ensure we're meeting the needs of our diverse audience. Members include community leaders, educators, farmers, and youth representatives.",
        "excerpt": "New advisory board established with representatives from all three countries to guide programming decisions.",
        "author": "Station Management",
        "image_url": None,
        "is_published": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "title": "Solar Power System Exceeds Performance Targets",
        "content": "Our 50kW solar power system is performing above expectations, generating 15% more power than projected. This means we can broadcast 24/7 with full backup capacity even during extended cloudy periods. The system represents our commitment to environmental sustainability and reliable broadcasting.",
        "excerpt": "Solar power system generates 15% more energy than projected, ensuring reliable 24/7 broadcasting.",
        "author": "Engineering Team",
        "image_url": None,
        "is_published": True,
        "created_at": datetime.utcnow()
    }
]

# Sample Donations
sample_donations = [
    {
        "id": str(uuid.uuid4()),
        "donor_name": "John Smith",
        "donor_email": "john@example.com",
        "amount": 500.0,
        "currency": "USD",
        "donation_type": "one-time",
        "message": "Excited to support this amazing ministry!",
        "is_anonymous": False,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "donor_name": "Anonymous Donor",
        "donor_email": "donor@example.com",
        "amount": 1000.0,
        "currency": "USD",
        "donation_type": "monthly",
        "message": "Praying for your success",
        "is_anonymous": True,
        "created_at": datetime.utcnow()
    },
    {
        "id": str(uuid.uuid4()),
        "donor_name": "Community Church",
        "donor_email": "church@example.com",
        "amount": 2500.0,
        "currency": "USD",
        "donation_type": "one-time",
        "message": "Supporting Christian radio ministry in West Africa",
        "is_anonymous": False,
        "created_at": datetime.utcnow()
    }
]

async def populate_data():
    """Populate database with sample data"""
    
    # Clear existing data
    await db.programs.delete_many({})
    await db.impact_stories.delete_many({})
    await db.news_updates.delete_many({})
    await db.donations.delete_many({})
    
    print("Cleared existing data...")
    
    # Insert sample data
    await db.programs.insert_many(sample_programs)
    print(f"Inserted {len(sample_programs)} sample programs")
    
    await db.impact_stories.insert_many(sample_impact_stories)
    print(f"Inserted {len(sample_impact_stories)} sample impact stories")
    
    await db.news_updates.insert_many(sample_news)
    print(f"Inserted {len(sample_news)} sample news updates")
    
    await db.donations.insert_many(sample_donations)
    print(f"Inserted {len(sample_donations)} sample donations")
    
    print("Sample data population complete!")

if __name__ == "__main__":
    asyncio.run(populate_data())