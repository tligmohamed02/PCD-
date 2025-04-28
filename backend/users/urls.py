from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UtilisateurViewSet, register, login

router = DefaultRouter()
router.register(r'users', UtilisateurViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
]
