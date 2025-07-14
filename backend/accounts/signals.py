from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Permission, Role

User = get_user_model()


@receiver(post_migrate)
def create_default_permissions_and_roles(sender, **kwargs):
    """Create default permissions and roles after migration"""
    if sender.name == 'accounts':
        # Create default permissions
        default_permissions = [
            {
                'name': 'View Leads',
                'description': 'View lead data and status',
                'category': 'leads',
                'actions': ['view']
            },
            {
                'name': 'Manage Leads',
                'description': 'Create, edit, and delete leads',
                'category': 'leads',
                'actions': ['view', 'create', 'edit', 'delete']
            },
            {
                'name': 'View Partners',
                'description': 'View partner information',
                'category': 'partners',
                'actions': ['view']
            },
            {
                'name': 'Manage Partners',
                'description': 'Create, edit, and delete partners',
                'category': 'partners',
                'actions': ['view', 'create', 'edit', 'delete']
            },
            {
                'name': 'View Analytics',
                'description': 'Access analytics and reports',
                'category': 'analytics',
                'actions': ['view']
            },
            {
                'name': 'Manage Users',
                'description': 'Create, edit, and delete users',
                'category': 'admin',
                'actions': ['view', 'create', 'edit', 'delete']
            },
            {
                'name': 'Manage Routing',
                'description': 'Create and edit routing rules',
                'category': 'routing',
                'actions': ['view', 'create', 'edit', 'delete']
            },
            {
                'name': 'View Sources',
                'description': 'View traffic sources',
                'category': 'sources',
                'actions': ['view']
            },
            {
                'name': 'Manage Sources',
                'description': 'Create, edit, and delete traffic sources',
                'category': 'sources',
                'actions': ['view', 'create', 'edit', 'delete']
            }
        ]
        
        created_permissions = []
        for perm_data in default_permissions:
            permission, created = Permission.objects.get_or_create(
                name=perm_data['name'],
                defaults=perm_data
            )
            created_permissions.append(permission)
        
        # Create default roles
        default_roles = [
            {
                'name': 'Super Admin',
                'description': 'Full system access with all permissions',
                'is_system': True,
                'permissions': created_permissions
            },
            {
                'name': 'Admin',
                'description': 'Administrative access without user management',
                'is_system': True,
                'permissions': [p for p in created_permissions if p.name != 'Manage Users']
            },
            {
                'name': 'Manager',
                'description': 'Lead and partner management access',
                'is_system': True,
                'permissions': [p for p in created_permissions if p.category in ['leads', 'partners', 'analytics', 'sources']]
            },
            {
                'name': 'Analyst',
                'description': 'Read-only access with analytics',
                'is_system': True,
                'permissions': [p for p in created_permissions if 'View' in p.name]
            },
            {
                'name': 'Viewer',
                'description': 'Basic read-only access',
                'is_system': True,
                'permissions': [p for p in created_permissions if p.name in ['View Leads', 'View Partners', 'View Sources']]
            }
        ]
        
        for role_data in default_roles:
            permissions = role_data.pop('permissions')
            role, created = Role.objects.get_or_create(
                name=role_data['name'],
                defaults=role_data
            )
            if created:
                role.permissions.set(permissions)
        
        # Create default superuser if it doesn't exist
        if not User.objects.filter(is_superuser=True).exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                email='admin@leadcrm.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='super_admin'
            )
            # Assign all permissions to admin
            admin_user.permissions.set(created_permissions)
            print(f"Created default admin user: admin@leadcrm.com / admin123")
