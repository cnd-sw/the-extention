from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import re

app = Flask(__name__)
CORS(app)

def correct_grammar(text, mode='professional'):
    """
    Comprehensive grammar correction using TextBlob and custom rules.
    """
    if not text or not text.strip():
        return text
    
    original_text = text
    
    # Step 1: Expand contractions and informal language
    contractions = {
        r"\bim\b": "I am",
        r"\bim\b": "I am",
        r"\bu\b": "you",
        r"\bur\b": "your",
        r"\br\b": "are",
        r"\bcuz\b": "because",
        r"\bcoz\b": "because",
        r"\bwanna\b": "want to",
        r"\bgonna\b": "going to",
        r"\bgotta\b": "have to",
        r"\bkinda\b": "kind of",
        r"\bsorta\b": "sort of",
        r"\byeah\b": "yes",
        r"\byep\b": "yes",
        r"\bnope\b": "no",
        r"\btho\b": "though",
        r"\bthru\b": "through",
        r"\bidk\b": "I do not know",
        r"\btbh\b": "to be honest",
        r"\bimo\b": "in my opinion",
        r"\bbtw\b": "by the way",
        r"\bfyi\b": "for your information",
        r"\basap\b": "as soon as possible",
        r"\bcant\b": "cannot",
        r"\bwont\b": "will not",
        r"\bdont\b": "do not",
        r"\bdidnt\b": "did not",
        r"\bisnt\b": "is not",
        r"\barent\b": "are not",
        r"\bwasnt\b": "was not",
        r"\bwerent\b": "were not",
        r"\bhasnt\b": "has not",
        r"\bhavent\b": "have not",
        r"\bhadnt\b": "had not",
        r"\bwouldnt\b": "would not",
        r"\bcouldnt\b": "could not",
        r"\bshouldnt\b": "should not",
        r"\balot\b": "a lot",
        r"\bthats\b": "that is",
        r"\bwhats\b": "what is",
        r"\bwhos\b": "who is",
        r"\bwheres\b": "where is",
        r"\bwhen\s+s\b": "when is",
        r"\bhows\b": "how is",
        r"\bits\b": "it is",
        r"\blets\b": "let us",
    }
    
    for pattern, replacement in contractions.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    
    # Step 2: Use TextBlob for spelling correction
    try:
        blob = TextBlob(text)
        text = str(blob.correct())
    except:
        pass  # If correction fails, continue with original
    
    # Step 3: Remove filler words based on mode
    if mode in ['professional', 'concise']:
        filler_patterns = [
            r'\b(very|really|quite|basically|actually|literally)\b',
            r'\b(just|simply|merely)\b',
            r'\b(kind of|sort of)\b',
        ]
        for pattern in filler_patterns:
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    
    if mode == 'concise':
        # More aggressive removal
        text = re.sub(r'\b(i think|i guess|i suppose|maybe|perhaps)\b', '', text, flags=re.IGNORECASE)
    
    # Step 4: Fix common grammar mistakes
    
    # Fix double spaces
    text = re.sub(r'\s+', ' ', text)
    
    # Fix spaces before punctuation
    text = re.sub(r'\s+([?.!,;:])', r'\1', text)
    
    # Add space after punctuation if missing
    text = re.sub(r'([?.!,;:])([A-Za-z])', r'\1 \2', text)
    
    # Fix "i" to "I"
    text = re.sub(r'\bi\b', 'I', text)
    
    # Fix "i'm" variations that might remain
    text = re.sub(r"\bi'm\b", "I am", text, flags=re.IGNORECASE)
    text = re.sub(r"\bi'll\b", "I will", text, flags=re.IGNORECASE)
    text = re.sub(r"\bi've\b", "I have", text, flags=re.IGNORECASE)
    text = re.sub(r"\bi'd\b", "I would", text, flags=re.IGNORECASE)
    
    # Fix common subject-verb agreement issues
    text = re.sub(r'\bI is\b', 'I am', text)
    text = re.sub(r'\bI was\b', 'I was', text)  # This is correct
    text = re.sub(r'\bhe are\b', 'he is', text, flags=re.IGNORECASE)
    text = re.sub(r'\bshe are\b', 'she is', text, flags=re.IGNORECASE)
    text = re.sub(r'\bit are\b', 'it is', text, flags=re.IGNORECASE)
    text = re.sub(r'\bthey is\b', 'they are', text, flags=re.IGNORECASE)
    text = re.sub(r'\bwe is\b', 'we are', text, flags=re.IGNORECASE)
    text = re.sub(r'\byou is\b', 'you are', text, flags=re.IGNORECASE)
    
    # Fix "a" vs "an"
    text = re.sub(r'\ba ([aeiouAEIOU])', r'an \1', text)
    text = re.sub(r'\ban ([^aeiouAEIOU])', r'a \1', text)
    
    # Capitalize first letter of sentence
    if text:
        text = text[0].upper() + text[1:] if len(text) > 1 else text.upper()
    
    # Capitalize after period, question mark, exclamation
    text = re.sub(r'([.!?]\s+)([a-z])', lambda m: m.group(1) + m.group(2).upper(), text)
    
    # Step 5: Add proper ending punctuation
    text = text.strip()
    if text and text[-1] not in '.!?':
        # Check if it's a question
        question_words = ['what', 'when', 'where', 'who', 'why', 'how', 'is', 'are', 'can', 'could', 'would', 'should', 'do', 'does', 'did']
        first_word = text.split()[0].lower() if text.split() else ''
        if first_word in question_words:
            text += '?'
        else:
            text += '.'
    
    # Final cleanup
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

@app.route('/correct', methods=['POST'])
def correct_text():
    data = request.json
    text = data.get('text', '')
    mode = data.get('mode', 'professional')
    
    if not text:
        return jsonify({'corrected': ''})
    
    # Apply grammar correction
    corrected = correct_grammar(text, mode)
    
    return jsonify({
        'original': text,
        'corrected': corrected,
        'category': 'auto'
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Antigravity Grammar Correction Server")
    print("=" * 50)
    print("Server running on: http://localhost:5001")
    print("Ready to correct grammar!")
    print("=" * 50)
    app.run(port=5001, debug=True)
