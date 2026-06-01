# Troubleshooting Guide - CodeBasics Frontend

This guide helps resolve common issues when developing, building, or running the CodeBasics frontend.

---

## 🚨 Common Issues

### 1. Dependencies Issues

#### "npm install" Fails

**Problem**: Installation hangs or fails with permission errors

**Solutions**:

```bash
# Clear npm cache
npm cache clean --force

# Install with verbose output
npm install --verbose

# On Windows, try:
npm install --legacy-peer-deps

# On macOS/Linux, check permissions
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

#### Module Not Found Error

**Problem**: `Cannot find module '@/...'`

**Causes & Solutions**:

```bash
# 1. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 2. Check path alias in tsconfig.json
# Should have:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# 3. Restart development server
npm run dev
```

#### Peer Dependency Warnings

**Problem**: `npm ERR! peer dep missing`

**Solution**:

```bash
# Install with legacy peer deps flag
npm install --legacy-peer-deps

# Or check package.json for version conflicts
# Update package versions to compatible ones
npm update
```

---

### 2. Development Server Issues

#### Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::5173`

**Solutions**:

```bash
# Windows - Find and kill process
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux - Find and kill process
lsof -i :5173
kill -9 <PID>

# Or change Vite port in vite.config.ts
export default defineConfig({
  server: {
    port: 5174
  }
})
```

#### Hot Module Replacement (HMR) Not Working

**Problem**: Changes don't reflect in browser

**Solutions**:

```bash
# 1. Restart dev server
# Stop (Ctrl+C) and run: npm run dev

# 2. Clear browser cache
# Open DevTools → Application → Clear storage

# 3. Check vite.config.ts HMR settings
export default defineConfig({
  server: {
    hmr: {
      host: 'localhost',
      port: 5173
    }
  }
})

# 4. Reload browser (Ctrl+R or Cmd+R)
```

#### Blank Page or 404 on Load

**Problem**: Browser shows blank page or cannot load app

**Solutions**:

```bash
# 1. Check console for errors
# Open DevTools → Console tab

# 2. Verify build output
npm run build
npm run preview

# 3. Check index.html exists
ls src/main.tsx  # or main.jsx

# 4. Check vite.config.ts
# Should have:
export default defineConfig({
  root: process.cwd(),
  plugins: [react()]
})
```

---

### 3. Build Issues

#### Build Fails with TypeScript Errors

**Problem**: `npm run build` fails with type errors

**Solutions**:

```bash
# 1. Check for type errors
npx tsc --noEmit

# 2. Review error details
npm run build 2>&1 | head -50

# 3. Fix common errors:
# - Missing type definitions: npm install --save-dev @types/package
# - Invalid type usage: Use proper TypeScript syntax
# - Any types: Avoid 'any', use proper types

# 4. Force build (not recommended for production)
npm run build -- --force
```

#### Build Output is Empty or Broken

**Problem**: `dist/` directory is empty or incomplete

**Solutions**:

```bash
# 1. Clean and rebuild
rm -rf dist
npm run build

# 2. Check for build errors
npm run build -- --debug

# 3. Verify vite.config.ts
npx vite build --debug

# 4. Check Node version
node --version  # Should be 18+
```

#### Bundle Size Too Large

**Problem**: Build produces large bundle

**Solutions**:

```bash
# 1. Analyze bundle size
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts:
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [visualizer()]
})

# 2. Run analysis
npm run build
# Check dist/stats.html

# 3. Code splitting
# Lazy load components:
const Dashboard = lazy(() => import('./Dashboard'))

# 4. Tree-shake unused code
# Ensure imports are specific:
import { Button } from '@mui/material'  // Bad
import Button from '@mui/material/Button'  // Better
```

---

### 4. Authentication Issues

#### "Unauthorized" Error on Every Request

**Problem**: API returns 401 status

**Causes & Solutions**:

```typescript
// 1. Check if session cookie is being sent
// In src/services/api.ts, verify:
const api = axios.create({
  withCredentials: true  // Important!
})

// 2. Check Auth header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 3. Check backend CORS configuration
// Backend should have:
// Access-Control-Allow-Credentials: true
// Access-Control-Allow-Origin: http://localhost:5173

// 4. Verify token in browser
// Open DevTools → Application → Storage → Cookies
// Should see 'session' cookie
```

