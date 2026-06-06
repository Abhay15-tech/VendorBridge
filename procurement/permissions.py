from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

class IsProcurementOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        role_name = getattr(getattr(request.user, 'role', None), 'name', None)
        if role_name == 'Procurement Officer':
            return True
        raise PermissionDenied("Access denied. Requester must be a Procurement Officer.")

class IsVendor(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        role_name = getattr(getattr(request.user, 'role', None), 'name', None)
        if role_name == 'Vendor':
            return True
        raise PermissionDenied("Access denied. Requester must be a Vendor.")

class IsManagerOrApprover(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        role_name = getattr(getattr(request.user, 'role', None), 'name', None)
        if role_name == 'Manager / Approver':
            return True
        raise PermissionDenied("Access denied. Requester must be a Manager / Approver.")

class IsPOOrInvoiceAuthorized(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        role_name = getattr(getattr(request.user, 'role', None), 'name', None)
        if role_name in ['Procurement Officer', 'Manager / Approver', 'Admin']:
            return True
        raise PermissionDenied("Access denied. Unauthorized role.")
