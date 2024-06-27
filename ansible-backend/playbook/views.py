from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlaybookSerializer 
import subprocess
import platform
import os
import yaml
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view











def get_playbooks(request, domaine):
    if not domaine:
        return Response({'error': 'domaine is required'}, status=status.HTTP_400_BAD_REQUEST)
   
    playbooks_dir = os.path.abspath(os.path.join(settings.BASE_DIR, '..', f'{domaine}', 'playbooks'))
    try:
        if os.path.isdir(playbooks_dir):
            playbooks = [f for f in os.listdir(playbooks_dir) if f.endswith('.yml')]
            return JsonResponse(playbooks, safe=False)
        else:
            return JsonResponse({'error': 'Le répertoire des playbooks n\'existe pas'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



def get_domaine(request):
    playbooks_dir = os.path.abspath(os.path.join(settings.BASE_DIR, '..'))
    try:
        if os.path.isdir(playbooks_dir):
            playbooks = [f for f in os.listdir(playbooks_dir) if f.startswith('playbooks')]
            return JsonResponse(playbooks, safe=False)
        else:
            return JsonResponse({'error': 'Le répertoire des playbooks n\'existe pas'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@api_view(['GET'])
def get_variables(request, domaine, playbook_name):
    if not playbook_name:
        return Response({'error': 'playbook_name is required'}, status=status.HTTP_400_BAD_REQUEST)
   
    vars_path =os.path.abspath(os.path.join(settings.BASE_DIR, '..', f'{domaine}', 'var', f'{playbook_name}_vars.yml'))
    try:
        with open(vars_path, 'r') as file:
            variables = yaml.safe_load(file) or {}
        return JsonResponse(variables)
    except FileNotFoundError:
        return JsonResponse({'error': f' {playbook_name}_vars.yml file not found'}, status=404)
    except yaml.YAMLError as e:
        return JsonResponse({'error': str(e)}, status=500)









import os
import platform
import subprocess


from .models import PlaybookLog

class RunPlaybook(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PlaybookSerializer(data=request.data)
        if serializer.is_valid():
            playbook_path = serializer.validated_data['playbook_path']
            selectedDomain = serializer.validated_data['selectedDomain']
            playbook_vars = request.data.get('variables', {})
            playbook_dir = os.path.abspath(os.path.join(settings.BASE_DIR, '..', f'{selectedDomain}', 'playbooks', playbook_path))

            if platform.system() == 'Windows':
                playbook_dir = playbook_dir.replace('\\', '/')
                playbook_dir = playbook_dir.replace('C:', '/mnt/c')
            
            vars_string = " ".join([f"{key}='{val}'" for key, val in playbook_vars.items()])

            try:
                if platform.system() == 'Windows':
                    command = ['wsl', 'ansible-playbook', playbook_dir]
                else:
                    command = ['ansible-playbook', playbook_dir]

                if vars_string:
                    command.extend(['--extra-vars', vars_string])

                result = subprocess.run(command, capture_output=True, text=True)

                PlaybookLog.objects.create(
                    playbook_name=playbook_path,
                    output=result.stdout if result.returncode == 0 else result.stderr
                )

                if result.returncode == 0:
                    return Response({'output': result.stdout}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': result.stderr}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': f"Failed to run playbook: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




from .models import PlaybookLog
from .serializers import PlaybookLogSerializer , PlaybookLogNameSerializer

from rest_framework.pagination import PageNumberPagination

from .models import PlaybookLog
from .serializers import PlaybookLogNameSerializer


class PlaybookLogPagination(PageNumberPagination):
    page_size = 10  

class PlaybookLogListView(APIView):
    def get(self, request):
        logs = PlaybookLog.objects.all().order_by('-created_at')
        paginator = PlaybookLogPagination()
        paginated_logs = paginator.paginate_queryset(logs, request)
        serializer = PlaybookLogNameSerializer(paginated_logs, many=True)
        return paginator.get_paginated_response(serializer.data)



class PlaybookLogDetailView(APIView):
    def get(self, request, pk):
        try:
            log = PlaybookLog.objects.get(pk=pk)
            serializer = PlaybookLogSerializer(log)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PlaybookLog.DoesNotExist:
            return Response({'error': 'Log not found'}, status=status.HTTP_404_NOT_FOUND)
