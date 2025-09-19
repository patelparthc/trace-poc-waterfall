#!/bin/bash

# OpenTelemetry Dashboard - Git Repository Setup Script
# Creates a new branch and pushes to a public GitHub repository

set -e  # Exit on any error

echo "🚀 Setting up Git repository for OpenTelemetry Dashboard..."

# Check if we're already in a git repository
if [ -d ".git" ]; then
    echo "📁 Git repository already exists"
    git status
else
    echo "📁 Initializing new Git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Set up remote repository (you'll need to create this on GitHub first)
REPO_NAME="trace-poc-waterfall"
GITHUB_USERNAME="p1nt0z"  # Change this to your GitHub username
REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "🔗 Setting up remote repository..."

# Check if remote already exists
if git remote get-url origin 2>/dev/null; then
    echo "📡 Remote 'origin' already exists:"
    git remote -v
    read -p "Do you want to update the remote URL? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
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
echo "⚠️  Make sure you've created the repository '$REPO_NAME' on GitHub first!"
echo "   Repository URL: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
read -p "Press Enter to continue with push, or Ctrl+C to cancel..."

# Push with upstream tracking
if git push -u origin $BRANCH_NAME; then
    echo "✅ Successfully pushed to remote repository!"
    echo ""
    echo "🎉 Repository setup complete!"
    echo "📍 Repository URL: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo "🌿 Branch: $BRANCH_NAME"
    echo ""
    echo "Next steps:"
    echo "1. Visit your repository on GitHub"
    echo "2. Make sure it's set to public in repository settings"
    echo "3. Add a detailed README if needed"
    echo "4. Consider adding topics/tags for discoverability"
else
    echo "❌ Failed to push to remote repository"
    echo "Please make sure:"
    echo "1. The repository '$REPO_NAME' exists on GitHub"
    echo "2. You have the correct permissions"
    echo "3. Your Git credentials are configured"
    echo ""
    echo "You can create the repository at:"
    echo "https://github.com/new"
fi