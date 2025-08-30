#!/usr/bin/env python3
"""
Update Rev. Dr Joseph Bannah and Henry SN Powoe with better quality photos
"""
import os
import sys
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.kioo_radio

# Better quality photos with optimal face-forward positioning
photo_updates = [
    {
        "name": "Rev. Dr Joseph Bannah",
        "city": "Monrovia",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/e04z6vtv_Rev.%20Dr%20Joseph%20Bannah.jpg",
        "focal_point": "center 20%"  # Traditional white attire with microphone - upper positioning for clear face visibility
    },
    {
        "name": "Rev. Henry SN Powoe", 
        "city": "Monrovia",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/jcqg3fc4_Henry%20SN%20Powoe.jpg",
        "focal_point": "center 25%"  # Colorful traditional attire - centered positioning to show face and beautiful clothing
    }
]

async def update_better_photos():
    print("Updating Rev. Dr Joseph Bannah and Henry SN Powoe with better quality photos...")
    
    updated_count = 0
    
    for pastor_data in photo_updates:
        pastor_name = pastor_data["name"]
        city = pastor_data["city"]
        photo_url = pastor_data["photo_url"]
        focal_point = pastor_data["focal_point"]
        
        # Update the pastor with the better photo
        result = await db.church_partners.update_one(
            {
                "pastorName": pastor_name,
                "city": city,
                "country": "Liberia"
            },
            {
                "$set": {
                    "photoUrl": photo_url,
                    "focalPoint": focal_point,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            print(f"✅ Updated {pastor_name} with better quality photo")
            print(f"   📷 New photo: {photo_url}")
            print(f"   🎯 Face-forward focal point: {focal_point}")
            updated_count += 1
        else:
            print(f"⚠️  No changes made for {pastor_name} - may already be up to date")
    
    print(f"\n📊 Update Summary:")
    print(f"   ✅ Photos updated: {updated_count}")
    
    # Verify the updates
    print(f"\n🔍 Verification - Updated pastors:")
    for pastor_data in photo_updates:
        pastor = await db.church_partners.find_one({
            "pastorName": pastor_data["name"],
            "city": pastor_data["city"],
            "country": "Liberia"
        })
        
        if pastor and pastor.get("photoUrl") == pastor_data["photo_url"]:
            print(f"   ✅ {pastor_data['name']} - Photo updated successfully")
            print(f"      🎯 Focal point: {pastor.get('focalPoint', 'default')}")
        else:
            print(f"   ⚠️  {pastor_data['name']} - Update verification failed")
    
    # Final count of all pastors with photos
    total_with_photos = await db.church_partners.count_documents({
        "photoUrl": {"$ne": None},
        "country": "Liberia"
    })
    
    print(f"\n📊 Total Liberian pastors with professional photos: {total_with_photos}")

async def main():
    try:
        await update_better_photos()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())