#!/usr/bin/env python3
"""
Test script to verify deployment readiness for Kioo Radio application
"""

import os
import sys
import subprocess
import requests
import time
import signal
from pathlib import Path

def test_backend_startup():
    """Test if backend can start properly"""
    print("🧪 Testing backend startup...")
    
    # Set test environment variables
    os.environ['MONGO_URL'] = 'mongodb://localhost:27017'
    os.environ['DB_NAME'] = 'kioo_radio_test'
    os.environ['PORT'] = '8002'  # Use different port for testing
    os.environ['CORS_ORIGINS'] = '*'
    
    backend_dir = Path(__file__).parent / 'backend'
    os.chdir(backend_dir)
    
    # Start backend process
    try:
        process = subprocess.Popen([
            sys.executable, '-m', 'uvicorn', 'server:app',
            '--host', '0.0.0.0',
            '--port', '8002',
            '--reload'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for startup
        print("⏳ Waiting for backend to start...")
        time.sleep(10)
        
        # Test basic endpoint
        try:
            response = requests.get('http://localhost:8002/', timeout=5)
            if response.status_code == 200:
                print("✅ Backend root endpoint working")
                data = response.json()
                if data.get('status') == 'healthy':
                    print("✅ Backend health check passed")
                else:
                    print("❌ Backend health check failed")
                    return False
            else:
                print(f"❌ Backend returned status {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to connect to backend: {e}")
            return False
        
        # Test health endpoint
        try:
            response = requests.get('http://localhost:8002/health', timeout=10)
            print(f"🔍 Health endpoint status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"📊 Health data: {data}")
            else:
                print(f"⚠️ Health endpoint returned {response.status_code}")
        except Exception as e:
            print(f"⚠️ Health endpoint error: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to start backend: {e}")
        return False
    finally:
        # Cleanup
        if 'process' in locals():
            try:
                process.terminate()
                process.wait(timeout=5)
            except:
                process.kill()
                process.wait()

def test_import_issues():
    """Test for import issues that could prevent startup"""
    print("🧪 Testing imports...")
    
    try:
        sys.path.insert(0, str(Path(__file__).parent / 'backend'))
        
        # Test main server import
        import server
        print("✅ Main server module imports successfully")
        
        # Test ClickUp integration import
        try:
            import clickup_integration
            print("✅ ClickUp integration imports successfully")
        except Exception as e:
            print(f"⚠️ ClickUp integration import warning: {e}")
        
        # Test ClickUp routes import
        try:
            import clickup_routes
            print("✅ ClickUp routes imports successfully")
        except Exception as e:
            print(f"⚠️ ClickUp routes import warning: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Import test failed: {e}")
        return False

def test_environment_variables():
    """Test environment variable handling"""
    print("🧪 Testing environment variables...")
    
    # Test required variables
    required_vars = ['MONGO_URL', 'DB_NAME']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️ Missing environment variables: {missing_vars}")
        # Set test values
        os.environ['MONGO_URL'] = 'mongodb://localhost:27017'
        os.environ['DB_NAME'] = 'kioo_radio_test'
        print("✅ Set test environment variables")
    else:
        print("✅ All required environment variables present")
    
    # Test PORT variable handling
    test_port = os.environ.get('PORT', '8001')
    try:
        port_int = int(test_port)
        print(f"✅ PORT variable valid: {port_int}")
    except ValueError:
        print(f"❌ Invalid PORT variable: {test_port}")
        return False
    
    return True

def main():
    """Run all deployment readiness tests"""
    print("🚀 Kioo Radio Deployment Readiness Test")
    print("=" * 50)
    
    tests = [
        ("Environment Variables", test_environment_variables),
        ("Import Issues", test_import_issues),
        ("Backend Startup", test_backend_startup),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} test...")
        try:
            result = test_func()
            results.append((test_name, result))
            if result:
                print(f"✅ {test_name} test PASSED")
            else:
                print(f"❌ {test_name} test FAILED")
        except Exception as e:
            print(f"❌ {test_name} test ERROR: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED - Ready for deployment!")
        return 0
    else:
        print(f"\n⚠️ {total - passed} test(s) failed - Review issues before deployment")
        return 1

if __name__ == "__main__":
    sys.exit(main())