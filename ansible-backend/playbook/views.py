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

from rest_framework.permissions import IsAuthenticated


import environ








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


import os
import platform
import subprocess
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import paramiko
from .serializers import PlaybookSerializer
from .models import PlaybookLog
from django.conf import settings

import os
import platform
import subprocess
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import paramiko
from .serializers import PlaybookSerializer
from .models import PlaybookLog
from django.conf import settings
from decouple import config


class RunPlaybook(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PlaybookSerializer(data=request.data)
        if serializer.is_valid():
            playbook_path = serializer.validated_data['playbook_path']
            selectedDomain = serializer.validated_data['selectedDomain']
            playbook_vars = request.data.get('variables', {})

            ssh_hostname = config('SSH_HOSTNAME')
            ssh_username = config('SSH_USERNAME')
            ssh_key_filename = config('SSH_KEY_FILENAME')

            playbook_dir = os.path.abspath(os.path.join(settings.BASE_DIR, '..', f'{selectedDomain}', 'playbooks', playbook_path))
            playbook_dir_windows = playbook_dir
            if platform.system() == 'Windows':
                playbook_dir = playbook_dir.replace('\\', '/')
                playbook_dir = playbook_dir.replace('C:', '/mnt/c')

            vars_string = " ".join([f'{key}="{val}"' for key, val in playbook_vars.items()])

            try:
                env = environ.Env()
                environ.Env.read_env()  # Reads the .env file
                ssh_client = paramiko.SSHClient()
                print(ssh_username)
                ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                ssh_client.connect(
                    ssh_hostname,
                    username=ssh_username,
                    key_filename=ssh_key_filename
                )
                print(playbook_path)
                print(playbook_dir_windows)
                print(playbook_dir)
                # Transfer playbook to remote machine if necessary
                sftp_client = ssh_client.open_sftp()
                remote_playbook_path = f"/home/ec2-user/{os.path.basename(playbook_path)}"
                sftp_client.put(playbook_dir_windows, remote_playbook_path)
                sftp_client.close()
                print(2)
                # Determine command based on operating system
                if platform.system() == 'Windows':
                    command = f"wsl ansible-playbook {remote_playbook_path}"
                else:
                    command = f"ansible-playbook {remote_playbook_path}"

                if vars_string:
                    command += f" --extra-vars \'{vars_string}\' "
                print(command)
                if playbook_dir_windows != playbook_dir:
                    stdin, stdout, stderr = ssh_client.exec_command(command[3:])
                else:
                    stdin, stdout, stderr = ssh_client.exec_command(command)
                result_stdout = stdout.read().decode()
                result_stderr = stderr.read().decode()
                return_code = stdout.channel.recv_exit_status()

                PlaybookLog.objects.create(
                    playbook_name=playbook_path,
                    output=result_stdout if return_code == 0 else result_stderr,
                    user=request.user  # Ajoutez l'utilisateur ici
                )

                ssh_client.close()

                if return_code == 0:
                    return Response({'output': result_stdout}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': result_stderr}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(e)
                return Response({'error': f"Failed to run playbook: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from .models import PlaybookLog
from .serializers import PlaybookLogSerializer , PlaybookLogNameSerializer

from rest_framework.pagination import PageNumberPagination

from .models import PlaybookLog
from .serializers import PlaybookLogNameSerializer

from rest_framework.permissions import AllowAny

class PlaybookLogPagination(PageNumberPagination):
    page_size = 10  

class PlaybookLogListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        logs = PlaybookLog.objects.all().order_by('-created_at')
        paginator = PlaybookLogPagination()
        paginated_logs = paginator.paginate_queryset(logs, request)
        serializer = PlaybookLogNameSerializer(paginated_logs, many=True)
        return paginator.get_paginated_response(serializer.data)



class PlaybookLogDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            log = PlaybookLog.objects.get(pk=pk)
            serializer = PlaybookLogSerializer(log)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PlaybookLog.DoesNotExist:
            return Response({'error': 'Log not found'}, status=status.HTTP_404_NOT_FOUND)



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print(request)
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'This is a protected endpoint'})
