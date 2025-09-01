#!/usr/bin/env python3

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime

# Load environment variables
load_dotenv()

async def add_rev_philip_kamara():
    """Add Rev. Philip Tamba Kamara to Partner Churches database"""
    
    # Get MongoDB URL from environment
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(mongo_url)
        db = client.kioo_radio  # Database name
        partners_collection = db.church_partners

        # Check if pastor already exists
        existing_pastor = await partners_collection.find_one({"pastorName": {"$regex": ".*Philip.*Kamara.*", "$options": "i"}})
        
        if existing_pastor:
            print("❌ Rev. Philip Tamba Kamara already exists in database")
            print(f"Existing record: {existing_pastor['pastorName']} at {existing_pastor['churchName']}")
            client.close()
            return

        # Create new partner church record
        new_partner = {
            "_id": str(uuid.uuid4()),
            "id": str(uuid.uuid4()),
            "pastorName": "Rev. Philip Tamba Kamara",
            "churchName": "Jerusalem Free Pentecostal Church",
            "country": "Sierra Leone",
            "city": "Koindu",
            "altCityNames": [],
            "onAirDaysTimes": "Schedule to be announced",
            "contactPhone": None,
            "whatsAppNumber": None,
            "consentToDisplayContact": False,
            "notes": "Pastor, Jerusalem Free Pentecostal Church",
            "photoUrl": "/partners/Rev_Philip_Tamba_Kamara.jpg",
            "isPublished": True,
            "sortOrder": 1,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "focalPoint": "center 20%"  # Good default for head shots
        }

        # Insert the new record
        result = await partners_collection.insert_one(new_partner)
        
        if result.inserted_id:
            print("✅ Successfully added Rev. Philip Tamba Kamara to Partner Churches!")
            print(f"✅ Pastor: Rev. Philip Tamba Kamara")
            print(f"✅ Church: Jerusalem Free Pentecostal Church")
            print(f"✅ Location: Koindu, Sierra Leone")
            print(f"✅ Photo: /partners/Rev_Philip_Tamba_Kamara.jpg")
            print(f"✅ Record ID: {result.inserted_id}")
        else:
            print("❌ Failed to add Rev. Philip Tamba Kamara")

        # Close the connection
        client.close()

        print("\n" + "="*50)
        print("NEW PARTNER CHURCH ADDED:")
        print("✅ Rev. Philip Tamba Kamara → Pastor, Jerusalem Free Pentecostal Church, Koindu, Sierra Leone")

    except Exception as e:
        print(f"❌ Error adding Rev. Philip Tamba Kamara: {e}")

if __name__ == "__main__":
    asyncio.run(add_rev_philip_kamara())