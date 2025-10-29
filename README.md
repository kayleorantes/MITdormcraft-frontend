# User Journey: The Videos!

[![Watch the NEW 4B video](https://youtu.be/NLE6hoRVIxQ)](https://youtu.be/NLE6hoRVIxQ)
<a href="https://youtu.be/NLE6hoRVIxQ" target="_blank" rel="noopener noreferrer">![Watch the video](https://img.youtube.com/vi/NLE6hoRVIxQ/0.jpg)</a>


<br>
<br>

[![Watch the OLD 4A video](https://youtube.com/shorts/Tx_oDc2P1dM?feature=share)](https://youtube.com/shorts/Tx_oDc2P1dM?feature=share)
<a href="https://youtube.com/shorts/Tx_oDc2P1dM?feature=share" target="_blank" rel="noopener noreferrer">![Watch the video](https://img.youtube.com/vi/Tx_oDc2P1dM/0.jpg)</a>

<br>
<br>
<br>
<br>



# User Journey: Finding Dorm Inspiration

Alex, a first-year MIT student, feels anxious about how to style her New Vassar double room and wants to find design ideas that match her space. She opens the MITDormCraft app and begins by navigating to the Register page, where she creates an account using her MIT Kerberos ID, choosing a username and password. After registering, she is redirected to the Home page.
<br>
<br>
Here, Alex sees a list of all the dorms and dorm sizes (single, double, etc). She clicks on the filters to see specifically the doubles in New Vassar, and the feed updates below to show design posts with images and titles submitted by previous students who lived in that same room type. Instantly, Alex feels inspired as she scrolls through the posts, seeing a variety of creative dorm setups ranging from minimalist study spaces to cozy, plant-filled rooms.
<br>
<br>
She likes several posts that catch her eye and pauses on one featuring warm fairy lights and a neatly organized desk. Curious, she leaves a comment asking, “Where did you get those fairy lights? This setup is amazing!”
<br>
<br>
Feeling motivated, Alex decides to share her own dorm transformation journey. She uploads photos of her progress, writes a short caption, and posts it to the feed, hoping to inspire others just as she was inspired. Through this process, Alex not only finds practical decorating ideas but also connects with a community of MIT students who share her passion for creating beautiful and functional living spaces.
<br>
<br>
This journey demonstrates the core features implemented: registering and logging in, browsing room templates, viewing posts in a feed, liking and commenting for community interaction, and sharing dorm room designs within the MIT community, all while logged in.

<br>
<br>
<br>
<br>


# Visual Design Study

<img width="1300" height="728" alt="Screenshot 2025-10-28 at 11 48 53 PM" src="https://github.com/user-attachments/assets/0959dfa8-d176-401f-b13c-4159cd13e436" />
<img width="1236" height="719" alt="Screenshot 2025-10-28 at 11 49 10 PM" src="https://github.com/user-attachments/assets/b31ea159-b239-4c43-a57e-e6bd34ba6996" />

<br>
<br>
<br>
<br>


# Frontend Design Updates - Ocean Theme (also found in back-end repo summarizing major changes in file called design_updates.md)

## Overview
Major UI/UX overhaul implementing an "ocean-water-luminara" design theme across the entire application.

## Key Changes

### 1. Visual Theme Updates
- **Color Palette**: Changed from purple/blue gradients to ocean-inspired colors (`#4a8bb8` background, `#1db2eb` accents)
- **Fonts**: Implemented Google Fonts ('Fredoka', 'Kalam') for a more playful, flowy aesthetic
- **Typography**: All text on ocean background is white for optimal readability
- **Consistent Background**: All pages now use solid background color

### 2. Component Styling

#### Navigation Bar
- Ocean gradient background with glow effects
- Active nav links have ocean blue highlight with shadow
- Username displays as "Hello, USERNAME!" (non-clickable)
- Profile picture avatar in header (when uploaded)
- Logout button styled with red gradient

#### Post Components
- Posts now feature dark gradient backgrounds with ocean blue accents
- All post text (titles, comments, captions) is white
- Like and comment icons with hover effects
- Profile pictures display in post author avatars
- Comment section toggle via click (hidden by default, show on click)

#### Forms (Login/Register/Create Post)
- Ocean-themed form cards with gradient backgrounds
- White placeholders matching label fonts
- Ocean blue submit buttons with glow effects
- Disabled states use dimmed ocean gradient (not grey)
- All form text is white or ocean blue

### 3. User Experience Improvements

#### Page Protection
- "Sign In Required" walls added to:
  - Create Post page
  - Dorms & Layouts page
  - User Profile page
- Styled consistently with ocean theme
- "Create Post" link hidden from nav when not signed in

#### Navigation
- Auto-scroll to top when navigating between pages
- Browser back button maintains scroll position

#### User Profile
- Centered, narrower profile card
- Avatar with ocean glow effects
- Centered tab navigation ("My Posts" / "Liked Posts")
- Ocean-themed tab styling with active state glow

#### Post Functionality
- Edit posts from user profile
- Delete posts (with confirmation)
- Profile picture upload
- User-specific like persistence (fixed cross-user like bug)

### 4. Responsive Design
- Mobile-friendly layouts maintained
- Breakpoints at 768px and 480px
- Text scales appropriately on smaller screens

## Technical Changes

### State Management
- Like state now persists user ID (not just boolean)
- Engagement data stored in localStorage with user-specific tracking
- Profile images stored in auth store

### Router
- Added `scrollBehavior` function
- Returns to top on navigation, preserves position on back/forward

### Components Updated
- `src/App.vue` - Navigation bar, logout styling
- `src/views/HomeView.vue` - Hero sections, ocean theme
- `src/views/DormsLayoutsView.vue` - Post styling, filters, comment toggle
- `src/views/UserProfileView.vue` - Profile card, tabs, edit/delete posts
- `src/views/CreatePostView.vue` - Ocean theme, form styling
- `src/components/Login.vue` - Ocean theme, white text
- `src/components/Register.vue` - Ocean theme, white text
- `src/assets/main.css` - Background color, fonts
- `src/assets/base.css` - Font imports

## Design Philosophy
The new design embodies fluidity and transformation through:
- Flow-inspired fonts
- Bioluminescent glow effects
- Ocean color palette
- Smooth transitions and hover states
- Playful, inviting aesthetic
