# Security Policy

## Reporting Security Issues

We take the security of this repository seriously. If you believe you have found a security vulnerability, please do not disclose it publicly via GitHub issues, discussions, or pull requests.

### Responsible Disclosure Process

1. **Email Reports:** Please submit security vulnerability reports directly to the maintainers via private security advisory on GitHub or email.
2. **Details to Include:**
   - Description of the vulnerability and potential impact.
   - Steps to reproduce or proof of concept.
   - Affected components (backend, frontend, worker, or dependencies).
3. **Response Time:** We will acknowledge receipt of your vulnerability report within 48 hours and provide status updates as we work on a fix.

## Security Best Practices for Deployment

- **API Keys & Secrets:** Never commit `.env` or `.env.local` files to version control. Use `.env.example` templates to set up local environments.
- **Authentication:** In production deployments, ensure authentication is enabled on all `/api/v1` routes and the `/api/livekit-token` route.
- **CORS:** Configure `ALLOWED_ORIGINS` to only permit authorized client domains.
