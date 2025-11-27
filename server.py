from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import spacy
import re

app = Flask(__name__)
CORS(app)

# Load Spacy model (ensure 'python -m spacy download en_core_web_sm' is run)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Spacy model not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

def rule_based_cleanup(text):
    """
    Step 1: Rule-based cleanup: spelling, punctuation, agreement, redundancies.
    Using TextBlob for basic spelling and simple regex for cleanup.
    """
    # Basic spelling correction (TextBlob is simple, might be too aggressive, use with caution)
    # blob = TextBlob(text)
    # corrected = str(blob.correct()) 
    # NOTE: TextBlob.correct() can be inaccurate. Skipping for now to avoid bad UX.
    
    corrected = text
    
    # Fix double spaces
    corrected = re.sub(r'\s+', ' ', corrected)
    
    # Fix spaces before punctuation
    corrected = re.sub(r'\s([?.!,"](?:\s|$))', r'\1', corrected)
    
    return corrected.strip()

def classify_text(text):
    """
    Step 2: Run classifier: email, chat, technical, academic, legal, corporate.
    Simple keyword based classification for MVP.
    """
    text_lower = text.lower()
    if any(word in text_lower for word in ['hey', 'hi', 'lol', 'u', 'r']):
        return 'chat'
    if any(word in text_lower for word in ['dear', 'sincerely', 'regards']):
        return 'email'
    if any(word in text_lower for word in ['function', 'api', 'code', 'bug']):
        return 'technical'
    return 'general'

def model_rewrite(text, category, mode='professional'):
    """
    Step 3: Apply model rewrite: clarity-first editing, compression, removal of noise.
    """
    # Placeholder for actual model (e.g., T5 or specialized BERT)
    # For now, we'll just do some simple transformations based on category and mode
    
    if mode == 'casual':
        # Don't formalize too much
        pass
    elif mode == 'concise':
        # Aggressive compression
        text = re.sub(r'\b(that|which|who)\b', '', text)
    else: # professional (default)
        if category == 'chat':
            # Expand common contractions for formal tone
            replacements = {
                r'\bu\b': 'you',
                r'\br\b': 'are',
                r'\bim\b': 'I am',
                r'\bcuz\b': 'because'
            }
            for pattern, repl in replacements.items():
                text = re.sub(pattern, repl, text, flags=re.IGNORECASE)
            
    # Simple compression: remove "very", "really"
    text = re.sub(r'\b(very|really|quite|basically|actually)\b', '', text, flags=re.IGNORECASE)
    
    return re.sub(r'\s+', ' ', text).strip()

def validate_structure(text):
    """
    Step 4: Validate final structure.
    """
    # Ensure it ends with punctuation if it looks like a sentence
    if text and text[-1] not in '.!?':
        text += '.'
    return text

@app.route('/correct', methods=['POST'])
def correct_text():
    data = request.json
    text = data.get('text', '')
    mode = data.get('mode', 'professional')
    
    if not text:
        return jsonify({'corrected': ''})

    # Pipeline
    step1 = rule_based_cleanup(text)
    category = classify_text(step1)
    step3 = model_rewrite(step1, category, mode)
    final_text = validate_structure(step3)
    
    return jsonify({
        'original': text,
        'corrected': final_text,
        'category': category
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