#### Login Redirect Loop

**Problem**: User keeps being redirected to login

**Causes & Solutions**:

```typescript
// 1. Check AuthContext
// In src/context/AuthContext.tsx, verify getMe() call

// 2. Test backend endpoint
// Try: curl -c cookies.txt http://localhost:5000/auth/me

// 3. Check token refresh
// If using JWT, implement refresh token logic

// 4. Review browser storage
// Open DevTools → Application
// Check localStorage and cookies
```

#### Google OAuth Not Working

**Problem**: Google Sign-in button doesn't work

**Solutions**:

```bash
# 1. Check environment variables
echo $VITE_API_URL

# 2. Verify backend OAuth setup
# Backend should have Google OAuth client ID configured

# 3. Check redirect URI
# Must match in Google Console and backend

# 4. Test OAuth endpoint
curl "http://localhost:5000/auth/google"

# 5. Browser console errors
# Open DevTools → Console tab
# Look for error messages
```

---

### 5. API Integration Issues

#### API Requests Time Out

**Problem**: API calls fail with timeout error

**Solutions**:

```typescript
// 1. Increase axios timeout in src/services/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000  // 30 seconds
})

// 2. Check network connectivity
// Open DevTools → Network tab
// Look for failed requests

// 3. Verify backend is running
curl http://localhost:5000/health

// 4. Check API URL configuration
console.log(import.meta.env.VITE_API_URL)
```

#### CORS Errors

**Problem**: Browser blocks API requests with CORS error

**Solutions**:

```typescript
// 1. Verify backend CORS headers
// Backend should return:
// Access-Control-Allow-Origin: http://localhost:5173
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE
// Access-Control-Allow-Credentials: true

// 2. Check axios configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true  // Required for CORS with credentials
})

// 3. Test endpoint directly
curl -i http://localhost:5000/challenges

// 4. Check browser console
// Open DevTools → Console tab
// Look for CORS error details
```

#### "Cannot find API endpoint" Error

**Problem**: API endpoint returns 404

**Solutions**:

```bash
# 1. Verify endpoint URL
# Check API_DOCUMENTATION.md for correct paths

# 2. Test endpoint manually
curl http://localhost:5000/api/challenges

# 3. Check API_URL environment variable
VITE_API_URL=http://localhost:5000 npm run dev

# 4. Review backend routes
# Ensure endpoint is implemented

# 5. Check request method
# GET vs POST vs PUT - must match backend
```

---

### 6. Component and Rendering Issues

#### Component Not Rendering

**Problem**: Component appears empty or doesn't display

**Solutions**:

```typescript
// 1. Check component return
export function MyComponent() {
  return null  // Renders nothing!
  // Should return JSX
}

// 2. Verify props are passed
<MyComponent title="Hello" />  // Props must match interface

// 3. Check conditional rendering
{showComponent && <MyComponent />}  // Condition might be false

// 4. Browser console errors
// Open DevTools → Console
// Look for error messages

// 5. Check CSS
// Component might be hidden by CSS
.hidden { display: none; }
```

#### Styling Not Applied

**Problem**: CSS classes don't style components

**Solutions**:

```typescript
// 1. Verify CSS import
import styles from './Component.css'

// 2. Apply class correctly
<div className={styles.className}>  // CSS Modules
<div className="className">          // Regular CSS

// 3. Check CSS file
// Verify .css file exists in same directory

// 4. Restart dev server
// Stop (Ctrl+C) and run: npm run dev

// 5. Clear browser cache
// DevTools → Application → Clear storage
```

#### State Not Updating

**Problem**: useState doesn't update component

**Solutions**:

```typescript
// ✅ CORRECT: New object reference
setUser({ ...user, name: 'John' })

// ❌ WRONG: Mutating state directly
user.name = 'John'
setUser(user)

// ✅ CORRECT: Array updates
setItems([...items, newItem])

// ❌ WRONG: Mutating array
items.push(newItem)
setItems(items)
```

---

### 7. Skulpt Execution Issues

#### "Skulpt is not defined" Error

**Problem**: Python code execution fails

**Solutions**:

