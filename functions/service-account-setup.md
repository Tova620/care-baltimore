# Service Account Setup Instructions

## Step 1: Upload the Service Account Key
1. Rename your downloaded JSON key file to `service-account-key.json`
2. Place it in the `functions/` directory
3. Add it to `.gitignore` to keep it secure

## Step 2: Share Google Sheets with Service Account
1. Open your Google Sheets:
   - Visitor Sheet: https://docs.google.com/spreadsheets/d/1J8P6hoN81akdJGgAKFiraUy9-znTd_XzQ-kAZy_soj0
   - Volunteer Sheet: https://docs.google.com/spreadsheets/d/1FEAg9tbecNAf_oyqCpOk_Nssby0x6WAQIkcGFFEdPbM
2. Click "Share" button
3. Add the service account email (found in the JSON file as "client_email")
4. Give it "Editor" permissions

## Step 3: Deploy
Run: `firebase deploy --only functions`

## Security Note
Never commit the service-account-key.json file to version control!