#!/bin/bash

# Release automation script for Tishya Foods

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

# Check if we're on the main branch
check_branch() {
    local current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        print_error "Must be on main branch to create a release. Current branch: $current_branch"
        exit 1
    fi
}

# Check if working directory is clean
check_working_directory() {
    if [ -n "$(git status --porcelain)" ]; then
        print_error "Working directory is not clean. Please commit or stash changes first."
        git status --porcelain
        exit 1
    fi
}

# Validate release type
validate_release_type() {
    local release_type=$1
    case $release_type in
        major|minor|patch)
            ;;
        *)
            print_error "Invalid release type: $release_type. Use: major, minor, or patch"
            exit 1
            ;;
    esac
}

# Run pre-release checks
run_pre_release_checks() {
    print_header "Running Pre-release Checks"
    
    print_status "Running linting..."
    npm run lint
    
    print_status "Running type checking..."
    npm run type-check
    
    print_status "Running tests..."
    npm run test
    
    print_status "Running security audit..."
    npm run security:audit
    
    print_status "Building application..."
    npm run build
    
    print_success "All pre-release checks passed!"
}

# Update version
update_version() {
    local release_type=$1
    
    print_header "Updating Version"
    
    # Get current version
    local current_version=$(node -p "require('./package.json').version")
    print_status "Current version: $current_version"
    
    # Update version
    npm version $release_type --no-git-tag-version
    
    # Get new version
    local new_version=$(node -p "require('./package.json').version")
    print_success "Updated to version: $new_version"
    
    echo $new_version
}

# Generate changelog
generate_changelog() {
    local new_version=$1
    
    print_header "Generating Changelog"
    
    # Get the latest tag
    local latest_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
    
    if [ -z "$latest_tag" ]; then
        # First release
        local commits=$(git log --oneline --format="- %s" HEAD)
    else
        # Generate changelog since last tag
        local commits=$(git log --oneline --format="- %s" ${latest_tag}..HEAD)
    fi
    
    # Create changelog entry
    local changelog_entry="## [${new_version}] - $(date +%Y-%m-%d)

### What's Changed
$commits

"
    
    # Prepend to CHANGELOG.md
    if [ -f CHANGELOG.md ]; then
        echo "$changelog_entry" | cat - CHANGELOG.md > temp && mv temp CHANGELOG.md
    else
        echo "$changelog_entry" > CHANGELOG.md
    fi
    
    print_success "Changelog updated"
}

# Commit and tag release
commit_and_tag() {
    local new_version=$1
    
    print_header "Committing and Tagging Release"
    
    # Stage changes
    git add package.json package-lock.json CHANGELOG.md
    
    # Commit changes
    git commit -m "chore(release): bump version to $new_version

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    
    # Create tag
    git tag -a "v$new_version" -m "Release v$new_version

$(head -n 20 CHANGELOG.md)

🚀 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    
    print_success "Release committed and tagged"
}

# Push release
push_release() {
    local new_version=$1
    
    print_header "Pushing Release"
    
    print_status "Pushing commits..."
    git push origin main
    
    print_status "Pushing tags..."
    git push origin "v$new_version"
    
    print_success "Release pushed to repository"
}

# Create GitHub release
create_github_release() {
    local new_version=$1
    
    print_header "Creating GitHub Release"
    
    if command -v gh >/dev/null 2>&1; then
        print_status "Creating GitHub release..."
        
        # Extract changelog for this version
        local release_notes=$(awk '/^## \[/{if(p) exit; p=1; next} p' CHANGELOG.md)
        
        gh release create "v$new_version" \
            --title "Release v$new_version" \
            --notes "$release_notes" \
            --latest
        
        print_success "GitHub release created"
    else
        print_warning "GitHub CLI not found. Please create the release manually at:"
        print_warning "https://github.com/kiranreddyghanta/TishyaFoods/releases/new?tag=v$new_version"
    fi
}

# Post-release actions
post_release_actions() {
    local new_version=$1
    
    print_header "Post-release Actions"
    
    print_status "Triggering deployment..."
    print_status "The CI/CD pipeline will automatically deploy version $new_version"
    
    print_status "Release checklist:"
    echo "  ✅ Version updated to $new_version"
    echo "  ✅ Changelog generated"
    echo "  ✅ Release committed and tagged"
    echo "  ✅ Release pushed to repository"
    echo "  ✅ GitHub release created"
    echo ""
    
    print_status "Next steps:"
    echo "  1. Monitor CI/CD pipeline for deployment status"
    echo "  2. Verify production deployment at https://tishyafoods.com"
    echo "  3. Announce release to team"
    echo ""
    
    print_success "Release process completed! 🎉"
}

# Show help
show_help() {
    echo "Tishya Foods Release Script"
    echo ""
    echo "Usage: $0 [RELEASE_TYPE]"
    echo ""
    echo "Release Types:"
    echo "  major    Major release (1.0.0 -> 2.0.0)"
    echo "  minor    Minor release (1.0.0 -> 1.1.0)"
    echo "  patch    Patch release (1.0.0 -> 1.0.1)"
    echo ""
    echo "Examples:"
    echo "  $0 patch    # Create a patch release"
    echo "  $0 minor    # Create a minor release"
    echo "  $0 major    # Create a major release"
    echo ""
    echo "Prerequisites:"
    echo "  - Must be on main branch"
    echo "  - Working directory must be clean"
    echo "  - All tests must pass"
    echo "  - No security vulnerabilities"
    echo ""
}

# Main release function
main() {
    local release_type=${1:-}
    
    if [ -z "$release_type" ]; then
        show_help
        exit 1
    fi
    
    if [ "$release_type" = "help" ] || [ "$release_type" = "--help" ] || [ "$release_type" = "-h" ]; then
        show_help
        exit 0
    fi
    
    print_header "Tishya Foods Release Process"
    
    validate_release_type "$release_type"
    check_branch
    check_working_directory
    
    print_status "Creating $release_type release..."
    
    run_pre_release_checks
    local new_version=$(update_version "$release_type")
    generate_changelog "$new_version"
    commit_and_tag "$new_version"
    push_release "$new_version"
    create_github_release "$new_version"
    post_release_actions "$new_version"
}

# Run main function with all arguments
main "$@"