#!/usr/bin/env python3
"""
Populate church partners database with blank templates for Sierra Leone and Guinea cities
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

# Template data for new cities
city_templates = {
    # Sierra Leone cities
    "Kailahun": {
        "country": "Sierra Leone",
        "templates": [
            {"pastorName": "Pastor Coming Soon", "churchName": "Church Name Available Soon"},
            {"pastorName": "Minister Coming Soon", "churchName": "Ministry Name Available Soon"},
            {"pastorName": "Reverend Coming Soon", "churchName": "Congregation Name Available Soon"},
        ]
    },
    "Bo": {
        "country": "Sierra Leone", 
        "templates": [
            {"pastorName": "Pastor Coming Soon", "churchName": "Church Name Available Soon"},
            {"pastorName": "Minister Coming Soon", "churchName": "Ministry Name Available Soon"},
            {"pastorName": "Evangelist Coming Soon", "churchName": "Fellowship Name Available Soon"},
        ]
    },
    
    # Guinea cities
    "N'Zérékoré": {
        "country": "Guinea",
        "templates": [
            {"pastorName": "Pasteur Bientôt Disponible", "churchName": "Nom d'Église Bientôt Disponible"},
            {"pastorName": "Ministre Bientôt Disponible", "churchName": "Nom de Ministère Bientôt Disponible"},
            {"pastorName": "Révérend Bientôt Disponible", "churchName": "Nom de Congrégation Bientôt Disponible"},
        ]
    },
    "Kissidougou": {
        "country": "Guinea",
        "templates": [
            {"pastorName": "Pasteur Bientôt Disponible", "churchName": "Nom d'Église Bientôt Disponible"},
            {"pastorName": "Ministre Bientôt Disponible", "churchName": "Nom de Ministère Bientôt Disponible"},
            {"pastorName": "Évangéliste Bientôt Disponible", "churchName": "Nom de Fraternité Bientôt Disponible"},
        ]
    },
    
    # Additional Liberia cities (blank templates)
    "Kolahun": {
        "country": "Liberia",
        "templates": [
            {"pastorName": "Pastor Coming Soon", "churchName": "Church Name Available Soon"},
            {"pastorName": "Minister Coming Soon", "churchName": "Ministry Name Available Soon"},
            {"pastorName": "Reverend Coming Soon", "churchName": "Congregation Name Available Soon"},
        ]
    },
    "Kakata": {
        "country": "Liberia",
        "templates": [
            {"pastorName": "Pastor Coming Soon", "churchName": "Church Name Available Soon"},
            {"pastorName": "Minister Coming Soon", "churchName": "Ministry Name Available Soon"},
            {"pastorName": "Evangelist Coming Soon", "churchName": "Fellowship Name Available Soon"},
        ]
    },
    "Monrovia": {
        "country": "Liberia",
        "templates": [
            {"pastorName": "Pastor Coming Soon", "churchName": "Church Name Available Soon"},
            {"pastorName": "Minister Coming Soon", "churchName": "Ministry Name Available Soon"},
            {"pastorName": "Reverend Coming Soon", "churchName": "Congregation Name Available Soon"},
            {"pastorName": "Evangelist Coming Soon", "churchName": "Fellowship Name Available Soon"},
        ]
    }
}

async def populate_city_templates():
    print("Populating church partner templates for additional cities...")
    
    partners_to_insert = []
    
    for city, city_data in city_templates.items():
        country = city_data["country"]
        templates = city_data["templates"]
        
        print(f"Creating templates for {city}, {country}...")
        
        for template_data in templates:
            partner = {
                "id": str(uuid.uuid4()),
                "pastorName": template_data["pastorName"],
                "churchName": template_data["churchName"],
                "country": country,
                "city": city,
                "altCityNames": [],
                "onAirDaysTimes": "To be announced",
                "contactPhone": None,
                "whatsAppNumber": None,
                "consentToDisplayContact": False,
                "notes": f"Church partnership details will be updated soon for {city}",
                "photoUrl": None,  # Will use placeholder avatar
                "isPublished": True,
                "sortOrder": None,
                "created_at": datetime.utcnow()
            }
            partners_to_insert.append(partner)
    
    # Insert all template partners
    if partners_to_insert:
        result = await db.church_partners.insert_many(partners_to_insert)
        print(f"Successfully inserted {len(result.inserted_ids)} church partner templates!")
        
        # Verify insertion by country
        for city, city_data in city_templates.items():
            country = city_data["country"]
            count = await db.church_partners.count_documents({"city": city, "country": country})
            print(f"Total church partners in {city}, {country}: {count}")
    else:
        print("No templates to insert.")

async def main():
    try:
        await populate_city_templates()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())