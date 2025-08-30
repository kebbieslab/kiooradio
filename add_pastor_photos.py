#!/usr/bin/env python3
"""
Add pastor photos to the database
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

# Pastor photos mapping
pastor_photos = [
    {
        "name": "Pastor Peter Sammy",
        "city": "Kakata",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/i6s07vua_Pastor%20Peter%20Sammy.jpg"
    },
    {
        "name": "Pastor. Emmanuel Taylor",  # Note the period in the database
        "city": "Foya",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/zml9enwe_Emmanul%20Taylor.jpg"
    },
    {
        "name": "Apostle David Fatorma", 
        "city": "Monrovia",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/xflxhg4y_David%20Fatorma.jpg"
    },
    {
        "name": "Bishop Robert Bimba",
        "city": "Monrovia", 
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/qa3x3lgr_Bishop%20Robert%20Bimba.jpg"
    },
    {
        "name": "Rev. John Singbae",
        "city": "Kolahun",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/5s6adj5d_Rev.%20John%20Singbae.jpg"
    }
]

async def add_pastor_photos():
    print("Adding pastor photos to database...")
    
    updated_count = 0
    not_found_count = 0
    
    for pastor_data in pastor_photos:
        pastor_name = pastor_data["name"]
        city = pastor_data["city"]
        photo_url = pastor_data["photo_url"]
        
        # Try to find the pastor by exact name match first
        pastor = await db.church_partners.find_one({
            "pastorName": pastor_name,
            "city": city,
            "country": "Liberia"
        })
        
        if pastor:
            # Update with photo URL
            result = await db.church_partners.update_one(
                {"_id": pastor["_id"]},
                {
                    "$set": {
                        "photoUrl": photo_url,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            if result.modified_count > 0:
                print(f"✅ Updated photo for {pastor_name} in {city}")
                updated_count += 1
            else:
                print(f"⚠️  No changes made for {pastor_name} in {city}")
        else:
            # Try alternative name variations
            alternative_names = []
            
            # For Emmanuel Taylor, try variations
            if "Emmanuel" in pastor_name:
                alternative_names = ["Emmanul Taylor", "Pastor Emmanul Taylor", "Pastor Emmanuel Taylor"]
            
            found_alternative = False
            for alt_name in alternative_names:
                pastor = await db.church_partners.find_one({
                    "pastorName": alt_name,
                    "city": city,
                    "country": "Liberia"
                })
                
                if pastor:
                    result = await db.church_partners.update_one(
                        {"_id": pastor["_id"]},
                        {
                            "$set": {
                                "photoUrl": photo_url,
                                "updated_at": datetime.utcnow()
                            }
                        }
                    )
                    
                    if result.modified_count > 0:
                        print(f"✅ Updated photo for {alt_name} in {city} (found as alternative for {pastor_name})")
                        updated_count += 1
                        found_alternative = True
                        break
            
            if not found_alternative:
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
    
    # Verify the updates
    if updated_count > 0:
        print(f"\n🔍 Verification - Pastors with photos:")
        pastors_with_photos = await db.church_partners.find({
            "photoUrl": {"$ne": None},
            "country": "Liberia"
        }).to_list(1000)
        
        for pastor in pastors_with_photos:
            if pastor.get("photoUrl"):
                print(f"   📷 {pastor.get('pastorName')} in {pastor.get('city')} - Has photo")

async def main():
    try:
        await add_pastor_photos()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())