# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in dsh-memo-notebook, please report it privately by opening a [security advisory](https://github.com/SeanWang114514/dsh-memo-notebook/security/advisories/new) or contacting the maintainer directly. Please do **not** open a public issue for security vulnerabilities.

## Scope

- The Host API (`lib/index.mjs`) — bind addresses, input validation, file access
- The Client UI (`lib/client.js`) — XSS, script injection, DOM manipulation
- State persistence — `state.json` handling, path traversal

## Notes

- The plugin binds only to `127.0.0.1` by default and stores data under `~/.dsh/memo-notebook/`
- Install from source review: this is a dsh community plugin; verify the code before use
