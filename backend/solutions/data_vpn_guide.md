# GlobalConnect VPN: Connection Timeout Errors

### Symptoms
* The connection progress bar hangs at 40% or 80%.
* Error message: "Connection failed due to a timeout. Please check your internet connection."
* VPN disconnects immediately after successful multi-factor authentication (MFA).

### Common Causes
1.  **MTU Size Issues:** The packet size is too large for your home router to process.
2.  **UDP Encapsulation:** Local firewalls are blocking the default VPN ports (usually 4500/500).
3.  **MFA Lag:** The authentication response took longer than the 30-second default window.

### Step-by-Step Solutions
1.  **Check Local Internet:** Ensure your ping is below 100ms. High latency frequently triggers timeouts.
2.  **Toggle Protocol:** Go to *Settings > Advanced* and switch from `Automatic` to `TCP`. This is slower but more stable on restrictive networks.
3.  **Reset Network Stack:**
    * Open Terminal and run: `sudo ifconfig en0 down && sudo ifconfig en0 up`.
4.  **Re-authenticate:** Log out of the GlobalConnect client completely and restart the application to clear the cached MFA token.
