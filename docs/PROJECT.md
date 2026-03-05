# StudyAI — AI Study Assistant

An AI-powered study tool that transforms student notes into structured summaries, interactive flashcards, and multiple-choice quizzes.

---

## Team Members & Roles

| Name     | Role                                        |
| -------- | ------------------------------------------- |
| Denis    | Team Lead, AI Integration, Frontend Development |
| Wisdom   | UI/UX Design (Figma)                        |
| Mariyum  | Backend Development                         |
| Quaysha  | Prompt Engineering, QA, Documentation        |
| Zainab   | Quiz Feature Development, Presentation Lead  |

---

## Tech Stack

| Technology    | Purpose                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| **React + Vite** | Frontend UI framework. React provides a component-based architecture; Vite offers fast development builds. |
| **Flask**     | Lightweight Python web framework for the backend API. Simple and easy to set up for a small project. |
| **OpenAI API** | Powers the AI features — generates summaries, flashcards, and quiz questions from student notes. |
| **Axios**     | HTTP client used in the frontend to make API calls to the Flask backend. |

---

## How to Run the App

### Prerequisites

- **Node.js** (v18+) and **npm**
- **Python** (3.9+) and **pip**
- An **OpenAI API key**

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder (if not already present):

```
OPENAI_API_KEY=your-api-key-here
```

Start the backend server:

```bash
python app.py
```

The backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` (Vite default).

---

## Features

1. **Summary Generation** — Paste your notes, get a structured summary with key points and concepts.
2. **Flashcards** — Automatically generated question/answer flashcards with a flip animation.
3. **Quiz** — 5 multiple-choice questions with instant feedback and scoring.

---

## API Documentation

### `POST /api/generate`

Generates study materials from student notes.

**Request Body (JSON):**

```json
{
  "notes": "Your study notes here...",
  "mode": "summary" | "flashcards" | "quiz"
}
```

**Validation Rules:**
- `notes` — required, non-empty, max 5000 characters
- `mode` — required, must be one of: `summary`, `flashcards`, `quiz`

**Response — Summary:**

```json
{
  "result": "A structured summary of the notes..."
}
```

**Response — Flashcards:**

```json
{
  "result": [
    { "front": "What is X?", "back": "X is..." },
    { "front": "Explain Y.", "back": "Y means..." }
  ]
}
```

**Response — Quiz:**

```json
{
  "result": [
    {
      "question": "What does X do?",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "B"
    }
  ]
}
```

**Error Response:**

```json
{
  "error": "Description of the error"
}
```

---

## Folder Structure

```
AI-study-assistant/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main layout, state management, tab navigation
│   │   ├── main.jsx             # React entry point
│   │   ├── index.css            # All app styles
│   │   ├── components/
│   │   │   ├── Home.jsx         # Landing/dashboard screen
│   │   │   ├── InputSection.jsx # Note input & generate button
│   │   │   ├── Summary.jsx      # Summary display with key points
│   │   │   ├── Flashcards.jsx   # Interactive flashcard viewer
│   │   │   └── Quiz.jsx         # Multiple-choice quiz with scoring
│   │   └── assets/
│   ├── index.html
│   └── package.json
├── backend/
│   ├── app.py                   # Flask server & API endpoint
│   ├── prompts.py               # OpenAI prompt templates
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # API key (not committed to git)
└── docs/
    ├── PROJECT.md               # This file
    └── AI-INTEGRATION-GUIDE.md  # Step-by-step AI integration guide
```

---

## Future Improvements

- **PDF Upload** — Allow students to upload PDF documents instead of pasting text
- **Saved Sessions** — Persist study sessions so students can revisit them later
- **More AI Models** — Support for different AI providers (Claude, Gemini, etc.)
- **User Accounts** — Login system so each student has their own session history
- **Export Options** — Download flashcards as PDF or import into Anki
- **Collaborative Study** — Share study materials with classmates
