Letter Range



---

### Game Specification

#### Overview
- **Title**: Letter Range
- **Objective**: Players learn English letters by shooting moving targets displaying individual letters to spell a given word.
- **Platform**: Web-based game using ReactJS and Three.js for 3D rendering.
- **Target Audience**: English learners (children or beginners).
- **Core Mechanic**: Players use a crosshair to shoot at moving lettered targets in a 3D shooting range environment.

#### Gameplay
1. **Start Screen**:
   - Displays title, "Start Game" button, and instructions.
   - Instructions: "Shoot the moving targets with the correct letters to spell the word shown on screen."
2. **Gameplay Screen**:
   - A 3D shooting range with moving targets (e.g., floating spheres or boards) displaying random English letters (A-Z).
   - A HUD (Heads-Up Display) showing:
     - The target word (e.g., "CAT").
     - Current progress (e.g., "_ _ _" → "C _ _" as letters are shot).
     - Score (increases with correct shots).
     - Timer (e.g., 60 seconds per word).
   - A crosshair controlled by mouse movement.
   - Clicking shoots a projectile or registers a hit.
   - Audio: A commander voice says the word (e.g., "Shoot CAT!") and provides feedback (e.g., "Good shot!" or "Wrong letter!").
3. **Target Behavior**:
   - Targets move horizontally across the screen at varying speeds.
   - Each target displays a single letter.
   - Targets respawn after being hit or moving off-screen.
4. **Win/Lose Conditions**:
   - Win: Spell the word correctly before the timer runs out.
   - Lose: Timer runs out before the word is completed.
   - After each word, the player advances to a new word with increasing difficulty (e.g., longer words).
5. **Feedback**:
   - Visual: Correct hits highlight the letter in the HUD; incorrect hits flash red.
   - Audio: Commander provides encouragement or correction.

#### Technical Requirements
- **Frontend**:
  - Framework: ReactJS with TypeScript.
  - 3D Rendering: Three.js for the shooting range and targets.
  - Styling: TailwindCSS for UI elements (HUD, buttons).
  - Audio: Web Audio API or HTML5 `<audio>` for commander voice and sound effects.
  - Accessibility: Keyboard controls (e.g., Enter to shoot) and ARIA labels for screen readers.
- **Backend**:
  - Framework: NextJS API routes for serving words and managing game state.
  - Database: Convex or Drizzle ORM to store a word list and player scores.
  - API: RESTful endpoints to fetch words and submit scores.
- **Assets**:
  - 3D models: Simple spheres or boards for targets.
  - Audio: Pre-recorded commander voice clips (e.g., "Shoot CAT!", "Good job!").
  - Sound effects: Gunshot, hit, miss.

#### Features
1. **Word Progression**:
   - Start with 3-letter words (e.g., "CAT", "DOG").
   - Progress to 4-letter, 5-letter words based on score.
2. **Scoring**:
   - +10 points for correct letter.
   - -5 points for incorrect letter.
3. **Commander**:
   - Voice clips triggered on word display, correct hit, incorrect hit, and win/lose.
   - Subtitles for accessibility.

#### User Interface
- **Start Screen**: Centered title, button, and instructions styled with TailwindCSS.
- **Game Screen**:
  - Canvas for Three.js rendering.
  - HUD overlay with TailwindCSS (word, progress, score, timer).
  - Crosshair in the center of the screen.

#### Backend API
- **Endpoints**:
  - `GET /api/words`: Fetch a random word based on difficulty level.
  - `POST /api/score`: Submit player score after each round.

---

### To-Do List

#### Frontend
1. **Setup Project**:
   - Initialize a NextJS project with TypeScript. - Done
   - Install dependencies: Three.js, TailwindCSS, React. - Done
2. **Start Screen**:
   - Create a `StartScreen` component with title, button, and instructions.
   - Style with TailwindCSS.
   - Add accessibility (tabindex, onKeyDown for Enter).
3. **Game Screen**:
   - Create a `GameScreen` component.
   - Integrate Three.js:
     - Set up a 3D scene with camera, lights, and renderer.
     - Add a crosshair (2D overlay or 3D object).
     - Create moving target objects (spheres) with letter textures.
     - Handle mouse movement for crosshair and click to shoot.
   - Implement HUD with TailwindCSS:
     - Display target word, progress, score, and timer.
   - Add keyboard controls (Enter to shoot).
4. **Game Logic**:
   - Fetch word from backend on game start.
   - Track progress (e.g., "C _ _" for "CAT").
   - Update score and timer.
   - Detect hits on correct/incorrect letters.
   - Respawn targets after hits or off-screen.
5. **Audio**:
   - Add Web Audio API or `<audio>` elements for commander voice and sound effects.
   - Trigger audio on word display, hits, and win/lose.
   - Add subtitles with TailwindCSS.
6. **Animation**:
   - Animate targets moving across the screen.
   - Add hit/miss visual feedback (e.g., target flash green/red).

