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
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}

    def create(self, validated_data):
        title = validated_data.get('title')
        content = validated_data.get('content')
        
        encrypted_title = cipher_suite.encrypt(title.encode())
        encrypted_content = cipher_suite.encrypt(content.encode())

        print("Title after encryption:", encrypted_title.decode())
        print("Content after encryption:", encrypted_content.decode())

        validated_data['title'] = encrypted_title.decode()
        validated_data['content'] = encrypted_content.decode()

        return super().create(validated_data)
    
    def to_representation(self, instance):
        decrypted_title = cipher_suite.decrypt(instance.title.encode()).decode()
        decrypted_content = cipher_suite.decrypt(instance.content.encode()).decode()

        representation = super().to_representation(instance)
        representation['title'] = decrypted_title
        representation['content'] = decrypted_content

        return representation

    def update(self, instance, validated_data):
        title = validated_data.get('title', instance.title)
        content = validated_data.get('content', instance.content)
        
        if title != instance.title:
            encrypted_title = cipher_suite.encrypt(title.encode()).decode()
            instance.title = encrypted_title
        if content != instance.content:
            encrypted_content = cipher_suite.encrypt(content.encode()).decode()
            instance.content = encrypted_content

        instance.save()
        return instance

   