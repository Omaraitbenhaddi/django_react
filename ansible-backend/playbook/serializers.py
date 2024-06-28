from rest_framework import serializers
from .models import PlaybookLog
from django.contrib.auth.models import User


class PlaybookSerializer(serializers.Serializer):
    playbook_path = serializers.CharField(max_length=255)
    selectedDomain = serializers.CharField(max_length=255)

    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']





class PlaybookLogNameSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = PlaybookLog
        fields = ['playbook_name', 'created_at', 'id','user']


class PlaybookLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = PlaybookLog
        fields = '__all__'
