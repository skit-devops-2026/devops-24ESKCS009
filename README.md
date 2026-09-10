# HireHub 💼 — Modern Job Portal

![CI Build Status](https://github.com/skit-devops-2026/devops-24ESKCS009/workflows/HireHub%20CI%20Pipeline/badge.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

> **Your Next Big Career Move Starts Right Here.**

HireHub is a modern, fully responsive job portal landing page and user interface designed to help job seekers discover and explore career opportunities from leading companies. It features interactive job search, category/location filtering, a sign-in modal, mobile-responsive navigation, Jest automated test suites, GitHub Actions CI/CD workflows, and a declarative Jenkins pipeline.

---

## 🌟 Overview

**HireHub** provides an intuitive web platform with:
- Dynamic job search & filtering across industries and geographical locations.
- Accessible authentication modals with full keyboard shortcut (ESC key) and backdrop click handling.
- Mobile-first drawer navigation with responsive layouts.
- Automated testing infrastructure using **Jest** and **DOM environment mocking**.
- **GitHub Actions CI/CD** integration with continuous testing and artifact storage.
- **Jenkins Pipeline** (`Jenkinsfile`) for local or server automated build verification.

---

## ✨ Key Features

### 🔍 Interactive Job Search & Filtering
- Search jobs by job title or role keyword.
- Filter jobs based on global locations (Canada, Hyderabad, Mumbai, Texas, Lagos, New York).
- Filter jobs across technical categories (Programming, Data Science, Designing, Management, Networking, Cybersecurity).

### 🏢 Trusted Employer Showcase
- Displays partner hiring organizations (Microsoft, Walmart, Accenture, Samsung, Amazon, Adobe).
- Interactive hover transitions and responsive image scaling.

### 💼 Rich Job Cards
Each job card provides essential details:
- Company logo & employer name
- Job title & seniority level
- Geographical location
- Role overview description
- Quick-action **Apply Now** and **Learn More** buttons

### 🔐 Interactive Sign-In Modal
- Accessible login overlay with backdrop blurring and lock-scroll behavior.
- Integrated keyboard handling (Escape key closes modal).
- Form field validation helper functions.

### 📱 Responsive Mobile Navigation
- Dynamic drawer navigation toggled via hamburger menu.
- Auto-close functionality upon selecting page navigation links.

---

## 🛠️ Tech Stack & Automation

- **Frontend Core**: HTML5, CSS3 (Flexbox & Grid), Vanilla JavaScript (ES6+).
- **Testing Framework**: Jest 29+ with `jest-environment-jsdom` and Babel.
- **CI/CD Pipeline**: GitHub Actions (`.github/workflows/ci.yml`).
- **Automation Pipeline**: Declarative Jenkinsfile (`Jenkinsfile`).

---

## 📁 Repository Structure

```text
job portal/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow definition
├── images/                    # Website brand assets and logos
├── job/                       # Recruiter page and job sub-modules
├── tests/
│   └── jobPortal.test.js      # Automated Jest unit & DOM test suite
├── .gitignore                 # Excludes build artifacts and dependencies
├── babel.config.js            # Babel configuration for Jest
├── index.html                 # Main website HTML structure
├── Jenkinsfile                # Declarative Jenkins build pipeline
├── package.json               # Node.js dependencies and test scripts
├── script.js                  # Application logic and exported helper functions
├── style.css                  # UI styling and responsive layouts
└── README.md                  # Comprehensive project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/skit-devops-2026/devops-24ESKCS009.git
cd devops-24ESKCS009
npm install
```

### 3. Running the Development Server
Open `index.html` in your web browser or start a static server:
```bash
npx serve .
```

---

## 🧪 Running Automated Tests

Run the full Jest test suite locally:
```bash
npm test
```

Generate test coverage reports:
```bash
npm test:coverage
```

---

## 🔄 CI/CD Pipelines

### 1. GitHub Actions CI
The `.github/workflows/ci.yml` pipeline triggers automatically on pushes and pull requests to `main`. It:
1. Checks out repository code.
2. Sets up Node.js 20 environment.
3. Installs clean dependencies via `npm ci`.
4. Executes the automated test suite with coverage tracking.
5. Uploads code coverage reports as workflow artifacts.

### 2. Jenkins Pipeline
The `Jenkinsfile` defines a declarative pipeline containing stages:
- **Checkout**: Source code retrieval.
- **Install Dependencies**: Clean dependency installation.
- **Run Automated Tests**: Jest test suite execution.
- **Build & Package**: Static asset verification.
- **Post-actions**: Archiving test coverage reports and build status reporting.

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` details if applicable.
