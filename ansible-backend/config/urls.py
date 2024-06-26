"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from playbook.views import RunPlaybook
from playbook.views import get_variables, get_playbooks, get_domaine, RegisterView , LoginView, ProtectedView ,PlaybookLogListView, PlaybookLogDetailView 
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)




urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/run-playbook/', RunPlaybook.as_view(), name='run-playbook'),
    path('api/get-playbooks/<str:domaine>/', get_playbooks, name='get-playbooks'),
    path('api/get_variables/<str:domaine>/<str:playbook_name>/', get_variables, name='get_variables'),
    path('api/get_domaine/', get_domaine, name='get_domaine'),
    path('logs/', PlaybookLogListView.as_view(), name='playbook-log-list'),
    path('logs/<int:pk>/', PlaybookLogDetailView.as_view(), name='playbook-log-detail'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('protected/', ProtectedView.as_view(), name='protected'),


]

