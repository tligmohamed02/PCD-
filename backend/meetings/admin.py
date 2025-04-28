from django.contrib import admin
from .models import Reunion, Transcription, Summary

@admin.register(Reunion)
class ReunionAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'language')

@admin.register(Transcription)
class TranscriptionAdmin(admin.ModelAdmin):
    list_display = ('meeting_id', 'confidence_score', 'created_at')

@admin.register(Summary)
class SummaryAdmin(admin.ModelAdmin):
    list_display = ('meeting_id', 'created_at')
