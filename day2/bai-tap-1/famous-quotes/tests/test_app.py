import json
import os
import pytest
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import app, load_quotes


@pytest.fixture
def client():
    """Create a test client for the Flask application."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_quotes_file_contains_100_valid_quotes():
    """Verify that quotes.json exists and contains exactly 100 properly structured bilingual quotes."""
    quotes = load_quotes()
    assert len(quotes) == 100, f"Expected exactly 100 quotes, found {len(quotes)}"

    seen_ids = set()
    for q in quotes:
        # Check required fields
        assert "id" in q, "Missing 'id' field in quote"
        assert "quote_en" in q, "Missing 'quote_en' field in quote"
        assert "quote_vi" in q, "Missing 'quote_vi' field in quote"
        assert "author" in q, "Missing 'author' field in quote"
        assert "category" in q, "Missing 'category' field in quote"

        # Check non-empty strings
        assert isinstance(q["id"], int), "Quote ID must be an integer"
        assert len(q["quote_en"].strip()) > 0, "quote_en cannot be empty"
        assert len(q["quote_vi"].strip()) > 0, "quote_vi cannot be empty"
        assert len(q["author"].strip()) > 0, "author cannot be empty"
        assert len(q["category"].strip()) > 0, "category cannot be empty"

        # Unique IDs
        assert q["id"] not in seen_ids, f"Duplicate quote id: {q['id']}"
        seen_ids.add(q["id"])


def test_index_route(client):
    """Verify that the home page returns 200 and loads HTML with essential elements."""
    response = client.get("/")
    assert response.status_code == 200
    html = response.data.decode("utf-8")
    assert "Danh Ngôn Bất Hủ" in html
    assert "hero-quote-card" in html
    assert "search-input" in html
    assert "fav-modal" in html
    assert "btn-theme-toggle" in html
    assert "btn-export-csv" in html
    assert "btn-speak-en" in html
    assert "btn-speak-vi" in html


def test_get_random_quote(client):
    """Test retrieving a random quote."""
    response = client.get("/api/quotes/random")
    assert response.status_code == 200
    data = response.get_json()
    assert "id" in data
    assert "quote_en" in data
    assert "quote_vi" in data
    assert "author" in data
    assert "category" in data


def test_get_random_quote_filtered_by_category(client):
    """Test retrieving a random quote filtered by category."""
    response = client.get("/api/quotes/random?category=Wisdom")
    assert response.status_code == 200
    data = response.get_json()
    assert data["category"] == "Wisdom"


def test_get_random_quote_nonexistent_criteria(client):
    """Test retrieving a random quote with impossible filters returns 404."""
    response = client.get("/api/quotes/random?category=nonexistent_xyz_99")
    assert response.status_code == 404
    data = response.get_json()
    assert "error" in data


def test_get_all_quotes(client):
    """Test retrieving all quotes via API."""
    response = client.get("/api/quotes")
    assert response.status_code == 200
    data = response.get_json()
    assert data["count"] == 100
    assert len(data["quotes"]) == 100


def test_filter_quotes_by_category(client):
    """Test filtering quotes by category."""
    response = client.get("/api/quotes?category=Courage")
    assert response.status_code == 200
    data = response.get_json()
    assert data["count"] > 0
    for q in data["quotes"]:
        assert q["category"] == "Courage"


def test_search_quotes_by_author(client):
    """Test searching quotes by author name."""
    response = client.get("/api/quotes?author=Steve Jobs")
    assert response.status_code == 200
    data = response.get_json()
    assert data["count"] >= 2
    for q in data["quotes"]:
        assert "steve jobs" in q["author"].lower()


def test_search_quotes_vietnamese_text(client):
    """Test searching quotes using Vietnamese keyword."""
    response = client.get("/api/quotes?search=thành công")
    assert response.status_code == 200
    data = response.get_json()
    assert data["count"] > 0


def test_get_quote_by_id(client):
    """Test retrieving a single quote by its ID."""
    response = client.get("/api/quotes/1")
    assert response.status_code == 200
    data = response.get_json()
    assert data["id"] == 1
    assert data["author"] == "Steve Jobs"

    # Nonexistent ID
    response_404 = client.get("/api/quotes/9999")
    assert response_404.status_code == 404


def test_get_categories(client):
    """Test retrieving categories and verify sum of counts equals 100."""
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.get_json()
    assert data["total"] > 0
    total_count = sum(c["count"] for c in data["categories"])
    assert total_count == 100


def test_get_authors(client):
    """Test retrieving authors list."""
    response = client.get("/api/authors")
    assert response.status_code == 200
    data = response.get_json()
    assert data["total"] > 0
    assert "Albert Einstein" in data["authors"]
