# Assignment 4c: Personal Reflections

## MITDormCraft Project Experience

**Name:** Kayle Orantes  
**Date:** November 12, 2025

---

## Overview

This reflection covers my experience building MITDormCraft through the 6.1040 personal project assignments. The project taught me a lot about full-stack development, but honestly, the final stretch—getting sessions/syncs working and deploying to Render—was way harder than I expected.

---

## What I Learned

### Backend Development

**Concepts & Syncs:**
- Understanding the concept-based architecture took some time, but once it clicked, it made sense
- Writing syncs was actually pretty intuitive—they're like declaring rules for how concepts should interact
- The hardest part was figuring out what belongs in a concept vs what belongs in a sync
- Session management seemed simple in theory but integrating it properly with authentication took forever

**What Went Well:**
- Basic CRUD operations were straightforward once I had one concept working
- The declarative nature of syncs made the code easier to reason about

**What Was Hard:**
- Getting sessions and syncs working together at the end was brutal. I had the app working without proper authentication for so long, and retrofitting it felt like rebuilding everything
- Debugging backend issues when the error messages weren't clear
- Understanding the Requesting concept and why we needed that extra layer

### Frontend Development

**Vue.js & Reactivity:**
- Vue's reactivity system is really nice once you get used to it
- Pinia stores for state management made sense pretty quickly
- The composition API felt natural for organizing component logic

**What Went Well:**
- Building UI components was fun and relatively straightforward
- Getting the feed and post creation views working felt rewarding
- The ocean theme came together nicely

**What Was Challenging:**
- Managing authentication state across the app
- Handling edge cases like what happens when a session expires
- Making sure the UI responded correctly to backend errors

### The Deployment Nightmare

This is where things got really rough. After working on the app for weeks with everything running locally, I thought deployment would be quick. **It was not.**

**The Render Saga:**

1. **First attempt:** Backend deployed fine, but frontend wouldn't build
   - Error: "Cannot initialize local storage" 
   - Spent hours trying to figure out what was wrong
   - Turns out Vue DevTools was trying to access localStorage during the build process, which doesn't exist in Node.js
   - **Solution:** Had to use dynamic imports so DevTools only loads in development

2. **Second attempt:** Build succeeded but frontend couldn't talk to backend
   - Error: "Network Error" on every request
   - Frontend was calling itself instead of the backend
   - Took way too long to realize I needed a `.env.production` file with the actual backend URL
   - **Solution:** Environment variable configuration for production vs development

3. **Third attempt:** Everything connected but authentication didn't work
   - Sessions weren't being created/validated properly
   - This was the worst part—I had built the app without sessions for so long, then had to integrate them at the very end
   - Spent a whole day debugging why the Session concept wasn't being called
   - **Solution:** Fixed the syncs to properly create sessions on login and validate them on protected routes

**Why Was This So Hard?**
- I didn't set up deployment early enough, so I discovered all these issues at the last minute
- Working without proper sessions/syncs for most of development meant I had to retrofit everything
- Each fix revealed a new problem
- The error messages from Render builds weren't always helpful
- Time zone difference with deployment server (okay, not really, but it felt that way)

**Key Lesson:** Start deployment setup from day one, not the day before it's due.

---

## Using AI Tools

### Context Tool for Design

**How I Used It:**
- Generating initial concept specifications
- Getting feedback on sync design
- Brainstorming how concepts should interact

**What Worked:**
- Really helpful for thinking through concept operations and state
- Good at suggesting alternative approaches to problems
- Helped me understand the concept paradigm better

**What Didn't Work:**
- Sometimes suggested overly complex solutions
- Had to simplify and adapt suggestions to my actual needs
- Not great at understanding my specific project constraints

### Agentic Coding Tool (Cursor)

**How I Used It:**
- Writing boilerplate code (so much boilerplate)
- Implementing API endpoints following patterns
- Creating Vue components
- Debugging error messages
- CSS styling

**What Worked Really Well:**
- Generating repetitive API endpoint code once I had a pattern established
- Creating similar Vue components (e.g., different form views)
- Suggesting fixes for TypeScript errors
- CSS layout problems—AI was surprisingly good at this

**What Needed Heavy Editing:**
- Complex state management logic
- Authentication flows (AI kept suggesting JWT when I just needed simple sessions)
- The deployment configuration fixes—AI helped but I had to piece together the solution

**Time Saved:** Probably saved 40-50% of my coding time overall, especially on repetitive tasks

**Time Lost:** Sometimes went down rabbit holes with AI-suggested approaches that didn't fit my architecture

### My Take on AI in Development

**Where AI Excels:**
- Repetitive code following established patterns
- Boilerplate reduction
- Quick syntax lookups
- "How do I do X in framework Y" questions
- Debugging error messages

