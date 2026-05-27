# Contributing Guidelines - CodeBasics Frontend

Thank you for contributing to CodeBasics! This guide will help you understand our development process and standards.

---

## 🤝 How to Contribute

### Types of Contributions

We welcome contributions in these areas:

1. **Bug Fixes** - Fix existing issues
2. **Features** - Implement new functionality
3. **Documentation** - Improve project documentation
4. **Performance** - Optimize code and performance
5. **Tests** - Add or improve tests
6. **Refactoring** - Improve code quality

### Getting Started

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

---

## 📋 Development Process

### 1. Creating a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Or for bug fixes
git checkout -b fix/my-bug-fix
```

**Naming Convention**:
- Features: `feature/descriptive-name`
- Bug fixes: `fix/descriptive-name`
- Documentation: `docs/descriptive-name`
- Refactoring: `refactor/descriptive-name`

### 2. Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build to verify
npm run build
```

### 3. Code Changes

#### File Organization

- Keep related files together
- Use consistent naming conventions
- Organize components by feature/page

#### Naming Conventions

**Files**:
- Components: `PascalCase` (e.g., `Header.tsx`)
- Utilities: `camelCase` (e.g., `helpers.ts`)
- Tests: `filename.test.tsx`

**Variables**:
```typescript
// Constants
const MAX_ITEMS = 100

// Functions
function getUserData() {}

// Variables
const userName = ''
let count = 0
```

**CSS Classes**:
```css
/* BEM-like naming */
.component-name { }
.component-name__element { }
.component-name--modifier { }
```

#### TypeScript Best Practices

```typescript
// ✅ GOOD: Explicit types
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`)
}

// ❌ BAD: Using any
function getUser(id: any): any {
  return api.get(`/users/${id}`)
}
```

#### React Best Practices

```typescript
// ✅ GOOD: Functional components with hooks
export function MyComponent({ title }: Props) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Effects code
  }, [])

  return <div>{title}: {count}</div>
}

// ❌ BAD: Class components (unless necessary)
class MyComponent extends React.Component {
  // Class code
}
```

---

## 🧪 Testing

### Test Structure

```typescript
// components/Button/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const mockClick = jest.fn()
    render(<Button onClick={mockClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(mockClick).toHaveBeenCalled()
  })
})
```

### Writing Tests

When adding features, include tests for:
- Component rendering
- User interactions
- Edge cases
- Error states
- Props validation

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test Button.test.tsx

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

---

## 📝 Code Review Checklist

Before submitting a pull request, ensure:

- [ ] Code follows TypeScript strict mode
- [ ] No `any` types without justification
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Tests pass (if applicable)
- [ ] Component props are typed
- [ ] No console errors or warnings
- [ ] Performance is acceptable
- [ ] Code is well-documented
- [ ] Commit messages are clear

---

## 💬 Commit Messages

### Format

```
type(scope): subject

body

footer
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, missing semicolons)
- `refactor` - Code refactoring without feature changes
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Dependency updates, config changes

### Examples

```bash
# Feature
git commit -m "feat(dashboard): add progress chart to student dashboard"

# Bug fix
git commit -m "fix(auth): prevent token expiration on page reload"

# Documentation
git commit -m "docs(api): update API endpoint documentation"

# Refactoring
git commit -m "refactor(components): extract common header logic into hook"
```

---

## 🔄 Pull Request Process

### 1. Before Submitting

```bash
# Update from main
git fetch origin
git rebase origin/main

# Run final checks
npm run lint
npm run build
npm test (if tests exist)
```

### 2. Create Pull Request

**Title Format**:
```
[type] Short description

Example:
[Feature] Add student progress analytics to dashboard
[Fix] Correct token refresh on session expiration
[Docs] Update API documentation
```

**Description Template**:
```markdown
## Description
Brief explanation of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Related Issues
Closes #123

## Testing
Describe testing approach

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] Tests pass
- [ ] Documentation updated
```

### 3. Code Review

- Address feedback promptly
- Explain your reasoning if you disagree
- Maintain a professional, respectful tone
- Update PR description if scope changes

### 4. Approval and Merge

- Need at least 1 approval from maintainer
- All CI checks must pass
- Squash commits if requested
- Delete feature branch after merge

