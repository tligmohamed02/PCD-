from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReunionViewSet, TranscriptionViewSet, SummaryViewSet, upload_audio,user_reunions

router = DefaultRouter()
router.register(r'reunions', ReunionViewSet)
router.register(r'transcriptions', TranscriptionViewSet)
router.register(r'summaries', SummaryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload-audio/', upload_audio, name='upload-audio'),
    path('user-reunions/', user_reunions, name='user-reunions'),
]
