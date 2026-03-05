# app.py — Flask backend for AI Study Assistant
# Handles API requests and communicates with Anthropic Claude API

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import anthropic
import os
import json
from prompts import get_summary_prompt, get_flashcards_prompt, get_quiz_prompt

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Anthropic client
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Map mode names to their prompt functions
PROMPT_FUNCTIONS = {
    "summary": get_summary_prompt,
    "flashcards": get_flashcards_prompt,
    "quiz": get_quiz_prompt,
}


@app.route("/api/generate", methods=["POST"])
def generate():
    """
    Main endpoint — accepts student notes and a mode,
    then returns AI-generated study material.

    Request JSON:
        { "notes": "...", "mode": "summary" | "flashcards" | "quiz" }

    Response JSON:
        { "result": <string or array depending on mode> }
    """
    data = request.get_json()

    # --- Input validation ---
    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    notes = data.get("notes", "").strip()
    mode = data.get("mode", "")

    if not notes:
        return jsonify({"error": "Notes cannot be empty."}), 400

    if len(notes) > 5000:
        return jsonify({"error": "Notes must be under 5000 characters."}), 400

    if mode not in PROMPT_FUNCTIONS:
        return jsonify({"error": f"Invalid mode. Choose from: {', '.join(PROMPT_FUNCTIONS.keys())}"}), 400

    # --- Build prompt and call Claude ---
    try:
        prompt_fn = PROMPT_FUNCTIONS[mode]
        system_message, user_message = prompt_fn(notes)

        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=system_message,
            messages=[
                {"role": "user", "content": user_message},
            ],
        )

        content = response.content[0].text.strip()

        # For flashcards and quiz, parse the JSON response
        if mode in ("flashcards", "quiz"):
            # Strip markdown code fences if present (e.g. ```json ... ```)
            cleaned = content
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[1]  # remove first line
                cleaned = cleaned.rsplit("```", 1)[0]  # remove closing fence
                cleaned = cleaned.strip()
            result = json.loads(cleaned)
        else:
            result = content

        return jsonify({"result": result})

    except json.JSONDecodeError:
        return jsonify({"error": "AI returned invalid JSON. Please try again."}), 503

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to generate content: {str(e)}"}), 503


if __name__ == "__main__":
    app.run(debug=True, port=5000)
