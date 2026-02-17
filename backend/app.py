from flask import Flask, jsonify
from flask_cors import CORS
import requests
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import math

app = Flask(__name__)
CORS(app)

analyzer = SentimentIntensityAnalyzer()
comment_cache = {}

# ===============================
# SENTIMENT FUNCTION
# ===============================

def analyze_sentiment(text):
    scores = analyzer.polarity_scores(text)
    compound = scores["compound"]

    if compound >= 0.05:
        label = "Positive"
    elif compound <= -0.05:
        label = "Negative"
    else:
        label = "Neutral"

    return label, round(compound, 3), round(abs(compound), 2)

# ===============================
# LIGHTWEIGHT EMOTION TAG
# ===============================

def detect_emotion(text):
    text = text.lower()

    if any(word in text for word in ["happy", "love", "great", "amazing"]):
        return "Joy"
    elif any(word in text for word in ["angry", "hate", "furious"]):
        return "Anger"
    elif any(word in text for word in ["sad", "disappointed"]):
        return "Sadness"
    elif any(word in text for word in ["fear", "scared"]):
        return "Fear"
    else:
        return "Neutral"

# ===============================
# POSTS API
# ===============================

@app.route("/api/posts")
def get_posts():
    url = "https://www.reddit.com/.json?limit=15"
    headers = {"User-Agent": "SentimentIQApp"}

    response = requests.get(url, headers=headers)
    data = response.json()

    posts = []
    sentiment_counts = {"Positive": 0, "Negative": 0, "Neutral": 0}

    for item in data["data"]["children"]:
        post = item["data"]

        combined_text = post["title"] + " " + post.get("selftext", "")

        sentiment, score, confidence = analyze_sentiment(combined_text)
        emotion = detect_emotion(combined_text)

        # 🔥 HEAT SCORE (correct placement)
        heat_score = round(abs(score) * math.log(post["num_comments"] + 1), 2)

        sentiment_counts[sentiment] += 1

        posts.append({
            "id": post["id"],
            "title": post["title"],
            "author": post["author"],
            "score": post["score"],
            "num_comments": post["num_comments"],
            "heat_score": heat_score,
            "created": post["created_utc"],

            # MEDIA SUPPORT
            "post_hint": post.get("post_hint"),
            "is_video": post.get("is_video"),
            "url": post.get("url"),
            "thumbnail": post.get("thumbnail"),
            "image_url": post.get("url") if post.get("post_hint") == "image" else None,
            "video_url": post.get("media", {}).get("reddit_video", {}).get("fallback_url")
                if post.get("is_video") else None,
            "gallery_data": post.get("media_metadata"),

            "analysis": {
                "sentiment_label": sentiment,
                "compound_score": score,
                "emotion_tag": emotion,
                "confidence": confidence
            }
        })

    return jsonify({
        "posts": posts,
        "summary": sentiment_counts
    })

# ===============================
# COMMENTS API
# ===============================

@app.route("/api/comments/<post_id>")
def get_comments(post_id):

    if post_id in comment_cache:
        return jsonify(comment_cache[post_id])

    url = f"https://www.reddit.com/comments/{post_id}.json"
    headers = {"User-Agent": "SentimentIQApp"}

    response = requests.get(url, headers=headers)
    data = response.json()

    if len(data) < 2:
        return jsonify([])

    comments = []
    comment_data = data[1]["data"]["children"]

    for child in comment_data:
        if child["kind"] != "t1":
            continue

        comment = child["data"]
        body = comment.get("body", "")

        sentiment, score, confidence = analyze_sentiment(body)
        emotion = detect_emotion(body)

        comments.append({
            "id": comment["id"],
            "author": comment.get("author"),
            "body": body,
            "score": comment.get("score"),
            "analysis": {
                "sentiment_label": sentiment,
                "compound_score": score,
                "emotion_tag": emotion,
                "confidence": confidence
            }
        })

    comment_cache[post_id] = comments
    return jsonify(comments)
@app.route("/api/trending")
def get_trending():
    url = "https://www.reddit.com/r/news/.json?limit=20"
    headers = {"User-Agent": "SentimentIQApp"}

    response = requests.get(url, headers=headers)
    data = response.json()

    trending_posts = []

    for item in data["data"]["children"]:
        post = item["data"]
        combined_text = post["title"] + " " + post.get("selftext", "")

        sentiment, score, confidence = analyze_sentiment(combined_text)

        heat_score = round(abs(score) * math.log(post["num_comments"] + 1), 2)

        trending_posts.append({
            "id": post["id"],
            "title": post["title"],
            "score": post["score"],
            "num_comments": post["num_comments"],
            "sentiment": sentiment,
            "compound": score,
            "heat_score": heat_score,
            "url": post.get("url")
        })

    # Sort by heat score
    trending_posts.sort(key=lambda x: x["heat_score"], reverse=True)

    return jsonify(trending_posts[:10])

# ===============================

if __name__ == "__main__":
    app.run(debug=True)