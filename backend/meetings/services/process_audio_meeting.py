from datetime import datetime
import os
from .transcription_service import TranscriptionService
from .summarization_service import summarize_text_with_ollama
from ..models import Reunion, Transcription, Summary


def process_meeting(file_path: str, title: str, language: str,reunion1 : Reunion):
    HF_TOKEN = os.getenv('HF_TOKEN')

    ts = TranscriptionService(HF_TOKEN)  
    segments = ts.transcribe_with_speakers(file_path)

    full_transcript = " ".join([seg["text"] for seg in segments])

    
    summary = summarize_text_with_ollama(full_transcript)


    Transcription.objects.create(
        meeting=reunion1._id,
        text=full_transcript,
        confidence_score=1.0  
    )

    Summary.objects.create(
        meeting=reunion1._id,
        summary_text=summary
    )

    return {"reunion_id": str(reunion1._id), "summary": summary}
