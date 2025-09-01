import requests
import sys
from datetime import datetime
import json

class KiooRadioAPITester:
    def __init__(self, base_url="https://kioo-mission.preview.emergentagent.com/api"):
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
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(response_data) <= 3:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    else:
                        print(f"   Response: {str(response_data)[:100]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                self.failed_tests.append(f"{name} - Expected {expected_status}, got {response.status_code}")
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if success and response.text else {}

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
        """Test programs-related endpoints"""
        print("\n=== TESTING PROGRAMS ENDPOINTS ===")
        
        # Test get all programs
        success, programs = self.run_test("Get All Programs", "GET", "programs", 200)
        
        # Test get programs schedule
        self.run_test("Get Programs Schedule", "GET", "programs/schedule", 200)
        
        # Test filtered programs
        self.run_test("Get English Programs", "GET", "programs", 200, params={"language": "english"})
        self.run_test("Get Monday Programs", "GET", "programs", 200, params={"day": "monday"})
        
        # Test create program
        program_data = {
            "title": "Test Program",
            "description": "A test program for API testing",
            "host": "Test Host",
            "language": "english",
            "category": "talk",
            "day_of_week": "monday",
            "start_time": "10:00",
            "duration_minutes": 60
        }
        self.run_test("Create Program", "POST", "programs", 200, data=program_data)

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
        """Test About page settings endpoints - CRITICAL for Kioo Radio website"""
        print("\n=== TESTING ABOUT PAGE SETTINGS ENDPOINTS ===")
        
        # Test GET /api/about-page-settings
        success, settings_data = self.run_test("Get About Page Settings", "GET", "about-page-settings", 200)
        
        if success:
            print(f"✅ About page settings endpoint accessible")
            
            # Verify required fields are present
            required_fields = [
                'visionTitle', 'visionContent',
                'timelineTitle', 'timelineItems', 
                'kissiTitle', 'kissiContent',
                'radioProjectPptUrl', 'maruRadioProposalPdfUrl'
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
            
            # Verify Vision 2005 section content
            if 'visionTitle' in settings_data and 'visionContent' in settings_data:
                vision_title = settings_data['visionTitle']
                vision_content = settings_data['visionContent']
                
                if "Vision (2005)" in vision_title:
                    print(f"✅ Vision title contains expected text")
                else:
                    print(f"❌ Vision title unexpected: {vision_title}")
                
                if "Joseph Kebbie" in vision_content and "Cape Town" in vision_content:
                    print(f"✅ Vision content contains Joseph Kebbie's Cape Town story")
                else:
                    print(f"❌ Vision content missing expected elements")
                    self.failed_tests.append("About Page Settings - Vision content missing Joseph Kebbie Cape Town story")
            
            # Verify timeline section
            if 'timelineItems' in settings_data:
                timeline_items = settings_data['timelineItems']
                if isinstance(timeline_items, list):
                    print(f"✅ Timeline items is a list with {len(timeline_items)} items")
                    
                    # Check for expected 7 timeline items (2005-2025)
                    if len(timeline_items) == 7:
                        print(f"✅ Timeline has expected 7 items")
                        
                        # Verify timeline spans 2005-2025
                        years = [item.get('year', '') for item in timeline_items if isinstance(item, dict)]
                        if '2005' in years and '2025' in years:
                            print(f"✅ Timeline spans from 2005 to 2025 as expected")
                        else:
                            print(f"❌ Timeline doesn't span expected years. Found years: {years}")
                    else:
                        print(f"❌ Timeline has {len(timeline_items)} items, expected 7")
                        self.failed_tests.append(f"About Page Settings - Timeline has {len(timeline_items)} items, expected 7")
                else:
                    print(f"❌ Timeline items is not a list: {type(timeline_items)}")
                    self.failed_tests.append("About Page Settings - Timeline items is not a list")
            
            # Verify Kissi people section
            if 'kissiContent' in settings_data:
                kissi_content = settings_data['kissiContent']
                if "Kissi people" in kissi_content and "cultural" in kissi_content.lower():
                    print(f"✅ Kissi content explains cultural significance")
                else:
                    print(f"❌ Kissi content missing cultural explanation")
                    self.failed_tests.append("About Page Settings - Kissi content missing cultural significance")
            
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

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Kioo Radio API Tests...")
        print(f"Testing against: {self.base_url}")
        
        self.test_basic_endpoints()
        self.test_programs_endpoints()
        self.test_impact_stories_endpoints()
        self.test_news_endpoints()
        self.test_donations_endpoints()
        self.test_contact_endpoints()
        self.test_newsletter_signup_endpoint()
        self.test_church_partners_endpoints()  # Add the new test
        
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