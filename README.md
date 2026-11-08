# 🎮 Maths Adventure – 100 Levels

**An interactive mathematics learning game for children**

Maths Adventure is a child-friendly educational game designed to make learning mathematics enjoyable through 100 progressive levels, 10 themed worlds, rewards, hints, and achievement tracking.

This starter project provides a working React frontend and an optional Node.js/Express + MongoDB backend foundation. The initial version stores progress in the browser (`localStorage`) so you can run and test the game without configuring a database.

---

## 1. Project goals

- Help children practise mathematics through play.
- Build confidence with gradually increasing difficulty.
- Encourage learning through positive feedback, stars, coins, and achievements.
- Track level completion and overall progress.
- Support desktop, tablet, and mobile screens.
- Provide a foundation that can later support accounts, cloud saving, and a leaderboard.

## 2. Target users

The age group is configurable. Suggested starting profiles:

| Age | Suggested content |
|---|---|
| 3–5 | Counting, number recognition, very simple addition |
| 5–7 | Addition, subtraction, number patterns, shapes |
| 8–10 | Multiplication, division, fractions, measurement |
| 11–13 | Mixed operations, geometry, multi-step word problems |

**Important:** The current starter question generator is a demonstration. Review and adapt the curriculum, language, accessibility, and difficulty with teachers or suitable education specialists before using it with children.

## 3. The 100-level learning journey

The game contains 10 worlds, with 10 levels per world.

| World | Levels | Topic |
|---|---:|---|
| 1. Number Land | 1–10 | Counting and number recognition |
| 2. Addition Island | 11–20 | Addition |
| 3. Subtraction Valley | 21–30 | Subtraction |
| 4. Multiplication Mountain | 31–40 | Multiplication |
| 5. Division Desert | 41–50 | Division |
| 6. Fraction Forest | 51–60 | Introductory fractions |
| 7. Geometry City | 61–70 | Shapes and geometry |
| 8. Measurement World | 71–80 | Time, length, and weight |
| 9. Math Challenge Castle | 81–90 | Mixed operations and word problems |
| 10. Math Champion Kingdom | 91–100 | Mixed challenge levels |

Each level has 5 questions in this starter version. The question count can be changed in `src/data/gameData.js`.

### Level progression

- Level 1 is available at the start.
- A level is unlocked when the previous level is completed.
- A level is marked complete after the player answers the required questions.
- Stars are awarded according to the score.
- Coins are earned for correct answers.
- The player can revisit completed levels.
- Progress is saved in browser local storage.

## 4. Main features

| Feature | Purpose |
|---|---|
| Player name | Personalises the welcome screen |
| 100 levels | Provides a structured learning journey |
| 10 themed worlds | Groups related mathematics topics |
| Question generator | Creates practice questions |
| Multiple-choice answers | Makes answering simple for younger players |
| Score | Rewards correct answers |
| Stars | Gives a level achievement rating |
| Coins | Provides a simple reward currency |
| Hint | Offers a clue for a question |
| Progress tracking | Remembers completed and unlocked levels |
| Encouraging feedback | Supports a positive learning experience |
| Responsive layout | Works on phones, tablets, and computers |
| Sound-ready design | Can be extended with sound effects |
| Certificate-ready design | Can be extended with a completion certificate |

### Suggested star rules

The starter uses the following simple scoring model:

- 5 correct answers: 3 stars
- 4 correct answers: 2 stars
- 3 or fewer correct answers: 1 star

You can change these rules in `src/App.jsx`.

## 5. Game screens

1. **Welcome screen** – enter the player's display name and start.
2. **World and level map** – view all 10 worlds and their 100 levels.
3. **Question screen** – answer a question, request a hint, and view progress.
4. **Level result screen** – see the score, stars, and coins earned.
5. **Progress summary** – view completed levels, total stars, and coins.

## 6. Technology stack

### Frontend
- React – reusable user interface components.
- Vite – development server and build tool.
- JavaScript – game rules and question logic.
- CSS – responsive design and visual styling.
- Browser `localStorage` – starter progress persistence.

### Optional backend
- Node.js – JavaScript runtime.
- Express – REST API.
- MongoDB – persistent player and progress data.
- Mongoose – MongoDB object modelling.

The backend folder is a foundation only. The current frontend does not yet call the API. Connect it after implementing authentication and API integration.

## 7. Project folder structure

```text
maths-adventure/
├── README.md
├── package.json
├── index.html
├── .gitignore
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── data/
│       │   └── gameData.js
│       └── styles.css
└── backend/
    ├── package.json
    ├── .env.example
    └── src/
        └── server.js
```

## 8. Requirements

