#!/usr/bin/env python3
"""
Comprehensive End-to-End Backend Testing for Kioo Dashboard: GMT + Farmer Messages
Focus: /api/dashboard/farmer-weather endpoint verification
"""

import requests
import json
import time
from datetime import datetime, timezone
import sys

class ComprehensiveFarmerWeatherTester:
    def __init__(self):
        # Use the production URL from frontend/.env
        self.base_url = "https://farmer-weather.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.critical_issues = []
        self.minor_issues = []
        
    def log_result(self, test_name, success, message="", is_critical=True):
        """Log test result and categorize issues"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name}: {message}")
        else:
            if is_critical:
                self.critical_issues.append(f"{test_name}: {message}")
                print(f"❌ {test_name}: {message}")
            else:
                self.minor_issues.append(f"{test_name}: {message}")
                print(f"⚠️  {test_name}: {message}")
            self.failed_tests.append(f"{test_name}: {message}")

    def test_endpoint_accessibility(self):
        """Test 1: Complete API endpoint verification"""
        print("\n🔍 TEST 1: COMPLETE API ENDPOINT VERIFICATION")
        print("=" * 60)
        
        try:
            response = requests.get(f"{self.base_url}/dashboard/farmer-weather", timeout=10)
            
            if response.status_code == 200:
                self.log_result("Endpoint Access", True, f"HTTP 200 - Endpoint accessible")
                
                # Verify JSON response
                try:
                    data = response.json()
                    self.log_result("JSON Response", True, "Valid JSON structure returned")
                    return data
                except json.JSONDecodeError as e:
                    self.log_result("JSON Response", False, f"Invalid JSON: {e}")
                    return None
            else:
                self.log_result("Endpoint Access", False, f"HTTP {response.status_code} - {response.text[:100]}")
                return None
                
        except requests.exceptions.Timeout:
            self.log_result("Endpoint Access", False, "Request timeout (>10s)")
            return None
        except requests.exceptions.RequestException as e:
            self.log_result("Endpoint Access", False, f"Request failed: {e}")
            return None

    def test_location_coverage(self, data):
        """Test 2: Verify all 4 locations are present"""
        print("\n🔍 TEST 2: LOCATION COVERAGE VERIFICATION")
        print("=" * 60)
        
        expected_locations = [
            "Foya, Liberia",
            "Koindu, Sierra Leone", 
            "Guéckédou, Guinea",
            "Kissidougou, Guinea"
        ]
        
        if not data or 'locations' not in data:
            self.log_result("Location Structure", False, "Missing 'locations' field in response")
            return False
            
        locations = data['locations']
        if not isinstance(locations, list):
            self.log_result("Location Structure", False, f"'locations' should be list, got {type(locations)}")
            return False
            
        found_locations = []
        for location in locations:
            if isinstance(location, dict) and 'location' in location:
                found_locations.append(location['location'])
        
        # Check count
        if len(found_locations) == 4:
            self.log_result("Location Count", True, f"Found all 4 locations")
        else:
            self.log_result("Location Count", False, f"Expected 4 locations, found {len(found_locations)}")
        
        # Check specific locations
        missing_locations = [loc for loc in expected_locations if loc not in found_locations]
        if not missing_locations:
            self.log_result("Location Names", True, "All expected locations present")
        else:
            self.log_result("Location Names", False, f"Missing locations: {missing_locations}")
        
        print(f"   Expected: {expected_locations}")
        print(f"   Found: {found_locations}")
        
        return len(missing_locations) == 0

    def test_data_quality_validation(self, data):
        """Test 3: Data quality validation - realistic values"""
        print("\n🔍 TEST 3: DATA QUALITY VALIDATION")
        print("=" * 60)
        
        if not data or 'locations' not in data:
            return False
            
        all_realistic = True
        fallback_detected = False
        
        for location_data in data['locations']:
            location_name = location_data.get('location', 'Unknown')
            now_data = location_data.get('now', {})
            
            print(f"\n📍 {location_name}:")
            
            # Extract values
            temp = now_data.get('tempC', 0)
            humidity = now_data.get('humidityPct', 0)
            wind = now_data.get('windKph', 0)
            rain_prob = now_data.get('rainProbPct', 0)
            rain_mm = now_data.get('rainMmHr', 0)
            
            print(f"   Temperature: {temp}°C")
            print(f"   Humidity: {humidity}%")
            print(f"   Wind: {wind} km/h")
            print(f"   Rain Probability: {rain_prob}%")
            print(f"   Rain Rate: {rain_mm} mm/hr")
            
            # Check for fallback patterns
            if temp == 25 and humidity == 75 and wind == 10 and rain_prob == 30:
                self.log_result(f"{location_name} Data Quality", False, "Using fallback data (static values)")
                fallback_detected = True
                all_realistic = False
            elif temp == 0 and humidity == 0 and wind == 0 and rain_prob == 0:
                self.log_result(f"{location_name} Data Quality", False, "Using zero fallback data")
                fallback_detected = True
                all_realistic = False
            else:
                # Validate realistic ranges for West Africa
                temp_valid = 15 <= temp <= 45  # Reasonable for West Africa
                humidity_valid = 30 <= humidity <= 100
                wind_valid = 0 <= wind <= 50
                rain_prob_valid = 0 <= rain_prob <= 100
                rain_mm_valid = 0 <= rain_mm <= 50
                
                if all([temp_valid, humidity_valid, wind_valid, rain_prob_valid, rain_mm_valid]):
                    self.log_result(f"{location_name} Data Quality", True, "Realistic live weather data")
                else:
                    issues = []
                    if not temp_valid: issues.append(f"temp={temp}°C")
                    if not humidity_valid: issues.append(f"humidity={humidity}%")
                    if not wind_valid: issues.append(f"wind={wind}km/h")
                    if not rain_prob_valid: issues.append(f"rain_prob={rain_prob}%")
                    if not rain_mm_valid: issues.append(f"rain_mm={rain_mm}mm/hr")
                    
                    self.log_result(f"{location_name} Data Quality", False, f"Unrealistic values: {', '.join(issues)}")
                    all_realistic = False
        
        # Overall assessment
        if all_realistic and not fallback_detected:
            self.log_result("Overall Data Quality", True, "All locations have realistic live weather data")
        elif fallback_detected:
            self.log_result("Overall Data Quality", False, "Some/all locations using fallback data")
        else:
            self.log_result("Overall Data Quality", False, "Some locations have unrealistic data")
            
        return all_realistic and not fallback_detected

    def test_response_structure(self, data):
        """Test 4: Response structure verification"""
        print("\n🔍 TEST 4: RESPONSE STRUCTURE VERIFICATION")
        print("=" * 60)
        
        if not data:
            return False
            
        # Check top-level structure
        required_top_fields = ['locations', 'updated', 'cache_duration_minutes', 'timezone']
        missing_top_fields = [field for field in required_top_fields if field not in data]
        
        if not missing_top_fields:
            self.log_result("Top-level Structure", True, "All required top-level fields present")
        else:
            self.log_result("Top-level Structure", False, f"Missing fields: {missing_top_fields}")
        
        # Check locations structure
        locations = data.get('locations', [])
        structure_valid = True
        
        for i, location in enumerate(locations):
            location_name = location.get('location', f'Location {i+1}')
            
            # Check required location fields
            required_location_fields = ['location', 'now', 'hourly', 'daily']
            missing_location_fields = [field for field in required_location_fields if field not in location]
            
            if missing_location_fields:
                self.log_result(f"{location_name} Structure", False, f"Missing fields: {missing_location_fields}")
                structure_valid = False
            else:
                # Check 'now' structure
                now_data = location.get('now', {})
                required_now_fields = ['tempC', 'humidityPct', 'windKph', 'cloudPct', 'rainProbPct', 'rainMmHr']
                missing_now_fields = [field for field in required_now_fields if field not in now_data]
                
                if missing_now_fields:
                    self.log_result(f"{location_name} 'now' Structure", False, f"Missing fields: {missing_now_fields}")
                    structure_valid = False
                else:
                    self.log_result(f"{location_name} 'now' Structure", True, "Complete current weather data")
                
                # Check hourly structure
                hourly_data = location.get('hourly', [])
                if isinstance(hourly_data, list) and len(hourly_data) > 0:
                    first_hour = hourly_data[0]
                    required_hourly_fields = ['timeIsoUTC', 'tempC', 'rainProbPct', 'rainMmHr']
                    missing_hourly_fields = [field for field in required_hourly_fields if field not in first_hour]
                    
                    if missing_hourly_fields:
                        self.log_result(f"{location_name} Hourly Structure", False, f"Missing fields: {missing_hourly_fields}")
                        structure_valid = False
                    else:
                        self.log_result(f"{location_name} Hourly Structure", True, f"72-hour forecast ({len(hourly_data)} hours)")
                else:
                    self.log_result(f"{location_name} Hourly Structure", False, "Missing or empty hourly data")
                    structure_valid = False
                
                # Check daily structure
                daily_data = location.get('daily', [])
                if isinstance(daily_data, list) and len(daily_data) > 0:
                    first_day = daily_data[0]
                    required_daily_fields = ['dateIsoUTC', 'rainProbMaxPct', 'rainSumMm']
                    missing_daily_fields = [field for field in required_daily_fields if field not in first_day]
                    
                    if missing_daily_fields:
                        self.log_result(f"{location_name} Daily Structure", False, f"Missing fields: {missing_daily_fields}")
                        structure_valid = False
                    else:
                        self.log_result(f"{location_name} Daily Structure", True, f"3-day outlook ({len(daily_data)} days)")
                else:
                    self.log_result(f"{location_name} Daily Structure", False, "Missing or empty daily data")
                    structure_valid = False
        
        return structure_valid

    def test_performance(self):
        """Test 5: Performance testing - response times"""
        print("\n🔍 TEST 5: PERFORMANCE TESTING")
        print("=" * 60)
        
        response_times = []
        
        for i in range(3):
            start_time = time.time()
            try:
                response = requests.get(f"{self.base_url}/dashboard/farmer-weather", timeout=15)
                response_time = time.time() - start_time
                response_times.append(response_time)
                
                if response.status_code == 200:
                    print(f"   Test {i+1}: {response_time:.2f}s - ✅")
                else:
                    print(f"   Test {i+1}: {response_time:.2f}s - ❌ HTTP {response.status_code}")
                    
            except requests.exceptions.Timeout:
                response_time = 15.0  # Timeout value
                response_times.append(response_time)
                print(f"   Test {i+1}: TIMEOUT (>15s) - ❌")
            except Exception as e:
                print(f"   Test {i+1}: ERROR - {e}")
            
            time.sleep(1)  # Avoid rate limiting
        
        if response_times:
            avg_time = sum(response_times) / len(response_times)
            max_time = max(response_times)
            
            print(f"\n   Average Response Time: {avg_time:.2f}s")
            print(f"   Maximum Response Time: {max_time:.2f}s")
            
            # Performance criteria
            if max_time < 2.0:
                self.log_result("Response Time", True, f"Excellent performance (max: {max_time:.2f}s)")
            elif max_time < 5.0:
                self.log_result("Response Time", True, f"Good performance (max: {max_time:.2f}s)")
            elif max_time < 10.0:
                self.log_result("Response Time", True, f"Acceptable performance (max: {max_time:.2f}s)", is_critical=False)
            else:
                self.log_result("Response Time", False, f"Slow performance (max: {max_time:.2f}s)")
            
            return max_time < 10.0
        
        return False

    def test_open_meteo_integration(self, data):
        """Test 6: Open-Meteo API integration verification"""
        print("\n🔍 TEST 6: OPEN-METEO API INTEGRATION")
        print("=" * 60)
        
        if not data:
            return False
        
        # Check for error field indicating API issues
        if 'error' in data:
            error_msg = data.get('error')
            self.log_result("Open-Meteo Integration", False, f"API error detected: {error_msg}")
            return False
        
        # Check data freshness
        updated_str = data.get('updated', '')
        if updated_str:
            try:
                updated_time = datetime.fromisoformat(updated_str.replace('Z', '+00:00'))
                now_time = datetime.now(timezone.utc)
                age_minutes = (now_time - updated_time).total_seconds() / 60
                
                print(f"   Data Age: {age_minutes:.1f} minutes")
                
                if age_minutes < 30:
                    self.log_result("Data Freshness", True, f"Fresh data ({age_minutes:.1f} min old)")
                else:
                    self.log_result("Data Freshness", False, f"Stale data ({age_minutes:.1f} min old)", is_critical=False)
                    
            except Exception as e:
                self.log_result("Data Freshness", False, f"Cannot parse timestamp: {e}", is_critical=False)
        
        # Check cache settings
        cache_duration = data.get('cache_duration_minutes', 0)
        if cache_duration == 15:
            self.log_result("Cache Configuration", True, "Correct 15-minute cache duration")
        else:
            self.log_result("Cache Configuration", False, f"Unexpected cache duration: {cache_duration} min", is_critical=False)
        
        # Verify timezone
        timezone_val = data.get('timezone', '')
        if timezone_val == 'UTC':
            self.log_result("Timezone Configuration", True, "Correct UTC timezone")
        else:
            self.log_result("Timezone Configuration", False, f"Unexpected timezone: {timezone_val}", is_critical=False)
        
        return True

    def test_fallback_system(self):
        """Test 7: Fallback system testing"""
        print("\n🔍 TEST 7: FALLBACK SYSTEM TESTING")
        print("=" * 60)
        
        # This test verifies that the system handles errors gracefully
        # We can't easily simulate API failures, but we can check the fallback structure
        
        try:
            response = requests.get(f"{self.base_url}/dashboard/farmer-weather", timeout=5)
            if response.status_code == 200:
                data = response.json()
                
                # Check if fallback data structure is present when needed
                if 'error' in data:
                    # System is in fallback mode
                    locations = data.get('locations', [])
                    if len(locations) == 4:
                        self.log_result("Fallback Structure", True, "Fallback provides all 4 locations")
                        
                        # Check fallback data quality
                        fallback_valid = True
                        for location in locations:
                            now_data = location.get('now', {})
                            if not all(field in now_data for field in ['tempC', 'humidityPct', 'windKph', 'rainProbPct']):
                                fallback_valid = False
                                break
                        
                        if fallback_valid:
                            self.log_result("Fallback Data Quality", True, "Fallback data has required structure")
                        else:
                            self.log_result("Fallback Data Quality", False, "Fallback data missing required fields")
                    else:
                        self.log_result("Fallback Structure", False, f"Fallback has {len(locations)} locations, expected 4")
                else:
                    # System is working normally
                    self.log_result("Fallback System", True, "API working normally, fallback not needed")
                
                return True
                
        except Exception as e:
            self.log_result("Fallback System", False, f"Cannot test fallback: {e}")
            return False

    def run_comprehensive_test(self):
        """Run all comprehensive tests"""
        print("🎵 COMPREHENSIVE KIOO DASHBOARD FARMER WEATHER TESTING")
        print("=" * 70)
        print("Focus: End-to-end backend testing for /api/dashboard/farmer-weather")
        print("Locations: Foya Liberia, Koindu Sierra Leone, Guéckédou Guinea, Kissidougou Guinea")
        print("=" * 70)
        
        # Test 1: Endpoint accessibility
        data = self.test_endpoint_accessibility()
        
        if data:
            # Test 2: Location coverage
            self.test_location_coverage(data)
            
            # Test 3: Data quality
            self.test_data_quality_validation(data)
            
            # Test 4: Response structure
            self.test_response_structure(data)
            
            # Test 6: Open-Meteo integration
            self.test_open_meteo_integration(data)
        
        # Test 5: Performance (independent)
        self.test_performance()
        
        # Test 7: Fallback system
        self.test_fallback_system()
        
        # Final summary
        self.print_final_summary()

    def print_final_summary(self):
        """Print comprehensive test summary"""
        print("\n" + "=" * 70)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 70)
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print(f"Total Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        if self.critical_issues:
            print(f"\n❌ CRITICAL ISSUES ({len(self.critical_issues)}):")
            for issue in self.critical_issues:
                print(f"   • {issue}")
        
        if self.minor_issues:
            print(f"\n⚠️  MINOR ISSUES ({len(self.minor_issues)}):")
            for issue in self.minor_issues:
                print(f"   • {issue}")
        
        if not self.critical_issues and not self.minor_issues:
            print(f"\n✅ ALL TESTS PASSED - NO ISSUES FOUND!")
            print(f"   The farmer weather API is working perfectly!")
        elif not self.critical_issues:
            print(f"\n✅ NO CRITICAL ISSUES - API IS FUNCTIONAL!")
            print(f"   Minor issues noted but core functionality works.")
        else:
            print(f"\n❌ CRITICAL ISSUES FOUND - REQUIRES ATTENTION!")
        
        print("=" * 70)

if __name__ == "__main__":
    tester = ComprehensiveFarmerWeatherTester()
    tester.run_comprehensive_test()