# Assignment 4c: Final Video and Backend Trace Instructions

## Overview

This guide walks you through creating your final demo video (up to 3 minutes) and capturing the backend trace for submission.

---

## Part 1: Preparing for the Demo

### 1.1 Choose Your Environment

**Option A: Use Deployed App (Recommended)**
- ✅ Shows the app in its final production state
- ✅ Demonstrates successful deployment
- ✅ More impressive for viewers
- ⚠️ Requires backend and frontend deployed first

**Option B: Use Local Development**
- ✅ Full control over environment
- ✅ Can demo even if deployment has issues
- ✅ Easier to restart if something goes wrong
- ⚠️ Doesn't show deployment success

**Recommendation:** Use deployed app if possible, have local as backup.

### 1.2 Prepare Demo Data

**Before Recording:**

1. **Create 2-3 Test Accounts:**
   - User 1: Your main demo account (e.g., "alex_mit")
   - User 2: Secondary account to show interactions (e.g., "jordan_mit")
   - User 3: Optional for multi-user scenarios

2. **Pre-populate Some Content:**
   - Add 3-5 room templates (different dorms)
   - Create 4-6 design posts with good images
   - Add some comments and upvotes
   - Make sure content looks realistic and polished

3. **Plan Your User Journey:**
   - Write a script of what you'll demonstrate
   - Test the journey once to ensure it flows well
   - Time it (should be under 3 minutes)

### 1.3 Clean Up Your Browser

**For Clean Recording:**
- Close unnecessary tabs
- Clear browser console
- Use incognito/private window for fresh session
- Make sure browser is full screen or good size
- Check audio levels if you'll narrate live

---

## Part 2: Recording the Video

### 2.1 Recommended Tools

**Screen Recording:**
- **Mac:** QuickTime Player (free, built-in)
  - File → New Screen Recording
  - Click red record button
  - Select area to record
  
- **Windows:** Xbox Game Bar (free, built-in)
  - Press Windows + G
  - Click record button
  
- **Cross-platform:** OBS Studio (free)
  - More features but steeper learning curve
  - Good for adding overlays or picture-in-picture

- **Online:** Loom (free tier available)
  - Records screen + webcam + audio
  - Automatically uploads and provides shareable link
  - Great for quick demos

**Audio Recording:**
- Use same tool as screen recording
- If recording narration separately:
  - Mac: QuickTime (Audio Recording)
  - Windows: Voice Recorder app
  - Audacity (cross-platform, free)

### 2.2 Video Structure

**Suggested Outline (3 minutes max):**

**0:00-0:15 - Introduction (15 seconds)**
- "Hi, I'm [name] and this is MITDormCraft"
- One-sentence description: "A platform for MIT students to share and discover dorm room design inspiration"
- Show the home page

**0:15-0:30 - Registration (15 seconds)**
- "First, let me show you registration"
- Quick registration flow
- "Users authenticate with their MIT email"

**0:30-1:00 - Browsing Templates (30 seconds)**
- "Students can browse room templates for different dorms"
- Show filter functionality
- "Here I'm filtering for New Vassar doubles"
- Scroll through some posts
- "Each post shows designs from real students"

**1:00-1:45 - Engagement Features (45 seconds)**
- "Users can interact with posts they like"
- Like a post: "I can upvote designs that inspire me"
- Add a comment: "And leave comments to ask questions"
- Show comment appearing
- "All of this is authenticated on the backend"

**1:45-2:30 - Creating Content (45 seconds)**
- "Now let me share my own design"
- Navigate to Create Post page
- Fill out form (have text ready to paste)
- Upload image (have it ready)
- Select template
- Submit
- "And there it is in the feed"

**2:30-3:00 - User Profile & Wrap-up (30 seconds)**
- "I can manage my posts from my profile"
- Show profile page with your posts
- Maybe show edit or delete functionality
- "This project demonstrates concept-based design with secure backend syncs"
- "Thanks for watching!"

### 2.3 Recording Tips

**Technical Tips:**
- **Resolution:** Record at 1920x1080 (1080p) if possible
- **Frame Rate:** 30fps is fine, 60fps is smoother
- **Audio:** Speak clearly, not too fast
- **Cursor:** Make your movements smooth and deliberate
- **Page Loads:** Wait for content to fully load before moving on

**Presentation Tips:**
- **Practice:** Do a dry run first
- **Pace:** Speak at a moderate pace, not rushed
- **Enthusiasm:** Sound interested in your project!
- **Clarity:** Explain what you're clicking and why
- **Professionalism:** Avoid filler words ("um", "like")

**What to Show:**
- ✅ Key features working correctly
- ✅ Beautiful UI (your ocean theme!)
- ✅ Smooth user experience
- ✅ Authentication and authorization
- ✅ Multiple concepts working together

**What to Avoid:**
- ❌ Lingering too long on any one feature
- ❌ Explaining implementation details
- ❌ Showing error states (unless recoverable)
- ❌ Rambling or going off-script
- ❌ Exceeding 3 minutes

### 2.4 If Something Goes Wrong

