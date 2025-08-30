#!/usr/bin/env python3
"""
Script to check newsletter signups in the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

async def check_newsletter_signups():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    try:
        # Count total newsletter signups
        total_count = await db.newsletter_signups.count_documents({})
        print(f"📊 Total newsletter signups in database: {total_count}")
        
        if total_count > 0:
            # Get all newsletter signups
            signups = await db.newsletter_signups.find({}).to_list(1000)
            
            print(f"\n📋 Newsletter Signups:")
            print("-" * 60)
            
            for i, signup in enumerate(signups, 1):
                print(f"{i}. Email: {signup.get('email', 'N/A')}")
                print(f"   Admin Email: {signup.get('admin_email', 'N/A')}")
                print(f"   Subscribed At: {signup.get('subscribed_at', 'N/A')}")
                print(f"   ID: {signup.get('id', 'N/A')}")
                print("-" * 40)
                
            # Check if admin email is set correctly
            admin_emails = [signup.get('admin_email') for signup in signups]
            expected_admin = 'admin@proudlyliberian.com'
            
            correct_admin_count = sum(1 for email in admin_emails if email == expected_admin)
            print(f"\n✅ Signups with correct admin email ({expected_admin}): {correct_admin_count}/{total_count}")
            
            if correct_admin_count != total_count:
                print(f"❌ Some signups have incorrect admin email!")
                for signup in signups:
                    if signup.get('admin_email') != expected_admin:
                        print(f"   - {signup.get('email')} has admin_email: {signup.get('admin_email')}")
        else:
            print("📭 No newsletter signups found in database")
            
    except Exception as e:
        print(f"❌ Error checking database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_newsletter_signups())