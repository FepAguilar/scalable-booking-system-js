#!/bin/bash

# Development script to start all services locally
# Usage: ./dev.sh [service_name] or ./dev.sh all

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

# Function to start a single service
start_service() {
    local service_name=$1
    local service_path="./$service_name"
    
    if [ ! -d "$service_path" ]; then
        print_error "Service directory $service_path does not exist"
        return 1
    fi
    
    print_status "Starting $service_name..."
    cd "$service_path"
    
    # Check if .env exists, create if not
    if [ ! -f ".env" ]; then
        print_warning "Creating .env for $service_name"
        case $service_name in
            "auth-service")
                echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_service?schema=public" > .env
                echo "PORT=3000" >> .env
                ;;
            "user-service")
                echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/user_service?schema=public" > .env
                echo "PORT=3001" >> .env
                ;;
            "workspace-service")
                echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/workspace_service?schema=public" > .env
                echo "PORT=3002" >> .env
                ;;
            "booking-service")
                echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/booking_service?schema=public" > .env
                echo "PORT=3003" >> .env
                ;;
            "payment-service")
                echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/payment_service?schema=public" > .env
                echo "PORT=3004" >> .env
                ;;
            "notification-service")
                echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/notification_service?schema=public" > .env
                echo "PORT=3005" >> .env
                ;;
            "reporting-service")
                echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/reporting_service?schema=public" > .env
                echo "PORT=3006" >> .env
                ;;
            "admin-service")
                echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/admin_service?schema=public" > .env
                echo "PORT=3007" >> .env
                ;;
        esac
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies for $service_name..."
        npm install --silent
    fi
    
    # Run Prisma migrations
    print_status "Running Prisma migrations for $service_name..."
    npx prisma migrate dev --name init --silent || true
    
    # Start the service in background
    print_status "Starting $service_name in background..."
    npm run start:dev > "../logs/$service_name.log" 2>&1 &
    local pid=$!
    echo $pid > "../logs/$service_name.pid"
    
    print_success "$service_name started with PID $pid"
    cd ..
}

# Function to stop a service
stop_service() {
    local service_name=$1
    local pid_file="./logs/$service_name.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            print_status "Stopping $service_name (PID: $pid)..."
            kill $pid
            rm "$pid_file"
            print_success "$service_name stopped"
        else
            print_warning "$service_name is not running"
            rm "$pid_file"
        fi
    else
        print_warning "$service_name is not running"
    fi
}

# Function to check if PostgreSQL is running
check_postgres() {
    if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
        print_error "PostgreSQL is not running on localhost:5432"
        print_status "Starting PostgreSQL with Docker..."
        docker compose up -d postgres
        sleep 5
    else
        print_success "PostgreSQL is running"
    fi
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    echo "=================="
    
    local services=("auth-service" "user-service" "workspace-service" "booking-service" "payment-service" "notification-service" "reporting-service" "admin-service")
    
    for service in "${services[@]}"; do
        local pid_file="./logs/$service.pid"
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${GREEN}✓${NC} $service (PID: $pid)"
            else
                echo -e "${RED}✗${NC} $service (not running)"
                rm "$pid_file"
            fi
        else
            echo -e "${RED}✗${NC} $service (not running)"
        fi
    done
    
    echo ""
    print_status "Service URLs:"
    echo "=============="
    echo "Auth Service:     http://localhost:3000/api"
    echo "User Service:     http://localhost:3001/api/docs"
    echo "Workspace Service: http://localhost:3002/api/docs"
    echo "Booking Service:  http://localhost:3003/api/docs"
    echo "Payment Service:  http://localhost:3004/api/docs"
    echo "Notification Service: http://localhost:3005/api/docs"
    echo "Reporting Service: http://localhost:3006/api/docs"
    echo "Admin Service:    http://localhost:3007/api/docs"
}

# Main script logic
main() {
    # Create logs directory
    mkdir -p logs
    
    case "${1:-all}" in
        "start")
            if [ -z "$2" ]; then
                print_error "Please specify a service name or 'all'"
                echo "Usage: $0 start [service_name|all]"
                exit 1
            fi
            
            check_postgres
            
            if [ "$2" = "all" ]; then
                print_status "Starting all services..."
                local services=("auth-service" "user-service" "workspace-service" "booking-service" "payment-service" "notification-service" "reporting-service" "admin-service")
                for service in "${services[@]}"; do
                    start_service "$service"
                    sleep 2
                done
                print_success "All services started!"
            else
                start_service "$2"
            fi
            ;;
        "stop")
            if [ -z "$2" ]; then
                print_error "Please specify a service name or 'all'"
                echo "Usage: $0 stop [service_name|all]"
                exit 1
            fi
            
            if [ "$2" = "all" ]; then
                print_status "Stopping all services..."
                local services=("auth-service" "user-service" "workspace-service" "booking-service" "payment-service" "notification-service" "reporting-service" "admin-service")
                for service in "${services[@]}"; do
                    stop_service "$service"
                done
                print_success "All services stopped!"
            else
                stop_service "$2"
            fi
            ;;
        "status")
            show_status
            ;;
        "restart")
            if [ -z "$2" ]; then
                print_error "Please specify a service name or 'all'"
                echo "Usage: $0 restart [service_name|all]"
                exit 1
            fi
            
            if [ "$2" = "all" ]; then
                print_status "Restarting all services..."
                $0 stop all
                sleep 2
                $0 start all
            else
                print_status "Restarting $2..."
                $0 stop "$2"
                sleep 2
                $0 start "$2"
            fi
            ;;
        "logs")
            if [ -z "$2" ]; then
                print_error "Please specify a service name"
                echo "Usage: $0 logs [service_name]"
                exit 1
            fi
            
            if [ -f "./logs/$2.log" ]; then
                tail -f "./logs/$2.log"
            else
                print_error "No log file found for $2"
            fi
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|status|logs} [service_name|all]"
            echo ""
            echo "Commands:"
            echo "  start [service|all]  - Start service(s)"
            echo "  stop [service|all]   - Stop service(s)"
            echo "  restart [service|all] - Restart service(s)"
            echo "  status               - Show service status"
            echo "  logs [service]       - Show service logs"
            echo ""
            echo "Examples:"
            echo "  $0 start all"
            echo "  $0 start booking-service"
            echo "  $0 status"
            echo "  $0 logs booking-service"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 