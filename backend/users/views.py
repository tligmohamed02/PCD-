
from rest_framework import viewsets, permissions
from .models import Utilisateur
from .serializers import UtilisateurSerializer
from .services.authentication_service import register_user, login_user

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [permissions.IsAuthenticated]

# Authentification basique
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def register(request):
    return register_user(request)

@api_view(['POST'])
def login(request):
    return login_user(request)
