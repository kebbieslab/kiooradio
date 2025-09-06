import requests
import sys
from datetime import datetime
import json

class Phase2RefinedTester:
    def __init__(self, base_url="https://mission-crm.preview.emergentagent.com/api"):
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

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    if 'application/json' in response.headers.get('content-type', ''):
                        response_data = response.json()
                        if isinstance(response_data, list):
                            print(f"   Response: List with {len(response_data)} items")
                        else:
                            print(f"   Response: {str(response_data)[:100]}...")
                        return success, response_data
                    else:
                        return success, {}
                except:
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

    def test_phase2_refined_requirements(self):
        """Test Phase 2 REFINED schedule modifications as specified in review request"""
        print("\n=== TESTING PHASE 2 REFINED SCHEDULE MODIFICATIONS ===")
        
        # Get all programs
        success, programs = self.run_test("Get All Programs", "GET", "programs", 200)
        
        if not success:
            print("❌ Cannot proceed with Phase 2 testing - programs endpoint failed")
            return
        
        print(f"✅ Programs endpoint accessible, found {len(programs)} programs")
        
        # CRITICAL VERIFICATION 1: Total program count should be 285
        print(f"\n🔍 CRITICAL VERIFICATION 1: Total Program Count (REFINED Phase 2)")
        expected_total = 285
        actual_total = len(programs)
        
        if actual_total == expected_total:
            print(f"✅ Total program count matches expected: {actual_total} programs")
        else:
            print(f"❌ Total program count mismatch: expected {expected_total}, found {actual_total}")
            self.failed_tests.append(f"Phase 2 REFINED - Total count mismatch: expected {expected_total}, found {actual_total}")
        
        # CRITICAL VERIFICATION 2: TTB Restrictions
        print(f"\n🔍 CRITICAL VERIFICATION 2: TTB Restrictions (REFINED Phase 2)")
        ttb_programs = [program for program in programs if 'ttb' in program.get('title', '').lower() or 'through the bible' in program.get('title', '').lower()]
        
        if ttb_programs:
            print(f"Found {len(ttb_programs)} TTB programs")
            
            # 2.1: TTB limited to 2 times daily for English/French/Kissi
            ttb_by_day_language = {}
            for program in ttb_programs:
                day = program.get('day_of_week', '').lower()
                language = program.get('language', '').lower()
                if day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']:
                    key = f"{day}_{language}"
                    ttb_by_day_language[key] = ttb_by_day_language.get(key, 0) + 1
            
            ttb_violations = []
            for key, count in ttb_by_day_language.items():
                day, language = key.split('_')
                if language in ['english', 'french', 'kissi'] and count > 2:
                    ttb_violations.append(f"{day} {language}: {count} TTB programs (should be ≤2)")
            
            if ttb_violations:
                print(f"❌ TTB restriction violations: {ttb_violations}")
                self.failed_tests.append(f"TTB Restrictions - Violations: {ttb_violations}")
            else:
                print(f"✅ TTB correctly limited to ≤2 times daily for English/French/Kissi")
            
            # 2.2: TTB only aired between 6am-10pm
            ttb_time_violations = []
            for program in ttb_programs:
                start_time = program.get('start_time', '')
                if start_time:
                    try:
                        hour = int(start_time.split(':')[0])
                        if hour < 6 or hour >= 22:  # Before 6am or after 10pm
                            ttb_time_violations.append(f"{program.get('title')} at {start_time}")
                    except:
                        pass
            
            if ttb_time_violations:
                print(f"❌ TTB time restriction violations: {ttb_time_violations}")
                self.failed_tests.append(f"TTB Time Restrictions - Violations: {ttb_time_violations}")
            else:
                print(f"✅ TTB correctly aired only between 6am-10pm")
            
            # 2.3: Verify total TTB programs is 30 (2x per day x 3 languages x 5 weekdays)
            expected_ttb_total = 30
            actual_ttb_total = len(ttb_programs)
            if actual_ttb_total == expected_ttb_total:
                print(f"✅ Total TTB programs matches expected: {actual_ttb_total}")
            else:
                print(f"❌ Total TTB programs mismatch: expected {expected_ttb_total}, found {actual_ttb_total}")
                self.failed_tests.append(f"TTB Total Count - Expected {expected_ttb_total}, found {actual_ttb_total}")
        else:
            print(f"❌ No TTB programs found")
            self.failed_tests.append("TTB Programs - No TTB programs found")
        
        # CRITICAL VERIFICATION 3: Christian Teaching Programs
        print(f"\n🔍 CRITICAL VERIFICATION 3: Christian Teaching Programs")
        christian_teaching_programs = [p for p in programs if 'christian teaching' in p.get('title', '').lower()]
        
        # 3.1: Mandingo Christian Teaching at 16:00-16:30
        mandingo_christian = [p for p in christian_teaching_programs if p.get('language', '').lower() == 'mandingo']
        if mandingo_christian:
            mandingo_program = mandingo_christian[0]
            start_time = mandingo_program.get('start_time', '')
            duration = mandingo_program.get('duration_minutes', 0)
            
            if start_time == '16:00' and duration == 30:
                print(f"✅ Mandingo Christian Teaching correctly scheduled at 16:00-16:30")
            else:
                print(f"❌ Mandingo Christian Teaching incorrect schedule: {start_time} for {duration} minutes")
                self.failed_tests.append(f"Mandingo Christian Teaching - Should be 16:00 for 30 minutes, found {start_time} for {duration} minutes")
        else:
            print(f"❌ Mandingo Christian Teaching program not found")
            self.failed_tests.append("Mandingo Christian Teaching - Program not found")
        
        # 3.2: Fula Christian Teaching at 17:00-17:30
        fula_christian = [p for p in christian_teaching_programs if p.get('language', '').lower() == 'fula']
        if fula_christian:
            fula_program = fula_christian[0]
            start_time = fula_program.get('start_time', '')
            duration = fula_program.get('duration_minutes', 0)
            
            if start_time == '17:00' and duration == 30:
                print(f"✅ Fula Christian Teaching correctly scheduled at 17:00-17:30")
            else:
                print(f"❌ Fula Christian Teaching incorrect schedule: {start_time} for {duration} minutes")
                self.failed_tests.append(f"Fula Christian Teaching - Should be 17:00 for 30 minutes, found {start_time} for {duration} minutes")
        else:
            print(f"❌ Fula Christian Teaching program not found")
            self.failed_tests.append("Fula Christian Teaching - Program not found")
        
        # CRITICAL VERIFICATION 4: Gbandi Language Hour
        print(f"\n🔍 CRITICAL VERIFICATION 4: Gbandi Language Hour")
        gbandi_programs = [p for p in programs if p.get('language', '').lower() == 'gbandi']
        monday_gbandi = [p for p in gbandi_programs if p.get('day_of_week', '').lower() == 'monday']
        
        if monday_gbandi:
            gbandi_program = monday_gbandi[0]
            start_time = gbandi_program.get('start_time', '')
            duration = gbandi_program.get('duration_minutes', 0)
            
            if start_time == '19:00' and duration == 60:
                print(f"✅ Gbandi Language Hour correctly scheduled Monday 19:00-20:00")
            else:
                print(f"❌ Gbandi Language Hour incorrect schedule: {start_time} for {duration} minutes")
                self.failed_tests.append(f"Gbandi Language Hour - Should be Monday 19:00 for 60 minutes, found {start_time} for {duration} minutes")
        else:
            print(f"❌ Gbandi Language Hour not found on Monday")
            self.failed_tests.append("Gbandi Language Hour - Not found on Monday")
        
        # CRITICAL VERIFICATION 5: Evening News & Roundup Extended to 1 hour
        print(f"\n🔍 CRITICAL VERIFICATION 5: Evening News & Roundup Extended")
        evening_news_programs = [p for p in programs if 'evening news' in p.get('title', '').lower() or 'news roundup' in p.get('title', '').lower()]
        
        if evening_news_programs:
            for news_program in evening_news_programs:
                start_time = news_program.get('start_time', '')
                duration = news_program.get('duration_minutes', 0)
                
                if start_time == '18:00' and duration == 60:
                    print(f"✅ Evening News & Roundup correctly extended to 1 hour (18:00-19:00)")
                else:
                    print(f"❌ Evening News & Roundup incorrect schedule: {start_time} for {duration} minutes")
                    self.failed_tests.append(f"Evening News & Roundup - Should be 18:00 for 60 minutes, found {start_time} for {duration} minutes")
        else:
            print(f"❌ Evening News & Roundup programs not found")
            self.failed_tests.append("Evening News & Roundup - Programs not found")
        
        # CRITICAL VERIFICATION 6: Music Buffers
        print(f"\n🔍 CRITICAL VERIFICATION 6: Music Buffers")
        music_programs = [p for p in programs if p.get('category', '').lower() == 'music']
        music_30min = [p for p in music_programs if p.get('duration_minutes', 0) == 30]
        
        if music_30min:
            print(f"✅ Found {len(music_30min)} 30-minute music programs for buffering")
            
            # Check if music programs are distributed across different days
            music_days = set(p.get('day_of_week', '').lower() for p in music_30min)
            if len(music_days) >= 5:  # Should be on most weekdays
                print(f"✅ Music buffers distributed across {len(music_days)} days")
            else:
                print(f"⚠️  Music buffers only on {len(music_days)} days, may need better distribution")
        else:
            print(f"❌ No 30-minute music programs found for buffering")
            self.failed_tests.append("Music Buffers - No 30-minute music programs found")
        
        # CRITICAL VERIFICATION 7: Database Totals per Day
        print(f"\n🔍 CRITICAL VERIFICATION 7: Database Totals per Day")
        
        # Get schedule to verify day counts
        success, schedule = self.run_test("Get Programs Schedule", "GET", "programs/schedule", 200)
        
        if success:
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
                        self.failed_tests.append(f"Day Count - {day} expected {expected_count} programs, found {actual_count}")
                else:
                    print(f"❌ {day.title()} missing from schedule")
                    self.failed_tests.append(f"Day Count - {day} missing")

    def run_all_tests(self):
        """Run all Phase 2 REFINED tests"""
        print("🚀 Starting Phase 2 REFINED Schedule Modifications Tests...")
        print(f"Testing against: {self.base_url}")
        
        self.test_phase2_refined_requirements()
        
        # Print final results
        print(f"\n📊 FINAL RESULTS:")
        print(f"Tests passed: {self.tests_passed}/{self.tests_run}")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for i, failed_test in enumerate(self.failed_tests, 1):
                print(f"   {i}. {failed_test}")
        else:
            print(f"\n✅ ALL TESTS PASSED!")
        
        return len(self.failed_tests) == 0

if __name__ == "__main__":
    tester = Phase2RefinedTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)