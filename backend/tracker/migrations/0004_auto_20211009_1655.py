# Generated by Django 3.2.7 on 2021-10-09 19:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0003_delete_datexlsx'),
    ]

    operations = [
        migrations.AddField(
            model_name='hold',
            name='xlsx',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='trade',
            name='xlsx',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='tradeonhold',
            name='xlsx',
            field=models.BooleanField(default=True),
        ),
        migrations.DeleteModel(
            name='PendingTrade',
        ),
    ]
