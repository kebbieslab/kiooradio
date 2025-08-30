#!/usr/bin/env python3
"""
Add new pastor photos with optimal face-forward positioning
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

# New pastor photos with optimized focal points for face-forward display
pastor_photos_new = [
    {
        "name": "Rev. Henry SN Powoe",
        "city": "Monrovia",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/gk0ws9pm_Henry%20SN%20Powoe.jpg",
        "focal_point": "center 20%"  # Preaching photo - center with upper positioning to show face clearly
    },
    {
        "name": "Rev. Dr Joseph Bannah", 
        "city": "Monrovia",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/gzf76jz5_Rev.%20Dr%20Joseph%20Bannah.jpg",
        "focal_point": "center 25%"  # Professional headshot - slight upper positioning for face focus
    },
    {
        "name": "Rev. John Lendor",
        "city": "Foya", 
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/wcgcy1yz_John%20Lendor.jpg",
        "focal_point": "center 30%"  # Traditional dress - centered positioning to show face and attire
    },
    {
        "name": "Jallah Kormah",
        "city": "Kolahun",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/eh5wf4dv_Jallah%20Kormah.jpg", 
        "focal_point": "center 25%"  # Traditional dress with good face visibility
    },
    {
        "name": "Abraham Haward",
        "city": "Foya",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/od7z5onw_Abraham%20Haward.jpg",
        "focal_point": "center 35%"  # Casual setting - centered to show face and context
    }
]

async def add_new_pastor_photos():
    print("Adding new pastor photos with face-forward positioning...")
    
    updated_count = 0
    not_found_count = 0
    
    for pastor_data in pastor_photos_new:
        pastor_name = pastor_data["name"]
        city = pastor_data["city"]
        photo_url = pastor_data["photo_url"]
        focal_point = pastor_data["focal_point"]
        
        # Search for the pastor with various name formats
        search_patterns = [
            pastor_name,  # Exact match
            pastor_name.replace("Rev. ", ""),  # Without Rev prefix
            pastor_name.replace("Dr ", "Dr. "),  # With proper Dr. format
        ]
        
        pastor = None
        found_name = None
        
        for pattern in search_patterns:
            pastor = await db.church_partners.find_one({
                "pastorName": pattern,
                "city": city,
                "country": "Liberia"
            })
            if pastor:
                found_name = pattern
                break
        
        if pastor:
            # Update with photo URL and focal point
            result = await db.church_partners.update_one(
                {"_id": pastor["_id"]},
                {
                    "$set": {
                        "photoUrl": photo_url,
                        "focalPoint": focal_point,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                print(f"✅ Updated photo for {found_name} in {city}")
                print(f"   📷 Photo: {photo_url}")
                print(f"   🎯 Focal point: {focal_point}")
                updated_count += 1
            else:
                print(f"⚠️  No changes made for {pastor_name} in {city}")
        else:
            print(f"❌ Pastor not found: {pastor_name} in {city}")
            not_found_count += 1
            
            # List pastors in that city for debugging
            city_pastors = await db.church_partners.find({
                "city": city,
                "country": "Liberia"
            }).to_list(1000)
            
            print(f"   Available pastors in {city}:")
            for p in city_pastors:
                print(f"     - {p.get('pastorName', 'Unknown')}")
    
    print(f"\n📊 Summary:")
    print(f"   ✅ Photos added: {updated_count}")
    print(f"   ❌ Pastors not found: {not_found_count}")
    
    # Verify the updates and check for head cropping issues
    if updated_count > 0:
        print(f"\n🔍 Verification - Updated pastors with face-forward photos:")
        updated_pastors = await db.church_partners.find({
            "photoUrl": {"$ne": None},
            "country": "Liberia",
            "focalPoint": {"$exists": True}
        }).to_list(1000)
        
        for pastor in updated_pastors:
            if pastor.get("photoUrl") and pastor.get("focalPoint"):
                print(f"   📷 {pastor.get('pastorName')} in {pastor.get('city')} - Photo with focal point: {pastor.get('focalPoint')}")

async def fix_existing_photo_positioning():
    """Fix any existing photos that might have head cropping issues"""
    print("\n🔧 Fixing existing photo positioning to prevent head cropping...")
    
    # Update existing photos with better focal points
    existing_fixes = [
        {"name": "Pastor Peter Sammy", "city": "Kakata", "focal_point": "center 20%"},
        {"name": "Apostle David Fatorma", "city": "Monrovia", "focal_point": "center 25%"},
        {"name": "Bishop Robert Bimba", "city": "Monrovia", "focal_point": "center 30%"},
        {"name": "Rev. John Singbae", "city": "Kolahun", "focal_point": "center 25%"},
        {"name": "Pastor Emmanul Taylor", "city": "Foya", "focal_point": "center 25%"}
    ]
    
    fixed_count = 0
    
    for fix in existing_fixes:
        result = await db.church_partners.update_one(
            {
                "pastorName": fix["name"],
                "city": fix["city"],
                "country": "Liberia",
                "photoUrl": {"$ne": None}
            },
            {
                "$set": {
                    "focalPoint": fix["focal_point"],
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.modified_count > 0:
            print(f"🔧 Fixed positioning for {fix['name']} in {fix['city']} - {fix['focal_point']}")
            fixed_count += 1
    
    print(f"   🔧 Fixed focal points for {fixed_count} existing photos")

async def main():
    try:
        await add_new_pastor_photos()
        await fix_existing_photo_positioning()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())