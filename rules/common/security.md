# Security

## Mandatory Pre-Commit Checks

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated at system boundaries
- [ ] SQL/NoSQL injection prevention (parameterised queries)
- [ ] XSS prevention (sanitised HTML output)
- [ ] CSRF protection where applicable
- [ ] Authentication/authorisation verified on all protected routes
- [ ] Rate limiting on all public-facing endpoints
- [ ] Error messages do not leak sensitive data or stack traces

## Secret Management

```
NEVER hardcode secrets in source code.
ALWAYS use environment variables or a secret manager.
Validate that required secrets are present at application startup.
Rotate any secret that may have been exposed.
```

## Secret Response Protocol

If a secret is found in code:
1. **STOP** — do not commit
2. Remove from code immediately
3. Rotate the exposed secret
4. Check git history for prior exposure (`git log --all -- .env`)
5. Review entire codebase for similar issues

## Security Incident Protocol

If a vulnerability is found:
1. **STOP** — do not continue until addressed
2. Use the `security-reviewer` agent for analysis
3. Fix CRITICAL issues before any further commits
4. Document the fix in the commit message