**Where AI Falls Short:**
- Understanding your specific architecture deeply
- Making design decisions that require trade-off analysis
- Novel problems without clear patterns
- Deployment and configuration issues (hit or miss)

**The Real Skill:** Knowing when to use AI and when to think it through yourself. I found AI most helpful after I understood what I needed—it couldn't make design decisions for me, but it could help me implement them faster.

---

## Mistakes & Lessons

### Biggest Mistakes

**1. Delaying Sessions/Syncs Integration**
- **What I did:** Built the whole app with fake authentication, planned to "add it later"
- **Why this was bad:** "Later" turned into "the night before deployment" and it was a nightmare
- **Lesson:** Build security from the start, not as an afterthought
- **How to avoid:** Next project, I'm setting up auth on day one

**2. No Deployment Testing Until The End**
- **What I did:** Only tested locally, assumed production would "just work"
- **Why this was bad:** Discovered 5+ production-only bugs at the last minute
- **Lesson:** Deploy early and deploy often
- **How to avoid:** Set up staging environment from week one

**3. Inconsistent Error Handling**
- **What I did:** Added error handling piece by piece, no unified strategy
- **Result:** Some errors crashed the app, others failed silently, debugging was hell
- **Lesson:** Design error handling architecture upfront
- **How to avoid:** Create error handling utilities before building features

### Technical Challenges

**The Session Concept Confusion:**
- Spent hours trying to figure out why sessions weren't working
- Turned out I had the concept right but the syncs weren't triggering it
- Finally realized the Requesting concept needed to extract the user ID header
- **Lesson:** Understanding the full request flow through concepts, syncs, and requesting is crucial

**MongoDB Connection Issues:**
- Local MongoDB worked fine, MongoDB Atlas kept timing out
- Forgot to whitelist Render's IP addresses
- **Lesson:** Cloud databases have different security requirements than local ones

---

## Skills Assessment

### What I'm Confident In Now:
- Vue.js component development
- RESTful API design patterns
- Concept-based architecture (finally!)
- Basic full-stack integration
- CSS styling and responsive design

### What I'm Still Learning:
- When to use syncs vs concept logic (I get it theoretically, but practical judgment needs work)
- Deployment and DevOps stuff (this project was a crash course)
- Performance optimization
- Proper session/authentication patterns for production

### What I Need More Practice With:
- Testing strategies (I mostly just clicked around)
- Database indexing and query optimization
- Real security beyond basic authentication
- Handling concurrent requests and race conditions

---

## The Bigger Picture

### What I'm Taking Away

**Technical Skills:**
- Full-stack development isn't just about knowing frontend and backend—it's about understanding how they communicate, fail, and recover
- Security must be baked in, not bolted on
- Production environments are fundamentally different from development
- Configuration management is way more important than I thought

**Process Skills:**
- Start with deployment infrastructure, not as an afterthought
- Integrate complex features (like auth) early, not late
- Test in production-like environments throughout development
- Don't assume anything "just works" until you've seen it work

**AI Collaboration:**
- AI is a powerful tool but not a replacement for understanding
- Best results come from knowing what you want, then using AI to help implement it
- AI can't make architecture decisions for you
- Debugging AI-generated code requires understanding the code yourself

### One Sentence Summary

Building MITDormCraft taught me that the hardest part of software development isn't writing code—it's integrating all the pieces, making them secure, and actually deploying them to work in the real world.

---

## Looking Forward

**If I Continued This Project:**
1. Proper token-based authentication with expiration
2. Image upload and optimization
3. Admin moderation tools
4. Real-time updates with WebSockets
5. Mobile responsive design improvements

**For My Next Project:**
1. Set up deployment on day one
2. Build authentication first
3. Create a unified error handling strategy
4. Write at least some automated tests
5. Plan for production from the start, not just local development

---

## Final Thoughts

This project was harder than I expected, especially at the end. Getting sessions and syncs working felt like untangling a knot—every fix revealed another problem. Deploying to Render introduced issues I never would have found locally. But now that it's done and **actually working in production**, I feel like I understand full-stack development in a way I didn't before.

The biggest lesson? **Working code locally is maybe 70% of the work. The other 30%—making it secure, deployable, and production-ready—can take just as long.**

Would I use AI tools again? Absolutely. They saved me a ton of time. But I learned to be more skeptical and to always understand what the AI is suggesting before using it.

Overall, proud of what I built, even if the last week was stressful. MITDormCraft is live, secure, and actually works. That feels good.

---

**Total Estimated Time:** ~60 hours across all assignments  
**Most Time Spent On:** Deployment and session integration (probably 15 hours combined)  
**Most Satisfying Moment:** Seeing "IT WORKS!" after finally fixing the Render deployment  
**Would I Do It Again?** Yes, but I'd start with deployment infrastructure from day one.
