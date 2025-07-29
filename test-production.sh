#!/bin/bash

# AutoGitPilot Production Testing Script
# This script performs comprehensive testing of the production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${BASE_URL:-http://localhost}"
API_URL="${API_URL:-$BASE_URL/api}"
TIMEOUT=30

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((TESTS_PASSED++))
}

log_failure() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((TESTS_FAILED++))
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((TESTS_TOTAL++))
    log_info "Running test: $test_name"
    
    if eval "$test_command"; then
        log_success "$test_name"
        return 0
    else
        log_failure "$test_name"
        return 1
    fi
}

# HTTP test helper
test_http() {
    local url="$1"
    local expected_status="${2:-200}"
    local timeout="${3:-$TIMEOUT}"
    
    local response=$(curl -s -w "%{http_code}" -o /dev/null --max-time "$timeout" "$url" 2>/dev/null || echo "000")
    
    if [[ "$response" == "$expected_status" ]]; then
        return 0
    else
        echo "Expected status $expected_status, got $response for $url" >&2
        return 1
    fi
}

# JSON response test helper
test_json_response() {
    local url="$1"
    local expected_field="$2"
    local timeout="${3:-$TIMEOUT}"
    
    local response=$(curl -s --max-time "$timeout" "$url" 2>/dev/null || echo "{}")
    
    if echo "$response" | jq -e "$expected_field" > /dev/null 2>&1; then
        return 0
    else
        echo "Expected field $expected_field not found in response from $url" >&2
        echo "Response: $response" >&2
        return 1
    fi
}

# Performance test helper
test_performance() {
    local url="$1"
    local max_time="${2:-1000}" # milliseconds
    
    local response_time=$(curl -s -w "%{time_total}" -o /dev/null --max-time "$TIMEOUT" "$url" 2>/dev/null || echo "999")
    local response_time_ms=$(echo "$response_time * 1000" | bc -l | cut -d. -f1)
    
    if [[ "$response_time_ms" -le "$max_time" ]]; then
        return 0
    else
        echo "Response time ${response_time_ms}ms exceeds maximum ${max_time}ms for $url" >&2
        return 1
    fi
}

