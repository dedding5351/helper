# Corporate Wi-Fi: "Authentication Failed" on macOS

### Symptoms
* The Wi-Fi icon shakes and prompts for a password repeatedly.
* Error message: "The network 'Corp-Secure' could not be joined."
* Status shows as "Authenticated" but no IP address is assigned (Self-assigned IP).

### Common Causes
1.  **Keychain Conflicts:** Old passwords stored in the macOS Keychain are overriding new ones.
2.  **Certificate Trust:** The 802.1X certificate for the RADIUS server has not been "Trusted" in System Settings.
3.  **MAC Randomization:** "Private Wi-Fi Address" is interfering with the corporate whitelist.

### Step-by-Step Solutions
1.  **Forget the Network:** * Go to *System Settings > Wi-Fi > Advanced*. 
    * Remove 'Corp-Secure' from the list of known networks.
2.  **Clear Keychain Access:**
    * Open *Keychain Access* app.
    * Search for "Corp-Secure" and delete all "application password" entries.
3.  **Rejoin and Trust:**
    * Select the network again. When the certificate prompt appears, click **"Show Certificate"** and ensure **"Always Trust"** is selected before clicking "Continue."
4.  **Disable Private Address:**
    * Click the (i) next to the network name and toggle off **"Private Wi-Fi Address."**
