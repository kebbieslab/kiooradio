#!/usr/bin/env python3
"""
Add specific partner churches to the database for Liberia cities
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

# Specific partner churches data
specific_partners = [
    {
        "pastorName": "Rev. Henry SN Powoe",
        "churchName": "Church Name To Be Announced",
        "city": "Monrovia",
        "country": "Liberia"
    },
    {
        "pastorName": "Pastor Peter Sammy",
        "churchName": "Church Name To Be Announced", 
        "city": "Kakata",
        "country": "Liberia"
    },
    {
        "pastorName": "Bishop Robert Bimba",
        "churchName": "Church Name To Be Announced",
        "city": "Monrovia",
        "country": "Liberia"
    },
    {
        "pastorName": "Apostle David Fatorma",
        "churchName": "Church Name To Be Announced",
        "city": "Monrovia", 
        "country": "Liberia"
    },
    {
        "pastorName": "Rev. Dr Joseph Bannah",
        "churchName": "Church Name To Be Announced",
        "city": "Monrovia",
        "country": "Liberia"
    },
    {
        "pastorName": "Rev. John Singbae",
        "churchName": "Church Name To Be Announced",
        "city": "Kolahun",
        "country": "Liberia"
    }
]

async def add_specific_partners():
    print("Adding specific partner churches to database...")
    
    partners_to_insert = []
    
    for partner_data in specific_partners:
        # Check if this pastor already exists
        existing = await db.church_partners.find_one({
            "pastorName": partner_data["pastorName"],
            "city": partner_data["city"],
            "country": partner_data["country"]
        })
        
        if existing:
            print(f"⚠️  {partner_data['pastorName']} in {partner_data['city']} already exists, skipping...")
            continue
            
        partner = {
            "id": str(uuid.uuid4()),
            "pastorName": partner_data["pastorName"],
            "churchName": partner_data["churchName"],
            "country": partner_data["country"],
            "city": partner_data["city"],
            "altCityNames": [],
            "onAirDaysTimes": "Schedule to be announced",
            "contactPhone": None,
            "whatsAppNumber": None,
            "consentToDisplayContact": False,
            "notes": f"Partner church pastor in {partner_data['city']}. Church name and contact details to be updated.",
            "photoUrl": None,  # Will use placeholder avatar
            "isPublished": True,
            "sortOrder": 1,  # Higher priority than template entries
            "created_at": datetime.utcnow()
        }
        partners_to_insert.append(partner)
        print(f"✅ Prepared {partner_data['pastorName']} for {partner_data['city']}")
    
    # Insert new partner churches
    if partners_to_insert:
        result = await db.church_partners.insert_many(partners_to_insert)
        print(f"🎉 Successfully inserted {len(result.inserted_ids)} new partner churches!")
        
        # Verify insertion by city
        cities_count = {}
        for partner in partners_to_insert:
            city = partner['city']
            if city not in cities_count:
                cities_count[city] = 0
            cities_count[city] += 1
        
        for city, count in cities_count.items():
            total_count = await db.church_partners.count_documents({"city": city, "country": "Liberia"})
            print(f"📊 Total partner churches in {city}, Liberia: {total_count} (added {count} new)")
    else:
        print("📭 No new partners to insert - all already exist in database")
    
    # Show summary by city
    print(f"\n📋 Summary of all partner churches in Liberia:")
    liberia_cities = ["Foya", "Kolahun", "Kakata", "Monrovia"]
    for city in liberia_cities:
        count = await db.church_partners.count_documents({"city": city, "country": "Liberia"})
        print(f"   {city}: {count} partner churches")

async def main():
    try:
        await add_specific_partners()
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())