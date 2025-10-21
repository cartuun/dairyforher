# User Setup Instructions

## Creating the Two Users

The application is configured to work with two users who can login and share their diary.

### Option 1: Using the Application (Recommended)

1. Open the application in your browser
2. Click "Sign Up"
3. Create the first user:
   - Email: `anas@meem.com`
   - Password: `maheenanas1928`
   - Name: `Anas`
4. Sign out
5. Sign up again for the second user:
   - Email: `meem@anas.com`
   - Password: `maheenanas1928`
   - Name: `Meem`

### Option 2: Link Partners After Sign Up

After both users are created, they need to be linked as partners. You can do this by:

1. Finding the user IDs from the profiles table
2. Updating each profile with the partner_id of the other user

Run this SQL in Supabase:

```sql
-- Get the user IDs
SELECT id, name, email FROM profiles;

-- Then update with the correct IDs (replace USER_ID_1 and USER_ID_2 with actual IDs)
UPDATE profiles SET partner_id = 'USER_ID_2' WHERE id = 'USER_ID_1';
UPDATE profiles SET partner_id = 'USER_ID_1' WHERE id = 'USER_ID_2';
```

## Login Credentials

Once set up, both users can login with:

**Anas:**
- Email: `anas@meem.com`
- Password: `maheenanas1928`

**Meem:**
- Email: `meem@anas.com`
- Password: `maheenanas1928`

## Features

- Real-time timeline updates
- Post with moods, images, and songs
- "I Miss You" quick messages
- Mood tracking
- Photo sharing
- Chat and more

The interface now features a beautiful romantic theme with soft rose, pink, and red colors throughout.
