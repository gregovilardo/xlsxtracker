# Generated by Django 3.2.7 on 2021-10-09 15:18

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TradeOnHold',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pair', models.CharField(default='error', max_length=16)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('price', models.FloatField(default=0, max_length=20)),
                ('ammount', models.FloatField(default=0, max_length=20)),
                ('total', models.FloatField(default=0, max_length=20)),
                ('profit_loss', models.FloatField(default=0, max_length=20)),
                ('percentage', models.FloatField(default=0, max_length=20)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trades_on_hold', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Trade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pair', models.CharField(default='error', max_length=16)),
                ('start', models.DateTimeField(default=datetime.datetime.now)),
                ('end', models.DateTimeField(default=datetime.datetime.now)),
                ('profit_loss', models.FloatField(default=0, max_length=20)),
                ('percentage', models.FloatField(default=0, max_length=20)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trades', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Hold',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pair', models.CharField(default='error', max_length=16)),
                ('holding', models.FloatField(default=0, max_length=20)),
                ('start_date', models.DateTimeField(default=datetime.datetime.now)),
                ('start_price', models.FloatField(default=0, max_length=20)),
                ('start_total', models.FloatField(default=0, max_length=20)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='holds', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='DateXLSX',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_date', models.DateTimeField(default=datetime.datetime.now)),
                ('last_date', models.DateTimeField(default=datetime.datetime.now)),
                ('owner', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='date_xlsx', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
