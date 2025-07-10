#!/bin/bash

# Docker development helper script for Tishya Foods

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Load environment variables
load_env() {
    if [ -f .env.local ]; then
        print_status "Loading environment variables from .env.local"
        export $(cat .env.local | grep -v '^#' | xargs)
    elif [ -f .env ]; then
        print_status "Loading environment variables from .env"
        export $(cat .env | grep -v '^#' | xargs)
    else
        print_warning "No .env file found. Using default development environment."
    fi
}

# Start development environment
start_dev() {
    print_status "Starting Tishya Foods development environment..."
    
    # Create network if it doesn't exist
    docker network create tishya-network 2>/dev/null || true
    
    # Start services
    docker-compose up -d
    
    print_success "Development environment started!"
    print_status "Services running:"
    echo "  - Application: http://localhost:3000"
    echo "  - Database Admin: http://localhost:8080"
    echo "  - Prisma Studio: http://localhost:5555"
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Redis: localhost:6379"
}

# Stop development environment
stop_dev() {
    print_status "Stopping development environment..."
    docker-compose down
    print_success "Development environment stopped!"
}

# Restart development environment
restart_dev() {
    print_status "Restarting development environment..."
    docker-compose restart
    print_success "Development environment restarted!"
}

# Show logs
show_logs() {
    local service=${1:-}
    if [ -n "$service" ]; then
        print_status "Showing logs for service: $service"
        docker-compose logs -f "$service"
    else
        print_status "Showing logs for all services"
        docker-compose logs -f
    fi
}

# Clean up Docker resources
cleanup() {
    print_status "Cleaning up Docker resources..."
    
    # Stop and remove containers
    docker-compose down -v
    
    # Remove unused images, containers, and networks
    docker system prune -f
    
    print_success "Cleanup completed!"
}

# Database operations
db_migrate() {
    print_status "Running database migrations..."
    docker-compose exec app npx prisma migrate dev
    print_success "Database migrations completed!"
}

db_seed() {
    print_status "Seeding database..."
    docker-compose exec app npm run db:seed
    print_success "Database seeded!"
}

db_reset() {
    print_warning "This will reset the database and lose all data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting database..."
        docker-compose exec app npx prisma migrate reset --force
        print_success "Database reset completed!"
    else
        print_status "Database reset cancelled."
    fi
}

# Build development image
build_dev() {
    print_status "Building development Docker image..."
    docker-compose build --no-cache
    print_success "Development image built!"
}

# Show service status
status() {
    print_status "Service status:"
    docker-compose ps
}

# Open shell in app container
shell() {
    print_status "Opening shell in app container..."
    docker-compose exec app /bin/bash
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    docker-compose exec app npm install
    print_success "Dependencies installed!"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    docker-compose exec app npm test
}

# Show help
show_help() {
    echo "Tishya Foods Docker Development Helper"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start development environment"
    echo "  stop        Stop development environment"
    echo "  restart     Restart development environment"
    echo "  logs [svc]  Show logs (optionally for specific service)"
    echo "  status      Show service status"
    echo "  cleanup     Clean up Docker resources"
    echo "  build       Build development image"
    echo "  shell       Open shell in app container"
    echo "  install     Install dependencies"
    echo "  test        Run tests"
    echo ""
    echo "Database Commands:"
    echo "  db:migrate  Run database migrations"
    echo "  db:seed     Seed database with sample data"
    echo "  db:reset    Reset database (WARNING: destroys data)"
    echo ""
    echo "Examples:"
    echo "  $0 start              # Start development environment"
    echo "  $0 logs app           # Show app service logs"
    echo "  $0 db:migrate         # Run migrations"
    echo ""
}

# Main script logic
main() {
    check_docker
    load_env
    
    case "${1:-}" in
        start)
            start_dev
            ;;
        stop)
            stop_dev
            ;;
        restart)
            restart_dev
            ;;
        logs)
            show_logs "$2"
            ;;
        status)
            status
            ;;
        cleanup)
            cleanup
            ;;
        build)
            build_dev
            ;;
        shell)
            shell
            ;;
        install)
            install_deps
            ;;
        test)
            run_tests
            ;;
        db:migrate)
            db_migrate
            ;;
        db:seed)
            db_seed
            ;;
        db:reset)
            db_reset
            ;;
        help|--help|-h)
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"