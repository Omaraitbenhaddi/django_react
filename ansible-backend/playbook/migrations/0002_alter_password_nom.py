# Generated by Django 5.0.6 on 2024-06-20 14:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playbook', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='password',
            name='nom',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
