from django.db import models
from django.core.validators import EmailValidator
from django.utils import timezone
import uuid


class Source(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    api_key = models.CharField(max_length=200, unique=True)
    webhook_url = models.URLField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    total_leads = models.PositiveIntegerField(default=0)
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def update_stats(self):
        """Update source statistics"""
        from .models import Lead
        leads = Lead.objects.filter(source=self)
        self.total_leads = leads.count()
        converted_leads = leads.filter(status__in=['deposit', 'ftd']).count()
        self.conversion_rate = (converted_leads / self.total_leads * 100) if self.total_leads > 0 else 0
        self.save()


class Lead(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('deposit', 'Deposit'),
        ('ftd', 'FTD'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(validators=[EmailValidator()])
    country = models.CharField(max_length=2)  # ISO 2-letter country code
    source = models.ForeignKey(Source, on_delete=models.CASCADE, related_name='leads')
    funnel = models.CharField(max_length=100)
    registration_date = models.DateTimeField()
    first_login_date = models.DateTimeField(null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    device_info = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    partner = models.ForeignKey('partners.Partner', on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    conversion_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional tracking fields
    attempts = models.PositiveIntegerField(default=0)  # Number of distribution attempts
    last_attempt_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['country', 'status']),
            models.Index(fields=['source', 'status']),
            models.Index(fields=['partner', 'status']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.email}) - {self.status}"
    
    def save(self, *args, **kwargs):
        # Set conversion date when status changes to deposit or ftd
        if self.status in ['deposit', 'ftd'] and not self.conversion_date:
            self.conversion_date = timezone.now()
        super().save(*args, **kwargs)
    
    @property
    def is_converted(self):
        return self.status in ['deposit', 'ftd']
    
    @property
    def source_name(self):
        return self.source.name if self.source else None
    
    @property
    def partner_name(self):
        return self.partner.name if self.partner else None


class LeadHistory(models.Model):
    """Track lead status changes and activities"""
    ACTION_CHOICES = [
        ('created', 'Created'),
        ('status_changed', 'Status Changed'),
        ('assigned_partner', 'Assigned to Partner'),
        ('sent_to_partner', 'Sent to Partner'),
        ('partner_response', 'Partner Response'),
        ('manual_update', 'Manual Update'),
    ]
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    old_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20, blank=True)
    partner = models.ForeignKey('partners.Partner', on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)  # Store additional data
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.lead.name} - {self.action} at {self.created_at}"
