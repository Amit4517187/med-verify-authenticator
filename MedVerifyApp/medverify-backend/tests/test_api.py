import pytest
import os
import json

def test_health_endpoint(client):
    """Test that the health check returns 200 and assigns a Request ID."""
    response = client.get('/health')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data["status"] == "alive"
    assert data["engine"] == "MedVerify"
    
    # Check if the Request-ID header is present
    assert 'X-Request-ID' in response.headers
    assert len(response.headers['X-Request-ID']) > 0

def test_analyze_missing_input(client):
    """Test that the /analyze endpoint rejects requests without medicine data."""
    # Note: For /analyze we need to send the correct API key, or it returns 401 Unauthorized
    api_key = os.getenv('MEDVERIFY_ACCESS_TOKEN', '')
    headers = {
        'X-API-Key': api_key
    }
    
    response = client.post('/analyze', headers=headers)
    
    # It should return 400 Bad Request because no image or text was provided
    assert response.status_code == 400
    
    data = response.get_json()
    assert data["status"] == "error"
    assert "No input provided" in data["message"]
    
def test_rate_limit(client):
    """Test that rate limiting blocks excessive requests."""
    # /verify-batch has a strict limit of 10 per minute.
    # We will just hit it 11 times.
    for i in range(10):
        client.post('/verify-batch')
        
    response = client.post('/verify-batch')
    assert response.status_code == 429

def test_unauthorized_analyze(client):
    """Test that /analyze returns 401 if API key is missing."""
    response = client.post('/analyze')
    assert response.status_code == 401
    
    data = response.get_json()
    assert data["status"] == "error"
    assert data["message"] == "Unauthorized"
