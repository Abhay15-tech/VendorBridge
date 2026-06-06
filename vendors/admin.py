from django.contrib import admin
from .models import Vendor, VendorCategory

admin.site.register(VendorCategory)
admin.site.register(Vendor)
