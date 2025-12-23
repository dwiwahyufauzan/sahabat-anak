# Test Documentation

## Overview
Test suite lengkap untuk Sahabat Anak Backend API menggunakan Bun Test.

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test src/tests/auth.test.ts

# Run tests with coverage
bun test --coverage
```

## Test Structure

```
src/tests/
├── auth.test.ts         # Authentication & JWT tests
├── programs.test.ts     # Programs CRUD tests
├── news.test.ts         # News/articles tests
├── donations.test.ts    # Donations & payment tests
├── volunteers.test.ts   # Volunteer registration tests
├── contacts.test.ts     # Contact form tests
├── team.test.ts         # Team members tests
└── upload.test.ts       # File upload utility tests
```

## Test Coverage

### 1. Authentication Tests (`auth.test.ts`)
- ✅ Register new admin
- ✅ Prevent duplicate registration
- ✅ Login with valid credentials
- ✅ Reject invalid credentials
- ✅ Get admin profile with JWT
- ✅ Reject invalid/missing tokens

### 2. Programs Tests (`programs.test.ts`)
- ✅ Get all active programs
- ✅ Create new program
- ✅ Get program by slug
- ✅ Return 404 for non-existent program
- ✅ Update program
- ✅ Delete program

### 3. News Tests (`news.test.ts`)
- ✅ Get all news articles
- ✅ Get news by slug
- ✅ Return 404 for non-existent news
- ✅ Validate required fields

### 4. Donations Tests (`donations.test.ts`)
- ✅ Create donation without file
- ✅ Validate required fields
- ✅ Handle anonymous donations
- ✅ Link donation to program
- ✅ Default pending status
- ✅ Payment proof upload

### 5. Volunteers Tests (`volunteers.test.ts`)
- ✅ Create volunteer registration
- ✅ Validate required fields
- ✅ Handle minimal required fields
- ✅ Email format validation
- ✅ Default pending status
- ✅ Accept all optional fields

### 6. Contacts Tests (`contacts.test.ts`)
- ✅ Create contact message
- ✅ Validate required fields
- ✅ Handle message without subject
- ✅ Email format validation
- ✅ Default unread status
- ✅ Accept long messages

### 7. Team Members Tests (`team.test.ts`)
- ✅ Create team member
- ✅ Get all team members
- ✅ Get member by ID
- ✅ Update member
- ✅ Delete member
- ✅ Default active status
- ✅ Custom order support

### 8. Upload Tests (`upload.test.ts`)
- ✅ Reject files > 5MB
- ✅ Reject invalid file types
- ✅ Accept JPEG files
- ✅ Accept PNG files
- ✅ Accept WebP files
- ✅ Generate unique filenames
- ✅ Handle file deletion
- ✅ Preserve file extensions

## Test Data Cleanup

All tests include proper cleanup in `afterAll()` hooks to:
- Delete test records from database
- Remove uploaded test files
- Prevent data pollution

## Database Requirements

Tests require:
- MySQL database running
- Test database configured in `.env`
- Database schema migrated (`bun run db:push`)

## Best Practices

1. **Isolation**: Each test is independent
2. **Cleanup**: Always cleanup test data
3. **Naming**: Descriptive test names
4. **Assertions**: Clear expectations
5. **Coverage**: Test happy & error paths

## CI/CD Integration

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: bun test
  
- name: Check coverage
  run: bun test --coverage
```

## Troubleshooting

**Database connection errors:**
```bash
# Ensure MySQL is running
# Check .env configuration
# Run migrations first
bun run db:push
```

**File upload tests failing:**
```bash
# Ensure public/uploads/payment-proofs exists
mkdir -p public/uploads/payment-proofs
```

**Authentication tests failing:**
```bash
# Check JWT_SECRET in .env
# Ensure proper password hashing
```

## Future Improvements

- [ ] Add integration tests
- [ ] Add e2e tests with Playwright
- [ ] Increase test coverage to 90%+
- [ ] Add performance benchmarks
- [ ] Mock external dependencies
- [ ] Add load testing

## Contributing

When adding new features:
1. Write tests first (TDD)
2. Ensure all tests pass
3. Update this documentation
4. Maintain >80% coverage
