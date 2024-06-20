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





class RunPlaybook(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PlaybookSerializer(data=request.data)
        if serializer.is_valid():
            playbook_path = serializer.validated_data['playbook_path']
            selectedDomain = serializer.validated_data['selectedDomain']
            playbook_vars = request.data.get('variables', {})
            playbook_dir = os.path.abspath(os.path.join(settings.BASE_DIR, '..', f'{selectedDomain}', 'playbooks', playbook_path))
            
            # For Windows WSL, the path needs to be converted to WSL format
            if platform.system() == 'Windows':
                # Convert the Windows path to WSL path
                playbook_dir = playbook_dir.replace('\\', '/')
                playbook_dir = playbook_dir.replace('C:', '/mnt/c')
            
            vars = " ".join([f"{key}='{val}'" for key, val in playbook_vars.items()])
            try:
                if platform.system() == 'Windows':
                    if vars != {} :
                        command = ['wsl', 'ansible-playbook', playbook_dir]
                    else:
                        command = ['wsl', 'ansible-playbook', playbook_dir, '--extra-vars', vars]
                else:
                    if vars != {} :
                        command = ['ansible-playbook', playbook_dir]
                    else:
                       command = ['ansible-playbook', playbook_dir, '--extra-vars', vars]
                
                print(f"Running command: {' '.join(command)}")
                result = subprocess.run(command, capture_output=True, text=True)
                
                if result.returncode == 0:
                    return Response({'output': result.stdout}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': result.stderr}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': f"Failed to run playbook: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)