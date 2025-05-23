from flask import Flask, request, jsonify
import subprocess
import json
import joblib
import torch
from transformers import BertTokenizer, BertModel
import numpy as np
import xgboost as xgb

app = Flask(__name__)

tokenizer = BertTokenizer.from_pretrained("bert_model")
bert = BertModel.from_pretrained("bert_model", output_hidden_states=True)

xgb_model = xgb.Booster()
xgb_model.load_model("xgboost_model.json")

@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    keyword = data.get("keyword")
    location = data.get("location")
    connection = data.get("connection")

    result = subprocess.run(
        ["node", "scraper.js", keyword, location, connection],
        capture_output=True, text=True
    )

    profiles = json.loads(result.stdout)
    filtered_profiles = []

    for profile in profiles:
        text = profile.get("about", "")
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=32)
        with torch.no_grad():
            output = bert(**inputs)
            embedding = torch.stack(output.hidden_states[-4:]).mean(0)[:, 0, :].numpy()

        dmatrix = xgb.DMatrix(embedding)
        pred = xgb_model.predict(dmatrix)
        match_score = float(pred[0]) * 100

        if match_score >= 90:
            profile["match"] = round(match_score, 2)
            filtered_profiles.append(profile)

    return jsonify(filtered_profiles)

if __name__ == "__main__":
    app.run(debug=True)
