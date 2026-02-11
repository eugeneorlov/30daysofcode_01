def test_root_endpoint(client):
    """Test the root health check endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "message" in data


def test_create_short_url(client):
    """Test creating a shortened URL."""
    response = client.post("/api/shorten", json={"url": "https://example.com"})
    assert response.status_code == 201

    data = response.json()
    assert "short_code" in data
    assert data["original_url"] == "https://example.com/"
    assert data["short_url"].startswith("/")


def test_create_short_url_invalid_url(client):
    """Test creating a short URL with invalid URL."""
    response = client.post("/api/shorten", json={"url": "not-a-valid-url"})
    assert response.status_code == 422


def test_list_urls_empty(client):
    """Test listing URLs when none exist (note: this may fail if other tests ran first)."""
    response = client.get("/api/urls")
    assert response.status_code == 200
    data = response.json()
    assert "urls" in data
    assert isinstance(data["urls"], list)


def test_list_urls_with_data(client):
    """Test listing URLs after creating some."""
    # Create a few URLs
    client.post("/api/shorten", json={"url": "https://example.com/1"})
    client.post("/api/shorten", json={"url": "https://example.com/2"})

    response = client.get("/api/urls")
    assert response.status_code == 200
    data = response.json()
    assert len(data["urls"]) >= 2


def test_redirect_to_url(client):
    """Test redirecting from a short code."""
    # Create a short URL
    create_response = client.post("/api/shorten", json={"url": "https://example.com"})
    short_code = create_response.json()["short_code"]

    # Test redirect
    response = client.get(f"/{short_code}", follow_redirects=False)
    assert response.status_code == 307
    assert response.headers["location"] == "https://example.com/"


def test_redirect_not_found(client):
    """Test redirecting with non-existent short code."""
    response = client.get("/nonexistent")
    assert response.status_code == 404
