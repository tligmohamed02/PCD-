from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReunionViewSet, TranscriptionViewSet, SummaryViewSet, upload_audio,user_reunions,transcribe_and_summarize
from .views import get_summary_for_reunion

router = DefaultRouter()
router.register(r'reunions', ReunionViewSet)
router.register(r'transcriptions', TranscriptionViewSet)
router.register(r'summaries', SummaryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload-audio/', upload_audio, name='upload-audio'),
    path('user-reunions/', user_reunions, name='user-reunions'),
    path('process/<str:reunion_id>/', transcribe_and_summarize, name='transcribe_and_summarize'),
    path('reunions/<str:reunion_id>/summary/', get_summary_for_reunion, name='get_summary'),

]
