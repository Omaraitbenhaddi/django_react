from django.db import models

class Password(models.Model):
    nom = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.nom


class PlaybookLog(models.Model):
    playbook_name = models.CharField(max_length=255)
    output = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.playbook_name
