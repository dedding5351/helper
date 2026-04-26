# SSL Certificate Renewal: Internal Staging Servers

### Symptoms
* Browser shows "Your connection is not private" (NET::ERR_CERT_DATE_INVALID).
* API calls to staging endpoints fail with "SSL Handshake Exception."
* `curl` commands require the `-k` or `--insecure` flag to work.

### Common Causes
1.  **Expiration:** The 90-day or 1-year validity period has ended.
2.  **Chain of Trust:** The Intermediate Certificate Authority (CA) was updated but not replaced on the staging server.
3.  **Mismatched Hostname:** The certificate was issued for `staging.company.com` but the server is being accessed via an IP address.

### Step-by-Step Solutions
1.  **Identify the Expiry:** Run this command in your terminal:
    * `openssl x509 -enddate -noout -in /path/to/your/cert.pem`
2.  **Generate a New CSR:**
    * `openssl req -new -newkey rsa:2048 -nodes -keyout staging_private.key -out staging.csr`
3.  **Submit to Internal CA:** * Upload the `.csr` to the company's internal PKI portal and download the "Base64 Encoded" certificate chain.
4.  **Update Server Configuration (Nginx Example):**
    * Replace the old `.crt` and `.key` files in `/etc/nginx/ssl/`.
    * Test configuration: `sudo nginx -t`.
    * Reload service: `sudo systemctl restart nginx`.
