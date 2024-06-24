from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PlaybookSerializer , PasswordSerializer
import subprocess
import platform
import os
import yaml
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password

from django.contrib.auth.hashers import make_password
from .models import Password






from rest_framework.response import Response

from cryptography.fernet import Fernet
key = b'V2h4YZl5NlJhWD4yQk1VQUNERFBQU1lhb3lOamE9PQo='
cipher_suite = Fernet(key)

class AddPasswordView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordSerializer(data=request.data)
        if serializer.is_valid():
            raw_password = serializer.validated_data['password'].encode()  # Convertir en bytes
            encrypted_password = cipher_suite.encrypt(raw_password).decode()  # Chiffrer et convertir en string
            password_instance = Password(nom=serializer.validated_data['nom'], password=encrypted_password)
            password_instance.save()
            return Response({'message': 'Password added successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)








@api_view(['GET'])
def getSecrets(request, nom):
    try:
        password = Password.objects.get(nom=nom)
        encrypted_password = password.password.encode()  
        decrypted_password = cipher_suite.decrypt(encrypted_password).decode()  
        return Response({'password': decrypted_password}, status=status.HTTP_200_OK)
    except Password.DoesNotExist:
        return Response({'error': 'Password not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    








@api_view(['GET'])
def getAllSecrets(request):
    try:
        passwords = Password.objects.all().values_list('nom', flat=True)
        return Response({'passwords': list(passwords)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    









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
import tempfile













class RunPlaybook(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PlaybookSerializer(data=request.data)
        if serializer.is_valid():
            playbook_path = serializer.validated_data['playbook_path']
            selectedDomain = serializer.validated_data['selectedDomain']
            vaultPass = serializer.validated_data.get('vaultPass', None)
            playbook_vars = request.data.get('variables', {})
            playbook_dir = os.path.abspath(os.path.join(settings.BASE_DIR, '..', f'{selectedDomain}', 'playbooks', playbook_path))

            # For Windows WSL, the path needs to be converted to WSL format
            if platform.system() == 'Windows':
                # Convert the Windows path to WSL path
                playbook_dir = playbook_dir.replace('\\', '/')
                playbook_dir = playbook_dir.replace('C:', '/mnt/c')
                        # Check for any variable containing 'password' and replace with the decrypted value
            print(vaultPass)
            for key in playbook_vars:
                if 'password' in key.lower():
                    try:
                        
                        password_record = Password.objects.get(nom=vaultPass)
                        encrypted_password = password_record.password.encode()
                        decrypted_password = cipher_suite.decrypt(encrypted_password).decode()
                        playbook_vars[key] = decrypted_password
                    except Password.DoesNotExist:
                        return Response({'error': f'Password for {key} not found in database'}, status=status.HTTP_404_NOT_FOUND)
                    except Exception as e:
                        return Response({'error': f"Failed to run playbook: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            vars_string = " ".join([f"{key}='{val}'" for key, val in playbook_vars.items()])

            try:
                if platform.system() == 'Windows':
                    command = ['wsl', 'ansible-playbook', playbook_dir]
                else:
                    command = ['ansible-playbook', playbook_dir]

                if vars_string:
                    command.extend(['--extra-vars', vars_string])

                # Check if the playbook should be run with a vault password
                if vaultPass:
                    try:
                        password = Password.objects.get(nom=vaultPass)
                        encrypted_password = password.password.encode()
                        decrypted_password = cipher_suite.decrypt(encrypted_password).decode()
                    except Password.DoesNotExist:
                        if not decrypted_password:
                            return Response({'error': 'Vault password not found in database or key vault'}, status=status.HTTP_404_NOT_FOUND)

                print(f"Running command: {' '.join(command)}")
                result = subprocess.run(command, capture_output=True, text=True)

                if result.returncode == 0:
                    return Response({'output': result.stdout}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': result.stderr}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': f"Failed to run playbook: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)