from rest_framework import serializers
from .models import Vendor, VendorCategory
from accounts.serializers import UserSerializer

class VendorCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorCategory
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    category_details = VendorCategorySerializer(source='category', read_only=True)

    class Meta:
        model = Vendor
        fields = '__all__'
        extra_kwargs = {'user': {'required': True}}
