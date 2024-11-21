# Contributing to Omnivox UI Optimizer

Thank you for your interest in contributing to Omnivox UI Optimizer! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Prerequisites**
   - Node.js (v18 or higher)
   - PNPM package manager
   - A userscript manager (Violentmonkey recommended)

2. **Local Development**
   ```bash
   # Clone the repository
   git clone https://github.com/evannotfound/omnivox-optimizer.git
   cd omnivox-optimizer

   # Install dependencies
   pnpm install

   # Start development server
   pnpm dev
   ```

   The development server will run on `localhost:8080`. Install the development version of the script through your userscript manager.

## Project Structure

- `src/`: Source code
  - `modules/`: Feature modules
    - `lea/`: LEA-specific features
  - `styles/`: Stylus stylesheets
- `dist/`: Built files
- `webpack.config.js`: Webpack configuration
- `userscript.config.js`: Userscript metadata configuration

## Coding Guidelines

1. **Commit Messages**
   We use conventional commits. Each commit message should be structured as follows:
   ```
   <type>: <description>

   [optional body]
   [optional footer]
   ```
   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes
   - `refactor`: Code refactoring
   - `perf`: Performance improvements
   - `test`: Adding or modifying tests
   - `chore`: Maintenance tasks

2. **Code Style**
   - Use meaningful variable and function names
   - Comment complex logic
   - Keep functions focused and small
   - Use modern JavaScript features

## Release Process

1. Make your changes and commit them using conventional commit messages
2. Run one of the following commands based on the type of change:
   ```bash
   pnpm release:patch  # For bug fixes
   pnpm release:minor  # For new features
   pnpm release:major  # For breaking changes
   ```
3. Push your changes and the new tag:
   ```bash
   git push --follow-tags origin main
   ```
4. GitHub Actions will automatically create a release with the built files

## Testing

Before submitting a pull request:
1. Test your changes locally
2. Ensure the script works in both development and production modes
3. Test on different pages of Omnivox
4. Verify that existing features still work

## Pull Request Process

1. Fork the repository
2. Create a new branch for your feature/fix
3. Make your changes
4. Submit a pull request with a clear description of the changes
5. Wait for review and address any feedback

## Questions or Problems?

If you have questions or run into problems, please open an issue on GitHub.

## License

By contributing to Omnivox UI Optimizer, you agree that your contributions will be licensed under the GPL-3.0 License.
