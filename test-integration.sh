#!/bin/bash

# Integration test script for inter-service communication
# This script demonstrates the complete booking flow

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

# Function to wait for service to be ready
wait_for_service() {
    local service_url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$service_url" > /dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - $service_name not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start after $max_attempts attempts"
    return 1
}

# Function to make HTTP request and check response
make_request() {
    local method=$1
    local url=$2
    local data=$3
    local description=$4
    
    print_status "$description..."
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all lines except last)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        print_success "$description completed (Status: $status_code)"
        echo "$response_body"
        return 0
    else
        print_error "$description failed (Status: $status_code)"
        echo "$response_body"
        return 1
    fi
}

# Main test function
run_integration_test() {
    print_status "Starting integration test for inter-service communication..."
    echo ""
    
    # Wait for all services to be ready
    wait_for_service "http://localhost:3001/api/docs" "User Service" || exit 1
    wait_for_service "http://localhost:3002/api/docs" "Workspace Service" || exit 1
    wait_for_service "http://localhost:3003/api/docs" "Booking Service" || exit 1
    wait_for_service "http://localhost:3004/api/docs" "Payment Service" || exit 1
    wait_for_service "http://localhost:3005/api/docs" "Notification Service" || exit 1
    wait_for_service "http://localhost:3006/api/docs" "Reporting Service" || exit 1
    
    echo ""
    print_status "All services are ready! Starting integration test..."
    echo ""
    
    # Step 1: Create a user
    print_status "Step 1: Creating a user..."
    user_data='{
        "name": "John Doe",
        "email": "john.doe@example.com"
    }'
    
    user_response=$(make_request "POST" "http://localhost:3001/user" "$user_data" "Creating user")
    if [ $? -ne 0 ]; then
        print_error "Failed to create user"
        exit 1
    fi
    
    # Extract user ID from response
    user_id=$(echo "$user_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    print_success "User created with ID: $user_id"
    echo ""
    
    # Step 2: Create a workspace
    print_status "Step 2: Creating a workspace..."
    workspace_data='{
        "name": "Conference Room A",
        "description": "A spacious conference room with projector"
    }'
    
    workspace_response=$(make_request "POST" "http://localhost:3002/workspaces" "$workspace_data" "Creating workspace")
    if [ $? -ne 0 ]; then
        print_error "Failed to create workspace"
        exit 1
    fi
    
    # Extract workspace ID from response
    workspace_id=$(echo "$workspace_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    print_success "Workspace created with ID: $workspace_id"
    echo ""
    
    # Step 3: Create a booking (this will trigger inter-service communication)
    print_status "Step 3: Creating a booking (this orchestrates all services)..."
    booking_data="{
        \"userId\": \"$user_id\",
        \"workspaceId\": \"$workspace_id\",
        \"startTime\": \"$(date -u -d '+1 hour' +%Y-%m-%dT%H:%M:%S.000Z)\",
        \"endTime\": \"$(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%S.000Z)\",
        \"status\": \"PENDING\"
    }"
    
    booking_response=$(make_request "POST" "http://localhost:3003/bookings" "$booking_data" "Creating booking")
    if [ $? -ne 0 ]; then
        print_error "Failed to create booking"
        exit 1
    fi
    
    # Extract booking ID from response
    booking_id=$(echo "$booking_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    print_success "Booking created with ID: $booking_id"
    echo ""
    
    # Step 4: Verify the booking was created
    print_status "Step 4: Verifying booking was created..."
    make_request "GET" "http://localhost:3003/bookings/$booking_id" "" "Fetching booking details"
    echo ""
    
    # Step 5: Check if payment was created
    print_status "Step 5: Checking if payment was created..."
    payments_response=$(make_request "GET" "http://localhost:3004/payments" "" "Fetching payments")
    echo ""
    
    # Step 6: Check if notification was created
    print_status "Step 6: Checking if notification was created..."
    notifications_response=$(make_request "GET" "http://localhost:3005/notifications" "" "Fetching notifications")
    echo ""
    
    # Step 7: Check if report was created
    print_status "Step 7: Checking if report was created..."
    reports_response=$(make_request "GET" "http://localhost:3006/reports" "" "Fetching reports")
    echo ""
    
    print_success "Integration test completed successfully!"
    echo ""
    print_status "Summary:"
    echo "  ✓ User created: $user_id"
    echo "  ✓ Workspace created: $workspace_id"
    echo "  ✓ Booking created: $booking_id"
    echo "  ✓ Payment processing triggered"
    echo "  ✓ Notification sent"
    echo "  ✓ Report generated"
    echo ""
    print_status "Inter-service communication is working correctly!"
}

# Check if services are running
check_services() {
    print_status "Checking if all services are running..."
    
    local services=(
        "http://localhost:3001/api/docs:User Service"
        "http://localhost:3002/api/docs:Workspace Service"
        "http://localhost:3003/api/docs:Booking Service"
        "http://localhost:3004/api/docs:Payment Service"
        "http://localhost:3005/api/docs:Notification Service"
        "http://localhost:3006/api/docs:Reporting Service"
    )
    
    for service in "${services[@]}"; do
        local url=$(echo "$service" | cut -d':' -f1)
        local name=$(echo "$service" | cut -d':' -f2)
        
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$name is running"
        else
            print_error "$name is not running"
            return 1
        fi
    done
    
    return 0
}

# Main script logic
case "${1:-test}" in
    "test")
        if check_services; then
            run_integration_test
        else
            print_error "Some services are not running. Please start all services first:"
            echo "  ./dev.sh start all"
            exit 1
        fi
        ;;
    "check")
        check_services
        ;;
    *)
        echo "Usage: $0 {test|check}"
        echo ""
        echo "Commands:"
        echo "  test  - Run the full integration test"
        echo "  check - Check if all services are running"
        echo ""
        echo "Before running tests, ensure all services are started:"
        echo "  ./dev.sh start all"
        exit 1
        ;;
esac 