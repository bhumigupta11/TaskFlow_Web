# Contributing Guidelines

We love your input! We want to make contributing to Team Task Manager as easy and transparent as possible.

## Development Setup

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch (`git checkout -b feature/amazing-feature`)
4. Follow our coding standards
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Coding Standards

### JavaScript/React
- Use ES6+ features
- Follow ESLint configuration if available
- Use meaningful variable names
- Add comments for complex logic

### Code Style
```javascript
// ✅ Good
const getUserById = (userId) => {
  return User.findById(userId);
};

// ❌ Avoid
function gudByID(u) {
  return User.findById(u);
}
```

### Naming Conventions
- Components: PascalCase (ProjectCard.jsx)
- Functions: camelCase (getUserData)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)
- File names: Descriptive and lowercase (auth.js)

## Commit Message Format

```
type(scope): brief description

Longer description explaining the changes...

Fixes #issue_number
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(auth): add password reset functionality

- Implement password reset email flow
- Add token verification
- Update user password on confirmation

Fixes #123
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage for new code

## Pull Request Process

1. Update README.md with any new features or changes
2. Ensure tests pass: `npm test`
3. Ensure linting passes: `npm run lint`
4. Request review from maintainers
5. Address any feedback

## Reporting Bugs

Use GitHub Issues with:
- Clear title
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## Feature Requests

Open an issue with:
- Clear title starting with "[FEATURE]"
- Detailed description of the feature
- Use cases and benefits
- Example implementation (if applicable)

## Documentation

- Update docs for API changes
- Add JSDoc comments for functions
- Update CHANGELOG.md
- Include code examples

## Code Review Points

Reviewers will check:
- Code quality and readability
- Test coverage
- Performance implications
- Security considerations
- Documentation completeness

## Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code improvements

## Local Development Checklist

- [ ] Environment variables set up
- [ ] Dependencies installed
- [ ] Database connection working
- [ ] Backend server running
- [ ] Frontend server running
- [ ] All tests passing
- [ ] No console errors

## Common Development Tasks

### Add a New API Endpoint

1. Create route in `backend/src/routes/`
2. Add corresponding controller in `backend/src/controllers/`
3. Add method to API service in `frontend/src/services/api.js`
4. Create component/page to use it
5. Add tests
6. Update API.md

### Add a New Component

1. Create in `frontend/src/components/`
2. Use Material-UI for consistency
3. Add PropTypes or TypeScript
4. Export from components index (if applicable)
5. Document usage in README

### Database Schema Changes

1. Update model in `backend/src/models/`
2. Create migration if needed
3. Update type definitions
4. Add validation rules

## Getting Help

- Create an issue for questions
- Ask in pull request comments
- Check existing issues/discussions
- Review documentation

---

Thank you for contributing! 🎉
