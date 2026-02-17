# rule based 
import pandas as pd
import re

# Basic lexicon dictionary
positive_words = {
    "good": 1,
    "excellent": 2,
    "amazing": 2,
    "happy": 2,
    "love": 2,
    "great": 2
}

negative_words = {
    "bad": -1,
    "terrible": -2,
    "sad": -2,
    "hate": -2,
    "worst": -2,
    "poor": -1
}

negation_words = ["not", "never", "no"]
intensifiers = ["very", "extremely", "really"]

def analyze_sentiment(text):
    words = re.findall(r'\b\w+\b', text.lower())
    score = 0
    
    for i, word in enumerate(words):
        
        # Positive words
        if word in positive_words:
            word_score = positive_words[word]
            
            # Negation handling
            if i > 0 and any(neg in words[max(0, i-3):i] for neg in negation_words):

                word_score = -word_score
            
            # Intensifier handling
            if i > 0 and words[i-1] in intensifiers:
                word_score = word_score * 1.5
                
            score += word_score

        # Negative words
        elif word in negative_words:
            word_score = negative_words[word]
            
            if i > 0 and words[i-1] in negation_words:
                word_score = -word_score
            
            if i > 0 and words[i-1] in intensifiers:
                word_score = word_score * 1.5
                
            score += word_score

    # Punctuation emphasis
    if "!" in text:
        score = score * 1.2

    # Final classification
    if score > 1:
        return "Positive", score
    elif score < -1:
        return "Negative", score
    else:
        return "Neutral", score


# Read dataset
df = pd.read_csv("reddit_sample.csv")

results = []
scores = []

for comment in df["comment"]:
    sentiment, score = analyze_sentiment(comment)
    results.append(sentiment)
    scores.append(score)

df["Predicted_Sentiment"] = results
df["Score"] = scores

df.to_csv("output_results.csv", index=False)

print(df.head())
