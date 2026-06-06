from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendorViewSet, VendorCategoryViewSet

router = DefaultRouter()
router.register(r'categories', VendorCategoryViewSet)
router.register(r'management', VendorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
