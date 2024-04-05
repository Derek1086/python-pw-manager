# serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from cryptography.fernet import Fernet
from .models import Note
import os
from dotenv import load_dotenv

load_dotenv()

static_key = os.getenv("STATIC_KEY")
if static_key is None:
    raise EnvironmentError("STATIC_KEY not found in .env file")

cipher_suite = Fernet(static_key)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "website", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        website = validated_data.pop('website') 
        title = validated_data.get('title')
        content = validated_data.get('content')
        
        encrypted_website = cipher_suite.encrypt(website.encode())
        encrypted_title = cipher_suite.encrypt(title.encode())
        encrypted_content = cipher_suite.encrypt(content.encode())

        validated_data['website'] = encrypted_website.decode()
        validated_data['title'] = encrypted_title.decode()
        validated_data['content'] = encrypted_content.decode()

        return super().create(validated_data)
    
    def to_representation(self, instance):
        decrypted_website = cipher_suite.decrypt(instance.website.encode()).decode()
        decrypted_title = cipher_suite.decrypt(instance.title.encode()).decode()
        decrypted_content = cipher_suite.decrypt(instance.content.encode()).decode()

        representation = super().to_representation(instance)
        representation['website'] = decrypted_website
        representation['title'] = decrypted_title
        representation['content'] = decrypted_content

        return representation

    def update(self, instance, validated_data):
        website = validated_data.pop('website', instance.website) 
        title = validated_data.get('title', instance.title)
        content = validated_data.get('content', instance.content)
        
        if website != instance.website:
            encrypted_website = cipher_suite.encrypt(website.encode()).decode()
            instance.website = encrypted_website
        if title != instance.title:
            encrypted_title = cipher_suite.encrypt(title.encode()).decode()
            instance.title = encrypted_title
        if content != instance.content:
            encrypted_content = cipher_suite.encrypt(content.encode()).decode()
            instance.content = encrypted_content

        instance.save()
        return instance
