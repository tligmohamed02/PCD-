from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .services.storage_service import save_audio_file
from .models import Reunion, Transcription, Summary
from .serializers import ReunionSerializer, TranscriptionSerializer, SummarySerializer
import datetime

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
#@permission_classes([IsAuthenticated])
def upload_audio(request):
    if 'audio' not in request.FILES:
        return Response({'error': 'Aucun fichier audio fourni.'}, status=400)

    uploaded_file = request.FILES['audio']
    title = request.data.get('title', 'Réunion sans titre')
    language = request.data.get('language', 'fr')

    # Sauvegarder le fichier sur le disque
    file_path = save_audio_file(uploaded_file)

    # Enregistrer une nouvelle réunion dans MongoDB
    reunion = Reunion.objects.create(
        title=title,
        date=datetime.datetime.now(),
        audio_file_path=file_path,
        language=language,
        user_id=request.user.id  # Relier la réunion au user connecté
    )

    return Response({'message': 'Fichier audio uploadé et réunion créée.', 'reunion_id': str(reunion.pk)}, status=201)