Install these before starting:

- Node.js (LTS version recommended)
- npm (included with Node.js)
- A code editor such as Visual Studio Code
- A modern browser

Optional for the backend:
- MongoDB Community Server or a MongoDB Atlas database
- A MongoDB connection string

Check installation:

```bash
node -v
npm -v
```

## 9. Run the frontend

Open a terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will show a local development URL, normally:

```text
http://localhost:5173
```

Open that address in your browser.

### Build for production

```bash
npm run build
```

The production files will be generated in `frontend/dist/`.

## 10. Run the optional backend

Open another terminal:

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and configure your MongoDB connection:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/maths_adventure
```

Start the backend:

```bash
npm run dev
```

Health check:

```text
http://localhost:5000/api/health
```

The starter API currently provides a health-check endpoint only. Add player, progress, authentication, and leaderboard routes as future development tasks.

## 11. How the game works

1. The player enters a display name.
2. The game loads the world map.
3. The player selects an unlocked level.
4. The game creates five questions for that level.
5. The player selects an answer.
6. The game provides immediate feedback.
7. The score and coins are updated.
8. After all questions, the game calculates stars.
9. The level is marked complete and the next level is unlocked.
10. Progress is saved in `localStorage`.

## 12. How to customise the game

### Change world names and topics

Edit:

```text
frontend/src/data/gameData.js
```

Update the `WORLDS` array.

### Change the number of questions

Find `QUESTIONS_PER_LEVEL` in `gameData.js`.

### Change rewards

Find the level-completion logic in `App.jsx`. Adjust the coin and star rules there.

### Change colours and layout

Edit:

```text
frontend/src/styles.css
```

### Add more question types

Extend the question generator in `gameData.js`. Add suitable question generators for fractions, geometry, measurement, and word problems.

## 13. Suggested future enhancements

### Phase 1 – Core game
- [x] 10 worlds and 100 levels
- [x] Sequential level unlocking
- [x] Random arithmetic questions for supported topics
- [x] Multiple-choice answers
- [x] Score, stars, coins, and hints
- [x] Browser progress saving
- [ ] Carefully authored question banks for all topics

### Phase 2 – Better learning experience
- [ ] Difficulty profiles by age or grade
- [ ] Sinhala, Tamil, and English language support
- [ ] Audio instructions and read-aloud questions
- [ ] Sound effects and background music
- [ ] More animations and character customisation
- [ ] Accessibility options

### Phase 3 – Backend and accounts
- [ ] Parent/teacher and child profiles
- [ ] Secure authentication and authorisation
- [ ] MongoDB progress synchronisation
- [ ] Parent/teacher dashboard
- [ ] Reports showing strengths and areas to practise
- [ ] Privacy-conscious leaderboard

### Phase 4 – Release
- [ ] Test on different screen sizes
- [ ] Test all 100 levels and edge cases
- [ ] Review child privacy and data protection
- [ ] Usability testing with appropriate adult supervision
- [ ] Deploy frontend and backend
- [ ] Prepare app-store packaging if required

## 14. Testing checklist

- [ ] Player can enter a name.
- [ ] Only unlocked levels can be started.
- [ ] Correct answers increase the score.
- [ ] Incorrect answers show supportive feedback.
- [ ] Hints work and do not reveal the answer directly.
- [ ] Stars and coins are calculated correctly.
- [ ] Completing a level unlocks the next level.
- [ ] Refreshing the page preserves progress.
- [ ] Resetting progress works as expected.
- [ ] Layout works on mobile and desktop.
- [ ] Questions have valid answers and no accidental duplicate choices.

## 15. Child safety and privacy

This is an educational starter, not a production-ready child-facing service.

- Do not collect children's full names, addresses, phone numbers, photos, or other unnecessary personal information.
- Obtain appropriate parent/guardian and institutional approval before collecting or storing children's data.
- If accounts are added, use secure authentication, access controls, validation, and protected secrets.
- Do not expose database credentials or API secrets in frontend code.
- Consider disabling public leaderboards or using non-identifying nicknames.
- Review applicable child privacy and data protection requirements before deployment.

## 16. Git and GitHub

Initialise Git from the project root:

```bash
git init
git add .
git commit -m "Initial Maths Adventure starter project"
```

Create a GitHub repository and connect it:

```bash
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Never commit `.env` files or database credentials.

## 17. Author's note

Maths Adventure is designed as a foundation for a fun, encouraging, and progressively challenging mathematics game. Build it step by step: first make the core gameplay reliable, then improve the learning content, visual design, accessibility, and backend.

**Learn. Play. Practise. Become a Math Champion!** 🌟
