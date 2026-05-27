# Architecture Guide - CodeBasics Frontend

This document describes the architecture, design patterns, and structure of the CodeBasics frontend application.

---

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Browser                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           React Application (Vite)                       │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  Router                                          │   │  │
│  │  │  ├── LandingPage                               │   │  │
│  │  │  ├── Dashboard                                 │   │  │
│  │  │  ├── ExercisePage                              │   │  │
│  │  │  └── TeacherDashboard                          │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  Context (Auth)                                 │   │  │
│  │  │  └── AuthProvider (Session Management)          │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  Services (API Integration)                      │   │  │
│  │  │  └── Axios Instance + Interceptors              │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  Components (Reusable UI)                        │   │  │
│  │  │  ├── Header                                      │   │  │
│  │  │  ├── Footer                                      │   │  │
│  │  │  └── Custom Components                           │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                 │
│                         HTTP (Axios)                           │
│                              │                                 │
│                    Skulpt (Python Interpreter)                 │
│                              │                                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
          ┌──────▼──────┐           ┌──────▼──────┐
          │ Backend API │           │ Browser API │
          │ (Node.js)   │           │ (Skulpt)    │
          │             │           │             │
          │ - Auth      │           │ - Execute   │
          │ - Contests  │           │ - Test      │
          │ - Analytics │           │ - Output    │
          └─────────────┘           └─────────────┘
```

---

## 📁 Project Structure

### Directory Organization

```
src/
├── components/                 # Reusable UI Components
│   ├── Footer/                # Footer component
│   ├── GoogleButton/          # Google OAuth button
│   ├── Header/                # Navigation header
│   └── [CustomComponents]/    # Other reusable components
│
├── pages/                      # Page Components
│   ├── AuthCallback/          # OAuth callback handler
│   ├── Dashboard/             # Student dashboard
│   │   └── components/        # Dashboard sub-components
│   ├── ExercisePage/          # Main code editor page
│   ├── HowItWorksPage/        # Feature explanation page
│   ├── LandingPage/           # Homepage
│   ├── NotAuthorizedPage/     # Access denied page
│   ├── TeacherDashboard/      # Teacher management page
│   └── TopicDetails/          # Topic overview page
│
├── context/                    # React Context
│   └── AuthContext.tsx        # Authentication state management
│
├── services/                   # API Integration
│   └── api.ts                 # Axios configuration + endpoints
│
├── hooks/                      # Custom React Hooks
│   └── [Custom hooks]/        # Application-specific hooks
│
├── types/                      # TypeScript Definitions
│   └── index.ts               # Type exports
│
├── utils/                      # Utility Functions
│   ├── ScrollToTop.tsx        # Scroll to top utility
│   ├── FadeIn/                # Animation utility
│   └── [Other utilities]/     # Helper functions
│
├── assets/                     # Static Assets
│   └── [Images, etc]/         # Media files
│
├── App.tsx                     # Root application component
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

---

## 🔄 Data Flow

### Authentication Flow

```
User Click "Sign in with Google"
          │
          ▼
    GoogleButton Component
          │
          ▼
    Google OAuth Dialog
          │
          ▼
    Redirect to: /auth/callback?code=xxx
          │
          ▼
    AuthCallback Component
          │
          ▼
    Exchange code for token (Backend)
          │
          ▼
    Set Session Cookie (HttpOnly)
          │
          ▼
    Call AuthContext.login()
          │
          ▼
    Fetch user data (GET /auth/me)
          │
          ▼
    Update AuthContext.user
          │
          ▼
    Redirect to Dashboard
```

### Challenge Submission Flow

```
User Views Exercise
          │
          ▼
    ExercisePage Loads
          │
          ▼
    Fetch Challenge Data (GET /challenges/:id)
          │
          ▼
    User Writes Python Code
          │
          ▼
    Click "Run" Button
          │
          ▼
    Execute Code with Skulpt (In-browser)
          │
          ▼
    Display Output / Errors
          │
          ▼
    Click "Submit" Button
          │
          ▼
    Send Code to Backend (POST /submissions)
          │
          ▼
    Backend Validates & Evaluates
          │
          ▼
    Return Results
          │
          ▼
    Update Dashboard Statistics
```

---

## 🏛️ Design Patterns

### 1. Component Structure

#### Presentational Components
Reusable UI components in `components/`:
```typescript
// components/Header/Header.tsx
interface HeaderProps {
  title: string;
  onLogout?: () => void;
}

export function Header({ title, onLogout }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      {onLogout && <button onClick={onLogout}>Logout</button>}
    </header>
  )
}
```

#### Container Components
Page-level components in `pages/`:
```typescript
// pages/Dashboard/Dashboard.tsx
export default function Dashboard() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div>
      <Header />
      {/* Dashboard content */}
    </div>
  )
}
```

### 2. Context Pattern (Authentication)