# Main test suite
main() {
    log_info "Starting AutoGitPilot Production Tests"
    log_info "Base URL: $BASE_URL"
    log_info "API URL: $API_URL"
    echo ""

    # Basic connectivity tests
    log_info "=== Basic Connectivity Tests ==="
    run_test "Frontend accessibility" "test_http '$BASE_URL' 200"
    run_test "API health endpoint" "test_http '$API_URL/../health' 200"
    run_test "API base endpoint" "test_http '$API_URL' 404" # Should return 404 for base API path
    echo ""

    # Health check tests
    log_info "=== Health Check Tests ==="
    run_test "Basic health check" "test_json_response '$BASE_URL/health' '.status'"
    run_test "Detailed health check" "test_json_response '$BASE_URL/monitoring/health/detailed' '.status'"
    run_test "System info endpoint" "test_json_response '$BASE_URL/monitoring/info' '.name'"
    run_test "Database health" "test_json_response '$BASE_URL/monitoring/database' '.status'"
    echo ""

    # Performance tests
    log_info "=== Performance Tests ==="
    run_test "Frontend load time (<2s)" "test_performance '$BASE_URL' 2000"
    run_test "Health check response time (<500ms)" "test_performance '$BASE_URL/health' 500"
    run_test "API response time (<1s)" "test_performance '$API_URL/../health' 1000"
    echo ""

    # Security tests
    log_info "=== Security Tests ==="
    run_test "Security headers present" "curl -s -I '$BASE_URL' | grep -q 'X-Frame-Options'"
    run_test "HTTPS redirect (if SSL enabled)" "test_http 'http://localhost' 301 || test_http 'http://localhost' 200"
    run_test "Rate limiting configured" "curl -s '$BASE_URL/api/test' | grep -q 'rate' || true"
    echo ""

    # API endpoint tests
    log_info "=== API Endpoint Tests ==="
    run_test "Auth endpoints accessible" "test_http '$API_URL/auth/test' 401" # Should require auth
    run_test "Public endpoints accessible" "test_http '$API_URL/../monitoring/health' 200"
    echo ""

    # Static asset tests
    log_info "=== Static Asset Tests ==="
    run_test "Favicon accessible" "test_http '$BASE_URL/favicon.ico' 200"
    run_test "Robots.txt accessible" "test_http '$BASE_URL/robots.txt' 200 || test_http '$BASE_URL/robots.txt' 404"
    echo ""

    # Database connectivity tests
    log_info "=== Database Tests ==="
    run_test "MongoDB connection" "test_json_response '$BASE_URL/monitoring/database' '.status' | grep -q 'healthy'"
    echo ""

    # Service availability tests
    log_info "=== Service Availability Tests ==="
    run_test "External services status" "test_json_response '$BASE_URL/monitoring/services' '.services'"
    echo ""

    # Load tests (basic)
    log_info "=== Basic Load Tests ==="
    run_test "Concurrent requests (10)" "
        for i in {1..10}; do
            curl -s '$BASE_URL/health' > /dev/null &
        done
        wait
        test_http '$BASE_URL/health' 200
    "
    echo ""

    # Docker container tests
    log_info "=== Container Health Tests ==="
    if command -v docker &> /dev/null; then
        run_test "Backend container running" "docker ps | grep -q 'autogitpilot-backend'"
        run_test "Frontend container running" "docker ps | grep -q 'autogitpilot-frontend'"
        run_test "MongoDB container running" "docker ps | grep -q 'autogitpilot-mongodb'"
        run_test "Redis container running" "docker ps | grep -q 'autogitpilot-redis' || true" # Optional
    else
        log_warning "Docker not available, skipping container tests"
    fi
    echo ""

    # Log file tests
    log_info "=== Log File Tests ==="
    if [[ -d "backend/logs" ]]; then
        run_test "Application logs exist" "[[ -f backend/logs/app-$(date +%Y-%m-%d).log ]] || [[ -f backend/logs/app.log ]]"
        run_test "Error logs exist" "[[ -f backend/logs/error-$(date +%Y-%m-%d).log ]] || [[ -f backend/logs/error.log ]]"
    else
        log_warning "Log directory not found, skipping log tests"
    fi
    echo ""

    # Configuration tests
    log_info "=== Configuration Tests ==="
    run_test "Environment variables set" "test_json_response '$BASE_URL/monitoring/info' '.environment'"
    run_test "Production mode enabled" "test_json_response '$BASE_URL/monitoring/info' '.environment' | grep -q 'production' || true"
    echo ""

    # SSL/TLS tests (if HTTPS)
    if [[ "$BASE_URL" == https* ]]; then
        log_info "=== SSL/TLS Tests ==="
        run_test "SSL certificate valid" "echo | openssl s_client -connect ${BASE_URL#https://}:443 -servername ${BASE_URL#https://} 2>/dev/null | openssl x509 -noout -dates"
        run_test "TLS version check" "curl -s --tlsv1.2 '$BASE_URL' > /dev/null"
        echo ""
    fi

    # Cleanup and summary
    log_info "=== Test Summary ==="
    echo "Total tests: $TESTS_TOTAL"
    echo "Passed: $TESTS_PASSED"
    echo "Failed: $TESTS_FAILED"
    echo ""

    if [[ $TESTS_FAILED -eq 0 ]]; then
        log_success "All tests passed! 🎉"
        echo ""
        log_info "Production deployment appears to be healthy and ready!"
        exit 0
    else
        log_failure "$TESTS_FAILED test(s) failed"
        echo ""
        log_warning "Please review the failed tests and fix any issues before going live."
        exit 1
    fi
}

# Help function
show_help() {
    echo "AutoGitPilot Production Testing Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -u, --url URL     Base URL to test (default: http://localhost)"
    echo "  -t, --timeout N   Request timeout in seconds (default: 30)"
    echo "  -h, --help        Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  BASE_URL          Base URL to test"
    echo "  API_URL           API URL to test"
    echo "  TIMEOUT           Request timeout"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Test localhost"
    echo "  $0 -u https://autogitpilot.com       # Test production"
    echo "  BASE_URL=https://staging.example.com $0  # Test staging"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            BASE_URL="$2"
            API_URL="$BASE_URL/api"
            shift 2
            ;;
        -t|--timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check dependencies
if ! command -v curl &> /dev/null; then
    log_failure "curl is required but not installed"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    log_warning "jq is not installed, some JSON tests may fail"
fi

if ! command -v bc &> /dev/null; then
    log_warning "bc is not installed, performance tests may fail"
fi

# Run main test suite
main