#### Backend
1. **Setup Backend**:
   - Configure NextJS API routes.
   - Install Convex or Drizzle ORM for database.
2. **Database**:
   - Create a table for words (e.g., `{ id, word, difficulty }`).
   - Seed with sample words (e.g., "CAT", "DOG", "BOOK").
   - Create a table for scores (e.g., `{ id, playerId, score, timestamp }`).
3. **API Endpoints**:
   - `GET /api/words`: Return a random word based on difficulty.
   - `POST /api/score`: Save player score to database.
4. **Validation**:
   - Ensure words are valid and difficulty matches player progress.

#### General
1. **Testing**:
   - Test game logic (word completion, scoring, timer).
   - Test audio cues and subtitles.
   - Test accessibility (keyboard navigation, ARIA).
2. **Deployment**:
   - Deploy to Vercel (NextJS hosting).

---

### Pseudocode Plan

#### Frontend (`GameScreen.tsx`)
```
// 1. Setup Three.js scene
Initialize scene, camera, renderer
Add ambient and directional lights
Create crosshair (2D overlay)
Add targets (spheres with letter textures)

// 2. Game State
const word = fetchWordFromAPI()  // e.g., "CAT"
const progress = ["_", "_", "_"]
const score = 0
const timer = 60 seconds

// 3. Target Management
for each target:
  set random letter (A-Z)
  set random speed and position
  animate horizontally across screen
  if hit or off-screen, respawn with new letter

// 4. Handle Shooting
onMouseMove:
  update crosshair position
onClick or onKeyDown(Enter):
  raycast from camera to detect hit
  if hit target:
    if target.letter matches next letter in word:
      update progress (e.g., "C _ _")
      score += 10
      play "Good shot!" audio
    else:
      score -= 5
      play "Wrong letter!" audio
    respawn target

// 5. Game Loop
if progress matches word:
  play "Good job!" audio
  fetch new word
if timer === 0:
  play "Time’s up!" audio
  end game
```

#### Backend (`/api/words.ts`)
```
// 1. Fetch Word
GET /api/words:
  query database for words where difficulty = currentLevel
  return random word (e.g., "CAT")

// 2. Save Score
POST /api/score:
  receive { playerId, score }
  insert into scores table
  return success message
```

---
You are a Senior full-stack Developer, and game developer and an Expert in Python, LLM, AI, three.js ReactJS, NextJS, JavaScript, TypeScript, Drizzle ORM, Convex, HTML, CSS and modern UI/UX frameworks (e.g., TailwindCSS, Shadcn, Radix). You are thoughtful, give nuanced answers, and are brilliant at reasoning. You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

- Follow the user’s requirements carefully & to the letter.
- First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
- Confirm, then write code!
- Always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules down below at Code Implementation Guidelines .
- Focus on easy and readability code, over being performant.
- Fully implement all requested functionality.
- Leave NO todo’s, placeholders or missing pieces.
- Ensure code is complete! Verify thoroughly finalised.
- Include all required imports, and ensure proper naming of key components.
- Be concise Minimize any other prose.
- If you think there might not be a correct answer, you say so.
- If you do not know the answer, say so, instead of guessing.

### Coding Environment
The user asks questions about the following coding languages:
- Python
- ReactJS
- NextJS
- Drizzle ORM
- Convex
- JavaScript
- TypeScript
- TailwindCSS
- HTML
- CSS

### Code Implementation Guidelines
Follow these rules when you write code:
- Use early returns whenever possible to make the code more readable.
- Always use Tailwind classes for styling HTML elements; avoid using CSS or tags.
- Use descriptive variable and function/const names. Also, event functions should be named with a “handle” prefix, like “handleClick” for onClick and “handleKeyDown” for onKeyDown.
- Implement accessibility features on elements. For example, a tag should have a tabindex=“0”, aria-label, on:click, and on:keydown, and similar attributes.
- Use consts instead of functions, for example, “const toggle = () =>”. Also, define a type if possible.
- Always prefer simple solutions
- Avoid duplication of code whenever possible. which means checking for other areas of the codebase that might already have similar code and functionality.
- Write code that takes into account edge cases, for example, handling errors, user input validation, and performance.
- Write code that takes into account the best practices for performance, for example, using memoization to avoid unnecessary re-renders.
- Write code that takes into account the different environments: dev, test, and prod.
- you are careful to only make changes that are requested or you are confident well understood and related to the change being requested.
- when fixing an issue or bug, do not introduce a new pattern ot technology without first exhausting all options for the existing implementation. and if you finally do this, make sure to remove the old implementation afterwards so we dont have duplicate logic.
- Keep the codebase very clean and organized.
- Avoid having files over 200-300 lines of code. refactor at that point.
- Mocking data is only needed for tests, never mock data for dev or prod.
- Never add stubbing or fake data pattern to code that affects the dev or prod environments.
- never overwrite my .env file without first ask permission from me and back up the old file first.