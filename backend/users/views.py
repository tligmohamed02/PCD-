
# from rest_framework import viewsets, permissions
# from .models import User
# from .serializers import UserSerializer
# from .services.authentication_service import register_user, login_user

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [permissions.IsAuthenticated]

# # Authentification basique
# from rest_framework.decorators import api_view
# from rest_framework.response import Response

# @api_view(['POST'])
# def register(request):
#     return register_user(request)

# @api_view(['POST'])
# def login(request):
#     return login_user(request)
