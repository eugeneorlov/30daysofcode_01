#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/new-project.sh day01-french-flashcards
# Creates a new Vite + React + Tailwind project in apps/

PROJECT_NAME="${1:?Usage: ./scripts/new-project.sh <project-name>}"
PROJECT_DIR="apps/${PROJECT_NAME}"

if [ -d "$PROJECT_DIR" ]; then
  echo "❌ Directory $PROJECT_DIR already exists"
  exit 1
fi

echo "🚀 Creating $PROJECT_NAME..."

# Scaffold Vite + React
pnpm create vite "$PROJECT_DIR" --template react

cd "$PROJECT_DIR"

# Install core dependencies
pnpm add -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom \
  jsdom eslint prettier eslint-plugin-react-hooks eslint-plugin-react-refresh \
  @eslint/js globals

# Configure Tailwind via Vite plugin
cat > vite.config.js << 'VITE'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
  },
});
VITE

# Replace CSS with Tailwind import
cat > src/index.css << 'CSS'
@import "tailwindcss";
CSS

# Vitest setup file
mkdir -p src/test
cat > src/test/setup.js << 'SETUP'
import "@testing-library/jest-dom";
SETUP

# Sample test so `pnpm test` works immediately
cat > src/App.test.jsx << 'TEST'
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });
});
TEST

# Clean up default Vite boilerplate
cat > src/App.jsx << 'APP'
function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-900">
        🚧 ${PROJECT_NAME} — let&apos;s build!
      </h1>
    </div>
  );
}

export default App;
APP

# Replace App.jsx placeholder with actual project name
sed -i "s/\${PROJECT_NAME}/${PROJECT_NAME}/g" src/App.jsx

# Remove default Vite CSS and assets we don't need
rm -f src/App.css

# Update package.json scripts
node -e "
const pkg = require('./package.json');
pkg.scripts = {
  ...pkg.scripts,
  'lint': 'eslint src/',
  'format': 'prettier --write \"src/**/*.{js,jsx,css,json}\"',
  'format:check': 'prettier --check \"src/**/*.{js,jsx,css,json}\"',
  'test': 'vitest run',
  'test:watch': 'vitest'
};
require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo ""
echo "✅ $PROJECT_NAME created!"
echo ""
echo "Next steps:"
echo "  cd $PROJECT_DIR"
echo "  pnpm dev"
echo ""
