#!/usr/bin/env python3

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def update_pastor_peter():
    # Get MongoDB URL from environment
    mongo_url = os.environ.get('MONGO_URL')
    if not mongo_url:
        print("Error: MONGO_URL not found in environment variables")
        return

    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(mongo_url)
        db = client.kioo_radio  # Database name
        partners_collection = db.church_partners

        # Find Pastor Peter Sammy
        pastor_peter = await partners_collection.find_one({"pastorName": "Pastor Peter Sammy"})
        
        if pastor_peter:
            print(f"Found Pastor Peter Sammy: {pastor_peter['pastorName']}")
            print(f"Current church: {pastor_peter['churchName']}")
            
            # Update the pastor's information
            update_data = {
                "pastorName": "Rev Peter F. Sammie",
                "churchName": "Christ End Time Revival Ministries International Inc.",
                "notes": "Founder and General Overseer, Christ End Time Revival Ministries International Inc."
            }
            
            # Update the record
            result = await partners_collection.update_one(
                {"_id": pastor_peter["_id"]},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                print("✅ Successfully updated Pastor Peter Sammy to Rev Peter F. Sammie")
                print(f"✅ Updated church name to: Christ End Time Revival Ministries International Inc.")
                print(f"✅ Updated notes to: Founder and General Overseer, Christ End Time Revival Ministries International Inc.")
            else:
                print("❌ No changes made to the record")
        else:
            print("❌ Pastor Peter Sammy not found in database")

        # Close the connection
        client.close()

    except Exception as e:
        print(f"❌ Error updating pastor: {e}")

if __name__ == "__main__":
    asyncio.run(update_pastor_peter())