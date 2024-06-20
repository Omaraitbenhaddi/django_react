from rest_framework import serializers
from .models import Password


class PlaybookSerializer(serializers.Serializer):
    playbook_path = serializers.CharField(max_length=255)
    selectedDomain = serializers.CharField(max_length=255)
    vaultPass = serializers.CharField(max_length=255, allow_blank=True, allow_null=True)

    



class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Password
        fields = ['nom', 'password']
