from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .services.transcription_service import TranscriptionService
from .services.summarization_service import summarize_text_with_ollama
from rest_framework.response import Response
from .services.storage_service import save_audio_file
from .models import Reunion, Transcription, Summary
from .serializers import ReunionSerializer, TranscriptionSerializer, SummarySerializer
from django.shortcuts import get_object_or_404
import datetime
from bson import ObjectId
from django.db import models

class ReunionViewSet(viewsets.ModelViewSet):
    queryset = Reunion.objects.all()
    serializer_class = ReunionSerializer
    permission_classes = [permissions.IsAuthenticated]


class TranscriptionViewSet(viewsets.ModelViewSet):
    queryset = Transcription.objects.all()
    serializer_class = TranscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

class SummaryViewSet(viewsets.ModelViewSet):
    queryset = Summary.objects.all()
    serializer_class = SummarySerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_audio(request):
    if 'audio' not in request.FILES:
        return Response({'error': 'Aucun fichier audio fourni.'}, status=400)

    uploaded_file = request.FILES['audio']
    title = request.data.get('title', 'Réunion sans titre')
    language = request.data.get('language', 'fr')

    # Sauvegarder le fichier sur le disque
    file_path = save_audio_file(uploaded_file)

    type_ = request.data.get('type', 'public')  # par défaut public

    reunion = Reunion.objects.create(
        title=title,
        date=datetime.datetime.now(),
        audio_file_path=file_path,
        language=language,
        user_id=request.user.id,
        type=type_
    )

    return Response({'message': 'Fichier audio uploadé et réunion créée.', 'reunion_id': str(reunion.pk)}, status=201)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_reunions(request):
    user = request.user

    if user.role == 'admin':
        # Admins/RH/CEO voient toutes les réunions
        reunions = Reunion.objects.all().order_by('-date')
    else:
        # Employés voient seulement les réunions publiques 
        reunions = Reunion.objects.filter(models.Q(type='public')).order_by('-date')

    serializer = ReunionSerializer(reunions, many=True)
    return Response(serializer.data)



transcriber = TranscriptionService(hf_token="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")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def transcribe_and_summarize(request, reunion_id):
    
    reunion = get_object_or_404(Reunion, pk=ObjectId(reunion_id))

    
    try:
        diarized_transcript = transcriber.transcribe_with_speakers(reunion.audio_file_path)
    except Exception as e:
        return Response({'error': f'Erreur transcription: {str(e)}'}, status=500)

   
    full_text = "\n".join(
        [f"[{seg['speaker']} - {seg['start']}s→{seg['end']}s] {seg['text']}" for seg in diarized_transcript]
    )

    
    transcription = Transcription.objects.create(
        meeting=reunion,
        text=full_text,
        confidence_score=0.95,  # (à ajuster dynamiquement si dispo)
        created_at=datetime.datetime.now()
    )

   
    try:
        summary_text = summarize_text_with_ollama(full_text)
    except Exception as e:
        return Response({'error': f'Erreur de summarization: {str(e)}'}, status=500)

    
    summary = Summary.objects.create(
        meeting=reunion,
        summary_text=summary_text,
        created_at=datetime.datetime.now()
    )

    return Response({
        'message': 'Transcription et résumé enregistrés.',
        'transcription_id': str(transcription.pk),
        'summary_id': str(summary.pk)
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_summary_for_reunion(request, reunion_id):
    try:
        reunion = Reunion.objects.get(pk=ObjectId(reunion_id))
        summary = Summary.objects.filter(meeting=reunion).latest('created_at')

        return Response({
            "title": reunion.title,
            "date": reunion.date,
            "language": reunion.language,
            "summary_text": summary.summary_text
        })

    except Reunion.DoesNotExist:
        return Response({"error": "Réunion introuvable."}, status=404)
    except Summary.DoesNotExist:
        return Response({"error": "Aucun résumé trouvé."}, status=404)

