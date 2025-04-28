from djongo import models

class Reunion(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateTimeField()
    audio_file_path = models.CharField(max_length=500)
    language = models.CharField(max_length=50)
    user_id = models.ObjectIdField()  # Référence vers l'utilisateur
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Transcription(models.Model):
    meeting_id = models.ObjectIdField()  # Référence vers Reunion
    text = models.TextField()
    confidence_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

class Summary(models.Model):
    meeting_id = models.ObjectIdField()  # Référence vers Reunion
    summary_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

