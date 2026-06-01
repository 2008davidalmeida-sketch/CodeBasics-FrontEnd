# Setup Guide - CodeBasics Frontend

This guide provides step-by-step instructions for setting up the CodeBasics frontend project for local development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### System Requirements
- **RAM**: Minimum 4GB
- **Disk Space**: Minimum 2GB
- **OS**: Windows, macOS, or Linux

---

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/codebasics-frontend.git

# Navigate to project directory
cd CodeBasics-FrontEnd/CodeBasics
```

### 2. Install Dependencies

```bash
# Install npm packages
npm install

# Verify installation
npm list
```

This will install:
- React 19 and React DOM
- React Router DOM for navigation
- Axios for HTTP requests
- CodeMirror for code editing
- Three.js for 3D graphics
- Skulpt for Python code execution
- And other utilities

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Feature Flags (optional)
VITE_ENABLE_TEACHER_DASHBOARD=true
VITE_ENABLE_ANALYTICS=true

# Optional: Add any other environment variables
```

**Environment Variables Reference:**
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |
| `VITE_ENABLE_TEACHER_DASHBOARD` | Enable teacher features | `true` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `true` |

### 4. Start Development Server

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

You should see output similar to:
```
  VITE v8.0.10  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

---

## 📦 NPM Scripts

### Available Commands

```bash
# Development
npm run dev          # Start development server with hot reload

# Production Build
npm run build        # Build for production (optimized)
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint to check code style

# Type Checking
npm run type-check   # Run TypeScript compiler (no build)
```

### Scripts Configuration
Located in `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

---

## 🛠️ Development Setup

### 1. IDE Configuration

#### VS Code Recommended Extensions
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

#### VS Code Settings (`.vscode/settings.json`)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### 2. Git Configuration

```bash
# Configure git hooks (recommended)
git config core.hooksPath .husky

# Or use a pre-commit hook to run lint
```

### 3. TypeScript Configuration

TypeScript is configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true
  }
}
```

---

## 🔌 Backend Integration

### API Server Setup

The frontend expects a backend API server running at `http://localhost:5000` (or as configured in `.env.local`).

#### Required Backend Endpoints
```
POST /auth/google         - Google OAuth callback
GET  /auth/me            - Get current user
POST /auth/logout        - Logout user
GET  /challenges         - Get all challenges
GET  /challenges/:id     - Get specific challenge
POST /submissions        - Create submission
GET  /submissions/me     - Get user submissions
DELETE /submissions/:id  - Delete submission
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint specs.

### Testing Without Backend

For frontend-only development, you can mock API responses:

```typescript
// src/services/api.ts
// Add mock responses for testing
api.interceptors.response.use(response => {
  // Mock data for development
  if (response.config.url === '/challenges') {
    return Promise.resolve({
      data: [
        { id: '1', title: 'Hello World', difficulty: 'easy' }
      ]
    })
  }
  return response
})
```

---

## 🐳 Docker Setup (Optional)

### Build Docker Image

```bash
# Build the Docker image
docker build -t codebasics-frontend .

# Run the container
docker run -p 3000:80 codebasics-frontend
```

### Docker Compose

```bash
# Start services with Docker Compose
docker-compose up -d

# Stop services
docker-compose down
```

**docker-compose.yml** services:
- Frontend (Vite dev server on port 5173)
- Backend API (assumed on port 5000)

---

## 🧪 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Edit files and the development server will auto-reload:
- Changes to `.tsx` files: Hot Module Replacement (HMR)
- Changes to `.css` files: Instant reload
- Changes to `.ts` files: Full page reload

### 3. Run Linting

```bash
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

### 4. Build Before Committing

```bash
npm run build
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <PID>
```

#### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Hot Reload Not Working
```bash
# Restart development server
# Stop server (Ctrl+C) and run again
npm run dev
```

#### TypeScript Errors
```bash
# Run TypeScript compiler to check for errors
npx tsc --noEmit

# Rebuild TypeScript
npm run build
```

---

## 📚 Next Steps

1. **Read the Architecture Guide**: [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Review Components**: [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)
3. **Check API Integration**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
4. **Review Contributing Guidelines**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🆘 Getting Help

- **Stuck?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Question about components?** See [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)
- **Issue with the API?** Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Security concerns?** Read [SECURITY_REPORT.md](./SECURITY_REPORT.md)

---

**Last Updated**: May 27, 2026  
**Version**: 1.0.0
