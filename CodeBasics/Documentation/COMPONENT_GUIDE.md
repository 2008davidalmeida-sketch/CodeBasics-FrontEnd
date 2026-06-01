# Component Guide - CodeBasics Frontend

This guide documents all reusable components and page components in the CodeBasics application.

---

## 📖 Component Organization

Components are organized into two categories:

1. **Components** (`src/components/`) - Reusable UI components
2. **Pages** (`src/pages/`) - Full-page components with business logic

---

## 🧩 Reusable Components

### Header Component

**Location**: `src/components/Header/Header.tsx`

**Purpose**: Navigation header displayed across all pages

**Props**:
```typescript
interface HeaderProps {
  title?: string
  onLogout?: () => void
  showAuth?: boolean
}
```

**Usage**:
```typescript
import { Header } from '@/components/Header/Header'

export function MyPage() {
  return (
    <>
      <Header title="Dashboard" showAuth={true} />
      {/* Page content */}
    </>
  )
}
```

**Features**:
- Navigation links (Home, Courses, Dashboard)
- User menu (Profile, Logout)
- Responsive mobile menu
- Logo and branding

---

### Footer Component

**Location**: `src/components/Footer/Footer.tsx`

**Purpose**: Footer displayed on all pages

**Props**: None (stateless)

**Usage**:
```typescript
import { Footer } from '@/components/Footer/Footer'

export function MyPage() {
  return (
    <>
      {/* Page content */}
      <Footer />
    </>
  )
}
```

**Features**:
- Copyright information
- Links to documentation
- Social media links
- Legal links (Privacy, Terms)

---

### GoogleButton Component

**Location**: `src/components/GoogleButton/GoogleButton.tsx`

**Purpose**: Google OAuth login button

**Props**:
```typescript
interface GoogleButtonProps {
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}
```

**Usage**:
```typescript
import { GoogleButton } from '@/components/GoogleButton/GoogleButton'

export function LoginPage() {
  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = `${API_URL}/auth/google`
  }

  return (
    <GoogleButton onClick={handleGoogleLogin} variant="primary" />
  )
}
```

**Features**:
- Google Sign-in integration
- Loading state handling
- Error boundary support
- Accessible button design

---

## 📄 Page Components

### Landing Page

**Location**: `src/pages/LandingPage/LandingPage.tsx`

**Purpose**: Homepage/welcome page

**Components Used**:
- `Hero` - Hero section with CTA
- `CodeMockup` - Code demonstration
- `Topics` - Course topics overview
- `ReadyToStart` - Call-to-action

**Key Features**:
- Eye-catching hero section
- Feature showcase
- Course preview
- Sign-up prompts

**Usage**:
```typescript
<Route path="/" element={<LandingPage />} />
```

---

### How It Works Page

**Location**: `src/pages/HowItWorksPage/HowItWorksPage.tsx`

**Purpose**: Explain platform features and workflow

**Components Used**:
- `HowItWorks` - Step-by-step guide

**Key Features**:
- Platform overview
- Step-by-step walkthrough
- Feature explanations
- FAQ section

**Usage**:
```typescript
<Route path="/como-funciona" element={<HowItWorksPage />} />
```

---

### Auth Callback Page

**Location**: `src/pages/AuthCallback/AuthCallback.tsx`

**Purpose**: Handle OAuth redirect from Google

**Components Used**:
- `AuthLoader` - Loading spinner during auth

**Flow**:
1. User redirected from Google with code
2. AuthCallback verifies session
3. Calls `AuthContext.login()`
4. Redirects to Dashboard

**Usage**:
```typescript
<Route path="/auth/callback" element={<AuthCallback />} />
```

**Code**:
```typescript
export default function AuthCallback() {
  const { login } = useAuth()

  useEffect(() => {
    // Backend handled the OAuth exchange
    // Now verify session
    login()
  }, [login])

  return <AuthLoader />
}
```

---

### Dashboard Page

**Location**: `src/pages/Dashboard/Dashboard.tsx`

**Purpose**: Student dashboard showing progress and challenges

**Sub-components**:
- `StatsCard` - Statistics display
- `ProgressBar` - Progress indicator
- `TopicCard` - Course topic card

**State**:
```typescript
const [challenges, setChallenges] = useState<Challenge[]>([])
const [submissions, setSubmissions] = useState<Submission[]>([])
const [stats, setStats] = useState<Stats | null>(null)
```

