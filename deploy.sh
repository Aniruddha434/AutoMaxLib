#!/bin/bash

# AutoGitPilot Deployment Script
# This script handles deployment to different environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="autogitpilot"
DOCKER_COMPOSE_FILE="docker-compose.yml"
DOCKER_COMPOSE_PROD_FILE="docker-compose.prod.yml"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    log_success "Docker is running"
}

# Check if required files exist
check_files() {
    local files=("$@")
    for file in "${files[@]}"; do
        if [[ ! -f "$file" ]]; then
            log_error "Required file $file not found"
            exit 1
        fi
    done
    log_success "All required files found"
}

# Environment setup
setup_environment() {
    local env=$1
    
    log_info "Setting up environment: $env"
    
    case $env in
        "development")
            if [[ ! -f "backend/.env" ]]; then
                log_warning "Backend .env file not found, copying from .env.example"
                cp backend/.env.example backend/.env
            fi
            if [[ ! -f "frontend/.env" ]]; then
                log_warning "Frontend .env file not found, copying from .env.example"
                cp frontend/.env.example frontend/.env
            fi
            ;;
        "production")
            if [[ ! -f "backend/.env.production" ]]; then
                log_error "Backend .env.production file not found"
                exit 1
            fi
            if [[ ! -f "frontend/.env.production" ]]; then
                log_error "Frontend .env.production file not found"
                exit 1
            fi
            # Copy production env files
            cp backend/.env.production backend/.env
            cp frontend/.env.production frontend/.env
            ;;
        *)
            log_error "Unknown environment: $env"
            exit 1
            ;;
    esac
    
    log_success "Environment $env configured"
}

# Build and deploy
deploy() {
    local env=$1
    local compose_file=$2
    
    log_info "Starting deployment for $env environment"
    
    # Pull latest images
    log_info "Pulling latest images..."
    docker-compose -f "$compose_file" pull
    
    # Build images
    log_info "Building images..."
    docker-compose -f "$compose_file" build --no-cache
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose -f "$compose_file" down
    
    # Start new containers
    log_info "Starting new containers..."
    docker-compose -f "$compose_file" up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Health check
    health_check
    
    log_success "Deployment completed successfully!"
}

# Health check
health_check() {
    log_info "Performing health checks..."
    
    local backend_url="http://localhost:5000/health"
    local frontend_url="http://localhost:3000"
    
    # Check backend
    if curl -f -s "$backend_url" > /dev/null; then
        log_success "Backend health check passed"
    else
        log_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend
    if curl -f -s "$frontend_url" > /dev/null; then
        log_success "Frontend health check passed"
    else
        log_warning "Frontend health check failed (this might be normal if using a reverse proxy)"
    fi
}

# Backup database
backup_database() {
    log_info "Creating database backup..."
    
    local backup_dir="backups"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$backup_dir/mongodb_backup_$timestamp.gz"
    
    mkdir -p "$backup_dir"
    
    # Create MongoDB backup
    docker-compose exec -T mongodb mongodump --archive --gzip > "$backup_file"
    
    if [[ $? -eq 0 ]]; then
        log_success "Database backup created: $backup_file"
    else
        log_error "Database backup failed"
        return 1
    fi
}

# Restore database
restore_database() {
    local backup_file=$1
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_info "Restoring database from: $backup_file"
    
    # Restore MongoDB backup
    docker-compose exec -T mongodb mongorestore --archive --gzip < "$backup_file"
    
    if [[ $? -eq 0 ]]; then
        log_success "Database restored successfully"
    else
        log_error "Database restore failed"
        return 1
    fi
}

# Cleanup old images and containers
cleanup() {
    log_info "Cleaning up old Docker images and containers..."
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    # Remove unused networks
    docker network prune -f
    
    log_success "Cleanup completed"
}

# Show logs
show_logs() {
    local service=$1
    local compose_file=$2
    
    if [[ -n "$service" ]]; then
        docker-compose -f "$compose_file" logs -f "$service"
    else
        docker-compose -f "$compose_file" logs -f
    fi
}

# Main script
main() {
    local command=$1
    local environment=${2:-"development"}
    local service=$3
    
    case $command in
        "deploy")
            check_docker
            setup_environment "$environment"
            
            if [[ "$environment" == "production" ]]; then
                check_files "$DOCKER_COMPOSE_PROD_FILE"
                deploy "$environment" "$DOCKER_COMPOSE_PROD_FILE"
            else
                check_files "$DOCKER_COMPOSE_FILE"
                deploy "$environment" "$DOCKER_COMPOSE_FILE"
            fi
            ;;
        "backup")
            check_docker
            backup_database
            ;;
        "restore")
            if [[ -z "$service" ]]; then
                log_error "Please provide backup file path"
                exit 1
            fi
            check_docker
            restore_database "$service"
            ;;
        "health")
            health_check
            ;;
        "cleanup")
            cleanup
            ;;
        "logs")
            local compose_file="$DOCKER_COMPOSE_FILE"
            if [[ "$environment" == "production" ]]; then
                compose_file="$DOCKER_COMPOSE_PROD_FILE"
            fi
            show_logs "$service" "$compose_file"
            ;;
        "stop")
            local compose_file="$DOCKER_COMPOSE_FILE"
            if [[ "$environment" == "production" ]]; then
                compose_file="$DOCKER_COMPOSE_PROD_FILE"
            fi
            log_info "Stopping services..."
            docker-compose -f "$compose_file" down
            log_success "Services stopped"
            ;;
        *)
            echo "Usage: $0 {deploy|backup|restore|health|cleanup|logs|stop} [environment] [service/backup_file]"
            echo ""
            echo "Commands:"
            echo "  deploy [development|production]  - Deploy the application"
            echo "  backup                          - Create database backup"
            echo "  restore <backup_file>           - Restore database from backup"
            echo "  health                          - Perform health checks"
            echo "  cleanup                         - Clean up Docker resources"
            echo "  logs [service]                  - Show logs for all services or specific service"
            echo "  stop [environment]              - Stop all services"
            echo ""
            echo "Examples:"
            echo "  $0 deploy development"
            echo "  $0 deploy production"
            echo "  $0 backup"
            echo "  $0 restore backups/mongodb_backup_20231201_120000.gz"
            echo "  $0 logs backend"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
