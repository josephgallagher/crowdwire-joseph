# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('latitude', models.DecimalField(default=0.0, max_digits=17, decimal_places=14)),
                ('longitude', models.DecimalField(default=0.0, max_digits=17, decimal_places=14)),
                ('picture', models.ImageField(null=True, upload_to=b'photos', blank=True)),
                ('caption', models.CharField(max_length=300, blank=True)),
                ('submitted_date_time', models.DateTimeField(default=django.utils.timezone.now, verbose_name=b'date submitted')),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=30)),
            ],
        ),
        migrations.AddField(
            model_name='event',
            name='tags',
            field=models.ManyToManyField(to='crowdwire.Tag'),
        ),
    ]