**Key Features**:
- User statistics (total points, completed challenges)
- Challenge list filtered by topic
- Progress visualization
- Quick access to exercises

**Usage**:
```typescript
<Route path="/dashboard" element={<Dashboard />} />
```

**Protected**: Yes - requires authentication

---

### Topic Details Page

**Location**: `src/pages/TopicDetails/TopicDetails.tsx`

**Purpose**: Display exercises within a topic

**Sub-components**:
- `TopicHeader` - Topic title and description
- `ExerciseItem` - Individual exercise card

**Params**:
```typescript
const { id } = useParams<{ id: string }>()
```

**State**:
```typescript
const [topic, setTopic] = useState<Topic | null>(null)
const [exercises, setExercises] = useState<Exercise[]>([])
```

**Key Features**:
- Topic overview and description
- Exercises list with difficulty levels
- Progress indicator per exercise
- Links to exercise details

**Usage**:
```typescript
<Route path="/topico/:id" element={<TopicDetails />} />
```

**Protected**: Yes - requires authentication

---

### Exercise Page

**Location**: `src/pages/ExercisePage/ExercisePage.tsx`

**Purpose**: Main coding challenge interface

**Key Components**:
- CodeMirror editor (code input)
- Output display (test results)
- Submit button

**Params**:
```typescript
const { topicId, exerciseId } = useParams<{
  topicId: string
  exerciseId: string
}>()
```

**State**:
```typescript
const [challenge, setChallenge] = useState<Challenge | null>(null)
const [code, setCode] = useState(challenge?.template || '')
const [output, setOutput] = useState('')
const [testResults, setTestResults] = useState<TestResult[]>([])
```

**Key Features**:
- Code editor with Python syntax highlighting
- Live code execution with Skulpt
- Test case display and results
- Submission handling
- Hints system

**Usage**:
```typescript
<Route 
  path="/topico/:topicId/exercicio/:exerciseId" 
  element={<ExercisePage />} 
/>
```

**Protected**: Yes - requires authentication

**Code Execution Flow**:
```typescript
async function handleRun() {
  try {
    // Configure Skulpt
    Sk.configure({
      output: (text) => { output += text }
    })
    
    // Execute code in browser
    const result = await Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody('<stdin>', false, code)
    )
    
    // Display results
    setOutput(result)
  } catch (error) {
    setOutput(`Error: ${error.message}`)
  }
}
```

---

### Teacher Dashboard

**Location**: `src/pages/TeacherDashboard/TeacherDashboard.tsx`

**Purpose**: Teacher interface for managing students and submissions

**Sub-components**:
- `StatsOverview` - Class statistics
- `StudentCard` - Student information
- `SubmissionsTable` - Student submissions
- `SubmissionModal` - Submission details
- `ChallengesAnalytics` - Challenge performance metrics

**Key Features**:
- Student list and management
- Submission review interface
- Class analytics and statistics
- Individual student progress tracking
- Grading system

**Usage**:
```typescript
<Route path="/teacher" element={<TeacherDashboard />} />
```

**Protected**: Yes - requires Teacher role

---

### Not Authorized Page

**Location**: `src/pages/NotAuthorizedPage/NotAuthorizedPage.tsx`

**Purpose**: Display access denied message

**Sub-components**:
- `AccessDeniedCard` - Error message card

**Usage**:
```typescript
<Route path="/nao-autorizado" element={<NotAutorizedPage />} />
```

**When Used**:
- User lacks required role (e.g., student accessing teacher panel)
- Permission denied from backend
- Unauthorized API response

---

## 🎨 Sub-components

### StatsCard

**Location**: `src/pages/Dashboard/components/StatsCard/StatsCard.tsx`

**Purpose**: Display statistics in card format

**Props**:
```typescript
interface StatsCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  trend?: 'up' | 'down'
  trendPercent?: number
}
```

**Usage**:
```typescript
<StatsCard 
  title="Challenges Completed" 
  value={15}
  trend="up"
  trendPercent={10}
/>
```

---

### ProgressBar

**Location**: `src/pages/Dashboard/components/ProgressBar/ProgressBar.tsx`

**Purpose**: Visualize progress percentage

**Props**:
```typescript
interface ProgressBarProps {
  label: string
  current: number
  total: number
  color?: 'blue' | 'green' | 'orange'
}
```

