#!/usr/bin/env python3
"""
Script to update "Truth for Life" French program from Sunday 07:00-07:30 to Sunday 21:00-21:30
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def update_truth_for_life():
    """Update the Truth for Life program in the database"""
    
    # Get MongoDB connection
    mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.getenv('DB_NAME', 'kioo_radio')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        print("🔍 Searching for Sunday 07:00-07:30 Truth for Life French program...")
        
        # Search for the specific program
        query = {
            "day_of_week": "sunday",
            "start_time": "07:00",
            "$or": [
                {"title": "Truth for Life"},
                {"title": {"$regex": "Truth for Life", "$options": "i"}}
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
                print(f"   - End Time: {program.get('end_time', 'N/A')}")
                print(f"   - Language: {program.get('language', 'N/A')}")
                print()
            
            # Update the programs to new time slot
            update_data = {
                "$set": {
                    "start_time": "21:00",
                    "end_time": "21:30",
                    "title": "Truth for Life",
                    "language": "French",
                    "category": "bible_teaching",
                    "description": "French Bible teaching program 'Truth for Life' featuring biblical teachings and spiritual guidance."
                }
            }
            
            result = await db.programs.update_many(query, update_data)
            
            print(f"✅ Updated {result.modified_count} program(s) successfully!")
            
            # Verify the update
            updated_programs = await db.programs.find({
                "day_of_week": "sunday",
                "start_time": "21:00",
                "title": "Truth for Life"
            }).to_list(length=None)
            
            if updated_programs:
                print(f"✅ Verification: Found {len(updated_programs)} updated program(s):")
                for program in updated_programs:
                    print(f"   - Title: {program.get('title')}")
                    print(f"   - Time: {program.get('start_time')} - {program.get('end_time')}")
                    print(f"   - Language: {program.get('language')}")
                    print(f"   - Category: {program.get('category')}")
                    print()
            
            # Now check if there's a program at 21:00-22:00 that needs to be adjusted
            print("🔍 Checking for programs that might conflict at 21:00-22:00...")
            
            conflict_query = {
                "day_of_week": "sunday",
                "start_time": "21:00",
                "end_time": "22:00",
                "title": {"$ne": "Truth for Life"}
            }
            
            conflicting_programs = await db.programs.find(conflict_query).to_list(length=None)
            
            if conflicting_programs:
                print(f"📋 Found {len(conflicting_programs)} conflicting program(s) at 21:00-22:00:")
                for program in conflicting_programs:
                    print(f"   - Title: {program.get('title')}")
                    print(f"   - Time: {program.get('start_time')} - {program.get('end_time')}")
                    print()
                
                # Update conflicting programs to start at 21:30
                conflict_update = {
                    "$set": {
                        "start_time": "21:30",
                        "end_time": "22:00"
                    }
                }
                
                conflict_result = await db.programs.update_many(conflict_query, conflict_update)
                print(f"✅ Adjusted {conflict_result.modified_count} conflicting program(s) to 21:30-22:00")
        
        else:
            print("ℹ️  No matching 'Truth for Life' programs found in database.")
            print("   This might mean:")
            print("   1. The program data is only in frontend files (not database)")
            print("   2. The program has a different title or time format")
            print("   3. No programs have been added to the database yet")
            
            # Let's check if there are any programs in the database at all
            all_programs_count = await db.programs.count_documents({})
            print(f"   Total programs in database: {all_programs_count}")
            
            if all_programs_count > 0:
                # Show some sample Sunday programs
                sunday_programs = await db.programs.find({"day_of_week": "sunday"}).limit(5).to_list(length=5)
                print("   Sample Sunday programs:")
                for program in sunday_programs:
                    print(f"   - {program.get('title')} ({program.get('start_time')} - {program.get('end_time', 'N/A')})")
    
    except Exception as e:
        print(f"❌ Error updating program: {e}")
    
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_truth_for_life())