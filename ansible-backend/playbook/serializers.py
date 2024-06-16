from rest_framework import serializers

class PlaybookSerializer(serializers.Serializer):
    playbook_path = serializers.CharField(max_length=255)
