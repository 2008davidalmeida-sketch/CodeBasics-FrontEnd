# API Documentation - CodeBasics Backend Integration

This document describes all backend API endpoints and how the frontend integrates with them.

---

## 🌐 API Configuration

### Base Configuration

**File**: `src/services/api.ts`

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true  // Include cookies in all requests
})
```

**Environment Variables:**
```env
VITE_API_URL=http://localhost:5000
```

---

## 🔐 Authentication Endpoints

### 1. Google OAuth Callback

**Endpoint**: `POST /auth/callback`

**Purpose**: Exchange Google OAuth code for authentication token

**Request**:
```typescript
// Automatically handled by backend redirect
// URL: /auth/callback?code=<google_code>&state=<state>
```

**Response**:
```json
{
  "user": {
    "id": "user123",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student"
  }
}
```

**Frontend Usage** (in `AuthCallback.tsx`):
```typescript
useEffect(() => {
  // Backend handles the callback automatically
  // Session cookie is set
  login()  // Calls getMe() to verify session
}, [])
```

---

### 2. Get Current User

**Endpoint**: `GET /auth/me`

**Purpose**: Retrieve current authenticated user

**Request Headers**:
```
Cookie: session=<session_cookie>
```

**Response** (Success - 200):
```json
{
  "id": "user123",
  "email": "student@example.com",
  "name": "John Doe",
  "role": "student",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Response** (Unauthorized - 401):
```json
{
  "error": "Unauthorized",
  "message": "No valid session found"
}
```

**Frontend Usage** (in `AuthContext.tsx`):
```typescript
useEffect(() => {
  getMe()
    .then(res => setUser(res.data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false))
}, [])
```

---

### 3. Logout

**Endpoint**: `POST /auth/logout`

**Purpose**: End user session

**Request**:
```typescript
logoutAPI()
```

**Response** (Success - 200):
```json
{
  "message": "Logged out successfully"
}
```

**Frontend Usage** (in `AuthContext.tsx`):
```typescript
function logout() {
  logoutAPI().finally(() => {
    localStorage.removeItem('authToken')
    setUser(null)
  })
}
```

---

## 📚 Challenge Endpoints

### 4. Get All Challenges

**Endpoint**: `GET /challenges`

**Purpose**: Retrieve list of all available challenges/exercises

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `topic` | string | Filter by topic ID |
| `difficulty` | string | Filter by difficulty (easy, medium, hard) |
| `limit` | number | Limit results (default: 50) |
| `offset` | number | Pagination offset (default: 0) |

**Request**:
```typescript
getChallenges({
  params: {
    topic: 'python-basics',
    difficulty: 'easy',
    limit: 20
  }
})
```

**Response** (Success - 200):
```json
{
  "challenges": [
    {
      "id": "challenge1",
      "title": "Hello World",
      "description": "Write a program that prints 'Hello, World!'",
      "difficulty": "easy",
      "topic": "python-basics",
      "template": "# Write your code here\nprint('Hello, World!')",
      "testCases": [
        {
          "input": "",
          "expectedOutput": "Hello, World!"
        }
      ],
      "points": 10
    }
  ],
  "total": 150
}
```

**Frontend Usage** (in `Dashboard.tsx`):
```typescript
useEffect(() => {
  getChallenges()
    .then(res => setChallenges(res.data.challenges))
    .catch(err => console.error('Failed to fetch challenges', err))
}, [])
```

---

### 5. Get Single Challenge

**Endpoint**: `GET /challenges/:id`

**Purpose**: Retrieve detailed information about a specific challenge

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Challenge ID |

**Request**:
```typescript
getChallenge('challenge1')
```

**Response** (Success - 200):
```json
{
  "id": "challenge1",
  "title": "Hello World",
  "description": "Write a program that prints 'Hello, World!'",
  "difficulty": "easy",
  "topic": "python-basics",
  "points": 10,
  "template": "# Write your code here\n",
  "hints": [
    "Use the print() function",
    "Make sure to use quotes for strings"
  ],
  "testCases": [
    {
      "id": "test1",
      "input": "",
      "expectedOutput": "Hello, World!",
      "visible": true
    },
    {
      "id": "test2",
      "input": "",
      "expectedOutput": "Hello, World!",
      "visible": false
    }
  ],
  "editorial": "The solution uses the print() function...",
  "relatedChallenges": ["challenge2", "challenge3"]
}
```

**Response** (Not Found - 404):
```json
{
  "error": "Not Found",
  "message": "Challenge with ID 'challenge1' not found"
}
```

**Frontend Usage** (in `ExercisePage.tsx`):
```typescript
useEffect(() => {
  getChallenge(exerciseId)
    .then(res => setChallenge(res.data))
    .catch(err => console.error('Failed to fetch challenge'))
}, [exerciseId])
```

---

## 📤 Submission Endpoints

### 6. Create Submission

**Endpoint**: `POST /submissions`

**Purpose**: Submit code solution for a challenge

**Request Body**:
```typescript
createSubmission(challengeId, code)
```

**Request Payload**:
```json
{
  "challengeId": "challenge1",
  "code": "print('Hello, World!')"
}
```

**Response** (Success - 201):
```json
{
  "id": "submission1",
  "challengeId": "challenge1",
  "userId": "user123",
  "code": "print('Hello, World!')",
  "status": "accepted",
  "testResults": [
    {
      "testId": "test1",
      "passed": true,
      "output": "Hello, World!",
      "expectedOutput": "Hello, World!",
      "time": 0.023
    }
  ],
  "score": 10,
  "feedback": "Excellent solution!",
  "submittedAt": "2024-05-27T14:30:00Z"
}
```

**Response** (Validation Error - 400):
```json
{
  "error": "Bad Request",
  "message": "Code is required",
  "details": {
    "challengeId": "Challenge ID is required"
  }
}
```

**Response** (Unauthorized - 401):
```json
{
  "error": "Unauthorized",
  "message": "Must be logged in to submit"
}
```

**Frontend Usage** (in `ExercisePage.tsx`):
```typescript
async function handleSubmit(code: string) {
  try {
    const response = await createSubmission(exerciseId, code)
    const { status, testResults, feedback } = response.data
    
    setSubmissionResult({
      status,
      testResults,
      feedback
    })
  } catch (error) {
    console.error('Submission failed', error)
  }
}
```

---

### 7. Get User Submissions

**Endpoint**: `GET /submissions/me`

**Purpose**: Retrieve all submissions by current user

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `challengeId` | string | Filter by challenge |
| `status` | string | Filter by status (pending, accepted, rejected) |
| `limit` | number | Limit results |
| `offset` | number | Pagination offset |

**Request**:
```typescript
getMySubmissions({
  params: {
    challengeId: 'challenge1',
    status: 'accepted'
  }
})
```

**Response** (Success - 200):
```json
{
  "submissions": [
    {
      "id": "submission1",
      "challengeId": "challenge1",
      "status": "accepted",
      "score": 10,
      "submittedAt": "2024-05-27T14:30:00Z",
      "feedback": "Great solution!"
    }
  ],
  "total": 15
}
```

**Frontend Usage** (in `Dashboard.tsx`):
```typescript
useEffect(() => {
  getMySubmissions()
    .then(res => setSubmissions(res.data.submissions))
}, [])
```

---

### 8. Delete Submission

**Endpoint**: `DELETE /submissions/:id`

**Purpose**: Delete a specific submission

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Submission ID |

**Request**:
```typescript
deleteSubmission('submission1')
```

**Response** (Success - 200):
```json
{
  "message": "Submission deleted successfully"
}
```

**Response** (Not Found - 404):
```json
{
  "error": "Not Found",
  "message": "Submission not found"
}
```

**Response** (Forbidden - 403):
```json
{
  "error": "Forbidden",
  "message": "Cannot delete another user's submission"
}
```

**Frontend Usage** (in `Dashboard.tsx`):
```typescript
async function handleDeleteSubmission(submissionId: string) {
  try {
    await deleteSubmission(submissionId)
    setSubmissions(submissions.filter(s => s.id !== submissionId))
  } catch (error) {
    console.error('Delete failed', error)
  }
}
```

---

## 🔧 Request/Response Patterns

### Error Handling

All endpoints follow this error response format:

```json
{
  "error": "ErrorType",
  "message": "Human-readable message",
  "details": {
    "field": "Field-specific error"
  },
  "timestamp": "2024-05-27T14:30:00Z"
}
```

**Common Status Codes**:
| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (auth required) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

### Authentication

All requests include session cookies:

```typescript
// Automatically added by axios
withCredentials: true

// Sends:
Cookie: session=<session_cookie>
```

---

## 🌐 CORS & Cookies

### Configuration

The frontend is configured to work with credentials:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true  // Include cookies
})
```

### Backend Requirements

Backend should set:

```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: http://localhost:5173
```

---

## 📋 API Interceptors

### Request Interceptor

Currently, the request interceptor adds authentication headers (if needed):

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Response Interceptor (Recommended)

For production, add a response interceptor to handle token refresh:

```typescript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

## 🔄 API Usage Examples

### Complete Example: Submit Solution

```typescript
// In ExercisePage.tsx
const [code, setCode] = useState('')
const [results, setResults] = useState(null)

async function handleSubmit() {
  try {
    // Submit code
    const response = await createSubmission(exerciseId, code)
    const { status, testResults } = response.data
    
    // Update UI with results
    setResults({
      passed: status === 'accepted',
      tests: testResults
    })
    
    // Show success message
    alert(`Solution ${status}!`)
  } catch (error) {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login'
    } else {
      // Show error message
      alert('Submission failed: ' + error.message)
    }
  }
}
```

---

## 🚀 Rate Limiting

**Recommendation**: Implement rate limiting on both client and server

```typescript
// Client-side throttling example
import { throttle } from 'lodash'

const throttledSubmit = throttle(handleSubmit, 3000)  // Max 1 request per 3 seconds
```

---

## 📚 Next Steps

1. **Integration Guide**: See specific component documentation
2. **Troubleshooting**: Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Component Guide**: See [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)

---

**Last Updated**: May 27, 2026  
**Version**: 1.0.0  
**API Version**: 1.0
