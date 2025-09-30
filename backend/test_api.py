import requests
import json

# Test the API endpoints
BASE_URL = "http://localhost:8000"

def test_simulation():
    """Test the simulation endpoint"""
    test_data = {
        "diameter": 100,
        "velocity": 20,
        "density": 3000,
        "lat": 40.7128,
        "lon": -74.0060
    }
    
    try:
        response = requests.post(f"{BASE_URL}/simulate", json=test_data)
        print("✅ Simulation endpoint test:")
        print(f"Status Code: {response.status_code}")
        print("Response:", json.dumps(response.json(), indent=2))
        print("-" * 50)
    except Exception as e:
        print(f"❌ Simulation test failed: {e}")

def test_mitigation():
    """Test the mitigation endpoint"""
    test_data = {
        "diameter": 100,
        "velocity": 20,
        "density": 3000,
        "delta_v": 0.01,
        "time_before_impact": 365,
        "lat": 40.7128,
        "lon": -74.0060
    }
    
    try:
        response = requests.post(f"{BASE_URL}/simulate-mitigation", json=test_data)
        print("✅ Mitigation endpoint test:")
        print(f"Status Code: {response.status_code}")
        print("Response:", json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"❌ Mitigation test failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing Impactor-2025 API Endpoints...")
    test_simulation()
    test_mitigation()