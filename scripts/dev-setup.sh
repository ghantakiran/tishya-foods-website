#!/bin/bash

# Development environment setup script for Tishya Foods

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js 20+ and try again."
        exit 1
    fi
    
    # Check npm
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: v$NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    # Check Git
    if command -v git >/dev/null 2>&1; then
        GIT_VERSION=$(git --version)
        print_success "Git found: $GIT_VERSION"
    else
        print_error "Git is not installed. Please install Git and try again."
        exit 1
    fi
    
    # Check Docker (optional)
    if command -v docker >/dev/null 2>&1; then
        DOCKER_VERSION=$(docker --version)
        print_success "Docker found: $DOCKER_VERSION"
    else
        print_warning "Docker not found. Docker features will be unavailable."
    fi
}

# Setup environment files
setup_environment() {
    print_header "Setting Up Environment"
    
    if [ ! -f .env.local ]; then
        print_status "Creating .env.local file..."
        cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tishyafoods"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/tishyafoods"

# NextAuth.js
NEXTAUTH_SECRET="development-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_NAME="Tishya Foods"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (Development)
# STRIPE_SECRET_KEY="sk_test_..."
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
# STRIPE_WEBHOOK_SECRET="whsec_..."

# Development Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_SUBSCRIPTION=true
NEXT_PUBLIC_ENABLE_LOYALTY=true

# Debug
DEBUG="app:*"
NODE_ENV="development"
EOF
        print_success "Created .env.local file"
    else
        print_status ".env.local already exists, skipping..."
    fi
    
    if [ ! -f .env.example ]; then
        print_status "Creating .env.example file..."
        cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database"
DIRECT_URL="postgresql://username:password@localhost:5432/database"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_NAME="Tishya Foods"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_SUBSCRIPTION=true
NEXT_PUBLIC_ENABLE_LOYALTY=true
EOF
        print_success "Created .env.example file"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    print_status "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed successfully"
    
    print_status "Setting up Husky git hooks..."
    npx husky install
    print_success "Git hooks setup complete"
}

# Setup database
setup_database() {
    print_header "Setting Up Database"
    
    print_status "Generating Prisma client..."
    npx prisma generate
    print_success "Prisma client generated"
    
    print_warning "Database setup requires PostgreSQL to be running."
    read -p "Do you want to setup the database now? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Pushing database schema..."
        npx prisma db push || {
            print_warning "Database push failed. Make sure PostgreSQL is running and connection details are correct."
            print_status "You can run 'npm run db:push' later when the database is ready."
        }
        
        print_status "Seeding database with sample data..."
        npm run db:seed || {
            print_warning "Database seeding failed. You can run 'npm run db:seed' later."
        }
    else
        print_status "Skipping database setup. Run 'npm run db:push' and 'npm run db:seed' when ready."
    fi
}

# Setup VS Code
setup_vscode() {
    print_header "Setting Up VS Code"
    
    if command -v code >/dev/null 2>&1; then
        print_status "VS Code found, installing recommended extensions..."
        
        # List of recommended extensions
        extensions=(
            "bradlc.vscode-tailwindcss"
            "esbenp.prettier-vscode"
            "dbaeumer.vscode-eslint"
            "ms-vscode.vscode-typescript-next"
            "prisma.prisma"
            "ms-playwright.playwright"
            "ms-docker.docker"
            "github.vscode-github-actions"
            "redhat.vscode-yaml"
            "ms-vscode.test-adapter-converter"
        )
        
        for ext in "${extensions[@]}"; do
            print_status "Installing extension: $ext"
            code --install-extension "$ext" --force >/dev/null 2>&1 || {
                print_warning "Failed to install extension: $ext"
            }
        done
        
        print_success "VS Code extensions installed"
    else
        print_status "VS Code not found, skipping extension installation"
    fi
}

# Run initial tests
run_tests() {
    print_header "Running Initial Tests"
    
    print_status "Running linting..."
    npm run lint || {
        print_warning "Linting failed. Run 'npm run lint:fix' to fix auto-fixable issues."
    }
    
    print_status "Running type checking..."
    npm run type-check || {
        print_warning "Type checking failed. Please fix TypeScript errors."
    }
    
    print_status "Running unit tests..."
    npm test || {
        print_warning "Some tests failed. Please review and fix failing tests."
    }
}

# Development tips
show_development_tips() {
    print_header "Development Tips"
    
    echo -e "🚀 ${GREEN}Your Tishya Foods development environment is ready!${NC}\n"
    
    echo -e "${BLUE}Getting Started:${NC}"
    echo -e "  npm run dev          # Start development server"
    echo -e "  npm run build        # Build for production"
    echo -e "  npm test             # Run tests"
    echo -e "  npm run lint         # Check code quality"
    echo ""
    
    echo -e "${BLUE}Database Commands:${NC}"
    echo -e "  npm run db:push      # Push schema changes"
    echo -e "  npm run db:seed      # Seed with sample data"
    echo -e "  npm run db:studio    # Open Prisma Studio"
    echo ""
    
    echo -e "${BLUE}Docker Commands:${NC}"
    echo -e "  npm run docker:dev:start    # Start development with Docker"
    echo -e "  npm run docker:dev:stop     # Stop Docker development"
    echo -e "  npm run docker:dev:logs     # View Docker logs"
    echo ""
    
    echo -e "${BLUE}Testing Commands:${NC}"
    echo -e "  npm run test:watch          # Run tests in watch mode"
    echo -e "  npm run test:e2e            # Run E2E tests"
    echo -e "  npm run test:coverage       # Generate coverage report"
    echo ""
    
    echo -e "${BLUE}Useful URLs:${NC}"
    echo -e "  http://localhost:3000       # Application"
    echo -e "  http://localhost:5555       # Prisma Studio"
    echo -e "  http://localhost:8080       # Database Admin (with Docker)"
    echo ""
    
    echo -e "${YELLOW}Next Steps:${NC}"
    echo -e "  1. Review and update .env.local with your actual values"
    echo -e "  2. Set up your database connection"
    echo -e "  3. Configure Stripe for payment testing"
    echo -e "  4. Start developing with 'npm run dev'"
    echo ""
}

# Main setup function
main() {
    print_header "Tishya Foods Development Setup"
    
    check_prerequisites
    setup_environment
    install_dependencies
    setup_database
    setup_vscode
    run_tests
    show_development_tips
    
    print_success "Setup complete! Happy coding! 🎉"
}

# Run setup if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi