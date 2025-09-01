#!/usr/bin/env python3
"""
Kioo Radio Admin Interface
Simple command-line tool for managing content
"""

import requests
import json
from datetime import datetime
import sys

BACKEND_URL = "https://kioo-mission.preview.emergentagent.com/api"

def print_header(title):
    print(f"\n{'='*50}")
    print(f"  {title}")
    print(f"{'='*50}")

def print_success(message):
    print(f"✅ {message}")

def print_error(message):
    print(f"❌ {message}")

def get_input(prompt, required=True):
    while True:
        value = input(f"{prompt}: ").strip()
        if value or not required:
            return value
        print("This field is required. Please enter a value.")

def select_option(prompt, options):
    print(f"\n{prompt}")
    for i, option in enumerate(options, 1):
        print(f"{i}. {option}")
    
    while True:
        try:
            choice = int(input("Select option (number): ")) - 1
            if 0 <= choice < len(options):
                return options[choice]
            print("Invalid choice. Please try again.")
        except ValueError:
            print("Please enter a valid number.")

def add_program():
    print_header("Add New Radio Program")
    
    title = get_input("Program Title")
    description = get_input("Description") 
    host = get_input("Host Name")
    
    language = select_option("Select Language:", ["english", "french", "kissi", "krio"])
    category = select_option("Select Category:", ["news", "music", "talk", "religious", "youth", "farming", "community"])
    day = select_option("Select Day:", ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
    
    start_time = get_input("Start Time (HH:MM, 24-hour format)")
    duration = int(get_input("Duration in minutes"))
    
    data = {
        "title": title,
        "description": description,
        "host": host,
        "language": language,
        "category": category, 
        "day_of_week": day,
        "start_time": start_time,
        "duration_minutes": duration
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/programs", json=data)
        if response.status_code == 200:
            print_success(f"Program '{title}' added successfully!")
            return True
        else:
            print_error(f"Failed to add program: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def add_news():
    print_header("Add News Update")
    
    title = get_input("News Title")
    excerpt = get_input("Brief Summary/Excerpt")
    author = get_input("Author Name")
    content = get_input("Full Article Content")
    
    data = {
        "title": title,
        "content": content,
        "excerpt": excerpt,
        "author": author,
        "is_published": True
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/news", json=data)
        if response.status_code == 200:
            print_success(f"News article '{title}' added successfully!")
            return True
        else:
            print_error(f"Failed to add news: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def add_impact_story():
    print_header("Add Impact Story")
    
    title = get_input("Story Title")
    content = get_input("Full Story Content")
    author_name = get_input("Author Name")
    author_location = get_input("Author Location (City, Country)")
    
    featured = input("Mark as featured? (y/n): ").lower().startswith('y')
    
    data = {
        "title": title,
        "content": content,
        "author_name": author_name,
        "author_location": author_location,
        "is_featured": featured
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/impact-stories", json=data)
        if response.status_code == 200:
            print_success(f"Impact story '{title}' added successfully!")
            return True
        else:
            print_error(f"Failed to add story: {response.text}")
            return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def view_programs():
    print_header("Current Radio Programs")
    
    try:
        response = requests.get(f"{BACKEND_URL}/programs")
        if response.status_code == 200:
            programs = response.json()
            if programs:
                for i, program in enumerate(programs, 1):
                    print(f"\n{i}. {program['title']}")
                    print(f"   Host: {program['host']}")
                    print(f"   Time: {program['day_of_week'].title()} at {program['start_time']}")
                    print(f"   Language: {program['language'].title()}")
                    print(f"   Category: {program['category'].title()}")
                    print(f"   Duration: {program['duration_minutes']} minutes")
            else:
                print("No programs found.")
        else:
            print_error(f"Failed to fetch programs: {response.text}")
    except Exception as e:
        print_error(f"Error: {str(e)}")

def view_donation_stats():
    print_header("Donation Statistics")
    
    try:
        response = requests.get(f"{BACKEND_URL}/donations/total")
        if response.status_code == 200:
            stats = response.json()
            print(f"💰 Total Amount Raised: ${stats['total_amount']:,.2f}")
            print(f"👥 Number of Donors: {stats['donor_count']}")
        else:
            print_error(f"Failed to fetch donation stats: {response.text}")
    except Exception as e:
        print_error(f"Error: {str(e)}")

def view_recent_news():
    print_header("Recent News Updates")
    
    try:
        response = requests.get(f"{BACKEND_URL}/news")
        if response.status_code == 200:
            news = response.json()
            if news:
                for i, article in enumerate(news[:5], 1):  # Show latest 5
                    date = datetime.fromisoformat(article['created_at'].replace('Z', '+00:00'))
                    print(f"\n{i}. {article['title']}")
                    print(f"   Author: {article['author']}")
                    print(f"   Date: {date.strftime('%B %d, %Y')}")
                    print(f"   Excerpt: {article['excerpt']}")
            else:
                print("No news articles found.")
        else:
            print_error(f"Failed to fetch news: {response.text}")
    except Exception as e:
        print_error(f"Error: {str(e)}")

def main_menu():
    while True:
        print_header("Kioo Radio Admin Interface")
        print("1. Add New Program")
        print("2. Add News Update")  
        print("3. Add Impact Story")
        print("4. View Programs")
        print("5. View Donation Stats")
        print("6. View Recent News")
        print("7. Exit")
        
        try:
            choice = int(input("\nSelect option (1-7): "))
            
            if choice == 1:
                add_program()
            elif choice == 2:
                add_news()
            elif choice == 3:
                add_impact_story()
            elif choice == 4:
                view_programs()
            elif choice == 5:
                view_donation_stats()
            elif choice == 6:
                view_recent_news()
            elif choice == 7:
                print("\n👋 Goodbye! Keep spreading the gift of good news!")
                break
            else:
                print("Invalid choice. Please select 1-7.")
                
        except ValueError:
            print("Please enter a valid number.")
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    print("🎙️ Welcome to Kioo Radio Admin Interface")
    print("📻 The Gift of Good News - 98.1 FM")
    
    # Test connection
    try:
        response = requests.get(f"{BACKEND_URL}/")
        if response.status_code == 200:
            print_success("Connected to Kioo Radio API")
        else:
            print_error("Cannot connect to API")
            sys.exit(1)
    except Exception as e:
        print_error(f"Connection failed: {str(e)}")
        sys.exit(1)
    
    main_menu()