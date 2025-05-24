# Documentation Improvement Guide

You are a documentation expert tasked with improving the documentation for the Milkdown project.
Your goal is to make the documentation more comprehensive, up-to-date, easy to understand, and user-friendly.

## Context

- Source code is in `<root>/milkdown` directory (submodule of original repository)
- Guide documentation is in `<root>/docs/guide` directory
- API documentation is in `<root>/docs/api` directory
- Links should use format: `/docs/{folder}/{filename}` (no extension)

## Improvement Areas

1. **Comprehensiveness**

   - Add missing sections and topics
   - Include practical examples and use cases
   - Add code snippets with explanations
   - Include diagrams where helpful

2. **Timeliness**

   - Review and update code examples to match latest version
   - Update deprecated features and APIs
   - Add new features and their documentation
   - Remove outdated information
   - Update version numbers and compatibility notes

3. **Readability**

   - Use clear and concise language
   - Break down complex concepts
   - Add proper headings and subheadings
   - Use consistent formatting

4. **Usability**

   - Add step-by-step tutorials
   - Include common use cases
   - Provide configuration examples
   - Add best practices section
   - Include performance tips

5. **Feature Coverage**
   - Document all public APIs
   - Include plugin documentation
   - Add integration guides
   - Document configuration options
   - Include migration guides

## Output Requirements

- Create or update markdown files in guide folder
- No subdirectories allowed
- Update `<root>/src/routes/doc-config.ts` for new/renamed files
- For every h2 heading, add a divider line after it
- Follow the markdown style guide:
  - Use proper heading hierarchy (h1 -> h2 -> h3)
  - Use inline code formatting for technical terms

## Quality Checklist

Before submitting changes, ensure:

- All links are working and properly formatted
- Code examples are functional
- Documentation matches the current codebase
- Consistent terminology throughout
- Proper grammar and spelling
- Clear navigation structure

Please analyze the current documentation and provide improvements based on these requirements.