```bash
# 1. Check Skulpt is loaded
# In browser console:
console.log(window.Sk)

# 2. Add Skulpt script to index.html
# In public/index.html:
<script src="https://cdn.jsdelivr.net/npm/skulpt@latest/dist/skulpt.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/skulpt@latest/dist/skulpt-stdlib.js"></script>

# 3. Wait for Skulpt to load
useEffect(() => {
  if (!window.Sk) {
    console.error('Skulpt not loaded')
    return
  }
  // Use Skulpt
}, [])
```

#### Code Execution Hangs

**Problem**: Running code causes browser to hang

**Solutions**:

```typescript
// 1. Add execution timeout
const timeout = setTimeout(() => {
  console.error('Code execution timed out')
  // Stop execution
}, 5000)

// 2. Detect infinite loops
// Limit loop iterations
// Add safety checks

// 3. Clear output
output = ''  // Reset before execution

// 4. Restart browser
// Force refresh (Ctrl+Shift+R)
```

#### Python Code Syntax Error

**Problem**: Code fails with syntax error

**Solutions**:

```bash
# 1. Validate Python syntax
python -m py_compile file.py

# 2. Check Skulpt compatibility
# Not all Python features are supported
# Use Python 3 compatible syntax

# 3. Review error message
# Skulpt errors show line number

# 4. Test code locally
python script.py  # Run locally to verify
```

---

### 8. Performance Issues

#### App Loads Slowly

**Problem**: Long initial load time

**Solutions**:

```bash
# 1. Check Network tab in DevTools
# Identify slow requests

# 2. Enable compression
# Nginx: gzip on;
# Apache: mod_deflate enabled

# 3. Lazy load components
const Dashboard = lazy(() => import('./Dashboard'))

# 4. Analyze bundle size
npm run build -- --analyze

# 5. Enable caching
# Set cache headers for static assets
```

#### Memory Leaks

**Problem**: App memory usage grows over time

**Solutions**:

```typescript
// 1. Clean up effects
useEffect(() => {
  const handler = () => { }
  window.addEventListener('resize', handler)
  
  return () => {
    window.removeEventListener('resize', handler)  // Clean up!
  }
}, [])

// 2. Cancel pending requests
useEffect(() => {
  const controller = new AbortController()
  
  fetch(url, { signal: controller.signal })
  
  return () => {
    controller.abort()  // Cancel on unmount
  }
}, [])

// 3. Clear timers
useEffect(() => {
  const timer = setTimeout(() => { }, 1000)
  return () => clearTimeout(timer)  // Clean up!
}, [])
```

---

## 🔍 Debugging Tips

### Using Browser DevTools

1. **Console Tab** - Check for errors and logs
2. **Network Tab** - Monitor API requests
3. **Application Tab** - Check storage, cookies, session
4. **Elements Tab** - Inspect DOM and styles
5. **Sources Tab** - Set breakpoints and debug

### Console Debugging

```typescript
// Log component lifecycle
useEffect(() => {
  console.log('Component mounted')
  return () => console.log('Component unmounted')
}, [])

// Log state changes
const [count, setCount] = useState(0)
console.log('Count changed:', count)

// Log API responses
api.interceptors.response.use(
  response => {
    console.log('API Response:', response)
    return response
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)
```

### Network Debugging

```bash
# Monitor all network traffic
# Open DevTools → Network tab
# Look for failed requests (red)
# Check status codes:
# 2xx - Success
# 3xx - Redirect
# 4xx - Client error
# 5xx - Server error

# Check request details
# Headers, payload, response
```

---

## 📞 Getting More Help

### Resources

1. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Installation help
2. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API details
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Project structure
4. **[SECURITY_REPORT.md](./SECURITY_REPORT.md)** - Security issues

### Contact Support

- Check existing GitHub issues
- Create a new GitHub issue with:
  - Error message (full text)
  - Steps to reproduce
  - Environment (OS, Node version, browser)
  - Screenshots if applicable

---

## 📝 Reporting Bugs

When reporting issues, include:

1. **Error Message** - Full error text from console
2. **Steps to Reproduce** - Exact steps to trigger
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment**:
   ```
   - OS: Windows 10
   - Node: 18.12.0
   - Browser: Chrome 120
   ```
6. **Screenshots** - Visual evidence if applicable

---

**Last Updated**: May 27, 2026  
**Version**: 1.0.0
