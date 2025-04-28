from djongo import models
from django.contrib.auth import get_user_model

User = get_user_model()  # Utilisez votre modèle d'utilisateur personnalisé si nécessaire

class Reunion(models.Model):
    _id = models.ObjectIdField(primary_key=True)  # Clé primaire MongoDB
    title = models.CharField(max_length=255)
    date = models.DateTimeField()
    audio_file_path = models.CharField(max_length=500)
    language = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Clé étrangère
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Transcription(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    meeting = models.ForeignKey(Reunion, on_delete=models.CASCADE)  # Référence à Reunion
    text = models.TextField()
    confidence_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

class Summary(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    meeting = models.ForeignKey(Reunion, on_delete=models.CASCADE)
    summary_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    