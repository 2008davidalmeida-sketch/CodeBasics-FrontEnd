# CodeBasics Frontend - Documentation

Welcome to the CodeBasics Frontend documentation. This guide will help you understand, set up, and contribute to the CodeBasics educational platform.

## 📚 Documentation Overview

### Getting Started
- **[Setup Guide](./SETUP_GUIDE.md)** - Installation, dependencies, and local development setup
- **[Architecture Guide](./ARCHITECTURE.md)** - Project structure, design patterns, and system overview

### Development
- **[Component Guide](./COMPONENT_GUIDE.md)** - Component documentation and usage examples
- **[API Documentation](./API_DOCUMENTATION.md)** - Backend API endpoints and service integration

### Operations
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment, Docker, and Vercel setup
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Common issues and solutions

### Quality & Security
- **[Contributing Guidelines](./CONTRIBUTING.md)** - Code standards, testing, and pull request process
- **[Security Report](./SECURITY_REPORT.md)** - Security analysis and recommendations
- **[Scalability Report](./SCALABILITY_REPORT.md)** - Performance optimization and scaling strategies

---

## 🎯 Project Overview

**CodeBasics** is an interactive educational platform where students learn programming by completing coding challenges in Python. The platform features:

- 🎓 **Student Dashboard** - Progress tracking, completed exercises, and statistics
- 🧑‍🏫 **Teacher Dashboard** - Student management and submission reviews
- 💻 **Exercise Page** - Live code editor with Skulpt Python interpreter
- 🔐 **OAuth2 Authentication** - Secure Google Sign-in integration
- 📊 **Progress Analytics** - Visual learning progress tracking
- 🎨 **Modern UI** - Responsive design with Three.js visualizations

### Tech Stack
- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Code Editor**: CodeMirror
- **3D Graphics**: Three.js + React Three Fiber
- **Code Execution**: Skulpt (Python interpreter)
- **Styling**: CSS Modules

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
cd CodeBasics

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm lint
```

The application will be available at `http://localhost:5173`

---

## 📂 Project Structure

```
CodeBasics/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components and layouts
│   ├── services/           # API integration and services
│   ├── context/            # React Context (authentication)
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── assets/             # Static assets
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Application entry point
│   └── index.css            # Global styles
├── public/                 # Static files
├── Documentation/          # Project documentation
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker image definition
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project README
```

---

## 🔑 Key Features

### 1. **Authentication System**
- OAuth2 with Google Sign-in
- Session-based authentication
- Role-based access control (Student/Teacher)

### 2. **Exercise Management**
- Interactive Python code editor
- Real-time code execution in browser
- Test case validation
- Submission history tracking

### 3. **Progress Tracking**
- Student dashboard with statistics
- Topic-based learning organization
- Progress bars and completion indicators
- Submission analytics

### 4. **Teacher Tools**
- Student management interface
- Submission review panel
- Class analytics and statistics
- Student performance tracking

---

## 📖 Next Steps

1. **New to the project?** Start with the [Setup Guide](./SETUP_GUIDE.md)
2. **Want to understand the architecture?** Read the [Architecture Guide](./ARCHITECTURE.md)
3. **Need component details?** Check the [Component Guide](./COMPONENT_GUIDE.md)
4. **Ready to deploy?** See the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
5. **Contributing?** Review the [Contributing Guidelines](./CONTRIBUTING.md)

---

## 📞 Support & Resources

### Getting Help
- Review the [Troubleshooting Guide](./TROUBLESHOOTING.md) for common issues
- Check existing issues in the repository
- Contact the development team

### Important Links
- **API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Security Guidelines**: See [SECURITY_REPORT.md](./SECURITY_REPORT.md)
- **Performance Tips**: See [SCALABILITY_REPORT.md](./SCALABILITY_REPORT.md)

---

## 📝 License

This project is proprietary software. Unauthorized copying or distribution is prohibited.

---

**Last Updated**: May 27, 2026  
**Version**: 1.0.0  
**Maintained by**: CodeBasics Development Team
