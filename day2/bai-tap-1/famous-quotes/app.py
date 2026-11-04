import json
import os
import random
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Base path for loading quotes.json reliably
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUOTES_FILE = os.path.join(BASE_DIR, "quotes.json")


def load_quotes():
    """Load quotes from the JSON data file."""
    with open(QUOTES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    """Render the main single-page application."""
    return render_template("index.html")


@app.route("/api/quotes", methods=["GET"])
def get_quotes():
    """
    Retrieve quotes with optional filtering by author, category, or search term.
    Query parameters:
      - search: string to search in English/Vietnamese text, author, or category
      - author: exact or partial author name
      - category: category name
    """
    quotes = load_quotes()
    search = request.args.get("search", "").strip().lower()
    author = request.args.get("author", "").strip().lower()
    category = request.args.get("category", "").strip().lower()

    filtered = quotes

    if category and category != "all":
        filtered = [q for q in filtered if q["category"].lower() == category]

    if author:
        filtered = [q for q in filtered if author in q["author"].lower()]

    if search:
        filtered = [
            q
            for q in filtered
            if (
                search in q["quote_en"].lower()
                or search in q["quote_vi"].lower()
                or search in q["author"].lower()
                or search in q["category"].lower()
            )
        ]

    return jsonify({"count": len(filtered), "quotes": filtered})


@app.route("/api/quotes/random", methods=["GET"])
def get_random_quote():
    """
    Return a single random quote.
    Supports optional category or author query filter.
    """
    quotes = load_quotes()
    category = request.args.get("category", "").strip().lower()
    author = request.args.get("author", "").strip().lower()

    pool = quotes
    if category and category != "all":
        pool = [q for q in pool if q["category"].lower() == category]
    if author:
        pool = [q for q in pool if author in q["author"].lower()]

    if not pool:
        return jsonify({"error": "No quotes found matching criteria"}), 404

    return jsonify(random.choice(pool))


@app.route("/api/quotes/<int:quote_id>", methods=["GET"])
def get_quote_by_id(quote_id):
    """Retrieve a single quote by its ID."""
    quotes = load_quotes()
    for q in quotes:
        if q["id"] == quote_id:
            return jsonify(q)
    return jsonify({"error": f"Quote with id {quote_id} not found"}), 404


@app.route("/api/categories", methods=["GET"])
def get_categories():
    """Retrieve distinct categories with quote count."""
    quotes = load_quotes()
    category_counts = {}
    for q in quotes:
        cat = q["category"]
        category_counts[cat] = category_counts.get(cat, 0) + 1

    result = [
        {"name": name, "count": count}
        for name, count in sorted(category_counts.items())
    ]
    return jsonify({"total": len(result), "categories": result})


@app.route("/api/authors", methods=["GET"])
def get_authors():
    """Retrieve unique authors sorted alphabetically."""
    quotes = load_quotes()
    authors = sorted(list({q["author"] for q in quotes}))
    return jsonify({"total": len(authors), "authors": authors})


if __name__ == "__main__":
    # Run explicitly on port 5001
    app.run(host="0.0.0.0", port=5001, debug=True)
