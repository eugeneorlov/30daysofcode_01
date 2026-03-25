#!/usr/bin/env python3
"""Seed script to populate the database with example pastes."""

import sys
from pathlib import Path

# Add the src directory to the path so we can import our modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.database import create_db_and_tables, get_session
from src.models.paste import PasteCreate
from src.services import paste_service


def main():
    """Seed the database with example pastes."""
    print("🌱 Seeding database with example pastes...")

    # Ensure database and tables exist
    create_db_and_tables()

    # Example pastes with realistic content
    seed_pastes = [
        {
            "content": """def fibonacci(n):
    \"\"\"Generate fibonacci sequence up to n terms.\"\"\"
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]

    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])

    return sequence

# Example usage
print(fibonacci(10))""",
            "title": "Fibonacci Generator",
            "language": "python"
        },
        {
            "content": """// Simple Todo App Component
import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, done: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
            {todo.done ? '✓' : '○'} {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;""",
            "title": "React Todo App",
            "language": "javascript"
        },
        {
            "content": """-- User management schema with audit trail
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);

-- Insert sample admin user
INSERT INTO users (email, username, password_hash)
VALUES ('admin@example.com', 'admin', '$2b$12$...');""",
            "title": "User Management Schema",
            "language": "sql"
        },
        {
            "content": """Project Meeting Notes - March 25, 2026

ATTENDEES:
- Sarah (Product Manager)
- Mike (Lead Developer)
- Jenny (UX Designer)
- Alex (DevOps)

AGENDA ITEMS DISCUSSED:

1. Sprint Review
   - Completed 8/10 user stories
   - 2 stories moved to next sprint due to API changes
   - Overall velocity looking good

2. Upcoming Features
   - User authentication system (Priority: High)
   - Dark mode toggle (Priority: Medium)
   - Export functionality (Priority: Low)

3. Technical Debt
   - Need to refactor the legacy payment module
   - Upgrade React from v17 to v18
   - Database migration scripts need review

ACTION ITEMS:
[ ] Mike: Create tickets for auth system implementation
[ ] Jenny: Finalize dark mode mockups by Friday
[ ] Alex: Set up staging environment for testing
[ ] Sarah: Schedule stakeholder demo for next week

NEXT MEETING: April 1, 2026 at 2:00 PM""",
            "title": "Sprint Planning Meeting Notes",
            "language": "plaintext"
        },
        {
            "content": """#!/bin/bash

# Automated deployment script for web applications
# Usage: ./deploy.sh [staging|production]

set -e  # Exit on any error

ENVIRONMENT=${1:-staging}
PROJECT_NAME="webapp"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 Starting deployment to $ENVIRONMENT..."

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Error: Environment must be 'staging' or 'production'"
    exit 1
fi

# Load environment-specific configuration
source config/$ENVIRONMENT.env

echo "📦 Building application..."
npm ci --production
npm run build

echo "🧪 Running tests..."
npm test

echo "📸 Creating backup..."
BACKUP_DIR="backups/${PROJECT_NAME}_${ENVIRONMENT}_${TIMESTAMP}"
mkdir -p $BACKUP_DIR

echo "🔄 Deploying to $ENVIRONMENT..."
rsync -avz --delete build/ $DEPLOY_PATH/

echo "🔄 Restarting services..."
sudo systemctl restart nginx
sudo systemctl restart $PROJECT_NAME

echo "✅ Deployment completed successfully!"
echo "📊 Application available at: $APP_URL"
""",
            "title": "Deployment Script",
            "language": "bash"
        }
    ]

    # Create pastes using the paste service
    session_gen = get_session()
    session = next(session_gen)

    try:
        created_pastes = []
        for paste_data in seed_pastes:
            paste_create = PasteCreate(**paste_data)
            paste = paste_service.create_paste(session, paste_create)
            created_pastes.append(paste)
            print(f"✅ Created paste: '{paste.title}' ({paste.language}) - ID: {paste.short_id}")

        print(f"\n🎉 Successfully seeded {len(created_pastes)} example pastes!")
        print("\nCreated pastes:")
        for paste in created_pastes:
            print(f"  - {paste.title} ({paste.language}): {paste.short_id}")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        sys.exit(1)
    finally:
        session.close()


if __name__ == "__main__":
    main()