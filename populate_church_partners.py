#!/usr/bin/env python3
"""
Populate the church partners database with seed data for Foya, Liberia
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

# Seed data for Foya, Liberia
foya_partners = [
    {
        "pastorName": "Pastor. Emmanuel Taylor",
        "churchName": "Light Streams Chapel"
    },
    {
        "pastorName": "Rev. John Lendor", 
        "churchName": "Free Pentecostal church Boma"
    },
    {
        "pastorName": "Rev. Checkor",
        "churchName": "Global Free Pentecostal Mission"
    },
    {
        "pastorName": "Rev. Abraham Haward",
        "churchName": "Body of Christ"
    },
    {
        "pastorName": "Pastor. Julius T. Saysay",
        "churchName": "Christ Life"
    },
    {
        "pastorName": "Pastor. Solomon Johnson",
        "churchName": "Hope International Ministries"
    },
    {
        "pastorName": "Pastor. Sylvester",
        "churchName": "Church of Pentecost"
    },
    {
        "pastorName": "Rev. Borsu",
        "churchName": "A.G. Church"
    },
    {
        "pastorName": "Rev. Emmanuel Tengbeh",
        "churchName": "Lutheran church"
    },
    {
        "pastorName": "Evan. Samuel Korfeh",
        "churchName": "New Life Pentecostal Ministry"
    },
    {
        "pastorName": "Pastor. Abraham Tamba",
        "churchName": "Spiritual Life church"
    },
    {
        "pastorName": "Rev. Wellie Blama",
        "churchName": "Love Baptist"
    },
    {
        "pastorName": "Pastor. Amos T. Josiah",
        "churchName": "Light of World"
    },
    {
        "pastorName": "Pastor. Philip Saah",
        "churchName": "Watchman prophetic"
    }
]

async def populate_church_partners():
    print("Populating church partners for Foya, Liberia...")
    
    # Clear existing data (optional)
    # await db.church_partners.delete_many({"city": "Foya", "country": "Liberia"})
    
    # Insert seed data
    partners_to_insert = []
    for partner_data in foya_partners:
        partner = {
            "id": str(uuid.uuid4()),
            "pastorName": partner_data["pastorName"],
            "churchName": partner_data["churchName"],
            "country": "Liberia",
            "city": "Foya",
            "altCityNames": ["Foyah"],
            "onAirDaysTimes": None,  # To be announced
            "contactPhone": None,
            "whatsAppNumber": None,
            "consentToDisplayContact": False,
            "notes": None,
            "photoUrl": None,
            "isPublished": True,
            "sortOrder": None,
            "created_at": datetime.utcnow()
        }
        partners_to_insert.append(partner)
    
    # Insert all partners
    result = await db.church_partners.insert_many(partners_to_insert)
    print(f"Successfully inserted {len(result.inserted_ids)} church partners!")
    
    # Verify insertion
    count = await db.church_partners.count_documents({"city": "Foya", "country": "Liberia"})
    print(f"Total church partners in Foya, Liberia: {count}")

async def main():
    try:
        await populate_church_partners()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())