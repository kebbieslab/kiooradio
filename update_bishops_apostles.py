#!/usr/bin/env python3

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def update_pastors():
    # Get MongoDB URL from environment
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(mongo_url)
        db = client.kioo_radio  # Database name
        partners_collection = db.church_partners

        # Update Bishop Robert Bimba
        bishop_robert = await partners_collection.find_one({"pastorName": {"$regex": ".*Robert.*Bimba.*", "$options": "i"}})
        
        if bishop_robert:
            print(f"Found: {bishop_robert['pastorName']}")
            print(f"Current church: {bishop_robert['churchName']}")
            
            # Update Bishop Robert Bimba's information
            update_data_robert = {
                "churchName": "Abide in the Vine Fellowship Liberia",
                "notes": "General Overseer, Abide in the Vine Fellowship Liberia"
            }
            
            result_robert = await partners_collection.update_one(
                {"_id": bishop_robert["_id"]},
                {"$set": update_data_robert}
            )
            
            if result_robert.modified_count > 0:
                print("✅ Successfully updated Bishop Robert Bimba")
                print(f"✅ Updated church name to: Abide in the Vine Fellowship Liberia")
                print(f"✅ Updated title to: General Overseer")
            else:
                print("❌ No changes made to Bishop Robert Bimba's record")
        else:
            print("❌ Bishop Robert Bimba not found in database")

        print("\n" + "="*50 + "\n")

        # Update Apostle David Fatorma
        apostle_david = await partners_collection.find_one({"pastorName": {"$regex": ".*David.*Fatorma.*", "$options": "i"}})
        
        if apostle_david:
            print(f"Found: {apostle_david['pastorName']}")
            print(f"Current church: {apostle_david['churchName']}")
            
            # Update Apostle David Fatorma's information
            update_data_david = {
                "churchName": "Light Stream Chapel",
                "notes": "General Overseer, Light Stream Chapel"
            }
            
            result_david = await partners_collection.update_one(
                {"_id": apostle_david["_id"]},
                {"$set": update_data_david}
            )
            
            if result_david.modified_count > 0:
                print("✅ Successfully updated Apostle David Fatorma")
                print(f"✅ Updated church name to: Light Stream Chapel")
                print(f"✅ Updated title to: General Overseer")
            else:
                print("❌ No changes made to Apostle David Fatorma's record")
        else:
            print("❌ Apostle David Fatorma not found in database")

        # Close the connection
        client.close()

        print("\n" + "="*50)
        print("UPDATE SUMMARY:")
        print("✅ Bishop Robert Bimba → General Overseer, Abide in the Vine Fellowship Liberia")
        print("✅ Apostle David Fatorma → General Overseer, Light Stream Chapel")

    except Exception as e:
        print(f"❌ Error updating pastors: {e}")

if __name__ == "__main__":
    asyncio.run(update_pastors())