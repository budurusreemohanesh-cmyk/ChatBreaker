import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

SAMPLE_CHAT = """12/03/2026, 10:15 - Paula: Hello!
12/03/2026, 10:16 - Liam: Hi Paula!
"""

def test_health_check():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["privacy"] == "local-first-compliant"

def test_analyze_endpoint():
    res = client.post("/api/analyze", json={"raw_text": SAMPLE_CHAT, "threshold_hours": 3})
    assert res.status_code == 200
    data = res.json()
    assert data["overview"]["totalMessages"] == 2
    assert len(data["participants"]) == 2

def test_report_lifecycle():
    # 1. First analyze
    res = client.post("/api/analyze", json={"raw_text": SAMPLE_CHAT})
    analytics = res.json()

    # 2. Save report
    save_res = client.post("/api/report", json={"title": "Test Chat", "analytics": analytics})
    assert save_res.status_code == 200
    report_data = save_res.json()
    report_id = report_data["id"]
    assert report_data["title"] == "Test Chat"

    # 3. Retrieve report
    get_res = client.get(f"/api/report/{report_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == report_id

    # 4. Delete report
    del_res = client.delete(f"/api/report/{report_id}")
    assert del_res.status_code == 200

    # 5. Verify deleted
    get_again = client.get(f"/api/report/{report_id}")
    assert get_again.status_code == 404
