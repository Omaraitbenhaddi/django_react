# Generated by Django 5.0.6 on 2024-06-27 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('playbook', '0002_alter_password_nom'),
    ]

    operations = [
        migrations.CreateModel(
            name='PlaybookLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('playbook_name', models.CharField(max_length=255)),
                ('output', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
