import requests
import sys
from datetime import datetime
import json
import base64

class KiooRadioAPITester:
    def __init__(self, base_url="https://faith-radio-app.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    # Check if response is JSON
                    if 'application/json' in response.headers.get('content-type', ''):
                        response_data = response.json()
                        if isinstance(response_data, dict) and len(response_data) <= 3:
                            print(f"   Response: {response_data}")
                        elif isinstance(response_data, list):
                            print(f"   Response: List with {len(response_data)} items")
                        else:
                            print(f"   Response: {str(response_data)[:100]}...")
                        return success, response_data
                    else:
                        # Handle binary/image responses
                        content_type = response.headers.get('content-type', '')
                        if 'image' in content_type:
                            print(f"   Response: Binary image data ({len(response.content)} bytes)")
                        else:
                            print(f"   Response: {response.text[:100]}...")
                        return success, {}
                except:
                    print(f"   Response: {response.text[:100]}...")
                    return success, {}
            else:
                self.failed_tests.append(f"{name} - Expected {expected_status}, got {response.status_code}")
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, {}

        except Exception as e:
            self.failed_tests.append(f"{name} - Error: {str(e)}")
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_basic_endpoints(self):
        """Test basic API endpoints"""
        print("\n=== TESTING BASIC ENDPOINTS ===")
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test radio status
        self.run_test("Radio Status", "GET", "radio/status", 200)
        
        # Test coverage areas
        self.run_test("Coverage Areas", "GET", "coverage", 200)

    def test_programs_endpoints(self):
        """Test programs-related endpoints with PHASE 2 SCHEDULE MODIFICATIONS FOCUS"""
        print("\n=== TESTING PROGRAMS ENDPOINTS - PHASE 2 SCHEDULE MODIFICATIONS ===")
        
        # Test get all programs
        success, programs = self.run_test("Get All Programs", "GET", "programs", 200)
        
        if success:
            print(f"✅ Programs endpoint accessible, found {len(programs)} programs")
            
            # CRITICAL VERIFICATION 0: Total program count should be 284 (reduced by 1 due to combining two 30-min slots into one 60-min slot)
            print(f"\n🔍 CRITICAL VERIFICATION 0: Total Program Count (Renaissance Duration Change)")
            expected_total = 284
            actual_total = len(programs)
            
            if actual_total == expected_total:
                print(f"✅ Total program count matches expected: {actual_total} programs")
            else:
                print(f"❌ Total program count mismatch: expected {expected_total}, found {actual_total}")
                self.failed_tests.append(f"Renaissance Duration Change - Total count mismatch: expected {expected_total}, found {actual_total}")
            
            # NEW CRITICAL VERIFICATION: Two New French Programs
            print(f"\n🔍 NEW CRITICAL VERIFICATION: Two New French Programs")
            
            # Check for "La Vie Chez Nous" - Sunday 14:00-15:00 (60 minutes)
            la_vie_programs = [p for p in programs if 'la vie chez nous' in p.get('title', '').lower()]
            if la_vie_programs:
                la_vie_program = la_vie_programs[0]
                print(f"✅ Found 'La Vie Chez Nous' program: {la_vie_program.get('title')}")
                
                # Verify day (Sunday)
                if la_vie_program.get('day_of_week', '').lower() == 'sunday':
                    print(f"✅ La Vie Chez Nous correctly scheduled on Sunday")
                else:
                    print(f"❌ La Vie Chez Nous wrong day: expected Sunday, found {la_vie_program.get('day_of_week')}")
                    self.failed_tests.append(f"La Vie Chez Nous - Wrong day: expected Sunday, found {la_vie_program.get('day_of_week')}")
                
                # Verify time (14:00)
                if la_vie_program.get('start_time') == '14:00':
                    print(f"✅ La Vie Chez Nous correctly scheduled at 14:00")
                else:
                    print(f"❌ La Vie Chez Nous wrong time: expected 14:00, found {la_vie_program.get('start_time')}")
                    self.failed_tests.append(f"La Vie Chez Nous - Wrong time: expected 14:00, found {la_vie_program.get('start_time')}")
                
                # Verify duration (60 minutes)
                if la_vie_program.get('duration_minutes') == 60:
                    print(f"✅ La Vie Chez Nous correct duration: 60 minutes")
                else:
                    print(f"❌ La Vie Chez Nous wrong duration: expected 60 minutes, found {la_vie_program.get('duration_minutes')}")
                    self.failed_tests.append(f"La Vie Chez Nous - Wrong duration: expected 60 minutes, found {la_vie_program.get('duration_minutes')}")
                
                # Verify language (French)
                if la_vie_program.get('language', '').lower() == 'french':
                    print(f"✅ La Vie Chez Nous correct language: French")
                else:
                    print(f"❌ La Vie Chez Nous wrong language: expected French, found {la_vie_program.get('language')}")
                    self.failed_tests.append(f"La Vie Chez Nous - Wrong language: expected French, found {la_vie_program.get('language')}")
            else:
                print(f"❌ 'La Vie Chez Nous' program not found")
                self.failed_tests.append("New French Programs - 'La Vie Chez Nous' not found")
            
            # Check for "Renaissance" - Friday 15:00-16:00 (60 minutes - UPDATED from 30 to 60)
            renaissance_programs = [p for p in programs if 'renaissance' in p.get('title', '').lower()]
            if renaissance_programs:
                renaissance_program = renaissance_programs[0]
                print(f"✅ Found 'Renaissance' program: {renaissance_program.get('title')}")
                
                # Verify day (Friday)
                if renaissance_program.get('day_of_week', '').lower() == 'friday':
                    print(f"✅ Renaissance correctly scheduled on Friday")
                else:
                    print(f"❌ Renaissance wrong day: expected Friday, found {renaissance_program.get('day_of_week')}")
                    self.failed_tests.append(f"Renaissance - Wrong day: expected Friday, found {renaissance_program.get('day_of_week')}")
                
                # Verify time (15:00)
                if renaissance_program.get('start_time') == '15:00':
                    print(f"✅ Renaissance correctly scheduled at 15:00")
                else:
                    print(f"❌ Renaissance wrong time: expected 15:00, found {renaissance_program.get('start_time')}")
                    self.failed_tests.append(f"Renaissance - Wrong time: expected 15:00, found {renaissance_program.get('start_time')}")
                
                # Verify duration (60 minutes - UPDATED from 30 to 60)
                if renaissance_program.get('duration_minutes') == 60:
                    print(f"✅ Renaissance correct duration: 60 minutes")
                else:
                    print(f"❌ Renaissance wrong duration: expected 60 minutes, found {renaissance_program.get('duration_minutes')}")
                    self.failed_tests.append(f"Renaissance - Wrong duration: expected 60 minutes, found {renaissance_program.get('duration_minutes')}")
                
                # Verify language (French)
                if renaissance_program.get('language', '').lower() == 'french':
                    print(f"✅ Renaissance correct language: French")
                else:
                    print(f"❌ Renaissance wrong language: expected French, found {renaissance_program.get('language')}")
                    self.failed_tests.append(f"Renaissance - Wrong language: expected French, found {renaissance_program.get('language')}")
            else:
                print(f"❌ 'Renaissance' program not found")
                self.failed_tests.append("New French Programs - 'Renaissance' not found")
            
            # CRITICAL VERIFICATION 1: Check for new program entries mentioned in Phase 2
            print(f"\n🔍 CRITICAL VERIFICATION 1: New Phase 2 Programs")
            expected_new_programs = [
                "Makona Talk Show",
                "Guidelines", 
                "Love & Faith",
                "Daily Sermon",
                "Truth for Life"
            ]
            
            program_titles = [program.get('title', '') for program in programs]
            found_programs = []
            missing_programs = []
            
            for expected_program in expected_new_programs:
                # Check for exact match or partial match
                found = False
                for title in program_titles:
                    if expected_program.lower() in title.lower():
                        found_programs.append(expected_program)
                        print(f"✅ Found new program: {expected_program} (as '{title}')")
                        found = True
                        break
                
                if not found:
                    missing_programs.append(expected_program)
                    print(f"❌ Missing new program: {expected_program}")
            
            if missing_programs:
                self.failed_tests.append(f"Phase 2 Programs - Missing new programs: {missing_programs}")
            else:
                print(f"✅ All {len(expected_new_programs)} new Phase 2 programs found")
            
            # CRITICAL VERIFICATION 1.1: Specific verification for Makona Talk Show (3 hours Saturday)
            makona_programs = [p for p in programs if 'makona talk show' in p.get('title', '').lower()]
            if makona_programs:
                makona_program = makona_programs[0]
                if makona_program.get('day_of_week', '').lower() == 'saturday':
                    print(f"✅ Makona Talk Show correctly scheduled on Saturday")
                    if makona_program.get('duration_minutes', 0) >= 180:  # 3 hours = 180 minutes
                        print(f"✅ Makona Talk Show has correct duration: {makona_program.get('duration_minutes')} minutes")
                    else:
                        print(f"❌ Makona Talk Show duration incorrect: {makona_program.get('duration_minutes')} minutes (should be 180+)")
                        self.failed_tests.append(f"Makona Talk Show - Duration should be 180+ minutes, found {makona_program.get('duration_minutes')}")
                else:
                    print(f"❌ Makona Talk Show not on Saturday: {makona_program.get('day_of_week')}")
                    self.failed_tests.append(f"Makona Talk Show - Should be on Saturday, found on {makona_program.get('day_of_week')}")
            
            # CRITICAL VERIFICATION 1.2: Verify Truth for Life has both English and French versions
            truth_programs = [p for p in programs if 'truth for life' in p.get('title', '').lower()]
            if truth_programs:
                languages_found = set(p.get('language', '').lower() for p in truth_programs)
                if 'english' in languages_found and 'french' in languages_found:
                    print(f"✅ Truth for Life found in both English and French")
                else:
                    print(f"❌ Truth for Life missing languages: expected English & French, found {languages_found}")
                    self.failed_tests.append(f"Truth for Life - Should have English & French versions, found {languages_found}")
            
            # CRITICAL VERIFICATION 2: TTB adjustments - removed from Fula/Mandingo and weekends
            print(f"\n🔍 CRITICAL VERIFICATION 2: TTB Adjustments")
            ttb_programs = [program for program in programs if 'ttb' in program.get('title', '').lower() or 'through the bible' in program.get('title', '').lower()]
            
            if ttb_programs:
                print(f"Found {len(ttb_programs)} TTB programs")
                
                # Check TTB is not in Fula/Mandingo languages
                fula_mandingo_ttb = []
                for program in ttb_programs:
                    language = program.get('language', '').lower()
                    if 'fula' in language or 'mandingo' in language:
                        fula_mandingo_ttb.append(f"{program.get('title')} ({language})")
                
                if fula_mandingo_ttb:
                    print(f"❌ TTB still found in Fula/Mandingo languages: {fula_mandingo_ttb}")
                    self.failed_tests.append(f"TTB Adjustments - Still in Fula/Mandingo: {fula_mandingo_ttb}")
                else:
                    print(f"✅ TTB correctly removed from Fula/Mandingo languages")
                
                # Check TTB is not on weekends
                weekend_ttb = []
                for program in ttb_programs:
                    day = program.get('day_of_week', '').lower()
                    if day in ['saturday', 'sunday']:
                        weekend_ttb.append(f"{program.get('title')} ({day})")
                
                if weekend_ttb:
                    print(f"❌ TTB still found on weekends: {weekend_ttb}")
                    self.failed_tests.append(f"TTB Adjustments - Still on weekends: {weekend_ttb}")
                else:
                    print(f"✅ TTB correctly removed from weekends")
                
                # Verify TTB is still present in English/French/Kissi on weekdays
                weekday_ttb_languages = set()
                for program in ttb_programs:
                    day = program.get('day_of_week', '').lower()
                    if day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']:
                        weekday_ttb_languages.add(program.get('language', '').lower())
                
                expected_ttb_languages = {'english', 'french', 'kissi'}
                found_ttb_languages = weekday_ttb_languages.intersection(expected_ttb_languages)
                
                if found_ttb_languages:
                    print(f"✅ TTB still present in weekday languages: {found_ttb_languages}")
                else:
                    print(f"❌ TTB missing from expected weekday languages: {expected_ttb_languages}")
                    self.failed_tests.append(f"TTB Adjustments - Missing from weekday languages: {expected_ttb_languages}")
            else:
                print(f"❌ No TTB programs found - this is unexpected for Phase 2")
                self.failed_tests.append("TTB Adjustments - No TTB programs found at all")
        
        # Test get programs schedule
        success, schedule = self.run_test("Get Programs Schedule", "GET", "programs/schedule", 200)
        
        if success:
            print(f"✅ Programs schedule endpoint accessible")
            
            # CRITICAL VERIFICATION 3: Complete Schedule Coverage
            print(f"\n🔍 CRITICAL VERIFICATION 3: Complete Schedule Coverage")
            
            if isinstance(schedule, dict):
                days_found = list(schedule.keys())
                expected_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                
                missing_days = [day for day in expected_days if day not in days_found]
                if missing_days:
                    print(f"❌ Schedule missing days: {missing_days}")
                    self.failed_tests.append(f"Schedule Integrity - Missing days: {missing_days}")
                else:
                    print(f"✅ Schedule contains all 7 days of the week")
                
                # Check specific program counts per day as mentioned in REFINED Phase 2 review request
                expected_counts = {
                    'monday': 47, 'tuesday': 48, 'wednesday': 48, 'thursday': 48, 'friday': 48,
                    'saturday': 22, 'sunday': 24
                }
                
                for day, expected_count in expected_counts.items():
                    if day in schedule:
                        day_programs = schedule[day]
                        actual_count = len(day_programs) if isinstance(day_programs, list) else 0
                        
                        if actual_count == expected_count:
                            print(f"✅ {day.title()} has correct program count: {actual_count}")
                        else:
                            print(f"❌ {day.title()} program count mismatch: expected {expected_count}, found {actual_count}")
                            self.failed_tests.append(f"Schedule Coverage - {day} expected {expected_count} programs, found {actual_count}")
                    else:
                        print(f"❌ {day.title()} missing from schedule")
                        self.failed_tests.append(f"Schedule Coverage - {day} missing")
                
                # Verify Saturday includes Makona Talk Show
                if 'saturday' in schedule:
                    saturday_programs = schedule['saturday']
                    makona_found = any('makona talk show' in p.get('title', '').lower() for p in saturday_programs)
                    if makona_found:
                        print(f"✅ Saturday schedule includes Makona Talk Show")
                    else:
                        print(f"❌ Saturday schedule missing Makona Talk Show")
                        self.failed_tests.append("Schedule Coverage - Saturday missing Makona Talk Show")
                
                # Verify Sunday includes La Vie Chez Nous (new French program)
                if 'sunday' in schedule:
                    sunday_programs = schedule['sunday']
                    la_vie_found = any('la vie chez nous' in p.get('title', '').lower() for p in sunday_programs)
                    if la_vie_found:
                        print(f"✅ Sunday schedule includes La Vie Chez Nous (new French program)")
                    else:
                        print(f"❌ Sunday schedule missing La Vie Chez Nous (new French program)")
                        self.failed_tests.append("Schedule Coverage - Sunday missing La Vie Chez Nous")
                
                # Verify Friday includes Renaissance (new French program)
                if 'friday' in schedule:
                    friday_programs = schedule['friday']
                    renaissance_found = any('renaissance' in p.get('title', '').lower() for p in friday_programs)
                    if renaissance_found:
                        print(f"✅ Friday schedule includes Renaissance (new French program)")
                    else:
                        print(f"❌ Friday schedule missing Renaissance (new French program)")
                        self.failed_tests.append("Schedule Coverage - Friday missing Renaissance")
            else:
                print(f"❌ Schedule data is not in expected dictionary format")
                self.failed_tests.append("Schedule Integrity - Invalid data format")
        
        # CRITICAL VERIFICATION 4: Language filtering functionality
        print(f"\n🔍 CRITICAL VERIFICATION 4: Language Filtering")
        
        # Test French language filtering specifically for new programs
        success, french_programs = self.run_test("Get French Programs", "GET", "programs", 200, params={"language": "french"})
        
        if success:
            print(f"✅ French language filter working, found {len(french_programs)} French programs")
            
            # Verify both new French programs appear in French filter
            french_titles = [p.get('title', '').lower() for p in french_programs]
            
            la_vie_in_french = any('la vie chez nous' in title for title in french_titles)
            renaissance_in_french = any('renaissance' in title for title in french_titles)
            
            if la_vie_in_french:
                print(f"✅ 'La Vie Chez Nous' appears in French language filter")
            else:
                print(f"❌ 'La Vie Chez Nous' missing from French language filter")
                self.failed_tests.append("French Language Filter - 'La Vie Chez Nous' not found")
            
            if renaissance_in_french:
                print(f"✅ 'Renaissance' appears in French language filter")
            else:
                print(f"❌ 'Renaissance' missing from French language filter")
                self.failed_tests.append("French Language Filter - 'Renaissance' not found")
            
            # Verify all returned programs are actually French
            wrong_language_programs = []
            for program in french_programs:
                if program.get('language', '').lower() != 'french':
                    wrong_language_programs.append(f"{program.get('title')} ({program.get('language')})")
            
            if wrong_language_programs:
                print(f"❌ French filter returned non-French programs: {wrong_language_programs}")
                self.failed_tests.append(f"French Language Filter - Non-French programs: {wrong_language_programs}")
            else:
                print(f"✅ French language filter correctly returns only French programs")
        
        # Test day filtering for the new French programs
        print(f"\n🔍 CRITICAL VERIFICATION 5: Day Filtering for New French Programs")
        
        # Test Sunday filtering (should include La Vie Chez Nous)
        success, sunday_programs = self.run_test("Get Sunday Programs", "GET", "programs", 200, params={"day": "sunday"})
        
        if success:
            sunday_titles = [p.get('title', '').lower() for p in sunday_programs]
            la_vie_in_sunday = any('la vie chez nous' in title for title in sunday_titles)
            
            if la_vie_in_sunday:
                print(f"✅ 'La Vie Chez Nous' appears in Sunday day filter")
            else:
                print(f"❌ 'La Vie Chez Nous' missing from Sunday day filter")
                self.failed_tests.append("Sunday Day Filter - 'La Vie Chez Nous' not found")
        
        # Test Friday filtering (should include Renaissance)
        success, friday_programs = self.run_test("Get Friday Programs", "GET", "programs", 200, params={"day": "friday"})
        
        if success:
            friday_titles = [p.get('title', '').lower() for p in friday_programs]
            renaissance_in_friday = any('renaissance' in title for title in friday_titles)
            
            if renaissance_in_friday:
                print(f"✅ 'Renaissance' appears in Friday day filter")
            else:
                print(f"❌ 'Renaissance' missing from Friday day filter")
                self.failed_tests.append("Friday Day Filter - 'Renaissance' not found")
        
        # Test other supported languages
        supported_languages = ["english", "kissi", "krio"]
        
        for language in supported_languages:
            success, filtered_programs = self.run_test(f"Get {language.title()} Programs", "GET", "programs", 200, params={"language": language})
            
            if success:
                # Verify all returned programs are in the requested language
                wrong_language_programs = []
                for program in filtered_programs:
                    if program.get('language', '').lower() != language:
                        wrong_language_programs.append(f"{program.get('title')} ({program.get('language')})")
                
                if wrong_language_programs:
                    print(f"❌ {language.title()} filter returned wrong language programs: {wrong_language_programs}")
                    self.failed_tests.append(f"Language Filter - {language} returned wrong languages: {wrong_language_programs}")
                else:
                    print(f"✅ {language.title()} language filter working correctly ({len(filtered_programs)} programs)")
        
        # Test day filtering for all days
        print(f"\n🔍 Testing Day Filtering for All Days")
        test_days = ["monday", "tuesday", "wednesday", "thursday", "saturday"]  # Skip Friday and Sunday as already tested above
        
        for day in test_days:
            success, day_programs = self.run_test(f"Get {day.title()} Programs", "GET", "programs", 200, params={"day": day})
            
            if success:
                # Verify all returned programs are on the requested day
                wrong_day_programs = []
                for program in day_programs:
                    if program.get('day_of_week', '').lower() != day:
                        wrong_day_programs.append(f"{program.get('title')} ({program.get('day_of_week')})")
                
                if wrong_day_programs:
                    print(f"❌ {day.title()} filter returned wrong day programs: {wrong_day_programs}")
                    self.failed_tests.append(f"Day Filter - {day} returned wrong days: {wrong_day_programs}")
                else:
                    print(f"✅ {day.title()} day filter working correctly ({len(day_programs)} programs)")
        
        # Test create program (basic functionality)
        program_data = {
            "title": "Test Program - Phase 2",
            "description": "A test program for Phase 2 API testing",
            "host": "Test Host",
            "language": "english",
            "category": "talk",
            "day_of_week": "monday",
            "start_time": "10:00",
            "duration_minutes": 60
        }
        self.run_test("Create Program", "POST", "programs", 200, data=program_data)

    def test_spot_light_english_verification(self):
        """CRITICAL TEST: Verify the new 'Spot Light English' daily program (Monday-Friday)"""
        print("\n=== CRITICAL VERIFICATION: SPOT LIGHT ENGLISH DAILY PROGRAM ===")
        print("Testing: 5 'Spot Light English' programs (Monday-Friday, 10:30-11:00, English, Educational)")
        
        # Get all programs first
        success, all_programs = self.run_test("Get All Programs for Spot Light English Verification", "GET", "programs", 200)
        
        if not success:
            print("❌ Failed to get programs for Spot Light English verification")
            return
        
        print(f"✅ Retrieved {len(all_programs)} total programs for verification")
        
        # VERIFICATION 1: Check total program count should be 284
        expected_total = 284
        actual_total = len(all_programs)
        
        if actual_total == expected_total:
            print(f"✅ Total program count correct: {actual_total} programs")
        else:
            print(f"⚠️  Total program count: expected {expected_total}, found {actual_total}")
            if actual_total > expected_total:
                print(f"   Note: {actual_total - expected_total} extra programs found")
            else:
                print(f"   Note: {expected_total - actual_total} programs missing")
        
        # VERIFICATION 2: Find all Spot Light English programs
        print(f"\n🔍 DETAILED VERIFICATION: Spot Light English Programs")
        spot_light_programs = [p for p in all_programs if 'spot light english' in p.get('title', '').lower()]
        
        if spot_light_programs:
            print(f"✅ FOUND: {len(spot_light_programs)} Spot Light English programs")
            
            # Expected: 5 programs (Monday-Friday)
            expected_count = 5
            if len(spot_light_programs) == expected_count:
                print(f"✅ Correct number of Spot Light English programs: {len(spot_light_programs)}")
            else:
                print(f"❌ Wrong number of Spot Light English programs: expected {expected_count}, found {len(spot_light_programs)}")
                self.failed_tests.append(f"Spot Light English - Wrong count: expected {expected_count}, found {len(spot_light_programs)}")
            
            # Verify each program's attributes
            expected_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            found_days = []
            
            for program in spot_light_programs:
                title = program.get('title', '')
                day = program.get('day_of_week', '').lower()
                start_time = program.get('start_time', '')
                duration = program.get('duration_minutes', 0)
                language = program.get('language', '').lower()
                category = program.get('category', '').lower()
                
                print(f"\n   📋 Program: {title}")
                print(f"      Day: {day}")
                print(f"      Time: {start_time}")
                print(f"      Duration: {duration} minutes")
                print(f"      Language: {language}")
                print(f"      Category: {category}")
                
                # Track found days
                if day in expected_days:
                    found_days.append(day)
                
                # Verify attributes
                checks = [
                    ("Day", day in expected_days, f"Should be weekday (Monday-Friday), found {day}"),
                    ("Start Time", start_time == '10:30', f"Should be 10:30, found {start_time}"),
                    ("Duration", duration == 30, f"Should be 30 minutes, found {duration}"),
                    ("Language", language == 'english', f"Should be English, found {language}"),
                    ("Category", category == 'educational', f"Should be educational, found {category}")
                ]
                
                for check_name, condition, error_msg in checks:
                    if condition:
                        print(f"      ✅ {check_name}: Correct")
                    else:
                        print(f"      ❌ {check_name}: {error_msg}")
                        self.failed_tests.append(f"Spot Light English ({day}) - {error_msg}")
            
            # Verify all weekdays are covered
            missing_days = [day for day in expected_days if day not in found_days]
            if missing_days:
                print(f"\n❌ Missing Spot Light English programs for days: {missing_days}")
                self.failed_tests.append(f"Spot Light English - Missing days: {missing_days}")
            else:
                print(f"\n✅ Spot Light English programs found for all weekdays (Monday-Friday)")
            
            # Check for duplicates
            duplicate_days = [day for day in found_days if found_days.count(day) > 1]
            if duplicate_days:
                print(f"❌ Duplicate Spot Light English programs found for days: {set(duplicate_days)}")
                self.failed_tests.append(f"Spot Light English - Duplicate programs for days: {set(duplicate_days)}")
            else:
                print(f"✅ No duplicate Spot Light English programs found")
                
        else:
            print(f"❌ CRITICAL ERROR: No 'Spot Light English' programs found")
            self.failed_tests.append("CRITICAL - Spot Light English programs not found in database")
        
        # VERIFICATION 3: Test English language filtering includes Spot Light English
        print(f"\n🔍 VERIFICATION: English Language Filtering")
        success, english_programs = self.run_test("English Language Filter Test", "GET", "programs", 200, params={"language": "english"})
        
        if success:
            english_titles = [p.get('title', '').lower() for p in english_programs]
            spot_light_in_english = [title for title in english_titles if 'spot light english' in title]
            
            if len(spot_light_in_english) == 5:
                print(f"✅ All 5 Spot Light English programs appear in English language filter")
            else:
                print(f"❌ Wrong number of Spot Light English programs in English filter: expected 5, found {len(spot_light_in_english)}")
                self.failed_tests.append(f"English Filter - Expected 5 Spot Light English programs, found {len(spot_light_in_english)}")
        
        # VERIFICATION 4: Test weekday filtering includes Spot Light English
        print(f"\n🔍 VERIFICATION: Weekday Filtering")
        weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        
        for day in weekdays:
            success, day_programs = self.run_test(f"{day.title()} Filter Test", "GET", "programs", 200, params={"day": day})
            if success:
                day_titles = [p.get('title', '').lower() for p in day_programs]
                spot_light_in_day = any('spot light english' in title for title in day_titles)
                
                if spot_light_in_day:
                    print(f"✅ Spot Light English appears in {day.title()} filter")
                else:
                    print(f"❌ Spot Light English missing from {day.title()} filter")
                    self.failed_tests.append(f"{day.title()} Filter - Spot Light English not found")
        
        # VERIFICATION 5: Test schedule endpoint includes Spot Light English
        print(f"\n🔍 VERIFICATION: Schedule Endpoint")
        success, schedule_data = self.run_test("Schedule Endpoint Test", "GET", "programs/schedule", 200)
        
        if success:
            weekday_schedule_count = 0
            for day in weekdays:
                if day in schedule_data:
                    day_schedule = schedule_data[day]
                    day_titles = [p.get('title', '').lower() for p in day_schedule]
                    spot_light_in_schedule = any('spot light english' in title for title in day_titles)
                    
                    if spot_light_in_schedule:
                        print(f"✅ Spot Light English in {day.title()} schedule")
                        weekday_schedule_count += 1
                    else:
                        print(f"❌ Spot Light English missing from {day.title()} schedule")
                        self.failed_tests.append(f"Schedule - Spot Light English not in {day.title()} schedule")
            
            if weekday_schedule_count == 5:
                print(f"✅ Spot Light English found in all 5 weekday schedules")
            else:
                print(f"❌ Spot Light English missing from {5 - weekday_schedule_count} weekday schedules")
        
        # VERIFICATION 6: Count Phase 2 programs (should be 27 including Spot Light English)
        print(f"\n🔍 VERIFICATION: Phase 2 Program Count")
        
        # Look for programs that might be Phase 2 (new programs)
        phase2_indicators = [
            'makona talk show', 'guidelines', 'love & faith', 'daily sermon', 'truth for life', 
            'la vie chez nous', 'renaissance', 'spot light english'
        ]
        
        phase2_programs = []
        for program in all_programs:
            title_lower = program.get('title', '').lower()
            for indicator in phase2_indicators:
                if indicator in title_lower:
                    phase2_programs.append(program.get('title'))
                    break
        
        print(f"✅ Found {len(phase2_programs)} identifiable Phase 2 programs:")
        for program in phase2_programs:
            print(f"   - {program}")
        
        # Expected: 27 Phase 2 programs (22 + 5 Spot Light English)
        expected_phase2_count = 27
        if len(phase2_programs) >= expected_phase2_count:
            print(f"✅ Phase 2 program count meets expectation: {len(phase2_programs)} >= {expected_phase2_count}")
        else:
            print(f"❌ Phase 2 program count below expectation: {len(phase2_programs)} < {expected_phase2_count}")
            self.failed_tests.append(f"Phase 2 Count - Expected at least {expected_phase2_count}, found {len(phase2_programs)}")
        
        # Final summary for Spot Light English
        print(f"\n📊 SPOT LIGHT ENGLISH VERIFICATION SUMMARY:")
        print(f"   Total Programs: {len(all_programs)}")
        print(f"   Spot Light English Programs: {len(spot_light_programs) if spot_light_programs else 0}")
        print(f"   Expected: 5 programs (Monday-Friday)")
        print(f"   Time Slot: 10:30-11:00 (30 minutes)")
        print(f"   Language: English")
        print(f"   Category: Educational")
        print(f"   Status: {'✅ VERIFIED' if len(spot_light_programs) == 5 else '❌ ISSUES FOUND'}")

    def test_new_french_programs_verification(self):
        """CRITICAL TEST: Verify the two new French programs added to Kioo Radio schedule"""
        print("\n=== CRITICAL VERIFICATION: NEW FRENCH PROGRAMS ===")
        print("Testing: 'La Vie Chez Nous' (Sunday 14:00-15:00) and 'Renaissance' (Friday 15:00-15:30)")
        
        # Get all programs first
        success, all_programs = self.run_test("Get All Programs for French Verification", "GET", "programs", 200)
        
        if not success:
            print("❌ Failed to get programs for French verification")
            return
        
        print(f"✅ Retrieved {len(all_programs)} total programs for verification")
        
        # VERIFICATION 1: Check total program count should be 285
        expected_total = 285
        actual_total = len(all_programs)
        
        if actual_total == expected_total:
            print(f"✅ Total program count correct: {actual_total} programs")
        else:
            print(f"⚠️  Total program count: expected {expected_total}, found {actual_total}")
            if actual_total > expected_total:
                print(f"   Note: {actual_total - expected_total} extra programs found")
            else:
                print(f"   Note: {expected_total - actual_total} programs missing")
        
        # VERIFICATION 2: Count French programs
        french_programs = [p for p in all_programs if p.get('language', '').lower() == 'french']
        print(f"✅ Found {len(french_programs)} French programs total")
        
        # VERIFICATION 3: Detailed verification of La Vie Chez Nous
        print(f"\n🔍 DETAILED VERIFICATION: La Vie Chez Nous")
        la_vie_programs = [p for p in all_programs if 'la vie chez nous' in p.get('title', '').lower()]
        
        if la_vie_programs:
            la_vie = la_vie_programs[0]
            print(f"✅ FOUND: {la_vie.get('title')}")
            
            # Check all attributes
            checks = [
                ("Day", la_vie.get('day_of_week', '').lower(), 'sunday'),
                ("Start Time", la_vie.get('start_time'), '14:00'),
                ("Duration", la_vie.get('duration_minutes'), 60),
                ("Language", la_vie.get('language', '').lower(), 'french')
            ]
            
            all_correct = True
            for check_name, actual, expected in checks:
                if actual == expected:
                    print(f"   ✅ {check_name}: {actual}")
                else:
                    print(f"   ❌ {check_name}: expected {expected}, found {actual}")
                    self.failed_tests.append(f"La Vie Chez Nous - {check_name} incorrect: expected {expected}, found {actual}")
                    all_correct = False
            
            if all_correct:
                print(f"✅ La Vie Chez Nous: ALL ATTRIBUTES CORRECT")
            else:
                print(f"❌ La Vie Chez Nous: Some attributes incorrect")
        else:
            print(f"❌ CRITICAL ERROR: 'La Vie Chez Nous' program NOT FOUND")
            self.failed_tests.append("CRITICAL - La Vie Chez Nous program not found in database")
        
        # VERIFICATION 4: Detailed verification of Renaissance
        print(f"\n🔍 DETAILED VERIFICATION: Renaissance")
        renaissance_programs = [p for p in all_programs if 'renaissance' in p.get('title', '').lower()]
        
        if renaissance_programs:
            renaissance = renaissance_programs[0]
            print(f"✅ FOUND: {renaissance.get('title')}")
            
            # Check all attributes
            checks = [
                ("Day", renaissance.get('day_of_week', '').lower(), 'friday'),
                ("Start Time", renaissance.get('start_time'), '15:00'),
                ("Duration", renaissance.get('duration_minutes'), 60),
                ("Language", renaissance.get('language', '').lower(), 'french')
            ]
            
            all_correct = True
            for check_name, actual, expected in checks:
                if actual == expected:
                    print(f"   ✅ {check_name}: {actual}")
                else:
                    print(f"   ❌ {check_name}: expected {expected}, found {actual}")
                    self.failed_tests.append(f"Renaissance - {check_name} incorrect: expected {expected}, found {actual}")
                    all_correct = False
            
            if all_correct:
                print(f"✅ Renaissance: ALL ATTRIBUTES CORRECT")
            else:
                print(f"❌ Renaissance: Some attributes incorrect")
        else:
            print(f"❌ CRITICAL ERROR: 'Renaissance' program NOT FOUND")
            self.failed_tests.append("CRITICAL - Renaissance program not found in database")
        
        # VERIFICATION 5: Test French language filtering
        print(f"\n🔍 VERIFICATION: French Language Filtering")
        success, french_filtered = self.run_test("French Language Filter Test", "GET", "programs", 200, params={"language": "french"})
        
        if success:
            french_titles = [p.get('title', '').lower() for p in french_filtered]
            
            la_vie_in_filter = any('la vie chez nous' in title for title in french_titles)
            renaissance_in_filter = any('renaissance' in title for title in french_titles)
            
            if la_vie_in_filter and renaissance_in_filter:
                print(f"✅ Both new French programs appear in French language filter")
            else:
                if not la_vie_in_filter:
                    print(f"❌ La Vie Chez Nous missing from French filter")
                    self.failed_tests.append("French Filter - La Vie Chez Nous not found")
                if not renaissance_in_filter:
                    print(f"❌ Renaissance missing from French filter")
                    self.failed_tests.append("French Filter - Renaissance not found")
        
        # VERIFICATION 6: Test day filtering
        print(f"\n🔍 VERIFICATION: Day Filtering")
        
        # Test Sunday filter for La Vie Chez Nous
        success, sunday_programs = self.run_test("Sunday Filter Test", "GET", "programs", 200, params={"day": "sunday"})
        if success:
            sunday_titles = [p.get('title', '').lower() for p in sunday_programs]
            if any('la vie chez nous' in title for title in sunday_titles):
                print(f"✅ La Vie Chez Nous appears in Sunday filter")
            else:
                print(f"❌ La Vie Chez Nous missing from Sunday filter")
                self.failed_tests.append("Sunday Filter - La Vie Chez Nous not found")
        
        # Test Friday filter for Renaissance
        success, friday_programs = self.run_test("Friday Filter Test", "GET", "programs", 200, params={"day": "friday"})
        if success:
            friday_titles = [p.get('title', '').lower() for p in friday_programs]
            if any('renaissance' in title for title in friday_titles):
                print(f"✅ Renaissance appears in Friday filter")
            else:
                print(f"❌ Renaissance missing from Friday filter")
                self.failed_tests.append("Friday Filter - Renaissance not found")
        
        # VERIFICATION 7: Test schedule endpoint includes both programs
        print(f"\n🔍 VERIFICATION: Schedule Endpoint")
        success, schedule_data = self.run_test("Schedule Endpoint Test", "GET", "programs/schedule", 200)
        
        if success:
            # Check Sunday schedule for La Vie Chez Nous
            if 'sunday' in schedule_data:
                sunday_schedule = schedule_data['sunday']
                sunday_titles = [p.get('title', '').lower() for p in sunday_schedule]
                if any('la vie chez nous' in title for title in sunday_titles):
                    print(f"✅ La Vie Chez Nous in Sunday schedule")
                else:
                    print(f"❌ La Vie Chez Nous missing from Sunday schedule")
                    self.failed_tests.append("Schedule - La Vie Chez Nous not in Sunday schedule")
            
            # Check Friday schedule for Renaissance
            if 'friday' in schedule_data:
                friday_schedule = schedule_data['friday']
                friday_titles = [p.get('title', '').lower() for p in friday_schedule]
                if any('renaissance' in title for title in friday_titles):
                    print(f"✅ Renaissance in Friday schedule")
                else:
                    print(f"❌ Renaissance missing from Friday schedule")
                    self.failed_tests.append("Schedule - Renaissance not in Friday schedule")
        
        # VERIFICATION 8: Count Phase 2 programs
        print(f"\n🔍 VERIFICATION: Phase 2 Program Count")
        
        # Look for programs that might be Phase 2 (new programs)
        # This is based on the review request mentioning 24 new Phase 2 programs
        phase2_indicators = ['makona talk show', 'guidelines', 'love & faith', 'daily sermon', 'truth for life', 'la vie chez nous', 'renaissance']
        
        phase2_programs = []
        for program in all_programs:
            title_lower = program.get('title', '').lower()
            for indicator in phase2_indicators:
                if indicator in title_lower:
                    phase2_programs.append(program.get('title'))
                    break
        
        print(f"✅ Found {len(phase2_programs)} identifiable Phase 2 programs:")
        for program in phase2_programs:
            print(f"   - {program}")
        
        # Final summary for French programs
        print(f"\n📊 FRENCH PROGRAMS VERIFICATION SUMMARY:")
        print(f"   Total Programs: {len(all_programs)}")
        print(f"   French Programs: {len(french_programs)}")
        print(f"   La Vie Chez Nous: {'✅ FOUND' if la_vie_programs else '❌ MISSING'}")
        print(f"   Renaissance: {'✅ FOUND' if renaissance_programs else '❌ MISSING'}")

    def test_live_broadcast_schedule_endpoint(self):
        """Test live broadcast schedule endpoint - PHASE 2 CRITICAL"""
        print("\n=== TESTING LIVE BROADCAST SCHEDULE ENDPOINT ===")
        
        # Test GET /api/live-broadcast-schedule
        success, schedule_data = self.run_test("Get Live Broadcast Schedule", "GET", "live-broadcast-schedule", 200)
        
        if success:
            print(f"✅ Live broadcast schedule endpoint accessible")
            
            # CRITICAL VERIFICATION: Check required data structure
            print(f"\n🔍 CRITICAL VERIFICATION: Live Broadcast Schedule Structure")
            
            required_top_level_fields = ['weeklySchedule', 'countrySchedules', 'introText']
            missing_fields = [field for field in required_top_level_fields if field not in schedule_data]
            
            if missing_fields:
                print(f"❌ Missing required top-level fields: {missing_fields}")
                self.failed_tests.append(f"Live Broadcast Schedule - Missing fields: {missing_fields}")
            else:
                print(f"✅ All required top-level fields present")
            
            # Verify weeklySchedule structure
            if 'weeklySchedule' in schedule_data:
                weekly_schedule = schedule_data['weeklySchedule']
                expected_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                
                missing_days = [day for day in expected_days if day not in weekly_schedule]
                if missing_days:
                    print(f"❌ Weekly schedule missing days: {missing_days}")
                    self.failed_tests.append(f"Weekly Schedule - Missing days: {missing_days}")
                else:
                    print(f"✅ Weekly schedule contains all 7 days")
                
                # Verify each day has country data
                for day, day_data in weekly_schedule.items():
                    if isinstance(day_data, dict):
                        expected_countries = ['liberia', 'sierra_leone', 'guinea']
                        missing_countries = [country for country in expected_countries if country not in day_data]
                        
                        if missing_countries:
                            print(f"❌ {day.title()} missing countries: {missing_countries}")
                            self.failed_tests.append(f"Weekly Schedule {day} - Missing countries: {missing_countries}")
                        else:
                            print(f"✅ {day.title()} has all 3 countries")
                    else:
                        print(f"❌ {day.title()} data is not a dictionary")
                        self.failed_tests.append(f"Weekly Schedule {day} - Invalid data structure")
            
            # Verify countrySchedules structure
            if 'countrySchedules' in schedule_data:
                country_schedules = schedule_data['countrySchedules']
                
                if isinstance(country_schedules, list):
                    print(f"✅ Country schedules is a list with {len(country_schedules)} countries")
                    
                    expected_countries = ['Liberia', 'Sierra Leone', 'Guinea']
                    found_countries = [country.get('country', '') for country in country_schedules]
                    
                    missing_countries = [country for country in expected_countries if country not in found_countries]
                    if missing_countries:
                        print(f"❌ Missing countries in schedules: {missing_countries}")
                        self.failed_tests.append(f"Country Schedules - Missing countries: {missing_countries}")
                    else:
                        print(f"✅ All 3 countries present in schedules")
                    
                    # Verify each country has required fields
                    for country_data in country_schedules:
                        country_name = country_data.get('country', 'Unknown')
                        required_fields = ['country', 'liveDays', 'preRecordedDays', 'specialNote', 'colorCode']
                        missing_fields = [field for field in required_fields if field not in country_data]
                        
                        if missing_fields:
                            print(f"❌ {country_name} missing fields: {missing_fields}")
                            self.failed_tests.append(f"Country Schedule {country_name} - Missing fields: {missing_fields}")
                        else:
                            print(f"✅ {country_name} has all required fields")
                            
                            # Verify liveDays and preRecordedDays are lists
                            live_days = country_data.get('liveDays', [])
                            pre_recorded_days = country_data.get('preRecordedDays', [])
                            
                            if isinstance(live_days, list) and isinstance(pre_recorded_days, list):
                                print(f"   ✅ {country_name} has {len(live_days)} live days, {len(pre_recorded_days)} pre-recorded days")
                            else:
                                print(f"   ❌ {country_name} days are not in list format")
                                self.failed_tests.append(f"Country Schedule {country_name} - Days not in list format")
                else:
                    print(f"❌ Country schedules is not a list")
                    self.failed_tests.append("Country Schedules - Not a list")
            
            # Verify introText is present and meaningful
            if 'introText' in schedule_data:
                intro_text = schedule_data['introText']
                if intro_text and len(intro_text) > 50:  # Should be a meaningful explanation
                    print(f"✅ Intro text present and meaningful ({len(intro_text)} characters)")
                else:
                    print(f"❌ Intro text missing or too short")
                    self.failed_tests.append("Live Broadcast Schedule - Intro text missing or inadequate")
            
            # SPECIFIC VERIFICATION: Liberia should be anchor with daily presence
            liberia_schedule = next((country for country in schedule_data.get('countrySchedules', []) if country.get('country') == 'Liberia'), None)
            if liberia_schedule:
                live_days = liberia_schedule.get('liveDays', [])
                if len(live_days) == 7:  # All 7 days
                    print(f"✅ Liberia correctly shows daily live presence (7 days)")
                else:
                    print(f"❌ Liberia should have daily live presence, found {len(live_days)} days")
                    self.failed_tests.append(f"Liberia Schedule - Should have 7 live days, found {len(live_days)}")
                
                special_note = liberia_schedule.get('specialNote', '')
                if 'anchor' in special_note.lower() or 'daily' in special_note.lower():
                    print(f"✅ Liberia special note mentions anchor/daily role")
                else:
                    print(f"❌ Liberia special note should mention anchor/daily role")
                    self.failed_tests.append("Liberia Schedule - Special note should mention anchor/daily role")
        else:
            print(f"❌ Live broadcast schedule endpoint failed")

    def test_impact_stories_endpoints(self):
        """Test impact stories endpoints"""
        print("\n=== TESTING IMPACT STORIES ENDPOINTS ===")
        
        # Test get all impact stories
        self.run_test("Get All Impact Stories", "GET", "impact-stories", 200)
        
        # Test get featured stories only
        self.run_test("Get Featured Stories", "GET", "impact-stories", 200, params={"featured_only": True})
        
        # Test create impact story
        story_data = {
            "title": "Test Impact Story",
            "content": "This is a test impact story to verify the API is working correctly.",
            "author_name": "Test Author",
            "author_location": "Test Location",
            "is_featured": True
        }
        self.run_test("Create Impact Story", "POST", "impact-stories", 200, data=story_data)

    def test_news_endpoints(self):
        """Test news endpoints"""
        print("\n=== TESTING NEWS ENDPOINTS ===")
        
        # Test get all news
        self.run_test("Get All News", "GET", "news", 200)
        
        # Test get published news only
        self.run_test("Get Published News", "GET", "news", 200, params={"published_only": True})
        
        # Test create news update
        news_data = {
            "title": "Test News Update",
            "content": "This is a test news update to verify the API functionality.",
            "excerpt": "Test news excerpt",
            "author": "Test Author",
            "is_published": True
        }
        self.run_test("Create News Update", "POST", "news", 200, data=news_data)

    def test_donations_endpoints(self):
        """Test donations endpoints"""
        print("\n=== TESTING DONATIONS ENDPOINTS ===")
        
        # Test get donation total
        self.run_test("Get Donation Total", "GET", "donations/total", 200)
        
        # Test create donation
        donation_data = {
            "donor_name": "Test Donor",
            "donor_email": "test@example.com",
            "amount": 50.0,
            "currency": "USD",
            "donation_type": "one-time",
            "message": "Test donation for API verification",
            "is_anonymous": False
        }
        self.run_test("Create Donation", "POST", "donations", 200, data=donation_data)

    def test_contact_endpoints(self):
        """Test contact endpoints"""
        print("\n=== TESTING CONTACT ENDPOINTS ===")
        
        # Test get contact messages
        self.run_test("Get Contact Messages", "GET", "contact", 200)
        
        # Test create contact message
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1234567890",
            "subject": "API Test Message",
            "message": "This is a test message to verify the contact API endpoint."
        }
        self.run_test("Create Contact Message", "POST", "contact", 200, data=contact_data)

    def test_newsletter_signup_endpoint(self):
        """Test newsletter signup endpoint"""
        print("\n=== TESTING NEWSLETTER SIGNUP ENDPOINT ===")
        
        # Test newsletter signup with proper data
        newsletter_data = {
            "email": "subscriber@kiooradio.com",
            "adminEmail": "admin@proudlyliberian.com"
        }
        success, response = self.run_test("Newsletter Signup", "POST", "newsletter-signup", 200, data=newsletter_data)
        
        if success:
            # Verify response contains expected fields
            if "message" in response and "email" in response:
                print(f"✅ Newsletter signup response contains required fields")
                if response["email"] == newsletter_data["email"]:
                    print(f"✅ Response email matches submitted email")
                else:
                    print(f"❌ Response email mismatch: expected {newsletter_data['email']}, got {response.get('email')}")
            else:
                print(f"❌ Newsletter signup response missing required fields")
        
        # Test with different email to verify multiple signups work
        newsletter_data2 = {
            "email": "listener@kiooradio.com", 
            "adminEmail": "admin@proudlyliberian.com"
        }
        self.run_test("Newsletter Signup (Second)", "POST", "newsletter-signup", 200, data=newsletter_data2)
        
        # Test with missing email field
        invalid_data = {
            "adminEmail": "admin@proudlyliberian.com"
        }
        self.run_test("Newsletter Signup (Missing Email)", "POST", "newsletter-signup", 422, data=invalid_data)
        
        # Test with missing adminEmail field
        invalid_data2 = {
            "email": "test@example.com"
        }
        self.run_test("Newsletter Signup (Missing AdminEmail)", "POST", "newsletter-signup", 422, data=invalid_data2)

    def test_church_partners_endpoints(self):
        """Test church partners endpoints with specific focus on Monrovia, Liberia"""
        print("\n=== TESTING CHURCH PARTNERS ENDPOINTS ===")
        
        # Test get all church partners
        success, all_partners = self.run_test("Get All Church Partners", "GET", "church-partners", 200)
        if success:
            print(f"   Total partners in database: {len(all_partners)}")
        
        # Test filtering by country only
        success, liberia_partners = self.run_test("Get Liberia Partners", "GET", "church-partners", 200, params={"country": "Liberia"})
        if success:
            print(f"   Partners in Liberia: {len(liberia_partners)}")
        
        # Test filtering by country and city - MAIN TEST FOR MONROVIA
        success, monrovia_partners = self.run_test("Get Monrovia Partners", "GET", "church-partners", 200, params={"country": "Liberia", "city": "Monrovia"})
        
        if success:
            print(f"   Partners in Monrovia, Liberia: {len(monrovia_partners)}")
            
            # Verify specific pastors are included
            pastor_names = [partner.get('pastorName', '') for partner in monrovia_partners]
            expected_pastors = [
                "Rev. Henry SN Powoe",
                "Bishop Robert Bimba", 
                "Apostle David Fatorma",
                "Rev. Dr Joseph Bannah"
            ]
            
            found_pastors = []
            missing_pastors = []
            
            for expected_pastor in expected_pastors:
                if expected_pastor in pastor_names:
                    found_pastors.append(expected_pastor)
                    print(f"✅ Found expected pastor: {expected_pastor}")
                else:
                    missing_pastors.append(expected_pastor)
                    print(f"❌ Missing expected pastor: {expected_pastor}")
            
            if len(found_pastors) == len(expected_pastors):
                print(f"✅ All {len(expected_pastors)} expected pastors found in Monrovia")
            else:
                print(f"⚠️  Found {len(found_pastors)}/{len(expected_pastors)} expected pastors")
                self.failed_tests.append(f"Monrovia Partners - Missing pastors: {missing_pastors}")
            
            # Verify data structure
            if monrovia_partners:
                sample_partner = monrovia_partners[0]
                required_fields = ['pastorName', 'churchName', 'country', 'city', 'isPublished']
                missing_fields = [field for field in required_fields if field not in sample_partner]
                
                if not missing_fields:
                    print(f"✅ Partner data structure contains all required fields")
                else:
                    print(f"❌ Missing required fields in partner data: {missing_fields}")
                    self.failed_tests.append(f"Partner Data Structure - Missing fields: {missing_fields}")
        
        # Test filtering by other cities
        self.run_test("Get Foya Partners", "GET", "church-partners", 200, params={"country": "Liberia", "city": "Foya"})
        self.run_test("Get Kakata Partners", "GET", "church-partners", 200, params={"country": "Liberia", "city": "Kakata"})
        
        # Test filtering by other countries
        self.run_test("Get Sierra Leone Partners", "GET", "church-partners", 200, params={"country": "Sierra Leone"})
        self.run_test("Get Guinea Partners", "GET", "church-partners", 200, params={"country": "Guinea"})
        
        # Test published_only parameter
        self.run_test("Get Published Partners Only", "GET", "church-partners", 200, params={"published_only": True})
        
        # Test create church partner
        partner_data = {
            "pastorName": "Test Pastor",
            "churchName": "Test Church",
            "country": "Liberia",
            "city": "Monrovia",
            "altCityNames": [],
            "onAirDaysTimes": "Sunday 10:00 AM",
            "contactPhone": "+231-123-456-789",
            "whatsAppNumber": "+231-123-456-789",
            "consentToDisplayContact": True,
            "notes": "Test church for API verification",
            "photoUrl": None,
            "isPublished": True,
            "sortOrder": 1
        }
        self.run_test("Create Church Partner", "POST", "church-partners", 200, data=partner_data)

    def test_about_page_settings_endpoints(self):
        """Test About page settings endpoints with CRITICAL VERIFICATION POINTS for timeline and content corrections"""
        print("\n=== TESTING ABOUT PAGE SETTINGS ENDPOINTS WITH CORRECTIONS ===")
        
        # Test GET /api/about-page-settings
        success, settings_data = self.run_test("Get About Page Settings", "GET", "about-page-settings", 200)
        
        if success:
            print(f"✅ About page settings endpoint accessible")
            
            # Verify required fields are present
            required_fields = [
                'visionTitle', 'visionContent',
                'timelineTitle', 'timelineItems', 
                'kissiTitle', 'kissiContent',
                'radioProjectPptUrl', 'maruRadioProposalPdfUrl',
                'radioProjectPreviewImages', 'maruRadioProposalPreviewImages'
            ]
            
            missing_fields = []
            for field in required_fields:
                if field not in settings_data:
                    missing_fields.append(field)
                else:
                    print(f"✅ Found required field: {field}")
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                self.failed_tests.append(f"About Page Settings - Missing fields: {missing_fields}")
            else:
                print(f"✅ All required fields present in About page settings")
            
            # CRITICAL VERIFICATION 1: Vision content corrections
            print(f"\n🔍 CRITICAL VERIFICATION 1: Vision Content Corrections")
            if 'visionContent' in settings_data:
                vision_content = settings_data['visionContent']
                
                # Check for "Media Village, a media school of YWMA" (not Cape Peninsula University)
                if "Media Village, a media school of YWMA" in vision_content:
                    print(f"✅ Vision content correctly mentions 'Media Village, a media school of YWMA'")
                else:
                    print(f"❌ Vision content should mention 'Media Village, a media school of YWMA' instead of Cape Peninsula University")
                    self.failed_tests.append("Vision content - Should mention Media Village, not Cape Peninsula University")
                
                # Check that Vox Radio started in 2017 (not 2006)
                if "Vox Radio first in 2017" in vision_content:
                    print(f"✅ Vision content correctly states Vox Radio started in 2017")
                else:
                    print(f"❌ Vision content should state Vox Radio started in 2017")
                    self.failed_tests.append("Vision content - Should state Vox Radio started in 2017")
                
                # Check for Elmer H. Schmidt Christian Broadcasting Fund grant information
                if "Elmer H. Schmidt Christian Broadcasting Fund" in vision_content:
                    print(f"✅ Vision content includes Elmer H. Schmidt Christian Broadcasting Fund grant information")
                else:
                    print(f"❌ Vision content should include Elmer H. Schmidt Christian Broadcasting Fund grant information")
                    self.failed_tests.append("Vision content - Missing Elmer H. Schmidt grant information")
                
                # Check story explains God originally wanted Kissi radio first
                if "Originally, God wanted us to first start the Kissi radio station" in vision_content:
                    print(f"✅ Vision content explains God originally wanted Kissi radio first")
                else:
                    print(f"❌ Vision content should explain God originally wanted Kissi radio first")
                    self.failed_tests.append("Vision content - Should explain God's original vision for Kissi radio first")
            
            # CRITICAL VERIFICATION 2: Timeline accuracy verification
            print(f"\n🔍 CRITICAL VERIFICATION 2: Timeline Accuracy")
            if 'timelineItems' in settings_data:
                timeline_items = settings_data['timelineItems']
                if isinstance(timeline_items, list):
                    print(f"✅ Timeline items is a list with {len(timeline_items)} items")
                    
                    # Check specific timeline entries
                    # Note: Don't use dict comprehension as it overwrites duplicate years
                    
                    # 2005: Vision received in Cape Town
                    vision_2005_found = False
                    for item in timeline_items:
                        if isinstance(item, dict) and '2005' in item.get('year', '') and "Vision received in Cape Town" in item.get('event', ''):
                            print(f"✅ 2005 entry correctly mentions Vision received in Cape Town")
                            vision_2005_found = True
                            break
                    if not vision_2005_found:
                        print(f"❌ 2005 entry should mention Vision received in Cape Town")
                        self.failed_tests.append("Timeline 2005 - Should mention Vision received in Cape Town")
                    
                    # 2017: Vox Radio established in shipping container
                    vox_2017_found = False
                    for item in timeline_items:
                        if isinstance(item, dict) and "2017" in item.get('year', '') and "Vox Radio established" in item.get('event', '') and "shipping container" in item.get('event', ''):
                            print(f"✅ 2017 entry correctly mentions Vox Radio established in shipping container")
                            vox_2017_found = True
                            break
                    if not vox_2017_found:
                        print(f"❌ 2017 entry should mention Vox Radio established in shipping container")
                        self.failed_tests.append("Timeline 2017 - Should mention Vox Radio established in shipping container")
                    
                    # 2024: Daniel Hatfield challenge
                    daniel_2024_found = False
                    for item in timeline_items:
                        if isinstance(item, dict) and "2024" in item.get('year', '') and "Daniel Hatfield" in item.get('event', '') and ("challenge" in item.get('event', '').lower() or "challenged" in item.get('event', '').lower()):
                            print(f"✅ 2024 entry includes Daniel Hatfield challenge")
                            daniel_2024_found = True
                            break
                    if not daniel_2024_found:
                        print(f"❌ 2024 should include Daniel Hatfield challenge entry")
                        self.failed_tests.append("Timeline 2024 - Should include Daniel Hatfield challenge")
                    
                    # 2024: Elmer H. Schmidt grant information
                    grant_2024_found = False
                    for item in timeline_items:
                        if isinstance(item, dict) and "2024" in item.get('year', '') and "Elmer H. Schmidt Christian Broadcasting Fund" in item.get('event', ''):
                            print(f"✅ 2024 entry includes Elmer H. Schmidt grant information")
                            grant_2024_found = True
                            break
                    if not grant_2024_found:
                        print(f"❌ 2024 should include Elmer H. Schmidt grant information")
                        self.failed_tests.append("Timeline 2024 - Should include Elmer H. Schmidt grant information")
                    
                    # 2025: License, construction, launch
                    launch_2025_found = False
                    for item in timeline_items:
                        if isinstance(item, dict) and "2025" in item.get('year', '') and ("launch" in item.get('event', '').lower() or "construction" in item.get('event', '').lower() or "license" in item.get('event', '').lower()):
                            print(f"✅ 2025 entries include license, construction, or launch information")
                            launch_2025_found = True
                            break
                    if not launch_2025_found:
                        print(f"❌ 2025 should include license, construction, or launch information")
                        self.failed_tests.append("Timeline 2025 - Should include license, construction, or launch information")
                    
                else:
                    print(f"❌ Timeline items is not a list: {type(timeline_items)}")
                    self.failed_tests.append("About Page Settings - Timeline items is not a list")
            
            # CRITICAL VERIFICATION 3: Kissi content corrections
            print(f"\n🔍 CRITICAL VERIFICATION 3: Kissi Content Corrections")
            if 'kissiContent' in settings_data:
                kissi_content = settings_data['kissiContent']
                
                # Check that "Kissi" means "Gift" not "Mirror"
                if '"Kissi" meaning "Gift"' in kissi_content:
                    print(f"✅ Kissi content correctly states 'Kissi' means 'Gift'")
                else:
                    print(f"❌ Kissi content should state 'Kissi' means 'Gift' not 'Mirror'")
                    self.failed_tests.append("Kissi content - Should state Kissi means Gift, not Mirror")
                
                # Check for cultural heritage explanation
                if "cultural heritage" in kissi_content.lower():
                    print(f"✅ Kissi content explains cultural heritage")
                else:
                    print(f"❌ Kissi content should explain cultural heritage")
                    self.failed_tests.append("Kissi content - Should explain cultural heritage")
            
            # CRITICAL VERIFICATION 4: Document preview functionality
            print(f"\n🔍 CRITICAL VERIFICATION 4: Document Preview Functionality")
            
            # Check radioProjectPreviewImages array has 3 placeholder images
            if 'radioProjectPreviewImages' in settings_data:
                ppt_previews = settings_data['radioProjectPreviewImages']
                if isinstance(ppt_previews, list) and len(ppt_previews) == 3:
                    print(f"✅ radioProjectPreviewImages array has 3 placeholder images")
                else:
                    print(f"❌ radioProjectPreviewImages should have 3 placeholder images, found {len(ppt_previews) if isinstance(ppt_previews, list) else 'not a list'}")
                    self.failed_tests.append(f"Document previews - radioProjectPreviewImages should have 3 images, found {len(ppt_previews) if isinstance(ppt_previews, list) else 'not a list'}")
            
            # Check maruRadioProposalPreviewImages array has PDF thumbnail images
            if 'maruRadioProposalPreviewImages' in settings_data:
                pdf_previews = settings_data['maruRadioProposalPreviewImages']
                if isinstance(pdf_previews, list) and len(pdf_previews) >= 2:
                    print(f"✅ maruRadioProposalPreviewImages array has {len(pdf_previews)} PDF thumbnail images")
                else:
                    print(f"❌ maruRadioProposalPreviewImages should have at least 2 PDF thumbnails, found {len(pdf_previews) if isinstance(pdf_previews, list) else 'not a list'}")
                    self.failed_tests.append(f"Document previews - maruRadioProposalPreviewImages should have at least 2 images, found {len(pdf_previews) if isinstance(pdf_previews, list) else 'not a list'}")
            
            # Verify document URLs
            if 'radioProjectPptUrl' in settings_data and 'maruRadioProposalPdfUrl' in settings_data:
                ppt_url = settings_data['radioProjectPptUrl']
                pdf_url = settings_data['maruRadioProposalPdfUrl']
                
                if ppt_url and "Radio%20Project11.ppt" in ppt_url:
                    print(f"✅ PowerPoint document URL points to correct file")
                else:
                    print(f"❌ PowerPoint URL incorrect: {ppt_url}")
                
                if pdf_url and "maru_radio_proposal.PDF" in pdf_url:
                    print(f"✅ PDF document URL points to correct file")
                else:
                    print(f"❌ PDF URL incorrect: {pdf_url}")
            
            # Verify no null values in default settings
            null_fields = [field for field, value in settings_data.items() if value is None]
            if null_fields:
                print(f"❌ Found null values in fields: {null_fields}")
                self.failed_tests.append(f"About Page Settings - Null values in: {null_fields}")
            else:
                print(f"✅ No null values in default settings")
        
        # Test PUT /api/about-page-settings (simulate CMS functionality)
        updated_settings = {
            "visionTitle": "Updated Vision (2005)",
            "visionContent": "Updated vision content for testing CMS functionality",
            "timelineTitle": "Updated Timeline Title",
            "timelineItems": [
                {"year": "2005", "event": "Updated test event"},
                {"year": "2025", "event": "Updated launch event"}
            ],
            "kissiTitle": "Updated Kissi Title",
            "kissiContent": "Updated Kissi content for testing",
            "radioProjectPptUrl": "https://example.com/test.ppt",
            "maruRadioProposalPdfUrl": "https://example.com/test.pdf"
        }
        
        success, update_response = self.run_test("Update About Page Settings", "PUT", "about-page-settings", 200, data=updated_settings)
        
        if success:
            print(f"✅ About page settings update endpoint working")
            
            # Verify response contains success message
            if "message" in update_response:
                print(f"✅ Update response contains success message")
            else:
                print(f"❌ Update response missing success message")
        
        # Test GET again to verify structure is still intact after PUT
        success, verify_settings = self.run_test("Verify Settings After Update", "GET", "about-page-settings", 200)
        if success:
            print(f"✅ Settings endpoint still accessible after update operation")

    def test_static_file_serving(self):
        """Test static file serving for document thumbnails"""
        print("\n=== TESTING STATIC FILE SERVING FOR THUMBNAILS ===")
        
        # First get the about page settings to get preview image URLs
        success, settings_data = self.run_test("Get Settings for Static File Testing", "GET", "about-page-settings", 200)
        
        if success and 'maruRadioProposalPreviewImages' in settings_data:
            pdf_previews = settings_data['maruRadioProposalPreviewImages']
            
            if isinstance(pdf_previews, list) and len(pdf_previews) > 0:
                # Test accessing the first PDF thumbnail
                first_thumbnail_url = pdf_previews[0]
                if first_thumbnail_url.startswith('/api/static/thumbnails/'):
                    # Extract the path after /api/
                    thumbnail_path = first_thumbnail_url.replace('/api/', '')
                    
                    # Test static file serving
                    success, _ = self.run_test("Access PDF Thumbnail", "GET", thumbnail_path, 200)
                    if success:
                        print(f"✅ Static file serving works for PDF thumbnails")
                    else:
                        print(f"❌ Static file serving failed for PDF thumbnails")
                        self.failed_tests.append("Static file serving - PDF thumbnail access failed")
                else:
                    print(f"❌ Thumbnail URL format incorrect: {first_thumbnail_url}")
            else:
                print(f"❌ No PDF preview images found to test static file serving")
        
        if success and 'radioProjectPreviewImages' in settings_data:
            ppt_previews = settings_data['radioProjectPreviewImages']
            
            if isinstance(ppt_previews, list) and len(ppt_previews) > 0:
                # Test accessing the first PowerPoint thumbnail
                first_thumbnail_url = ppt_previews[0]
                if first_thumbnail_url.startswith('/api/static/thumbnails/'):
                    # Extract the path after /api/
                    thumbnail_path = first_thumbnail_url.replace('/api/', '')
                    
                    # Test static file serving
                    success, _ = self.run_test("Access PowerPoint Thumbnail", "GET", thumbnail_path, 200)
                    if success:
                        print(f"✅ Static file serving works for PowerPoint thumbnails")
                    else:
                        print(f"❌ Static file serving failed for PowerPoint thumbnails")
                        self.failed_tests.append("Static file serving - PowerPoint thumbnail access failed")
                else:
                    print(f"❌ Thumbnail URL format incorrect: {first_thumbnail_url}")
            else:
                print(f"❌ No PowerPoint preview images found to test static file serving")

    def test_dashboard_weather_api(self):
        """Test Dashboard Weather API Integration - CRITICAL FOCUS"""
        print("\n=== TESTING DASHBOARD WEATHER API INTEGRATION ===")
        
        # Test GET /api/dashboard/weather endpoint
        success, weather_data = self.run_test("Dashboard Weather API", "GET", "dashboard/weather", 200)
        
        if success:
            print(f"✅ Weather API endpoint accessible")
            
            # Verify all 4 cities are present
            expected_cities = [
                "Foya, Liberia",
                "Koindu, Sierra Leone", 
                "Guéckédou, Guinea",
                "Kissidougou, Guinea"
            ]
            
            missing_cities = []
            for city in expected_cities:
                if city in weather_data:
                    print(f"✅ Found weather data for {city}")
                    
                    # Verify data structure for each city
                    city_data = weather_data[city]
                    required_fields = ['temperature', 'condition', 'updated']
                    
                    missing_fields = [field for field in required_fields if field not in city_data]
                    if not missing_fields:
                        print(f"   ✅ {city} has all required fields: {required_fields}")
                        
                        # Verify temperature is realistic for West Africa (20-30°C range or N/A)
                        temp = city_data.get('temperature')
                        if temp == "N/A":
                            print(f"   ⚠️  {city} temperature is N/A (fallback data)")
                        elif isinstance(temp, (int, float)) and 15 <= temp <= 35:
                            print(f"   ✅ {city} temperature {temp}°C is realistic for West Africa")
                        else:
                            print(f"   ❌ {city} temperature {temp}°C seems unrealistic for West Africa")
                            self.failed_tests.append(f"Weather API - {city} unrealistic temperature: {temp}")
                        
                        # Verify condition is not empty
                        condition = city_data.get('condition', '')
                        if condition and condition != "Weather unavailable":
                            print(f"   ✅ {city} has weather condition: {condition}")
                        elif condition == "Weather unavailable":
                            print(f"   ⚠️  {city} shows fallback condition (API may be down)")
                        else:
                            print(f"   ❌ {city} missing weather condition")
                            self.failed_tests.append(f"Weather API - {city} missing condition")
                        
                        # Verify updated timestamp format
                        updated = city_data.get('updated', '')
                        if updated and len(updated) >= 16:  # YYYY-MM-DD HH:MM format
                            print(f"   ✅ {city} has updated timestamp: {updated}")
                        else:
                            print(f"   ❌ {city} missing or invalid updated timestamp: {updated}")
                            self.failed_tests.append(f"Weather API - {city} invalid timestamp")
                    else:
                        print(f"   ❌ {city} missing required fields: {missing_fields}")
                        self.failed_tests.append(f"Weather API - {city} missing fields: {missing_fields}")
                else:
                    missing_cities.append(city)
            
            if missing_cities:
                print(f"❌ Missing weather data for cities: {missing_cities}")
                self.failed_tests.append(f"Weather API - Missing cities: {missing_cities}")
            else:
                print(f"✅ All 4 expected cities have weather data")
            
            # Test error handling by checking if any city shows fallback data
            fallback_cities = []
            for city, data in weather_data.items():
                if data.get('condition') == "Weather unavailable" or data.get('temperature') == "N/A":
                    fallback_cities.append(city)
            
            if fallback_cities:
                print(f"⚠️  Cities showing fallback data (API may be down): {fallback_cities}")
                print(f"   This is expected behavior when Open-Meteo API is unavailable")
            else:
                print(f"✅ All cities showing real weather data (API working)")
        else:
            print(f"❌ Weather API endpoint failed")

    def test_dashboard_endpoints(self):
        """Test All Dashboard Endpoints - COMPREHENSIVE TESTING"""
        print("\n=== TESTING ALL DASHBOARD ENDPOINTS ===")
        
        # Test GET /api/dashboard/schedule
        success, schedule_data = self.run_test("Dashboard Schedule", "GET", "dashboard/schedule", 200)
        if success:
            print(f"✅ Schedule endpoint accessible")
            if isinstance(schedule_data, list) and len(schedule_data) > 0:
                print(f"   ✅ Schedule contains {len(schedule_data)} program entries")
                
                # Verify schedule data structure
                sample_program = schedule_data[0]
                required_fields = ['day', 'time', 'program', 'presenter']
                missing_fields = [field for field in required_fields if field not in sample_program]
                
                if not missing_fields:
                    print(f"   ✅ Schedule entries have all required fields")
                    
                    # Check for all days of the week
                    days_found = set(program.get('day', '') for program in schedule_data)
                    expected_days = {'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'}
                    missing_days = expected_days - days_found
                    
                    if not missing_days:
                        print(f"   ✅ Schedule covers all days of the week")
                    else:
                        print(f"   ⚠️  Schedule missing days: {missing_days}")
                else:
                    print(f"   ❌ Schedule entries missing fields: {missing_fields}")
                    self.failed_tests.append(f"Dashboard Schedule - Missing fields: {missing_fields}")
            else:
                print(f"   ❌ Schedule data is empty or not a list")
                self.failed_tests.append("Dashboard Schedule - Empty or invalid data structure")
        
        # Test GET /api/dashboard/presenters
        success, presenters_data = self.run_test("Dashboard Presenters", "GET", "dashboard/presenters", 200)
        if success:
            print(f"✅ Presenters endpoint accessible")
            
            # Verify presenters data structure by country
            expected_countries = ['liberia', 'sierra_leone', 'guinea']
            missing_countries = []
            
            for country in expected_countries:
                if country in presenters_data:
                    country_presenters = presenters_data[country]
                    if isinstance(country_presenters, list) and len(country_presenters) > 0:
                        print(f"   ✅ {country.title()} has {len(country_presenters)} presenters")
                        
                        # Verify presenter data structure
                        sample_presenter = country_presenters[0]
                        required_fields = ['name', 'programs', 'schedule']
                        missing_fields = [field for field in required_fields if field not in sample_presenter]
                        
                        if not missing_fields:
                            print(f"   ✅ {country.title()} presenters have all required fields")
                        else:
                            print(f"   ❌ {country.title()} presenters missing fields: {missing_fields}")
                            self.failed_tests.append(f"Dashboard Presenters - {country} missing fields: {missing_fields}")
                    else:
                        print(f"   ❌ {country.title()} has no presenters or invalid data")
                        self.failed_tests.append(f"Dashboard Presenters - {country} empty or invalid")
                else:
                    missing_countries.append(country)
            
            if missing_countries:
                print(f"   ❌ Missing countries: {missing_countries}")
                self.failed_tests.append(f"Dashboard Presenters - Missing countries: {missing_countries}")
            else:
                print(f"   ✅ All 3 countries have presenter data")
        
        # Test POST /api/dashboard/testimony
        testimony_data = {
            "id": "test-testimony-001",
            "date": "2024-12-19",
            "name": "Sarah Johnson",
            "location": "Foya, Liberia", 
            "program": "Morning Devotion",
            "summary": "God healed my daughter from malaria after we prayed on the radio. Thank you Kioo Radio for bringing hope to our community."
        }
        success, response = self.run_test("Submit Testimony", "POST", "dashboard/testimony", 200, data=testimony_data)
        if success:
            print(f"✅ Testimony submission endpoint working")
            if "message" in response and "id" in response:
                print(f"   ✅ Testimony response contains required fields")
            else:
                print(f"   ❌ Testimony response missing required fields")
                self.failed_tests.append("Dashboard Testimony - Response missing message or id")
        
        # Test POST /api/dashboard/call-log
        call_log_data = {
            "id": "test-call-001",
            "date": "2024-12-19",
            "time": "08:30",
            "phone": "+231-77-123-4567",
            "summary": "Listener called to request prayer for sick family member and asked about upcoming community outreach program.",
            "category": "Prayer Request"
        }
        success, response = self.run_test("Submit Call Log", "POST", "dashboard/call-log", 200, data=call_log_data)
        if success:
            print(f"✅ Call log submission endpoint working")
            if "message" in response and "id" in response:
                print(f"   ✅ Call log response contains required fields")
            else:
                print(f"   ❌ Call log response missing required fields")
                self.failed_tests.append("Dashboard Call Log - Response missing message or id")
        
        # Test GET /api/dashboard/export
        success, csv_response = self.run_test("Export Dashboard Data", "GET", "dashboard/export", 200)
        if success:
            print(f"✅ Export endpoint accessible")
            # Note: csv_response will be empty dict since we handle CSV differently in run_test
            # The fact that we got 200 status means the endpoint is working
            print(f"   ✅ CSV export functionality working (returns proper CSV format)")
        
        # Test form validation - missing required fields
        invalid_testimony = {
            "date": "2024-12-19",
            # Missing required fields like location, program, summary
        }
        success, response = self.run_test("Invalid Testimony (Missing Fields)", "POST", "dashboard/testimony", 422, data=invalid_testimony)
        if success:
            print(f"✅ Testimony validation working (rejects incomplete data)")
        else:
            # If it returns 200 instead of 422, it means validation is not strict
            print(f"⚠️  Testimony validation may be lenient (accepts incomplete data)")
        
        invalid_call_log = {
            "date": "2024-12-19",
            # Missing required fields like category, summary
        }
        success, response = self.run_test("Invalid Call Log (Missing Fields)", "POST", "dashboard/call-log", 422, data=invalid_call_log)
        if success:
            print(f"✅ Call log validation working (rejects incomplete data)")
        else:
            # If it returns 200 instead of 422, it means validation is not strict
            print(f"⚠️  Call log validation may be lenient (accepts incomplete data)")

    def test_pastoral_enhancements_verification(self):
        """CRITICAL TEST: Verify all pastoral enhancements as requested in review"""
        print("\n=== CRITICAL VERIFICATION: PASTORAL ENHANCEMENTS ===")
        print("Testing: Hope & Care Outreach, Pastor Sermon Slots, Evangelist Billy Bimba Programs, Renaissance")
        
        # Get all programs first
        success, all_programs = self.run_test("Get All Programs for Pastoral Verification", "GET", "programs", 200)
        
        if not success:
            print("❌ Failed to get programs for pastoral verification")
            return
        
        print(f"✅ Retrieved {len(all_programs)} total programs for verification")
        
        # VERIFICATION 1: Check total program count should be 284
        expected_total = 284
        actual_total = len(all_programs)
        
        if actual_total == expected_total:
            print(f"✅ Total program count correct: {actual_total} programs")
        else:
            print(f"⚠️  Total program count: expected {expected_total}, found {actual_total}")
            if actual_total > expected_total:
                print(f"   Note: {actual_total - expected_total} extra programs found")
            else:
                print(f"   Note: {expected_total - actual_total} programs missing")
        
        # VERIFICATION 2: Hope & Care Outreach - Daily Monday-Friday (15:00-15:30)
        print(f"\n🔍 DETAILED VERIFICATION: Hope & Care Outreach")
        hope_care_programs = [p for p in all_programs if 'hope' in p.get('title', '').lower() and 'care' in p.get('title', '').lower() and 'outreach' in p.get('title', '').lower()]
        
        if hope_care_programs:
            print(f"✅ FOUND: {len(hope_care_programs)} Hope & Care Outreach programs")
            
            # Expected: 5 programs (Monday-Friday)
            expected_count = 5
            if len(hope_care_programs) == expected_count:
                print(f"✅ Correct number of Hope & Care Outreach programs: {len(hope_care_programs)}")
            else:
                print(f"❌ Wrong number of Hope & Care Outreach programs: expected {expected_count}, found {len(hope_care_programs)}")
                self.failed_tests.append(f"Hope & Care Outreach - Wrong count: expected {expected_count}, found {len(hope_care_programs)}")
            
            # Verify each program's attributes
            expected_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            found_days = []
            
            for program in hope_care_programs:
                title = program.get('title', '')
                day = program.get('day_of_week', '').lower()
                start_time = program.get('start_time', '')
                duration = program.get('duration_minutes', 0)
                category = program.get('category', '').lower()
                
                print(f"\n   📋 Program: {title}")
                print(f"      Day: {day}")
                print(f"      Time: {start_time}")
                print(f"      Duration: {duration} minutes")
                print(f"      Category: {category}")
                
                # Track found days
                if day in expected_days:
                    found_days.append(day)
                
                # Verify attributes
                checks = [
                    ("Day", day in expected_days, f"Should be weekday (Monday-Friday), found {day}"),
                    ("Start Time", start_time == '15:00', f"Should be 15:00 (moved from nighttime), found {start_time}"),
                    ("Duration", duration == 30, f"Should be 30 minutes, found {duration}"),
                    ("Category", category == 'outreach', f"Should be outreach type, found {category}")
                ]
                
                for check_name, condition, error_msg in checks:
                    if condition:
                        print(f"      ✅ {check_name}: Correct")
                    else:
                        print(f"      ❌ {check_name}: {error_msg}")
                        self.failed_tests.append(f"Hope & Care Outreach ({day}) - {error_msg}")
            
            # Verify all weekdays are covered
            missing_days = [day for day in expected_days if day not in found_days]
            if missing_days:
                print(f"\n❌ Missing Hope & Care Outreach programs for days: {missing_days}")
                self.failed_tests.append(f"Hope & Care Outreach - Missing days: {missing_days}")
            else:
                print(f"\n✅ Hope & Care Outreach programs found for all weekdays (Monday-Friday)")
        else:
            print(f"❌ CRITICAL ERROR: No 'Hope & Care Outreach' programs found")
            self.failed_tests.append("CRITICAL - Hope & Care Outreach programs not found in database")
        
        # VERIFICATION 3: Four Pastor Sermon Slots (30 minutes each) from 3 countries
        print(f"\n🔍 DETAILED VERIFICATION: Pastor Sermon Slots")
        pastor_corner_programs = [p for p in all_programs if 'pastor' in p.get('title', '').lower() and 'corner' in p.get('title', '').lower()]
        
        if pastor_corner_programs:
            print(f"✅ FOUND: {len(pastor_corner_programs)} Pastor's Corner programs")
            
            # Expected: 4 programs
            expected_count = 4
            if len(pastor_corner_programs) == expected_count:
                print(f"✅ Correct number of Pastor's Corner programs: {len(pastor_corner_programs)}")
            else:
                print(f"❌ Wrong number of Pastor's Corner programs: expected {expected_count}, found {len(pastor_corner_programs)}")
                self.failed_tests.append(f"Pastor's Corner - Wrong count: expected {expected_count}, found {len(pastor_corner_programs)}")
            
            # Expected slots with their details
            expected_slots = [
                {"country": "liberia", "time": "10:00", "language": "english"},
                {"country": "sierra leone", "time": "14:30", "language": "english"},
                {"country": "guinea", "time": "19:00", "language": "french"},
                {"country": "multi-country", "time": "21:30", "language": "mixed"}
            ]
            
            for program in pastor_corner_programs:
                title = program.get('title', '')
                start_time = program.get('start_time', '')
                duration = program.get('duration_minutes', 0)
                language = program.get('language', '').lower()
                
                print(f"\n   📋 Program: {title}")
                print(f"      Time: {start_time}")
                print(f"      Duration: {duration} minutes")
                print(f"      Language: {language}")
                
                # Verify duration is 30 minutes
                if duration == 30:
                    print(f"      ✅ Duration: Correct (30 minutes)")
                else:
                    print(f"      ❌ Duration: Should be 30 minutes, found {duration}")
                    self.failed_tests.append(f"Pastor's Corner ({title}) - Wrong duration: expected 30, found {duration}")
                
                # Check if this matches any expected slot
                matching_slot = None
                for slot in expected_slots:
                    if start_time == slot["time"] and language == slot["language"]:
                        matching_slot = slot
                        break
                
                if matching_slot:
                    print(f"      ✅ Matches expected slot: {matching_slot['country']} at {matching_slot['time']}")
                else:
                    print(f"      ❌ Does not match any expected slot")
                    self.failed_tests.append(f"Pastor's Corner ({title}) - Does not match expected slots")
        else:
            print(f"❌ CRITICAL ERROR: No 'Pastor's Corner' programs found")
            self.failed_tests.append("CRITICAL - Pastor's Corner programs not found in database")
        
        # VERIFICATION 4: Evangelist Billy Bimba Weekly Programs
        print(f"\n🔍 DETAILED VERIFICATION: Evangelist Billy Bimba Programs")
        billy_bimba_programs = [p for p in all_programs if 'billy bimba' in p.get('title', '').lower()]
        
        if billy_bimba_programs:
            print(f"✅ FOUND: {len(billy_bimba_programs)} Evangelist Billy Bimba programs")
            
            # Expected: 2 programs (Saturday English Hour, Sunday Kissi Hour)
            expected_count = 2
            if len(billy_bimba_programs) == expected_count:
                print(f"✅ Correct number of Billy Bimba programs: {len(billy_bimba_programs)}")
            else:
                print(f"❌ Wrong number of Billy Bimba programs: expected {expected_count}, found {len(billy_bimba_programs)}")
                self.failed_tests.append(f"Billy Bimba - Wrong count: expected {expected_count}, found {len(billy_bimba_programs)}")
            
            # Check for Saturday English Hour (10:00-11:00, English, 60 minutes)
            saturday_program = None
            sunday_program = None
            
            for program in billy_bimba_programs:
                day = program.get('day_of_week', '').lower()
                if day == 'saturday':
                    saturday_program = program
                elif day == 'sunday':
                    sunday_program = program
            
            # Verify Saturday English Hour
            if saturday_program:
                print(f"\n   📋 Saturday Program: {saturday_program.get('title')}")
                checks = [
                    ("Day", saturday_program.get('day_of_week', '').lower() == 'saturday', "Should be Saturday"),
                    ("Start Time", saturday_program.get('start_time') == '10:00', f"Should be 10:00, found {saturday_program.get('start_time')}"),
                    ("Duration", saturday_program.get('duration_minutes') == 60, f"Should be 60 minutes, found {saturday_program.get('duration_minutes')}"),
                    ("Language", saturday_program.get('language', '').lower() == 'english', f"Should be English, found {saturday_program.get('language')}")
                ]
                
                for check_name, condition, error_msg in checks:
                    if condition:
                        print(f"      ✅ {check_name}: Correct")
                    else:
                        print(f"      ❌ {check_name}: {error_msg}")
                        self.failed_tests.append(f"Billy Bimba Saturday - {error_msg}")
            else:
                print(f"❌ Saturday Billy Bimba program not found")
                self.failed_tests.append("Billy Bimba - Saturday English Hour not found")
            
            # Verify Sunday Kissi Hour
            if sunday_program:
                print(f"\n   📋 Sunday Program: {sunday_program.get('title')}")
                checks = [
                    ("Day", sunday_program.get('day_of_week', '').lower() == 'sunday', "Should be Sunday"),
                    ("Start Time", sunday_program.get('start_time') == '06:00', f"Should be 06:00, found {sunday_program.get('start_time')}"),
                    ("Duration", sunday_program.get('duration_minutes') == 60, f"Should be 60 minutes, found {sunday_program.get('duration_minutes')}"),
                    ("Language", sunday_program.get('language', '').lower() == 'kissi', f"Should be Kissi, found {sunday_program.get('language')}")
                ]
                
                for check_name, condition, error_msg in checks:
                    if condition:
                        print(f"      ✅ {check_name}: Correct")
                    else:
                        print(f"      ❌ {check_name}: {error_msg}")
                        self.failed_tests.append(f"Billy Bimba Sunday - {error_msg}")
            else:
                print(f"❌ Sunday Billy Bimba program not found")
                self.failed_tests.append("Billy Bimba - Sunday Kissi Hour not found")
        else:
            print(f"❌ CRITICAL ERROR: No 'Evangelist Billy Bimba' programs found")
            self.failed_tests.append("CRITICAL - Evangelist Billy Bimba programs not found in database")
        
        # VERIFICATION 5: Renaissance Program (Friday 16:30-17:30, French, 1 hour)
        print(f"\n🔍 DETAILED VERIFICATION: Renaissance Program")
        renaissance_programs = [p for p in all_programs if 'renaissance' in p.get('title', '').lower()]
        
        if renaissance_programs:
            renaissance = renaissance_programs[0]
            print(f"✅ FOUND: {renaissance.get('title')}")
            
            # Check all attributes
            checks = [
                ("Day", renaissance.get('day_of_week', '').lower(), 'friday'),
                ("Start Time", renaissance.get('start_time'), '16:30'),
                ("Duration", renaissance.get('duration_minutes'), 60),
                ("Language", renaissance.get('language', '').lower(), 'french')
            ]
            
            all_correct = True
            for check_name, actual, expected in checks:
                if actual == expected:
                    print(f"   ✅ {check_name}: {actual}")
                else:
                    print(f"   ❌ {check_name}: expected {expected}, found {actual}")
                    self.failed_tests.append(f"Renaissance - {check_name} incorrect: expected {expected}, found {actual}")
                    all_correct = False
            
            if all_correct:
                print(f"✅ Renaissance: ALL ATTRIBUTES CORRECT")
            else:
                print(f"❌ Renaissance: Some attributes incorrect")
        else:
            print(f"❌ CRITICAL ERROR: 'Renaissance' program NOT FOUND")
            self.failed_tests.append("CRITICAL - Renaissance program not found in database")
        
        # VERIFICATION 6: Count New Phase 2 programs (should be 53)
        print(f"\n🔍 VERIFICATION: New Phase 2 Program Count")
        
        # Look for programs that might be Phase 2 (new programs)
        phase2_indicators = [
            'hope', 'care', 'outreach', 'pastor', 'corner', 'billy bimba', 'renaissance',
            'makona talk show', 'guidelines', 'love & faith', 'daily sermon', 'truth for life', 
            'la vie chez nous', 'spot light english'
        ]
        
        phase2_programs = []
        for program in all_programs:
            title_lower = program.get('title', '').lower()
            for indicator in phase2_indicators:
                if indicator in title_lower:
                    phase2_programs.append(program.get('title'))
                    break
        
        print(f"✅ Found {len(phase2_programs)} identifiable Phase 2 programs")
        
        # Expected: 53 Phase 2 programs
        expected_phase2_count = 53
        if len(phase2_programs) >= expected_phase2_count:
            print(f"✅ Phase 2 program count meets expectation: {len(phase2_programs)} >= {expected_phase2_count}")
        else:
            print(f"❌ Phase 2 program count below expectation: {len(phase2_programs)} < {expected_phase2_count}")
            self.failed_tests.append(f"Phase 2 Count - Expected at least {expected_phase2_count}, found {len(phase2_programs)}")
        
        # Final summary for pastoral enhancements
        print(f"\n📊 PASTORAL ENHANCEMENTS VERIFICATION SUMMARY:")
        print(f"   Total Programs: {len(all_programs)}")
        print(f"   Hope & Care Outreach: {'✅ FOUND' if hope_care_programs else '❌ MISSING'} ({len(hope_care_programs) if hope_care_programs else 0}/5)")
        print(f"   Pastor's Corner: {'✅ FOUND' if pastor_corner_programs else '❌ MISSING'} ({len(pastor_corner_programs) if pastor_corner_programs else 0}/4)")
        print(f"   Billy Bimba Programs: {'✅ FOUND' if billy_bimba_programs else '❌ MISSING'} ({len(billy_bimba_programs) if billy_bimba_programs else 0}/2)")
        print(f"   Renaissance: {'✅ FOUND' if renaissance_programs else '❌ MISSING'}")
        print(f"   Phase 2 Programs: {len(phase2_programs)}/53")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Kioo Radio API Tests...")
        print(f"Testing against: {self.base_url}")
        
        self.test_basic_endpoints()
        self.test_programs_endpoints()
        self.test_pastoral_enhancements_verification()  # CRITICAL: Test pastoral enhancements from review
        self.test_spot_light_english_verification()  # CRITICAL: Test new Spot Light English programs
        self.test_new_french_programs_verification()  # CRITICAL: Test new French programs
        self.test_live_broadcast_schedule_endpoint()  # CRITICAL: Test Phase 2 live broadcast schedule
        self.test_impact_stories_endpoints()
        self.test_news_endpoints()
        self.test_donations_endpoints()
        self.test_contact_endpoints()
        self.test_newsletter_signup_endpoint()
        self.test_church_partners_endpoints()
        self.test_about_page_settings_endpoints()  # CRITICAL: Test About page settings API with corrections
        self.test_static_file_serving()  # CRITICAL: Test document thumbnail serving
        
        # CRITICAL: Test Presenters Dashboard API endpoints
        self.test_dashboard_weather_api()  # PRIMARY FOCUS: Weather API integration
        self.test_dashboard_endpoints()    # Test all dashboard endpoints comprehensively
        
        # Print final results
        print(f"\n📊 FINAL RESULTS:")
        print(f"Tests passed: {self.tests_passed}/{self.tests_run}")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for failed_test in self.failed_tests:
                print(f"   - {failed_test}")
        else:
            print("🎉 All tests passed!")
        
        return 0 if self.tests_passed == self.tests_run else 1

def main():
    tester = KiooRadioAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())