import pytest

from src.services.url_service import URLService


def test_generate_short_code():
    """Test that short codes are generated correctly."""
    service = URLService()
    code = service.generate_short_code()
    assert len(code) == 6
    assert code.isalnum()


def test_generate_short_code_custom_length():
    """Test generating short codes with custom length."""
    service = URLService()
    code = service.generate_short_code(length=10)
    assert len(code) == 10


def test_create_short_url():
    """Test creating a shortened URL."""
    service = URLService()
    original_url = "https://example.com/very/long/url"
    short_code = service.create_short_url(original_url)

    assert len(short_code) == 6
    assert service.get_original_url(short_code) == original_url


def test_get_original_url_not_found():
    """Test getting a URL that doesn't exist."""
    service = URLService()
    result = service.get_original_url("nonexistent")
    assert result is None


def test_list_all_urls():
    """Test listing all URLs."""
    service = URLService()

    url1 = "https://example.com/1"
    url2 = "https://example.com/2"

    code1 = service.create_short_url(url1)
    code2 = service.create_short_url(url2)

    all_urls = service.list_all_urls()
    assert len(all_urls) == 2
    assert all_urls[code1] == url1
    assert all_urls[code2] == url2


def test_unique_short_codes():
    """Test that generated short codes are unique."""
    service = URLService()
    codes = set()

    for i in range(100):
        code = service.create_short_url(f"https://example.com/{i}")
        assert code not in codes
        codes.add(code)
