from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Permission, Role


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'actions', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['category', 'name']


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_system', 'created_at']
    list_filter = ['is_system', 'created_at']
    search_fields = ['name', 'description']
    filter_horizontal = ['permissions']
    readonly_fields = ['created_at']


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'full_name', 'role', 'status', 'is_staff', 'created_at']
    list_filter = ['role', 'status', 'is_staff', 'is_superuser', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'last_login']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('role', 'status', 'permissions', 'created_by', 'last_login_ip')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    filter_horizontal = ['permissions', 'groups', 'user_permissions']
    
    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = 'Full Name'