---

## 🎨 Code Style Guide

### Indentation & Formatting

```typescript
// Use 2 spaces for indentation
const config = {
  option1: 'value',
  option2: 'value'
}

// Line length: max 100 characters (soft limit 80)
const veryLongVariableName = 'This is a long string that might exceed ' +
  'the line length limit'
```

### Imports

```typescript
// 1. External packages
import React, { useState, useEffect } from 'react'
import axios from 'axios'

// 2. Internal modules
import { Header } from '@/components/Header/Header'
import { useAuth } from '@/context/AuthContext'
import type { User } from '@/types'

// 3. Styles
import styles from './MyComponent.css'
```

### Variable Declaration

```typescript
// Prefer const (immutable)
const name = 'John'

// Use let for reassignment
let count = 0
count++

// Avoid var
var oldStyle = 'deprecated'  // ❌ Don't use
```

### Async/Await

```typescript
// ✅ GOOD: async/await
async function fetchData() {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    console.error('Failed to fetch', error)
    throw error
  }
}

// ❌ AVOID: .then() chains (unless necessary)
function fetchData() {
  return api.get('/data')
    .then(res => res.data)
    .catch(err => {
      console.error('Failed to fetch', err)
      throw err
    })
}
```

---

## 📚 Documentation Standards

### Component Documentation

```typescript
/**
 * Button component for user interactions
 * 
 * @param children - Button text/content
 * @param onClick - Click handler
 * @param variant - Button style variant
 * @param disabled - Whether button is disabled
 * 
 * @example
 * <Button onClick={handleClick} variant="primary">
 *   Click me
 * </Button>
 */
export function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return <button className={`btn btn-${variant}`}>{children}</button>
}
```

### Inline Comments

```typescript
// ✅ GOOD: Explain why, not what
// Retry failed requests with exponential backoff
const shouldRetry = attempt < MAX_ATTEMPTS && exponentialBackoff(attempt)

// ❌ BAD: State the obvious
// Set shouldRetry to true if attempt < 3
const shouldRetry = attempt < 3
```

---

## 🔒 Security Considerations

### When Contributing

- Never commit secrets or API keys
- Don't hardcode sensitive data
- Follow security best practices
- Use environment variables for configuration
- Report security issues privately

### Code Review Security

- Check for XSS vulnerabilities
- Verify proper input validation
- Ensure authorization checks
- Review API key handling
- Check for dependency vulnerabilities

---

## 🚀 Performance Guidelines

### Optimization Tips

```typescript
// ✅ Use useMemo for expensive computations
const expensiveValue = useMemo(() => {
  return complexCalculation(data)
}, [data])

// ✅ Use useCallback for stable function references
const handleClick = useCallback(() => {
  dispatch(action)
}, [dispatch])

// ✅ Lazy load components
const Dashboard = lazy(() => import('./Dashboard'))

// ❌ AVOID: Creating functions in render
const handleClick = () => {
  dispatch(action)  // Creates new function each render
}
```

---

## 📊 Code Quality Tools

### Run Before Submitting PR

```bash
# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Build verification
npm run build

# Security audit
npm audit
```

---

## 🐛 Bug Reporting

When reporting bugs, include:

1. **Description** - What's the issue?
2. **Steps to Reproduce** - How to trigger the bug?
3. **Expected Behavior** - What should happen?
4. **Actual Behavior** - What actually happens?
5. **Environment** - Browser, OS, Node version
6. **Screenshots/Videos** - Visual evidence if applicable

---

## 💡 Feature Requests

When suggesting features:

1. **Problem Statement** - What problem does it solve?
2. **Proposed Solution** - How would you implement it?
3. **Examples** - Show expected usage
4. **Benefits** - Why is this valuable?
5. **Alternatives** - Any other approaches?

---

## 📞 Getting Help

- **Questions?** Open a discussion or contact maintainers
- **Stuck?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Docs?** Review [SETUP_GUIDE.md](./SETUP_GUIDE.md) and other guides

---

## 🙏 Thank You!

Your contributions make CodeBasics better. We appreciate your effort and look forward to collaborating with you!

---

**Last Updated**: May 27, 2026  
**Version**: 1.0.0