**During Recording:**
1. **Pause and resume:** Most tools allow this
2. **Don't panic:** Stay calm, fix the issue
3. **Restart if needed:** It's okay to do another take
4. **Have backup plan:** Local version if deployed breaks

**Common Issues:**
- **Slow loading:** Wait patiently, or speed up video in editing
- **Wrong data entered:** Have your demo text in a file to copy
- **Forgot something:** Either continue and edit, or restart
- **Audio glitch:** Re-record narration separately and overlay

---

## Part 3: Capturing Backend Trace

### 3.1 What is the Backend Trace?

The backend trace is the console output showing all the `Requesting.request` actions that occurred during your demo. This proves that your backend syncs are working correctly.

**Example Trace:**
```
[2025-11-10 15:30:45] Requesting.request: Authentication.registerAndCreateAccount
  → params: {username: "alex_mit", mitKerberos: "alex@mit.edu"}
  → result: {userID: "abc123"}

[2025-11-10 15:31:10] Requesting.request: RoomTemplate.findTemplates
  → params: {dorm: "New Vassar", roomType: "double"}
  → result: [Array of 5 templates]

[2025-11-10 15:31:15] Requesting.request: DesignPost.findPostsByTemplate
  → params: {templateID: "xyz789"}
  → result: [Array of 3 posts]

[2025-11-10 15:31:45] Requesting.request: Engagement.toggleUpvote
  → headers: {X-User-ID: "abc123"}
  → Auth sync validated
  → result: {upvoted: true, count: 15}

[2025-11-10 15:32:00] Requesting.request: Engagement.addComment
  → headers: {X-User-ID: "abc123"}
  → Auth sync validated
  → result: {commentID: "comment123"}

[2025-11-10 15:32:30] Requesting.request: DesignPost.createPost
  → headers: {X-User-ID: "abc123"}
  → Auth sync validated
  → result: {postID: "post456"}
```

### 3.2 How to Capture Trace (Deployed App)

**Step 1: Access Render Dashboard**
1. Go to https://dashboard.render.com/
2. Sign in to your account
3. Select your backend service

**Step 2: Open Logs**
1. Click on "Logs" tab in left sidebar
2. You'll see real-time console output
3. Clear the log if there's old content (optional)

**Step 3: Perform Your Demo**
1. Open your deployed frontend in a browser
2. Perform the exact same actions as in your video
3. Watch the Render logs update in real-time

**Step 4: Copy the Trace**
1. In Render logs, select all the relevant log entries
2. Copy to clipboard
3. Paste into a text file

**Alternative: Download Full Logs**
- Render may have a "Download Logs" button
- This saves a `.log` file with complete console output

### 3.3 How to Capture Trace (Local Development)

**Step 1: Start Backend with Logging**
```bash
cd /path/to/MITdormcraft-backend
deno run start
```

**Step 2: Clear Terminal (Optional)**
- Press Cmd+K (Mac) or Ctrl+L (Linux/Windows) to clear old output
- Or redirect to a file: `deno run start > demo_trace.log`

