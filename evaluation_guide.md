# PixelStream Evaluation Guide (15 Marks)

This guide is designed to help you secure full marks in your evaluation by thoroughly understanding the **PixelStream** codebase. It covers the evaluation criteria: Application Design, Implementation, Functionality, Database Integration, Code Quality, and Presentation.

---

## 1. Application Design & Architecture (MERN Stack)
PixelStream is built using a modern **MERN** stack approach, heavily optimized for performance and serverless deployment:
- **Frontend**: React.js (bootstrapped with Vite for ultra-fast HMR and building).
- **Backend**: Node.js & Express.js.
- **Database**: MongoDB (NoSQL), accessed via Mongoose ODM.
- **Deployment Strategy**: Vercel. The backend is configured as **Serverless Functions** inside the `/api` directory rather than a traditional always-on server, making it highly scalable and cost-efficient.
- **External APIs**: OMDb API (Open Movie Database) for real-time movie posters, plots, ratings, and search.

---

## 2. Codebase Map: Where is everything located?

If the evaluator asks you to point out a specific feature, use this map:

### Frontend (`/src`)
- **`src/App.jsx`**: The root component. Handles routing (`react-router-dom`), the Navigation Bar (`<Navbar>`), and the Global Movie Modal overlay.
- **`src/index.css`**: All global styles, CSS variables (colors), and mobile-responsive `@media` queries.
- **`src/context/AppContext.jsx`**: The "Brain" of the frontend. Uses React Context to manage global state (the logged-in user, subscription details, the watchlist array, and toast notifications) so you don't have to pass props down multiple levels.
- **`src/components/`**: Reusable UI blocks.
  - **`MoviePoster.jsx`**: The individual movie cards you see on the dashboard and watchlist.
  - **`MovieModal.jsx`**: The dark popup that appears when you click a poster. It fetches detailed data directly from OMDb.
- **`src/pages/`**: The main screens.
  - **`LandingPage.jsx`**: The homepage with the scrolling background and "Trending Now" section.
  - **`LoginPage.jsx`**: Simple username/password form.
  - **`PlansPage.jsx`**: The subscription pricing tables.
  - **`DashboardPage.jsx`**: Visual statistics (SVG progress circles), active plan details, and recently added movies.
  - **`WatchlistPage.jsx`**: The search bar (with dropdown) and grid of saved movies.

### Backend (`/api`)
- **`api/index.js`**: The Express server setup, MongoDB connection string, and CORS configuration. This is the entry point for Vercel serverless.
- **`api/models/User.js`**: The MongoDB schema. Notice that `subscription` and `watchlist` are stored *inside* the User document, which is a NoSQL best practice (embedding over referencing) for this scale.
- **`api/routes/`**: The API endpoints.
  - **`users.js`**: Login and authentication logic.
  - **`subscriptions.js`**: Logic for upgrading/renewing plans.
  - **`watchlist.js`**: Endpoints to add (`POST /api/watchlist/add`) and remove (`DELETE /api/watchlist/remove`) movies using MongoDB `$push` and `$pull` operators.

---

## 3. Database Integration (MongoDB)
- **Connection**: Managed in `api/index.js` using `mongoose.connect(process.env.MONGO_URI)`. 
- **Schema Design**: PixelStream uses an embedded document design. Instead of having a separate `Watchlist` table with foreign keys, the watchlist is an array of objects directly inside the `User` document.
- **Updating Arrays**: In `api/routes/watchlist.js`, we use native MongoDB array operators.
  - `$push`: Appends a movie object to the user's watchlist array.
  - `$pull`: Removes a movie from the array matching a specific title.

---

## 4. Code Quality & Best Practices (Highlight these!)
If you need to show off code quality, mention these architectural decisions:
1. **Debouncing**: In `WatchlistPage.jsx`, the OMDb search uses a `setTimeout` (debounce). It waits until the user stops typing before hitting the API, preventing rate-limiting.
2. **Global State Management**: Utilizing React's `useContext` (`AppContext.jsx`) prevents "prop drilling" and keeps the codebase clean.
3. **Environment Variables**: API keys (`VITE_OMDB_KEY`) and Database URIs (`MONGO_URI`) are hidden in `.env` files, which is a critical security practice.
4. **Mobile First UI**: The app uses native CSS Grid and Flexbox with responsive `@media` queries in `index.css` to gracefully adapt to phones without needing heavy CSS frameworks.

---

## 5. Live Modification Preparation (How to adapt)

If the evaluator says: *"Can you change X right now?"*

**"Change the main theme color from Red to Blue."**
- **Action**: Go to `src/index.css`. Look at the `:root` block at the top. Change `--primary-red: #E50914;` to a blue hex code (e.g., `#007BFF`). Change `--primary-gradient` to blue tones.

**"Add a 'Genre' field to the database when saving a movie."**
- **Action**: 
  1. Go to `api/models/User.js` and add `genre: String` to the watchlist schema array.
  2. Go to `src/components/MovieModal.jsx`, inside the `onAdd` function, add `genre: movieData.Genre` to the object being passed.

**"Change the Subscription cost of the Premium plan."**
- **Action**: Go to `src/pages/PlansPage.jsx`. Find the `plans` array at the top of the component and modify the `price` and `amount` strings.

**"Change the background of the Dashboard."**
- **Action**: Go to `src/pages/DashboardPage.jsx`, find the outer `<div>` and change `background: '#0A0A0A'` to your desired color.

---

## 6. Likely Viva Questions & Answers

**Q: Why did you use Vite instead of Create React App (CRA)?**
**A**: Vite uses native ES modules to serve code instantly during development, making it significantly faster than CRA's Webpack bundler. It also produces highly optimized, smaller production builds.

**Q: Explain how the Watchlist Search dropdown works.**
**A**: It uses a controlled React input attached to the `onChange` event. We use a `useEffect` hook to implement "debouncing"—it waits a few milliseconds after the user stops typing to trigger an asynchronous `fetch` call to the OMDb API. The results are stored in local state and mapped into a dropdown list.

**Q: How does the backend communicate with the frontend?**
**A**: The frontend uses the browser's native `fetch` API inside `AppContext.jsx` to make HTTP requests (GET, POST, DELETE) to the backend `/api/...` endpoints. The Express backend receives these, interacts with MongoDB via Mongoose, and responds with JSON data.

**Q: What is a Serverless Function and why use it?**
**A**: Instead of having a server running 24/7 (like a traditional Node/Express app), Vercel takes our `api/` routes and converts them into serverless functions. They "wake up" only when requested, run the code, and shut down. This is incredibly cost-effective and scales automatically without manual server management.

**Q: How do you handle Cross-Origin Resource Sharing (CORS)?**
**A**: In `api/index.js`, we use the `cors` middleware (`app.use(cors())`). Since our frontend is hosted on Vercel and the backend is on Vercel Serverless, this allows the frontend domain to legally request data from the backend API without the browser blocking it for security reasons.
