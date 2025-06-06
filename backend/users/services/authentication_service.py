from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from ..models import User

def register_user(request):
    data = request.data
    if User.objects.filter(email=data['email']).exists():
        return Response({'error': 'Email déjà utilisé'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create(
        username=data['username'],
        email=data['email'],
        password_hash=make_password(data['password']),
        role='user'
    )
    return Response({'message': 'Utilisateur créé avec succès'}, status=status.HTTP_201_CREATED)

# def login_user(request):
#     data = request.data
#     try:
#         user = User.objects.get(email=data['email'])
#         if check_password(data['password'], user.password_hash):
#             # Normalement ici tu devrais générer un vrai Token JWT
#             return Response({'message': 'Connexion réussie', 'user_id': str(user.id)}, status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)
#     except User.DoesNotExist:
#         return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from ..models import User

def login_user(request):
    data = request.data
    try:
        user = User.objects.get(email=data['email'])
        if check_password(data['password'], user.password_hash):
            return Response({
                'message': 'Connexion réussie',
                'user_id': str(user.id),
                'role': user.role  # Ajout du rôle ici
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Mot de passe incorrect'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)
