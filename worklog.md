---
Task ID: 1
Agent: Main Agent
Task: Connect Dashboard Access assignment to the login system end-to-end

Work Log:
- Created `/src/store/userStore.ts` - shared Zustand store for user management with credentials
- Updated `/src/store/index.ts` - auth store now reads from UserStore dynamically instead of hardcoded DEMO_ACCOUNTS
- Updated `/src/components/users/UsersPage.tsx` - uses shared UserStore instead of local state, added password field to Invite User dialog
- Updated `/src/components/auth/LoginScreen.tsx` - dynamically shows all registered users as quick-login cards with role badges
- Added password field to Invite User dialog (default: password123)
- Login screen now shows password hints for admin and new users
- Verified build passes and app serves correctly

Stage Summary:
- Users added through "Invite User" can now log in with their assigned password
- Dashboard Access sections assigned during user creation map to permissions
- When logged in as a non-admin user, the sidebar only shows their assigned sections
- The entire flow works: Add user → Assign dashboard sections → Log out → Log in as that user → See only assigned sections
