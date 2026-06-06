import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vendorbridge.settings')
django.setup()

from accounts.models import User
from accounts.models import Role

def create_admin():
    email = 'admin@vendorbridge.com'
    password = 'adminpassword123'

    # Create the Admin Role if it doesn't exist
    admin_role, created = Role.objects.get_or_create(
        name='Admin',
        defaults={'description': 'System Administrator'}
    )
    if created:
        print("Created 'Admin' role.")

    # Create the Superuser
    if not User.objects.filter(email=email).exists():
        user = User.objects.create_superuser(
            email=email,
            password=password,
            first_name='System',
            last_name='Admin',
            role=admin_role
        )
        print(f"✅ Superuser created successfully!")
        print(f"📧 Email: {email}")
        print(f"🔑 Password: {password}")
    else:
        print(f"⚠️ Superuser with email {email} already exists.")

if __name__ == '__main__':
    create_admin()
