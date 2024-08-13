from rest_framework import generics
from .models import Professeur, Departement, Module, Niveau, Salle, EmploiDuTemps, Reservation
from .serializers import ProfesseurSerializer, DepartementSerializer, ModuleSerializer, NiveauSerializer, SalleSerializer, EmploiDuTempsSerializer, ReservationSerializer
from .models import ProfUser
from .serializers import ProfUserSerializer
from django.views import View
from django.http import JsonResponse

from django.shortcuts import render
from django.http import HttpResponse
from .models import EmploiDuTemps
from PIL import Image, ImageDraw, ImageFont
import io


class StatisticsView(View):
    def get(self, request, *args, **kwargs):
        # Récupérer le nombre de chaque élément
        nombre_professeurs = Professeur.objects.count()
        nombre_salles = Salle.objects.count()
        nombre_reservations = Reservation.objects.count()
        nombre_modules = Module.objects.count()

        data = {
            'nombre_professeurs': nombre_professeurs,
            'nombre_salles': nombre_salles,
            'nombre_reservations': nombre_reservations,
            'nombre_modules': nombre_modules,
        }

        return JsonResponse(data)

class ProfUserListView(generics.ListCreateAPIView):
    serializer_class = ProfUserSerializer
    queryset = ProfUser.objects.all()

class ProfUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfUserSerializer
    queryset = ProfUser.objects.all()

class ProfesseurListView(generics.ListCreateAPIView):
    serializer_class = ProfesseurSerializer
    queryset = Professeur.objects.all()

class ProfesseurDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfesseurSerializer
    queryset = Professeur.objects.all()

class DepartementListView(generics.ListCreateAPIView):
    serializer_class = DepartementSerializer
    queryset = Departement.objects.all()

class DepartementDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DepartementSerializer
    queryset = Departement.objects.all()

class ModuleListView(generics.ListCreateAPIView):
    serializer_class = ModuleSerializer
    queryset = Module.objects.all()

class ModuleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ModuleSerializer
    queryset = Module.objects.all()

class NiveauListView(generics.ListCreateAPIView):
    serializer_class = NiveauSerializer
    queryset = Niveau.objects.all()

class NiveauDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NiveauSerializer
    queryset = Niveau.objects.all()

class SalleListView(generics.ListCreateAPIView):
    serializer_class = SalleSerializer
    queryset = Salle.objects.all()

class SalleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SalleSerializer
    queryset = Salle.objects.all()

class EmploiDuTempsListView(generics.ListCreateAPIView):
    serializer_class = EmploiDuTempsSerializer
    queryset = EmploiDuTemps.objects.all()

class EmploiDuTempsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmploiDuTempsSerializer
    queryset = EmploiDuTemps.objects.all()

class ReservationListView(generics.ListCreateAPIView):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()

class ReservationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()


from PIL import Image, ImageDraw, ImageFont
import io
from django.http import HttpResponse

def generate_emploi_image(request):
    emplois = EmploiDuTemps.objects.all()

    # Dimensions de l'image
    width, height = 800, 600
    # Marges et espacement
    margin = 50
    row_height = 30
    col_widths = [150, 150, 200, 200]

    # Créer une image blanche
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)

    # Définir une police
    try:
        font = ImageFont.truetype("arial.ttf", 15)
    except IOError:
        font = ImageFont.load_default()

    # Fonction pour obtenir la taille du texte
    def get_text_size(text):
        bbox = draw.textbbox((0, 0), text, font=font)
        return bbox[2] - bbox[0], bbox[3] - bbox[1]

    # Titre
    title = "Emploi du Temps"
    title_width, title_height = get_text_size(title)
    draw.text((width // 2 - title_width // 2, margin // 2), title, font=font, fill=(0, 0, 0))

    # En-têtes du tableau
    headers = ["Date", "Heure", "Algorithme", "Niveau"]
    y_text = margin

    # Dessiner les en-têtes
    for i, header in enumerate(headers):
        header_width, header_height = get_text_size(header)
        draw.text((margin + sum(col_widths[:i]), y_text), header, font=font, fill=(0, 0, 0))

    # Dessiner les lignes du tableau
    y_text += row_height
    for emploi in emplois:
        # Dessiner les cellules du tableau
        cells = [
            emploi.jour,
            f"{emploi.heure_debut} - {emploi.heure_fin}",
            emploi.module.nomModule,
            emploi.niveau.nomNiveau
        ]
        for i, cell in enumerate(cells):
            cell_width, cell_height = get_text_size(cell)
            draw.text((margin + sum(col_widths[:i]), y_text), cell, font=font, fill=(0, 0, 0))
        y_text += row_height

    # Sauvegarder l'image dans un objet BytesIO
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)

    return HttpResponse(buffer, content_type='image/png')
