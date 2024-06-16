# playbook/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlaybookSerializer
import subprocess

class RunPlaybook(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PlaybookSerializer(data=request.data)
        if serializer.is_valid():
            playbook_path = serializer.validated_data['playbook_path']
            try:
                result = subprocess.run(['ansible-playbook', playbook_path], capture_output=True, text=True)
                if result.returncode == 0:
                    return Response({'output': result.stdout}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': result.stderr}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
