# AI Integration Guide — StudyAI

A beginner-friendly guide explaining how the AI features work in this project. Written for students who have never used an API before.

---

## 1. How the OpenAI API Works

Think of the OpenAI API like a texting service for AI. You send it a message (your study notes), and it sends back a reply (a summary, flashcards, or quiz).

Here's what happens behind the scenes:

1. You type your notes into the app
2. Your notes get sent to our backend server (Flask)
3. The server packages your notes into a structured "prompt" (instructions for the AI)
4. The server sends that prompt to OpenAI's servers over the internet
5. OpenAI's AI model (GPT-3.5-turbo) processes your notes and generates a response
6. The response comes back to our server, which sends it to your browser
7. The app displays the results

**Key concept:** An API (Application Programming Interface) is just a way for two programs to talk to each other. Our app talks to OpenAI's AI the same way your browser talks to any website — by sending and receiving data over the internet.

---

## 2. How to Get an API Key

An API key is like a password that lets your app use OpenAI's services.

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account (or sign in)
3. Click on **API Keys** in the left sidebar
4. Click **"Create new secret key"**
5. Copy the key — it looks like `sk-abc123...`
6. **Important:** You won't be able to see this key again after closing the popup, so save it immediately

### Setting up your key in the project:

Create a file called `.env` inside the `backend/` folder:

```
OPENAI_API_KEY=sk-your-actual-key-here
```

**Never share your API key or commit it to GitHub.** The `.gitignore` file is already set up to ignore `.env` files.

---

## 3. How prompts.py Works (and Why Prompt Engineering Matters)

The `prompts.py` file contains three functions, one for each mode (summary, flashcards, quiz). Each function returns two things:

- **System message** — Instructions telling the AI *how* to behave
- **User message** — The actual student notes

### Example: Summary Prompt

```python
def get_summary_prompt(notes):
    system_message = "You are a study assistant. Provide a clear, structured summary..."
    return system_message, notes
```

### Why does this matter?

The AI doesn't know what you want unless you tell it precisely. This is called **prompt engineering** — the art of writing clear instructions for AI.

Compare these two approaches:

**Bad prompt:** "Summarize this."
→ The AI might give a vague, unhelpful response.

**Good prompt (what we use):** "You are a study assistant. Provide a clear, structured summary of the student's notes. Break down complex sentences. Use bullet points for key concepts. Keep it under 300 words."
→ The AI knows exactly what format and style to use.

For flashcards and quizzes, we also tell the AI to return **valid JSON** (a structured data format) so our app can parse and display the data correctly.

---

## 4. How the Backend Calls the API

Here's what happens in `app.py` when a request comes in:

### Step 1: Receive the request

```python
@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json()
    notes = data.get("notes", "")
    mode = data.get("mode", "")
```

The backend receives JSON data with the student's `notes` and the `mode` (summary, flashcards, or quiz).

### Step 2: Validate inputs

```python
if not notes:
    return jsonify({"error": "Notes cannot be empty."}), 400
```

We check that the notes aren't empty, aren't too long (max 5000 characters), and that the mode is valid.

### Step 3: Get the right prompt

```python
prompt_fn = PROMPT_FUNCTIONS[mode]  # Gets the right function for the mode
system_message, user_message = prompt_fn(notes)
```

### Step 4: Call OpenAI

```python
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_message},
    ],
    temperature=0.7,
    max_tokens=1024,
)
```

- `model` — Which AI model to use (gpt-3.5-turbo is fast and affordable)
- `messages` — The conversation: system instructions + user's notes
- `temperature` — Controls creativity (0 = very precise, 1 = very creative; 0.7 is a good balance)
- `max_tokens` — Maximum length of the response

### Step 5: Return the result

```python
content = response.choices[0].message.content.strip()
return jsonify({"result": content})
```

For flashcards and quizzes, we also parse the JSON string into actual data objects before returning.

---

## 5. How the Frontend Sends Notes and Displays Results

### Sending notes (in App.jsx):

```javascript
const [summaryRes, flashcardsRes, quizRes] = await Promise.all([
    axios.post(API_URL, { notes: fullNotes, mode: "summary" }),
    axios.post(API_URL, { notes: fullNotes, mode: "flashcards" }),
    axios.post(API_URL, { notes: fullNotes, mode: "quiz" }),
]);
```

When the user clicks "Generate", the frontend fires **all three API calls at the same time** using `Promise.all`. This means the user doesn't have to wait for each one sequentially — they all process in parallel.

### Displaying results:

Each result type has its own component:

- **Summary.jsx** — Splits the summary text into bullet points and displays them with styled cards
- **Flashcards.jsx** — Shows one card at a time with a flip animation (CSS 3D transform)
- **Quiz.jsx** — Shows one question at a time with 4 clickable options, tracks score

The user can switch between tabs (Study, Flashcards, Quiz) without re-generating because all results are stored in the app's state.

---

## 6. How to Test the Full Flow

### Step 1: Start the backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

You should see: `Running on http://127.0.0.1:5000`

### Step 2: Start the frontend

```bash
cd frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:5173/`

### Step 3: Test it

1. Open `http://localhost:5173` in your browser
2. Click the **"New"** tab
3. Enter a subject (e.g., "Biology")
4. Paste some study notes (a paragraph or more works best)
5. Click **"Generate Study Materials"**
6. Wait for the loading spinner to finish
7. You should see a summary on the Study tab
8. Navigate to Flashcards and Quiz using the buttons or bottom nav

### Step 4: Test the API directly (optional)

You can test the backend without the frontend using curl:

```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"notes": "Photosynthesis is the process by which plants convert sunlight into energy.", "mode": "summary"}'
```

---

## 7. Common Issues and How to Fix Them

### "API key not working" / 401 Unauthorized

- **Check your `.env` file** — Make sure it's in the `backend/` folder and contains `OPENAI_API_KEY=sk-...`
- **No quotes around the key** — It should be `OPENAI_API_KEY=sk-abc123`, NOT `OPENAI_API_KEY="sk-abc123"`
- **Check your OpenAI account** — Make sure you have billing set up at [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
- **Key might be expired** — Generate a new one from the OpenAI dashboard

### CORS errors (blocked by browser)

If you see an error like `Access to XMLHttpRequest has been blocked by CORS policy`:

- **Make sure the backend is running** — The Flask server must be running on port 5000
- **Check flask-cors is installed** — Run `pip install flask-cors`
- The `CORS(app)` line in `app.py` should handle this automatically

### JSON parse errors

If the AI returns invalid JSON (rare but possible):

- **Try again** — Sometimes the AI adds extra text around the JSON
- **Check your notes** — Very short or unclear notes can cause unexpected responses
- The backend will return a clear error message: "AI returned invalid JSON. Please try again."

### "Module not found" errors

- **Frontend:** Run `npm install` in the `frontend/` folder
- **Backend:** Run `pip install -r requirements.txt` in the `backend/` folder

### Backend won't start

- Make sure you're in the `backend/` directory
- Make sure Python 3.9+ is installed: `python --version`
- Make sure all dependencies are installed: `pip install -r requirements.txt`

### Frontend won't start

- Make sure you're in the `frontend/` directory
- Make sure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
