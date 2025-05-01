import requests
import json

def summarize_text_with_ollama(text, model="llama3.1"):
    """
    Résume un texte en utilisant Ollama localement.
    """
    url = "http://localhost:11434/api/chat"
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": f"Résume ce texte : {text}"}]
    }

    response = requests.post(url, json=payload, stream=True)
    summary = ""

    if response.status_code == 200:
        for line in response.iter_lines(decode_unicode=True):
            if line:
                try:
                    json_data = json.loads(line)
                    if "message" in json_data and "content" in json_data["message"]:
                        summary += json_data["message"]["content"]
                except json.JSONDecodeError:
                    print(f"Erreur de parsing JSON: {line}")
    else:
        print("Erreur Ollama:", response.status_code, response.text)

    return summary