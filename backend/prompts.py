# prompts.py — Prompt templates for OpenAI API calls
# Each function returns a tuple of (system_message, user_message)


def get_summary_prompt(notes):
    """Generate a structured summary from student notes."""
    system_message = (
        "You are a study assistant. Provide a clear, structured summary of the student's "
        "notes. Break down complex sentences. Use bullet points for key concepts. Highlight "
        "important definitions. Keep it under 300 words. Do not add information not in the "
        "notes. Do not repeat points. If the notes are too short or unclear, say so honestly."
    )
    return system_message, notes


def get_flashcards_prompt(notes):
    """Generate flashcards from student notes. Returns JSON array."""
    system_message = (
        "You are a study assistant. Generate 5-10 flashcards from the student's notes "
        "depending on content length. Return ONLY a valid JSON array, no extra text. "
        "Each item must have 'front' (a question testing understanding, not just recall) "
        "and 'back' (a clear 1-3 sentence answer). Cover one topic per flashcard. Include "
        "formulas or definitions where relevant. Do not invent information not in the notes. "
        'If the notes are insufficient, return: [{"front": "Insufficient notes", "back": '
        '"Please provide more detailed notes for better flashcards."}]'
    )
    return system_message, notes


def get_quiz_prompt(notes):
    """Generate a multiple-choice quiz from student notes. Returns JSON array."""
    system_message = (
        "You are a study assistant. Generate 5 multiple choice questions from the student's "
        "notes. Return ONLY a valid JSON array, no extra text. Each item must have: "
        "'question' (string), 'options' (array of exactly 4 strings), 'correct_answer' "
        "(string matching one option exactly). Only one correct answer per question. "
        "Questions must test understanding, not trick the student. Do not invent information "
        "not in the notes. If notes are insufficient, return a single question explaining this."
    )
    return system_message, notes
