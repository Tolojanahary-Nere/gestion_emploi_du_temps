from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView, 
    TokenRefreshView, 
    TokenVerifyView
)
from .views import (
    ProfesseurListView, ProfesseurDetailView,
    DepartementListView, DepartementDetailView,
    ModuleListView, ModuleDetailView,
    NiveauListView, NiveauDetailView,
    SalleListView, SalleDetailView,
    EmploiDuTempsListView, EmploiDuTempsDetailView,
    ReservationListView, ReservationDetailView
)
from .views import ProfUserListView, ProfUserDetailView,StatisticsView
from . import views

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('ProfesseurList/', ProfesseurListView.as_view(), name='ProfesseurList'),
    path('professeurs/<int:pk>/', ProfesseurDetailView.as_view(), name='professeur-detail'),
    path('departements/', DepartementListView.as_view(), name='departement-list'),
    path('departements/<int:pk>/', DepartementDetailView.as_view(), name='departement-detail'),
    path('modules/', ModuleListView.as_view(), name='module-list'),
    path('modules/<int:pk>/', ModuleDetailView.as_view(), name='module-detail'),
    path('niveaux/', NiveauListView.as_view(), name='niveau-list'),
    path('niveaux/<int:pk>/', NiveauDetailView.as_view(), name='niveau-detail'),
    path('salles/', SalleListView.as_view(), name='salle-list'),
    path('salles/<int:pk>/', SalleDetailView.as_view(), name='salle-detail'),
    path('emplois-du-temps/', EmploiDuTempsListView.as_view(), name='emploi-du-temps-list'),
    path('emplois-du-temps/<int:pk>/', EmploiDuTempsDetailView.as_view(), name='emploi-du-temps-detail'),
    path('reservations/', ReservationListView.as_view(), name='reservation-list'),
    path('reservations/<int:pk>/', ReservationDetailView.as_view(), name='reservation-detail'),
    path('profusers/', ProfUserListView.as_view(), name='profuser-list'),
    path('profusers/<int:pk>/', ProfUserDetailView.as_view(), name='profuser-detail'),
    path('statistics/', StatisticsView.as_view(), name='statistics'),
    path('generate-image/', views.generate_emploi_image, name='generate_emploi_image'),
]
