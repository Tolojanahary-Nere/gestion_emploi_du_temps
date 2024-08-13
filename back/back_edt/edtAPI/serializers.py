from rest_framework import serializers
from .models import Professeur, Departement, Module, Niveau, Salle, EmploiDuTemps, Reservation
from .models import ProfUser
class ProfesseurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professeur
        fields = '__all__'

class DepartementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departement
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    nomProfesseur = serializers.CharField(source='professeur.nom', read_only=True)
    nomDepartement = serializers.CharField(source='departement.nomDepartement', read_only=True)

    class Meta:
        model = Module
        fields = '__all__'

class NiveauSerializer(serializers.ModelSerializer):
    nomDepartement = serializers.CharField(source='departement.nomDepartement', read_only=True)

    class Meta:
        model = Niveau
        fields = '__all__'

class SalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salle
        fields = '__all__'

class EmploiDuTempsSerializer(serializers.ModelSerializer):
    nomModule = serializers.CharField(source='module.nomModule', read_only=True)
    nomNiveau = serializers.CharField(source='niveau.nomNiveau', read_only=True)
    nomProfesseur = serializers.CharField(source='professeur.nom', read_only=True)
    nomSalle = serializers.CharField(source='salle.nomSalle', read_only=True)

    class Meta:
        model = EmploiDuTemps
        fields = '__all__'



class ProfUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfUser
        fields = '__all__'


class ReservationSerializer(serializers.ModelSerializer):
    nomSalle = serializers.CharField(source='salle.nomSalle', read_only=True)
    detailsEmploiDuTemps = serializers.CharField(source='emploi_du_temps.__str__', read_only=True)

    class Meta:
        model = Reservation
        fields = '__all__'