**Usage**:
```typescript
<ProgressBar 
  label="Python Basics"
  current={3}
  total={5}
  color="blue"
/>
```

---

### TopicCard

**Location**: `src/pages/Dashboard/components/TopicCard/TopicCard.tsx`

**Purpose**: Display individual topic with progress

**Props**:
```typescript
interface TopicCardProps {
  id: string
  title: string
  description: string
  completedExercises: number
  totalExercises: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  onClick: () => void
}
```

**Usage**:
```typescript
<TopicCard
  id="topic1"
  title="Python Basics"
  completedExercises={3}
  totalExercises={5}
  onClick={() => navigate(`/topico/${id}`)}
/>
```

---

### AuthLoader

**Location**: `src/pages/AuthCallback/components/AuthLoader/AuthLoader.tsx`

**Purpose**: Loading indicator during authentication

**Usage**:
```typescript
<AuthLoader />
```

**Visual**:
- Spinning loader animation
- "Authenticating..." message
- Full-screen overlay

---

## 🪝 Custom Hooks

### useAuth Hook

**Location**: `src/context/AuthContext.tsx`

**Purpose**: Access authentication state and methods

**Usage**:
```typescript
import { useAuth } from '@/context/AuthContext'

export function MyComponent() {
  const { user, login, logout, loading } = useAuth()

  if (loading) return <Loading />

  if (!user) {
    return <button onClick={login}>Login</button>
  }

  return (
    <>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </>
  )
}
```

**Returns**:
```typescript
{
  user: User | null,        // Current user or null
  login: () => void,        // Initiate login
  logout: () => void,       // Log out user
  loading: boolean          // Loading state
}
```

---

## 🛡️ Protected Routes

### Implementation Pattern

```typescript
function ProtectedRoute({ 
  element, 
  requiredRole?: string 
}: Props) {
  const { user, loading } = useAuth()

  if (loading) return <Loading />

  if (!user) {
    return <Navigate to="/" />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/nao-autorizado" />
  }

  return element
}

// Usage
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute element={<Dashboard />} />
  } 
/>

<Route 
  path="/teacher" 
  element={
    <ProtectedRoute element={<TeacherDashboard />} requiredRole="teacher" />
  } 
/>
```

---

## 🎨 Styling Components

### CSS Module Pattern

Each component has a corresponding `.css` file:

```typescript
// Button.tsx
import styles from './Button.css'

export function Button({ children }) {
  return <button className={styles.button}>{children}</button>
}
```

```css
/* Button.css */
.button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
```

---

## 📦 Component Composition

### Composition Example

```typescript
// pages/Dashboard/Dashboard.tsx
export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Header title="Dashboard" />
      
      <main className={styles.main}>
        <section className={styles.stats}>
          <StatsCard title="Completed" value={15} />
          <StatsCard title="In Progress" value={3} />
        </section>
        
        <section className={styles.challenges}>
          {topics.map(topic => (
            <TopicCard key={topic.id} {...topic} />
          ))}
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
```

---

## 🧪 Component Testing

### Example Test

```typescript
// __tests__/StatsCard.test.tsx
import { render, screen } from '@testing-library/react'
import { StatsCard } from '../StatsCard'

describe('StatsCard', () => {
  it('displays title and value', () => {
    render(<StatsCard title="Completed" value={15} />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })
})
```

---

## 🔄 Data Flow Example

### Complete Component Flow

```
User Views Dashboard
         │
         ▼
Dashboard Component Mounts
         │
         ├─ useAuth() → Get user
         │
         ├─ getChallenges() → Fetch data
         │
         └─ setState with data
         │
         ▼
Render StatsCards with data
         │
         ▼
User Clicks TopicCard
         │
         ▼
Navigate to TopicDetails/:id
         │
         ▼
TopicDetails Mounts
         │
         ├─ getChallenge(id) → Fetch exercises
         │
         └─ Render ExerciseItems
         │
         ▼
User Clicks Exercise
         │
         ▼
Navigate to ExercisePage/:id
         │
         ▼
ExercisePage Mounts
         │
         ├─ getChallenge(id) → Fetch exercise
         │
         └─ Display code editor
         │
         ▼
User Submits Code
         │
         └─ createSubmission() → Upload code
```

---

## 📚 Next Steps

1. **API Integration**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Styling**: Review CSS files in `src/components/`

---

**Last Updated**: May 27, 2026  
**Version**: 1.0.0
