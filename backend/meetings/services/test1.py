from transcription_service import TranscriptionService

# Initialise le service avec ton token Hugging Face
token = "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"  # à mettre dans .env en prod
service = TranscriptionService(hf_token=token)

# Traitement de l'audio
audio_path = "C:/Users/Lenovo/Desktop/PCDproject/backend/uploads/cov.mp3"

result = service.transcribe_with_speakers(audio_path)

# Sauvegarde
service.save_to_json(result, "output.json")
print(result)

