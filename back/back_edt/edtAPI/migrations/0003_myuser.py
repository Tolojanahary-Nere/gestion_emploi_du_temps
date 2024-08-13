# Generated by Django 5.0 on 2024-08-05 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('edtAPI', '0002_departement_salle_alter_professeur_contact_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='MyUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(max_length=150, unique=True)),
                ('password', models.CharField(max_length=128)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
