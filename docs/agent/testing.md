# Testing

This document describes the test infrastructure, frameworks, and conventions for Neovate Code.

## Test Framework

- **Framework**: Vitest
- **Environment**: Node.js
- **Test timeout**: 30 seconds
- **Coverage**: Not configured by default

## Test Structure

### Test File Locations
Tests are co-located with source files using the `.test.ts` suffix:
- `src/**/*.test.ts` - Unit and integration tests
- `e2e/` - End-to-end tests with real model interactions

### Test File Naming Convention
- `filename.test.ts` for unit tests
- `filename.integration.test.ts` for integration tests (if needed)

## Running Tests

### Basic Test Commands
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode for test development
```

### E2E Tests
End-to-end tests validate CLI functionality with real model interactions:

```bash
npm run test:e2e         # Run all e2e tests
npm run test:e2e --only normal  # Run tests for a specific fixture
npm run test:e2e --only normal/basic  # Run a specific test
```

**E2E Test Setup**:
1. Set `E2E_MODEL` environment variable in `.env` file
2. Configure appropriate API keys for the chosen model
3. Tests use real LLM providers (costs may apply)

## Test Patterns

### Unit Test Patterns
- Mock external dependencies (file system, network, etc.)
- Use Vitest's built-in mocking capabilities
- Test tool implementations in isolation
- Validate zod schemas and type guards

### Integration Test Patterns
- Test component interactions
- Validate configuration loading
- Test session persistence
- Verify tool execution flows

### E2E Test Patterns
- Use real model interactions
- Validate end-to-end user workflows
- Test slash command functionality
- Verify UI component rendering

## Test Utilities

### Common Test Helpers
Located in `src/utils/`:
- `applyEdit.test.ts` - Text editing utilities
- `messageNormalization.test.ts` - Message processing
- `safeFrontMatter.test.ts` - Frontmatter parsing
- `tokenCounter.test.ts` - Token counting utilities

### Mock Data
- Use fixtures in `e2e/fixtures/` for e2e tests
- Create minimal test data for unit tests
- Avoid hardcoding large test data in test files

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Descriptive names**: Use descriptive test names that explain what's being tested
3. **Minimal mocks**: Mock only what's necessary
4. **Cleanup**: Clean up test artifacts after each test
5. **Performance**: Keep tests fast; avoid unnecessary I/O or network calls

## Debugging Tests

### Debug Mode
```bash
DEBUG=neovate* npm test  # Print debug logs during tests
```

### Test Failures
When tests fail:
1. Check test timeout (default 30 seconds)
2. Verify environment variables for e2e tests
3. Check for network connectivity issues
4. Review test logs for specific error messages

## Coverage (When Enabled)

To enable coverage:
```bash
vitest run --coverage
```

Coverage reports help identify untested code paths and ensure comprehensive test coverage.
