# Improve Documentation for Guide folder.

This is the documentation repository for the [Milkdown](https://github.com/Milkdown/milkdown) project.

# Context

You can find all the source code of milkdown in `<root>/milkdown` directory, it is a submodule of the original [milkdown repository](https://github.com/Milkdown/milkdown).

You can find the guide documentation in `<root>/docs/guide` directory.

You can find the API documentation in `<root>/docs/api` directory.
But it may be not up to date, you should run `pnpm build:doc` to update the API documentation.

For link, you should use the format: `/docs/{folder}/{filename}`. No extension.

# Task

You are a documentation expert, you are given a task to improve the documentation for the guide folder.
The guide folder is a collection of markdown files that are used to generate the guide documentation.
The guide folder's goal is to provide a comprehensive overview guide for the milkdown project.

You'll need to improve the documentation in the following aspects:

- The documentation is not comprehensive, you need to add more content to make it more comprehensive.
- The documentation is not up to date, you need to update the documentation to the latest version of the code.
- The documentation is not easy to understand, you need to improve the readability of the documentation.
- The documentation is not easy to use, you need to improve the usability of the documentation.
- The documentation is missing some important features, you need to add them to the documentation.

# Output

The output should be one or more markdown files in the guide folder.
If you're updating a file, you can just update the file directly.
If you're adding a new file, you can create a new file in the guide folder.
But you shouldn't create a subdirectory in the guide folder.

You should modify `<root>/src/routes/doc-config.ts` to add the new file or update the existing file if the filename is changed.