**Step 3: Perform Your Demo**
1. Open frontend (http://localhost:5173)
2. Perform all the actions from your video
3. Watch terminal for `Requesting.request` logs

**Step 4: Save the Trace**

**Method A: Copy from Terminal**
- Select all relevant log output
- Copy and paste into a text file

**Method B: Redirect to File**
```bash
# Before starting
deno run start > demo_trace.log 2>&1

# After demo
# Open demo_trace.log
```

**Method C: Use `tee` to see and save**
```bash
deno run start | tee demo_trace.log
# This shows logs AND saves to file
```

### 3.4 Formatting the Trace File

**Create a file: `BACKEND_TRACE.txt` or `BACKEND_TRACE.md`**

**Add Header:**
```
Backend Trace for MITDormCraft Demo Video
Date: November 10, 2025
Duration: [match your video duration]
Environment: [Deployed / Local]
Backend URL: [your backend URL]

---

[Paste trace below]

```

**Clean Up (Optional):**
- Remove unrelated log entries
- Remove excessive debug info
- Keep all `Requesting.request` lines
- Keep auth validation messages
- Keep any error logs (if relevant)

**Save the file:**
- In your backend repository root
- Name it clearly: `BACKEND_TRACE_4C.txt` or similar

---

## Part 4: Uploading and Sharing

### 4.1 Video Upload Options

**YouTube (Recommended)**
- ✅ Free, unlimited hosting
- ✅ Easy to share link
- ✅ Can be unlisted (not public)
- ✅ Reliable playback

**How to upload:**
1. Go to https://youtube.com/
2. Click camera icon → "Upload Video"
3. Select your video file
4. Set visibility to "Unlisted" (not Private!)
5. Title: "MITDormCraft - 6.1040 Assignment 4c Demo"
6. Description: Brief project description
7. Click "Publish"
8. Copy the share link

**Other Options:**
- **Google Drive:** Share with "Anyone with link" permission
- **Dropbox:** Generate shareable link
- **Vimeo:** Similar to YouTube
- **MIT Media Server:** If available to students

### 4.2 Verify Accessibility

**Before submitting:**
1. Open video link in incognito/private window
2. Verify it plays without login
3. Check audio is audible
4. Check video quality is acceptable

### 4.3 File Naming Conventions

**For local files (before upload):**
- `MITDormCraft_Demo_4C.mp4`
- `MIT_DormCraft_Final_Demo.mov`

**For trace file:**
- `BACKEND_TRACE_4C.txt`
- `backend_trace_nov10.log`

---

## Part 5: Submission Checklist

### 5.1 Video Requirements
- [ ] Duration: 3 minutes or less
- [ ] Shows intelligible user journey
- [ ] Has audio narration throughout
- [ ] Demonstrates key features:
  - [ ] Registration/Login
  - [ ] Browsing room templates
  - [ ] Liking posts
  - [ ] Commenting
  - [ ] Creating a post
  - [ ] User profile
- [ ] Uploaded and accessible via public link
- [ ] Link added to README in backend repo

### 5.2 Backend Trace Requirements
- [ ] Shows `Requesting.request` actions
- [ ] Corresponds to actions in video
- [ ] Shows authentication validation
- [ ] Saved as text file in backend repo
- [ ] Linked from README in backend repo

### 5.3 Documentation Requirements
- [ ] Design document completed (in backend repo)
- [ ] Reflections document completed (in backend repo)
- [ ] README updated with all links
- [ ] All documents clearly linked

---

## Part 6: Troubleshooting

### 6.1 Video Issues

**Problem: Video file is too large to upload**
- **Solution:** Compress using HandBrake (free) or online compressor
- Target: Under 500MB for easy upload

**Problem: Audio out of sync**
- **Solution:** Re-record with better tool, or use video editor to sync

**Problem: Video quality is poor**
- **Solution:** Record at higher resolution, ensure good lighting

### 6.2 Trace Issues

**Problem: No logs appearing in Render**
- **Solution:** Check if backend is using console.log()
- Make sure you're looking at the right service
- Try refreshing the logs page

**Problem: Logs are overwhelming**
- **Solution:** Filter for "Requesting.request" or "Auth sync"
- Copy only relevant sections
- Add comments to clarify sections

**Problem: Can't copy from terminal**
- **Solution:** Use output redirection: `command > file.txt`
- Or use script/screen recording tool

### 6.3 Timing Issues

**Problem: Demo actions don't match video timestamp**
- **Solution:** Record trace separately, note timestamps
- Add timestamps to trace file manually
- Explain discrepancy in a comment

---

## Example Final Submission Structure

**In Backend Repository:**

```
MITdormcraft/
├── README.md (updated with all links)
├── DESIGN_DOCUMENT_4C.md
├── REFLECTIONS_4C.md
├── BACKEND_TRACE_4C.txt
├── design/
│   └── [concept specs, prompts, etc.]
├── context/
│   └── [LLM interaction snapshots]
└── server/
    └── [backend code]
```

**README.md should include:**
```markdown
# MITDormCraft Backend

## Assignment 4c Deliverables

- **Demo Video:** https://youtu.be/YOUR_VIDEO_ID
- **Design Document:** [DESIGN_DOCUMENT_4C.md](./DESIGN_DOCUMENT_4C.md)
- **Reflections:** [REFLECTIONS_4C.md](./REFLECTIONS_4C.md)
- **Backend Trace:** [BACKEND_TRACE_4C.txt](./BACKEND_TRACE_4C.txt)
- **Deployed App:** https://your-app.onrender.com

[Rest of README...]
```

---

## Tips for Success

### Recording Tips
1. **Do a practice run** before final recording
2. **Script your narration** so you don't ramble
3. **Show, don't just tell** - demonstrate features actively
4. **Keep energy up** - sound enthusiastic about your project
5. **Time yourself** - don't go over 3 minutes

### Trace Tips
1. **Clear logs before starting** for clean output
2. **Perform actions slowly** so logs are readable
3. **Verify authentication messages appear** for protected routes
4. **Add comments to trace file** to clarify sections
5. **Keep original backup** in case you need to reference it

### General Tips
1. **Start early** - don't wait until deadline day
2. **Test on different devices** to ensure accessibility
3. **Have a backup plan** if deployed version has issues
4. **Save everything** - don't delete files until after grading
5. **Proofread documents** before submitting

---

## Final Checklist

**Before you submit:**
- [ ] Video is under 3 minutes
- [ ] Video shows all required features
- [ ] Video is narrated throughout
- [ ] Video link is public and accessible
- [ ] Backend trace file is in repo
- [ ] Trace corresponds to video actions
- [ ] Design document is complete
- [ ] Reflections document is complete
- [ ] README links to all deliverables
- [ ] All files are in backend repository
- [ ] Both repositories have latest commits pushed
- [ ] Google form submitted with commit hashes

---

## Good Luck! 🎬

Remember: The video and trace demonstrate that your app works and that you understand what you built. Focus on showing a smooth, complete user journey that highlights your best work!

**Questions?** Review the assignment specification or ask course staff.

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025