```typescript
// context/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: Props) {
  // State management
  // Provides auth state to entire app
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### 3. Service Pattern (API Integration)

```typescript
// services/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Interceptors for authentication
api.interceptors.request.use((config) => {
  // Add auth headers
  return config;
});

// Export API functions
export function getMe(config?: AxiosRequestConfig) {
  return api.get('/auth/me', config);
}
```

### 4. Custom Hooks Pattern

```typescript
// hooks/useChallenge.ts
export function useChallenge(challengeId: string) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenge(challengeId);
  }, [challengeId]);

  return { challenge, loading };
}
```

---

## 🔐 State Management

### Authentication State (Context)

Located in `src/context/AuthContext.tsx`:

```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher';
  } | null;
  loading: boolean;
}
```

### Local Component State (useState)

- **Dashboard**: Challenge list, filters, sorting
- **ExercisePage**: Code, output, test results
- **TeacherDashboard**: Student list, submissions, filters

### No Global State Management

The app currently uses:
- React Context for auth state
- Local useState for page-specific state
- No Redux, Zustand, or Jotai

**Recommendation**: Consider adding state management library if complexity grows.

---

## 🌐 Routing Structure

### Route Configuration

Located in `src/App.tsx`:

```typescript
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/como-funciona" element={<HowItWorksPage />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/topico/:id" element={<TopicDetails />} />
  <Route path="/topico/:topicId/exercicio/:exerciseId" element={<ExercisePage />} />
  <Route path="/teacher" element={<TeacherDashboard />} />
  <Route path="/nao-autorizado" element={<NotAutorizedPage />} />
</Routes>
```

### Route Categories

| Category | Routes | Auth Required |
|----------|--------|---------------|
| Public | `/`, `/como-funciona` | No |
| Auth | `/auth/callback` | Special |
| Student | `/dashboard`, `/topico/*`, `/exercicio/*` | Yes |
| Teacher | `/teacher` | Yes (Teacher role) |
| Error | `/nao-autorizado` | No |

---

## 📦 Dependency Overview

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.5 | UI framework |
| react-dom | ^19.2.5 | DOM rendering |
| react-router-dom | ^7.14.2 | Client-side routing |
| axios | ^1.15.2 | HTTP requests |
| @uiw/react-codemirror | ^4.25.9 | Code editor |
| three | ^0.184.0 | 3D graphics |
| @react-three/fiber | ^9.6.0 | React Three.js integration |
| @codemirror/lang-python | ^6.2.1 | Python syntax highlighting |

### Build Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^8.0.10 | Build tool |
| typescript | ~6.0.2 | Type checking |
| eslint | ^10.2.1 | Code linting |
| react-refresh | ^0.5.2 | HMR support |

---

## 🔌 API Integration Points

### Axios Instance Configuration

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true  // Send cookies with requests
});
```

### API Functions

```typescript
// Authentication
getMe()
logoutAPI()

// Challenges
getChallenges()
getChallenge(id)

// Submissions
createSubmission(challengeId, code)
deleteSubmission(id)
getMySubmissions()
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

---

## 🎨 Styling Approach

### CSS Organization

- **Global Styles**: `src/index.css` - Reset and utilities
- **Component Styles**: Colocated `.css` files
- **Page Styles**: Separate `.css` per page component

### CSS Naming Convention

```css
/* Component Name - BEM-like pattern */
.component-name { }
.component-name__element { }
.component-name--modifier { }
```

### No CSS-in-JS

The project uses plain CSS files for simplicity and performance.

---

## 🧪 Code Quality

### Linting

ESLint configuration in `eslint.config.js`:
- React hooks rules
- React refresh compatibility
- TypeScript support

### TypeScript

- Strict mode enabled in `tsconfig.json`
- Type definitions in `src/types/index.ts`
- No `any` types without justification

---

## 🚀 Performance Considerations

### Code Splitting

Currently using default Vite code splitting:
- Vendor code separated
- Dynamic imports for pages (recommended)

### Bundle Analysis

Recommended tools:
- `rollup-plugin-visualizer` - Analyze bundle size
- Chrome DevTools - Runtime performance

See [SCALABILITY_REPORT.md](./SCALABILITY_REPORT.md) for optimization strategies.

---

## 🔄 Build Pipeline

### Development Build

```bash
npm run dev
```

- Vite dev server with HMR
- No minification
- Source maps enabled

### Production Build

```bash
npm run build
```

1. TypeScript compilation (`tsc -b`)
2. Vite build (bundling and minification)
3. Output to `dist/` directory

### Output Structure

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── vendor-[hash].js
│   └── [component]-[hash].css
└── vite.svg
```

---

## 📚 Next Steps

1. **Review Components**: [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)
2. **API Integration**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. **Deployment**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
4. **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Last Updated**: May 27, 2026  
**Version**: 1.0.0
