#!/usr/bin/env python3
"""
Update Jallah Kormah and Abraham Haward with new professional photos
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

# Final photo updates with optimal face-forward positioning
final_photo_updates = [
    {
        "name": "Jallah Kormah",
        "city": "Kolahun",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/a7k3xt5k_Jallah%20Kormah.jpg",
        "focal_point": "center 25%"  # Professional business suit - centered positioning for clear professional headshot
    },
    {
        "name": "Abraham Haward", 
        "city": "Foya",
        "photo_url": "https://customer-assets.emergentagent.com/job_radio-geo-detect/artifacts/8gx21f4e_Abraham%20Haward.jpg",
        "focal_point": "center 30%"  # Traditional West African attire with cap - positioning to show face and beautiful cultural dress
    }
]

async def update_final_photos():
    print("Updating Jallah Kormah and Abraham Haward with new professional photos...")
    
    updated_count = 0
    
    for pastor_data in final_photo_updates:
        pastor_name = pastor_data["name"]
        city = pastor_data["city"]
        photo_url = pastor_data["photo_url"]
        focal_point = pastor_data["focal_point"]
        
        # Try different name variations for Abraham Haward
        search_names = [pastor_name]
        if "Abraham Haward" in pastor_name:
            search_names = ["Abraham Haward", "Rev. Abraham Haward"]
        
        pastor = None
        found_name = None
        
        for search_name in search_names:
            pastor = await db.church_partners.find_one({
                "pastorName": search_name,
                "city": city,
                "country": "Liberia"
            })
            if pastor:
                found_name = search_name
                break
        
        if pastor:
            # Update the pastor with the new photo
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
                print(f"✅ Updated {found_name} with new professional photo")
                print(f"   📷 Photo: {photo_url}")
                print(f"   🎯 Face-forward focal point: {focal_point}")
                updated_count += 1
            else:
                print(f"⚠️  No changes made for {pastor_name}")
        else:
            print(f"❌ Pastor not found: {pastor_name} in {city}")
            
            # Show available pastors in the city for debugging
            city_pastors = await db.church_partners.find({
                "city": city,
                "country": "Liberia"
            }).to_list(1000)
            
            print(f"   Available pastors in {city}:")
            for p in city_pastors:
                print(f"     - {p.get('pastorName', 'Unknown')}")
    
    print(f"\n📊 Update Summary:")
    print(f"   ✅ Photos updated: {updated_count}")
    
    # Final verification and complete summary
    print(f"\n🔍 Verification - All updated pastors:")
    
    all_pastors_with_photos = await db.church_partners.find({
        "photoUrl": {"$ne": None},
        "country": "Liberia"
    }).to_list(1000)
    
    print(f"\n📊 COMPLETE PHOTO SUMMARY:")
    print(f"   📷 Total Liberian pastors with professional photos: {len(all_pastors_with_photos)}")
    
    # Group by city for better overview
    cities = {}
    for pastor in all_pastors_with_photos:
        city = pastor.get('city', 'Unknown')
        if city not in cities:
            cities[city] = []
        cities[city].append(pastor.get('pastorName', 'Unknown'))
    
    for city, pastors in cities.items():
        print(f"\n   🏙️ {city} ({len(pastors)} pastors):")
        for pastor_name in pastors:
            print(f"      📷 {pastor_name}")

async def main():
    try:
        await update_final_photos()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())