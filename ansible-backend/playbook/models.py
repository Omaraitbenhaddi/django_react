from django.db import models

class Password(models.Model):
    nom = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.nom
