# IntelliSmart Operator Portal

Separate frontend deployment from the EaaS consumer app.

## Architecture

The consumer app (eaasv1.netlify.app) and this operator portal
(intellismart-admin.netlify.app) are deliberately maintained as
independent deployments with separate authentication and service
layers. This follows standard security and compliance requirements
for B2B2C platforms — the frontend and services are separated;
the database is shared but sits behind firewall and proxy layers
with no direct client access.

## Auth
- Prototype: hardcoded credentials (admin@intellismart.in / admin123)
- Production path: Enterprise SSO via identity provider of
  IntelliSmart's choice

## Demo
- URL: intellismart-admin.netlify.app
- Email: admin@intellismart.in
- Password: admin123
