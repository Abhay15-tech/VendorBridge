from rest_framework import viewsets, permissions, filters
from .models import Vendor, VendorCategory
from .serializers import VendorSerializer, VendorCategorySerializer

class VendorCategoryViewSet(viewsets.ModelViewSet):
    queryset = VendorCategory.objects.all()
    serializer_class = VendorCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['company_name', 'gst_number', 'status']

    def perform_create(self, serializer):
        # Automatically assign the logged-in user if not provided in request,
        # but the schema links User and Vendor 1:1, so we just save it.
        serializer.save()
