import random
import string


class URLService:
    """Service for managing URL shortening operations."""

    def __init__(self) -> None:
        # In-memory storage: {short_code: original_url}
        self._urls: dict[str, str] = {}

    def generate_short_code(self, length: int = 6) -> str:
        """Generate a random short code."""
        characters = string.ascii_letters + string.digits
        while True:
            code = "".join(random.choices(characters, k=length))
            if code not in self._urls:
                return code

    def create_short_url(self, original_url: str) -> str:
        """Create a shortened URL and return the short code."""
        short_code = self.generate_short_code()
        self._urls[short_code] = original_url
        return short_code

    def get_original_url(self, short_code: str) -> str | None:
        """Get the original URL from a short code."""
        return self._urls.get(short_code)

    def list_all_urls(self) -> dict[str, str]:
        """List all stored URLs."""
        return self._urls.copy()


# Global instance
url_service = URLService()
