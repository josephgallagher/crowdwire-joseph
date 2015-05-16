from datetime import datetime

from rest_framework import serializers

from models import *


class Base64ImageField(serializers.ImageField):
    """
    A Django REST framework field for handling image-uploads through raw post data.
    It uses base64 for encoding and decoding the contents of the file.

    Heavily based on
    https://github.com/tomchristie/django-rest-framework/pull/1268

    Updated for Django REST framework 3.
    """

    def to_internal_value(self, data):
        from django.core.files.base import ContentFile
        import base64
        import six
        import uuid

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:  # Break out the header from the base64 content
                header, data = data.split(';base64,')

                # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

                # Generate file name:
            file_name = str(uuid.uuid4())[:12]  # 12 characters are more than enough.  # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension, )

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


"""
 Create the serializer for Tags. The Meta class is inheriting from serializers.ModelSerializer, and adding
 a model to it (It's basically saying "serialize the Tag model in addition to whatever else you're doing").
  """


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag


"""
 Create the serializer for Events. The Meta class is inheriting from serializers.ModelSerializer, and adding
 a model to it (It's basically saying "serialize the Event model in addition to whatever else you're doing").
 The tags attribute is necessary so that each serialized event has serialized tags within it. The picture data
 is serialized via theBase64ImageField above, and the submitted_dat_time here is cast to the current datetime.
  """


class EventSerializer(serializers.ModelSerializer):
    tags = TagsSerializer(many=True)
    picture = Base64ImageField(max_length=None, use_url=True)  # So that we don't get an encoding error
    submitted_date_time = datetime.now()

    class Meta:
        model = Event

    """
    CRUD functionality for the serialized data
    """
    def create(self, validated_data):
        hashtags = validated_data.pop('tags')
        event = Event.objects.create(**validated_data)
        for tag in hashtags:
            tag, created = Tag.objects.get_or_create(name=tag['name'])
            event.tags.add(tag)
        return event

    # def update(self, instance, validated_data):
    #     hashtags = validated_data.pop('tags')
    #     instance.name = validated_data.get('name', instance.name)  # Basically, rename the tag name
    #     instance.caption = validated_data.get('caption', instance.caption)
    #     instance.location = validated_data.get('location', instance.location)
    #     instance.picture = validated_data.get('picture', instance.picture)
    #
    #     tags_list = []
    #     for tag in hashtags:
    #         tag, created = Tag.objects.get_or_create(name=tag["name"])
    #         # Try to get tag object from DB...if it doesn't exist, create it and append it to the tag list
    #         tags_list.append(tag)
    #     instance.tags = tags_list
    #     instance.save()
    #     return instance