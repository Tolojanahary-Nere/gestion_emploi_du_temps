from django.db import models
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

class Professeur(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    contact = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.nom} {self.prenom}"


class ProfUser(models.Model):
    id = models.AutoField(primary_key=True)
    nom_user = models.CharField(max_length=50)
    prenom_user = models.CharField(max_length=50)
    passmot = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.nom_user} {self.passmot}"

class Departement(models.Model):
    nomDepartement = models.CharField(max_length=20)

    def __str__(self):
        return self.nomDepartement

class Module(models.Model):
    nomModule = models.CharField(max_length=20)
    code = models.CharField(max_length=10, unique=True)
    departement = models.ForeignKey(Departement, on_delete=models.CASCADE)
    professeur = models.ForeignKey(Professeur, on_delete=models.CASCADE)

    def __str__(self):
        return self.nomModule

class Niveau(models.Model):
    nomNiveau = models.CharField(max_length=20)
    departement = models.ForeignKey(Departement, on_delete=models.CASCADE)

    def __str__(self):
        return self.nomNiveau

class Salle(models.Model):
    nomSalle = models.CharField(max_length=50)
    batiment = models.CharField(max_length=50)
    lieu = models.CharField(max_length=50)
    est_libre = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nomSalle} ({self.lieu})"

class EmploiDuTemps(models.Model):
    jour = models.CharField(max_length=10)  # Par exemple, 'Lundi'
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    niveau = models.ForeignKey(Niveau, on_delete=models.CASCADE)
    professeur = models.ForeignKey(Professeur, on_delete=models.CASCADE)
    salle = models.ForeignKey(Salle, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['jour']),
            models.Index(fields=['heure_debut']),
            models.Index(fields=['heure_fin']),
        ]

    def clean(self):
        if self.heure_debut >= self.heure_fin:
            raise ValidationError("L'heure de début doit être antérieure à l'heure de fin.")

    def __str__(self):
        return f"{self.jour} {self.heure_debut} - {self.heure_fin}: {self.module.nomModule} ({self.niveau.nomNiveau})"

class Reservation(models.Model):
    salle = models.ForeignKey(Salle, on_delete=models.CASCADE)
    emploi_du_temps = models.ForeignKey(EmploiDuTemps, on_delete=models.CASCADE)
    date = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()

    class Meta:
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['salle']),
            models.Index(fields=['heure_debut']),
            models.Index(fields=['heure_fin']),
        ]

    def clean(self):
        # Vérifie les chevauchements d'emplois du temps pour la même salle
        reservations = Reservation.objects.filter(
            salle=self.salle,
            date=self.date
        )
        for reservation in reservations:
            if (
                (self.heure_debut < reservation.heure_fin and
                 self.heure_fin > reservation.heure_debut)
            ):
                raise ValidationError("La salle est déjà réservée pendant cette période.")

    def __str__(self):
        return f"Réservation pour {self.salle.nomSalle} le {self.date} de {self.heure_debut} à {self.heure_fin}"

@receiver(post_save, sender=Reservation)
def reserver_salle(sender, instance, **kwargs):
    instance.salle.est_libre = False
    instance.salle.save()

@receiver(post_delete, sender=Reservation)
def liberer_salle(sender, instance, **kwargs):
    if not Reservation.objects.filter(salle=instance.salle).exists():
        instance.salle.est_libre = True
        instance.salle.save()
