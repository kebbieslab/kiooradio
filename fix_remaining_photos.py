#!/usr/bin/env python3
"""
Fix the remaining two pastor photos
"""
import os
import sys
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import uuid

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.kioo_radio

async def fix_remaining_photos():
    print("Fixing remaining pastor photos...")
    
    # Update Abraham Haward
    result = await db.church_partners.update_one(
        {"pastorName": "Rev. Abraham Haward", "city": "Foya", "country": "Liberia"},
        {"$set": {
            "photoUrl": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/od7z5onw_Abraham%20Haward.jpg",
            "focalPoint": "center 35%",
            "updated_at": datetime.utcnow()
        }}
    )
    
    if result.modified_count > 0:
        print("✅ Updated Abraham Haward photo in Foya")
    else:
        print("⚠️  Abraham Haward not found or already updated")
    
    # Handle Jallah Kormah - replace a placeholder
    placeholder = await db.church_partners.find_one({
        "pastorName": "Pastor Coming Soon",
        "city": "Kolahun", 
        "country": "Liberia"
    })
    
    if placeholder:
        result = await db.church_partners.update_one(
            {"_id": placeholder["_id"]},
            {"$set": {
                "pastorName": "Jallah Kormah",
                "churchName": "Church Name To Be Announced",
                "photoUrl": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/eh5wf4dv_Jallah%20Kormah.jpg",
                "focalPoint": "center 25%",
                "onAirDaysTimes": "Schedule to be announced",
                "sortOrder": 1,
                "updated_at": datetime.utcnow()
            }}
        )
        
        if result.modified_count > 0:
            print("✅ Added Jallah Kormah photo in Kolahun (replaced placeholder)")
        else:
            print("⚠️  Failed to update placeholder for Jallah Kormah")
    else:
        print("ℹ️  No placeholder found to replace for Jallah Kormah")
    
    # Final summary
    total_with_photos = await db.church_partners.count_documents({
        "photoUrl": {"$ne": None},
        "country": "Liberia"
    })
    
    print(f"\n📊 Final summary:")
    print(f"   📷 Total Liberian pastors with photos: {total_with_photos}")
    
    # List all pastors with photos
    pastors_with_photos = await db.church_partners.find({
        "photoUrl": {"$ne": None},
        "country": "Liberia"
    }).to_list(1000)
    
    print(f"\n📋 All Liberian pastors with photos:")
    for pastor in pastors_with_photos:
        focal_point = pastor.get("focalPoint", "default")
        print(f"   📷 {pastor.get('pastorName')} in {pastor.get('city')} - Focal: {focal_point}")

async def main():
    try:
        await fix_remaining_photos()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())