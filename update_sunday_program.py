#!/usr/bin/env python3
"""
Script to update Sunday 20:00-21:00 program from "Community Programming" to "Sunday Gospel with Sam Ngardu"
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def update_sunday_program():
    """Update the Sunday program in the database"""
    
    # Get MongoDB connection
    mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.getenv('DB_NAME', 'kioo_radio')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        print("🔍 Searching for Sunday 20:00-21:00 Community Programming...")
        
        # Search for the specific program
        query = {
            "day_of_week": "sunday",
            "start_time": "20:00",
            "$or": [
                {"title": "Community Programming"},
                {"title": {"$regex": "Community Programming", "$options": "i"}}
            ]
        }
        
        programs = await db.programs.find(query).to_list(length=None)
        
        if programs:
            print(f"📋 Found {len(programs)} matching program(s):")
            for program in programs:
                print(f"   - ID: {program.get('id', program.get('_id'))}")
                print(f"   - Title: {program.get('title')}")
                print(f"   - Day: {program.get('day_of_week')}")
                print(f"   - Time: {program.get('start_time')}")
                print(f"   - Host: {program.get('host', 'N/A')}")
                print()
            
            # Update the programs
            update_data = {
                "$set": {
                    "title": "Sunday Gospel with Sam Ngardu",
                    "host": "Sam Ngardu",
                    "category": "gospel",
                    "description": "Weekly Sunday Gospel program featuring Sam Ngardu with inspirational gospel music and messages."
                }
            }
            
            result = await db.programs.update_many(query, update_data)
            
            print(f"✅ Updated {result.modified_count} program(s) successfully!")
            
            # Verify the update
            updated_programs = await db.programs.find({
                "day_of_week": "sunday",
                "start_time": "20:00",
                "title": "Sunday Gospel with Sam Ngardu"
            }).to_list(length=None)
            
            if updated_programs:
                print(f"✅ Verification: Found {len(updated_programs)} updated program(s):")
                for program in updated_programs:
                    print(f"   - Title: {program.get('title')}")
                    print(f"   - Host: {program.get('host')}")
                    print(f"   - Category: {program.get('category')}")
                    print()
        
        else:
            print("ℹ️  No matching programs found in database.")
            print("   This might mean:")
            print("   1. The program data is only in frontend files (not database)")
            print("   2. The program has a different title or time format")
            print("   3. No programs have been added to the database yet")
            
            # Let's check if there are any programs in the database at all
            all_programs_count = await db.programs.count_documents({})
            print(f"   Total programs in database: {all_programs_count}")
            
            if all_programs_count > 0:
                # Show some sample programs
                sample_programs = await db.programs.find().limit(3).to_list(length=3)
                print("   Sample programs:")
                for program in sample_programs:
                    print(f"   - {program.get('title')} ({program.get('day_of_week')} {program.get('start_time')})")
    
    except Exception as e:
        print(f"❌ Error updating program: {e}")
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_sunday_program())