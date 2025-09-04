#!/usr/bin/env python3
"""
Kioo Radio Programs Database - Phase 2 Population Script
Populates MongoDB with comprehensive program schedule including new Phase 2 modifications:
- TTB removed from Fula/Mandingo languages and weekends  
- New programs: Makona Talk Show, Guidelines, Love & Faith, Daily Sermon, Truth for Life
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, time
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')

# MongoDB connection
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'kioo_radio')

async def populate_programs():
    """Populate the programs collection with Phase 2 schedule data"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    programs_collection = db.programs
    
    print("🔄 Clearing existing programs...")
    await programs_collection.delete_many({})
    
    print("📅 Populating Phase 2 program schedule...")
    
    # WEEKDAY SCHEDULE (Monday-Friday) - Phase 2 Modified
    weekday_programs = []
    
    # Daily programs that repeat Monday-Friday - REFINED PHASE 2
    weekday_schedule = [
        {"time": "00:00", "end_time": "00:30", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "00:30", "end_time": "01:00", "title": "Community Announcements", "language": "english", "type": "community"},
        {"time": "01:00", "end_time": "01:30", "title": "Phone-in Program", "language": "english", "type": "interactive"},
        {"time": "01:30", "end_time": "02:00", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "02:00", "end_time": "02:30", "title": "Community Programming", "language": "kissi", "type": "community"},
        {"time": "02:30", "end_time": "03:00", "title": "Music & Reflection", "language": "kissi", "type": "music"},
        {"time": "03:00", "end_time": "03:30", "title": "Community Announcements", "language": "kissi", "type": "community"},
        {"time": "03:30", "end_time": "04:00", "title": "Phone-in Program", "language": "kissi", "type": "interactive"},
        {"time": "04:00", "end_time": "04:30", "title": "Community Programming", "language": "french", "type": "community"},
        {"time": "04:30", "end_time": "05:00", "title": "Music & Reflection", "language": "french", "type": "music"},
        {"time": "05:00", "end_time": "05:10", "title": "Guidelines", "language": "english", "type": "bible_teaching", "new_program": True},
        {"time": "05:10", "end_time": "05:15", "title": "Morning Devotional", "language": "english", "type": "devotional"},
        {"time": "05:15", "end_time": "05:45", "title": "Morning Prayer & Worship", "language": "english", "type": "worship"},
        {"time": "05:45", "end_time": "06:00", "title": "Community Announcements", "language": "english", "type": "community"},
        # TTB REFINEMENT: Limited to 2 times daily between 6am-10pm for English/French/Kissi
        {"time": "06:00", "end_time": "06:30", "title": "Through the Bible (TTB)", "language": "english", "type": "bible_teaching"},
        {"time": "06:30", "end_time": "07:00", "title": "Daily Sermon", "language": "english", "type": "sermon", "new_program": True},
        {"time": "07:00", "end_time": "07:30", "title": "Love & Faith", "language": "english", "type": "bible_teaching", "new_program": True},
        {"time": "07:30", "end_time": "08:00", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "08:00", "end_time": "08:30", "title": "Through the Bible (TTB)", "language": "kissi", "type": "bible_teaching"},
        {"time": "08:30", "end_time": "09:00", "title": "Community Programming", "language": "kissi", "type": "community"},
        {"time": "09:00", "end_time": "10:00", "title": "VNA French Satellite Feed", "language": "french", "type": "satellite"},
        {"time": "10:00", "end_time": "10:30", "title": "Music & Reflection", "language": "french", "type": "music"},
        {"time": "10:30", "end_time": "11:00", "title": "Women & Family Hour", "language": "english", "type": "community"},
        {"time": "11:00", "end_time": "11:30", "title": "Community Announcements", "language": "english", "type": "community"},
        {"time": "11:30", "end_time": "12:00", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "12:00", "end_time": "12:30", "title": "Through the Bible (TTB)", "language": "kissi", "type": "bible_teaching"},
        {"time": "12:30", "end_time": "13:00", "title": "Youth Connect", "language": "kissi", "type": "youth"},
        {"time": "13:00", "end_time": "13:30", "title": "Community Announcements", "language": "kissi", "type": "community"},
        {"time": "13:30", "end_time": "14:00", "title": "Phone-in Program", "language": "kissi", "type": "interactive"},
        {"time": "14:00", "end_time": "14:30", "title": "Through the Bible (TTB)", "language": "french", "type": "bible_teaching"},
        {"time": "14:30", "end_time": "15:00", "title": "Health & Wellness", "language": "french", "type": "community"},
        {"time": "15:00", "end_time": "15:30", "title": "Community Announcements", "language": "french", "type": "community"},
        {"time": "15:30", "end_time": "16:00", "title": "Music & Reflection", "language": "french", "type": "music"},
        # REFINEMENT: Mandingo Christian Teaching
        {"time": "16:00", "end_time": "16:30", "title": "Christian Teaching", "language": "mandingo", "type": "christian_teaching"},
        {"time": "16:30", "end_time": "17:00", "title": "Community Programming", "language": "mandingo", "type": "community"},
        # REFINEMENT: Fula Christian Teaching
        {"time": "17:00", "end_time": "17:30", "title": "Christian Teaching", "language": "fula", "type": "christian_teaching"},
        {"time": "17:30", "end_time": "18:00", "title": "Community Programming", "language": "fula", "type": "community"},
        # REFINEMENT: Evening News & Roundup made hourly
        {"time": "18:00", "end_time": "19:00", "title": "Evening News & Roundup", "language": "mixed", "type": "community"},
        {"time": "19:00", "end_time": "19:30", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "19:30", "end_time": "20:00", "title": "Community Announcements", "language": "english", "type": "community"},
        {"time": "20:00", "end_time": "20:30", "title": "Community Programming", "language": "kissi", "type": "community"},
        {"time": "20:30", "end_time": "21:00", "title": "Phone-in Program", "language": "kissi", "type": "interactive"},
        {"time": "21:00", "end_time": "21:30", "title": "Through the Bible (TTB)", "language": "english", "type": "bible_teaching"},
        {"time": "21:30", "end_time": "22:00", "title": "Evening Worship & Reflection", "language": "english", "type": "devotional"},
        {"time": "22:00", "end_time": "22:30", "title": "Through the Bible (TTB)", "language": "french", "type": "bible_teaching"},  # Last TTB at 10pm
        {"time": "22:30", "end_time": "23:00", "title": "Community Announcements", "language": "mixed", "type": "community"},
        {"time": "23:00", "end_time": "23:30", "title": "Music & Reflection", "language": "mixed", "type": "music"},
        {"time": "23:30", "end_time": "00:00", "title": "Hope & Care Outreach", "language": "mixed", "type": "community"}
    ]
    
    # Create weekday programs (Monday-Friday) + Renaissance on Friday
    for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']:
        for program in weekday_schedule:
            # SPECIAL CASE: Replace Monday 19:00-20:00 with Gbandi Language Hour
            if day == 'monday' and program["time"] == "19:00":
                weekday_programs.append({
                    "id": str(uuid.uuid4()),
                    "title": "Gbandi Language Hour",
                    "description": "Gbandi Language Hour - Monday special program",
                    "host": "Gbandi Community Host",
                    "language": "gbandi",
                    "category": "community",
                    "day_of_week": day,
                    "start_time": program["time"],
                    "end_time": "20:00",  # Full hour for Gbandi
                    "duration": 60,  # 1 hour
                    "is_live": True,
                    "is_recurring": True,
                    "new_program": False,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                })
                # Skip the regular 19:30-20:00 program for Monday
                continue
            elif day == 'monday' and program["time"] == "19:30":
                # Skip this slot as it's covered by Gbandi Language Hour
                continue
            
            # SPECIAL CASE: Add Renaissance on Friday 15:00-15:30 (replacing Community Announcements)
            elif day == 'friday' and program["time"] == "15:00":
                weekday_programs.append({
                    "id": str(uuid.uuid4()),
                    "title": "Renaissance",
                    "description": "Renaissance - Friday French program",
                    "host": "French Program Host",
                    "language": "french",
                    "category": "talk_show",
                    "day_of_week": day,
                    "start_time": program["time"],
                    "end_time": "15:30",
                    "duration": 30,
                    "is_live": True,
                    "is_recurring": True,
                    "new_program": True,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat()
                })
                continue
            
            duration = 30 if program["time"] != "09:00" and program["time"] != "18:00" else (60 if program["time"] == "09:00" else 60)  # VNA French and Evening News are 60 mins
            weekday_programs.append({
                "id": str(uuid.uuid4()),
                "title": program["title"],
                "description": f"{program['title']} - {day.title()}",
                "host": "Kioo Radio Team",
                "language": program["language"],
                "category": program["type"],
                "day_of_week": day,
                "start_time": program["time"],
                "end_time": program["end_time"],
                "duration": duration,
                "is_live": True,
                "is_recurring": True,
                "new_program": program.get("new_program", False),
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            })
    
    # SATURDAY SCHEDULE - Phase 2 Modified (TTB removed, Makona Talk Show added)
    saturday_schedule = [
        {"time": "00:00", "end_time": "01:00", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "01:00", "end_time": "02:00", "title": "Community Programming", "language": "english", "type": "community"},
        {"time": "02:00", "end_time": "03:00", "title": "Community Programming", "language": "kissi", "type": "community"},
        {"time": "03:00", "end_time": "04:00", "title": "Community Programming", "language": "french", "type": "community"},
        {"time": "04:00", "end_time": "05:00", "title": "Music & Reflection", "language": "french", "type": "music"},
        {"time": "05:00", "end_time": "06:00", "title": "Morning Devotional & Prayer", "language": "english", "type": "devotional"},
        # PHASE 2 NEW PROGRAM: Makona Talk Show (3 hours Saturday morning)
        {"time": "06:00", "end_time": "09:00", "title": "Makona Talk Show", "language": "english", "type": "talk_show", "new_program": True},
        {"time": "09:00", "end_time": "09:30", "title": "Truth for Life", "language": "english", "type": "bible_teaching", "new_program": True},
        {"time": "09:30", "end_time": "10:00", "title": "Daily Sermon", "language": "english", "type": "sermon", "new_program": True},
        {"time": "10:00", "end_time": "11:00", "title": "Community Programming", "language": "kissi", "type": "community"},
        {"time": "11:00", "end_time": "13:00", "title": "NLASN 'Island Praise'", "language": "english", "type": "satellite"},
        {"time": "13:00", "end_time": "14:00", "title": "Community Programming", "language": "english", "type": "community"},
        {"time": "14:00", "end_time": "15:00", "title": "Community Programming", "language": "french", "type": "community"},
        {"time": "15:00", "end_time": "16:00", "title": "Community Programming", "language": "mandingo", "type": "community"},
        {"time": "16:00", "end_time": "17:00", "title": "Community Programming", "language": "mandingo", "type": "community"},
        {"time": "17:00", "end_time": "18:00", "title": "Community Programming", "language": "fula", "type": "community"},
        {"time": "18:00", "end_time": "19:00", "title": "Evening Programming", "language": "mixed", "type": "community"},
        {"time": "19:00", "end_time": "20:00", "title": "Community Programming", "language": "english", "type": "community"},
        {"time": "20:00", "end_time": "21:00", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "21:00", "end_time": "22:00", "title": "Community Programming", "language": "kissi", "type": "community"},
        {"time": "22:00", "end_time": "23:00", "title": "Community Programming", "language": "mixed", "type": "community"},
        {"time": "23:00", "end_time": "00:00", "title": "Music & Reflection", "language": "mixed", "type": "music"}
    ]
    
    saturday_programs = []
    for program in saturday_schedule:
        duration = 60  # Default 60 minutes
        if program["time"] == "06:00":  # Makona Talk Show is 3 hours
            duration = 180
        elif program["time"] == "11:00":  # NLASN is 2 hours
            duration = 120
        elif program["time"] in ["09:00", "09:30"]:  # Truth for Life and Daily Sermon are 30 minutes
            duration = 30
        
        saturday_programs.append({
            "id": str(uuid.uuid4()),
            "title": program["title"],
            "description": f"{program['title']} - Saturday",
            "host": "Kioo Radio Team" if not program.get("new_program") else "Special Host",
            "language": program["language"],
            "category": program["type"],
            "day_of_week": "saturday",
            "start_time": program["time"],
            "end_time": program["end_time"],
            "duration": duration,
            "is_live": True,
            "is_recurring": True,
            "new_program": program.get("new_program", False),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        })
    
    # SUNDAY SCHEDULE - Phase 2 Modified (TTB removed from weekends) + La Vie Chez Nous
    sunday_schedule = [
        {"time": "00:00", "end_time": "01:00", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "01:00", "end_time": "02:00", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "02:00", "end_time": "03:00", "title": "Community Programming", "language": "kissi", "type": "community"},
        {"time": "03:00", "end_time": "04:00", "title": "Community Programming", "language": "french", "type": "community"},
        {"time": "04:00", "end_time": "05:00", "title": "Music & Reflection", "language": "french", "type": "music"},
        {"time": "05:00", "end_time": "06:00", "title": "Morning Devotional & Prayer", "language": "english", "type": "devotional"},
        {"time": "06:00", "end_time": "07:00", "title": "Pre-Service Programming", "language": "english", "type": "community"},
        # PHASE 2 NEW PROGRAM: Truth for Life (Sunday French version)
        {"time": "07:00", "end_time": "07:30", "title": "Truth for Life", "language": "french", "type": "bible_teaching", "new_program": True},
        {"time": "07:30", "end_time": "08:00", "title": "Daily Sermon", "language": "english", "type": "sermon", "new_program": True},
        {"time": "08:00", "end_time": "09:00", "title": "Community Programming", "language": "kissi", "type": "community"},
        {"time": "09:00", "end_time": "10:00", "title": "Pre-Service Worship", "language": "mixed", "type": "worship"},
        {"time": "10:00", "end_time": "12:00", "title": "Live Partner Church Service", "language": "mixed", "type": "live_service"},
        {"time": "12:00", "end_time": "13:00", "title": "Post-Service Reflection", "language": "mixed", "type": "devotional"},
        {"time": "13:00", "end_time": "14:00", "title": "Community Programming", "language": "french", "type": "community"},
        # NEW PROGRAM: La Vie Chez Nous (French program on Sunday 14:00-15:00)
        {"time": "14:00", "end_time": "15:00", "title": "La Vie Chez Nous", "language": "french", "type": "talk_show", "new_program": True},
        {"time": "15:00", "end_time": "16:00", "title": "Community Programming", "language": "mandingo", "type": "community"},
        {"time": "16:00", "end_time": "17:00", "title": "Community Programming", "language": "mandingo", "type": "community"},
        {"time": "17:00", "end_time": "18:00", "title": "Community Programming", "language": "fula", "type": "community"},
        {"time": "18:00", "end_time": "19:00", "title": "Community Programming", "language": "fula", "type": "community"},
        {"time": "19:00", "end_time": "20:00", "title": "Sunday Evening Worship", "language": "mixed", "type": "worship"},
        {"time": "20:00", "end_time": "21:00", "title": "Community Programming", "language": "english", "type": "community"},
        {"time": "21:00", "end_time": "22:00", "title": "Music & Reflection", "language": "english", "type": "music"},
        {"time": "22:00", "end_time": "23:00", "title": "Community Programming", "language": "mixed", "type": "community"},
        {"time": "23:00", "end_time": "00:00", "title": "Evening Devotional", "language": "mixed", "type": "devotional"}
    ]
    
    sunday_programs = []
    for program in sunday_schedule:
        duration = 60  # Default 60 minutes
        if program["time"] in ["07:00", "07:30"]:  # Truth for Life and Daily Sermon are 30 minutes
            duration = 30
        elif program["time"] == "10:00":  # Live Church Service is 2 hours
            duration = 120
        
        sunday_programs.append({
            "id": str(uuid.uuid4()),
            "title": program["title"],
            "description": f"{program['title']} - Sunday",
            "host": "Kioo Radio Team" if not program.get("new_program") else "Special Host",
            "language": program["language"],
            "category": program["type"],
            "day_of_week": "sunday",
            "start_time": program["time"],
            "end_time": program["end_time"],
            "duration": duration,
            "is_live": True,
            "is_recurring": True,
            "new_program": program.get("new_program", False),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        })
    
    # Combine all programs
    all_programs = weekday_programs + saturday_programs + sunday_programs
    
    # Insert all programs
    if all_programs:
        result = await programs_collection.insert_many(all_programs)
        print(f"✅ Successfully inserted {len(result.inserted_ids)} programs")
        
        # Count programs by day
        for day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']:
            count = await programs_collection.count_documents({"day_of_week": day})
            print(f"   📅 {day.title()}: {count} programs")
        
        # Count new Phase 2 programs
        new_program_count = await programs_collection.count_documents({"new_program": True})
        print(f"   ⭐ New Phase 2 programs: {new_program_count}")
        
        # Count TTB programs
        ttb_count = await programs_collection.count_documents({"title": {"$regex": "Through the Bible|TTB", "$options": "i"}})
        print(f"   📖 TTB programs: {ttb_count}")
        
        # Verify TTB not in Fula/Mandingo
        ttb_fula_mandingo = await programs_collection.count_documents({
            "title": {"$regex": "Through the Bible|TTB", "$options": "i"},
            "language": {"$in": ["fula", "mandingo"]}
        })
        print(f"   ❌ TTB in Fula/Mandingo: {ttb_fula_mandingo} (should be 0)")
        
        # Verify TTB not on weekends
        ttb_weekends = await programs_collection.count_documents({
            "title": {"$regex": "Through the Bible|TTB", "$options": "i"},
            "day_of_week": {"$in": ["saturday", "sunday"]}
        })
        print(f"   ❌ TTB on weekends: {ttb_weekends} (should be 0)")
        
    else:
        print("❌ No programs to insert")
    
    # Close connection
    client.close()
    print("✅ Database population completed!")

if __name__ == "__main__":
    asyncio.run(populate_programs())