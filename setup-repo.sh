#!/bin/bash

# OpenTelemetry Dashboard - Git Repository Setup Script
# Creates a new branch, creates GitHub repo, and pushes as public repository

set -e  # Exit on any error

echo "🚀 Setting up Git repository for OpenTelemetry Dashboard..."

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Please install it first:"
    echo "  brew install gh"
    echo "  or visit: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated with GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub CLI first:"
    echo "gh auth login"
    exit 1
fi

# Check if we're already in a git repository
if [ -d ".git" ]; then
    echo "📁 Git repository already exists"
    git status
else
    echo "📁 Initializing new Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Repository configuration
REPO_NAME="trace-poc-waterfall"
REPO_DESCRIPTION="OpenTelemetry Dashboard for Agentic AI Systems - Modern React 19 + Vite dashboard with waterfall visualization"

echo "🔗 Setting up GitHub repository..."

# Check if repository already exists on GitHub
if gh repo view "$REPO_NAME" &> /dev/null; then
    echo "📡 Repository '$REPO_NAME' already exists on GitHub"
    REPO_URL=$(gh repo view "$REPO_NAME" --json url -q '.url').git
else
    echo "🆕 Creating new public repository on GitHub..."
    gh repo create "$REPO_NAME" --public --description "$REPO_DESCRIPTION" --clone=false
    echo "✅ Repository '$REPO_NAME' created on GitHub"
    REPO_URL="https://github.com/$(gh api user --jq .login)/${REPO_NAME}.git"
fi

# Check if remote already exists
if git remote get-url origin 2>/dev/null; then
    echo "📡 Remote 'origin' already exists:"
    git remote -v
    CURRENT_URL=$(git remote get-url origin)
    if [ "$CURRENT_URL" != "$REPO_URL" ]; then
        git remote set-url origin "$REPO_URL"
        echo "✅ Remote URL updated to: $REPO_URL"
    fi
else
    git remote add origin "$REPO_URL"
    echo "✅ Remote 'origin' added: $REPO_URL"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production
/dist

# Local env files
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOL
    echo "✅ .gitignore created"
fi

# Stage all files
echo "📦 Staging files for commit..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit"
else
    # Commit changes
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: OpenTelemetry Dashboard with React 19 + Vite

Features:
- Modern OpenTelemetry dashboard for agentic AI systems
- 5 main tabs: Overview, Sessions, Spans, Traces, Waterfall
- 1000+ realistic trace samples with hierarchical structure
- Professional UI with clean design and interactive components
- Custom waterfall visualization for trace analysis
- Built with React 19, Vite, and TypeScript"
    echo "✅ Initial commit created"
fi

# Create and switch to new branch
BRANCH_NAME="main"
echo "🌿 Creating and switching to branch: $BRANCH_NAME"

# Check if we're already on the desired branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
    # Check if branch exists
    if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
        git checkout $BRANCH_NAME
    else
        git checkout -b $BRANCH_NAME
    fi
    echo "✅ Switched to branch: $BRANCH_NAME"
else
    echo "✅ Already on branch: $BRANCH_NAME"
fi

# Push to remote repository
echo "🚀 Pushing to remote repository..."

# Push with upstream tracking
if git push -u origin $BRANCH_NAME; then
    echo "✅ Successfully pushed to remote repository!"
    
    # Enable GitHub Pages
    echo "🌐 Enabling GitHub Pages..."
    if gh api repos/$(gh api user --jq .login)/${REPO_NAME}/pages \
        --method POST \
        --field source.branch="main" \
        --field source.path="/" \
        --field build_type="workflow" &> /dev/null; then
        echo "✅ GitHub Pages enabled with GitHub Actions"
    else
        echo "ℹ️  GitHub Pages may already be enabled or will be enabled after first workflow run"
    fi
    
    echo ""
    echo "🎉 Repository setup complete!"
    echo "📍 Repository URL: $REPO_URL"
    echo "🌿 Branch: $BRANCH_NAME"
    echo "🔍 View on GitHub: https://github.com/$(gh api user --jq .login)/${REPO_NAME}"
    echo "🌐 Live Demo (available after GitHub Actions deployment): https://$(gh api user --jq .login).github.io/${REPO_NAME}/"
    echo ""
    echo "🚀 What happens next:"
    echo "1. GitHub Actions will automatically build and deploy your site"
    echo "2. Your demo will be available at the Live Demo URL in a few minutes"
    echo "3. Every push to main will trigger automatic redeployment"
    echo "4. The repository is configured as public with GitHub Pages enabled"
    echo ""
    echo "⚡ Local development:"
    echo "- Run 'npm run dev' to start development server"
    echo "- Run 'npm run build' to build for production"
    echo "- Run 'npm run preview' to preview production build locally"
else
    echo "❌ Failed to push to remote repository"
    echo "Please check your Git credentials and network connection"
fi