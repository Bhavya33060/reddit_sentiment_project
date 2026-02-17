# ===============================
# REDDIT SENTIMENT ANALYSIS PROJECT
# Hybrid: Rule-Based + ML Model
# ===============================

import pandas as pd
import re

# ML Imports
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# ===============================
# RULE-BASED LEXICON SETUP
# ===============================

positive_words = {
    "good": 1,
    "excellent": 2,
    "amazing": 2,
    "happy": 2,
    "love": 2,
    "great": 2,
    "fantastic": 2,
    "brilliant": 2,
    "recommend": 1
}

negative_words = {
    "bad": -1,
    "terrible": -2,
    "sad": -2,
    "hate": -2,
    "worst": -2,
    "poor": -1,
    "disappointed": -2,
    "awful": -2
}

negation_words = ["not", "never", "no"]
intensifiers = ["very", "extremely", "really", "highly", "absolutely"]


# ===============================
# RULE-BASED SENTIMENT FUNCTION
# ===============================

def analyze_sentiment(text):
    words = re.findall(r'\b\w+\b', text.lower())
    score = 0
    
    for i, word in enumerate(words):

        # POSITIVE WORDS
        if word in positive_words:
            word_score = positive_words[word]

            # 3-word negation window
            if any(neg in words[max(0, i-3):i] for neg in negation_words):
                word_score = -word_score

            # Intensifier
            if i > 0 and words[i-1] in intensifiers:
                word_score = word_score * 1.5

            score += word_score

        # NEGATIVE WORDS
        elif word in negative_words:
            word_score = negative_words[word]

            if any(neg in words[max(0, i-3):i] for neg in negation_words):
                word_score = -word_score

            if i > 0 and words[i-1] in intensifiers:
                word_score = word_score * 1.5

            score += word_score

    # Contrast rule ("but" emphasis)
    if "but" in words:
        score = score * 1.1

    # Punctuation emphasis
    if "!" in text:
        score = score * 1.2

    # Final Classification
    if score > 1:
        return "Positive", score
    elif score < -1:
        return "Negative", score
    else:
        return "Neutral", score


# ===============================
# LOAD DATASET
# ===============================

df = pd.read_csv("reddit_dataset.csv")

# ===============================
# APPLY RULE-BASED MODEL
# ===============================

rule_predictions = []
rule_scores = []

for comment in df["comment"]:
    sentiment, score = analyze_sentiment(comment)
    rule_predictions.append(sentiment)
    rule_scores.append(score)

df["Rule_Predicted"] = rule_predictions
df["Rule_Score"] = rule_scores

# Calculate Rule-Based Accuracy
rule_accuracy = accuracy_score(df["sentiment"], df["Rule_Predicted"])
print("Rule-Based Accuracy:", rule_accuracy)


# ===============================
# MACHINE LEARNING MODEL
# ===============================

# TF-IDF Vectorization
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(df["comment"])
y = df["sentiment"]

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Logistic Regression Model
model = LogisticRegression(max_iter=300)
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluation
print("\nML Model Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))


# ===============================
# SAVE RESULTS
# ==================b=============

df.to_csv("output_results.csv", index=False)

print("\nSample Output:")
print(df.head())
