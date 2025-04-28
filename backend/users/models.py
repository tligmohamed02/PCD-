#from django.db import models

# Create your models here.

from djongo import models

class Utilisateur(models.Model):
    id = models.ObjectIdField(primary_key=True)
    username = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=[('user', 'User'), ('admin', 'Admin')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
