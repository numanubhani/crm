from django.db import models
from django.core.validators import URLValidator, MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid


class Partner(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]
    
    DEAL_TYPE_CHOICES = [
        ('CPA', 'Cost Per Acquisition'),
        ('CPL', 'Cost Per Lead'),
        ('RevShare', 'Revenue Share'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    api_endpoint = models.URLField(validators=[URLValidator()])
    api_key = models.CharField(max_length=500)  # Encrypted in production
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    deal_type = models.CharField(max_length=20, choices=DEAL_TYPE_CHOICES)
    deal_value = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    daily_cap = models.PositiveIntegerField(null=True, blank=True)
    total_cap = models.PositiveIntegerField(null=True, blank=True)
    current_daily_sent = models.PositiveIntegerField(default=0)
    countries = models.JSONField(default=list)  # List of ISO 2-letter country codes
    priority = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(10)])
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_leads = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    
    # Contact and technical info
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    technical_contact = models.EmailField(blank=True)
    
    # Performance tracking
    average_response_time = models.DurationField(null=True, blank=True)  # Average API response time
    last_successful_send = models.DateTimeField(null=True, blank=True)
    last_failed_send = models.DateTimeField(null=True, blank=True)
    consecutive_failures = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['priority', 'name']
        indexes = [
            models.Index(fields=['status', 'priority']),
            models.Index(fields=['deal_type', 'status']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.deal_type})"
    
    def reset_daily_counter(self):
        """Reset daily counter - called by daily cron job"""
        self.current_daily_sent = 0
        self.save(update_fields=['current_daily_sent'])
    
    def can_receive_leads(self, country=None):
        """Check if partner can receive leads"""
        if self.status != 'active':
            return False
        
        # Check daily cap
        if self.daily_cap and self.current_daily_sent >= self.daily_cap:
            return False
        
        # Check total cap
        if self.total_cap and self.total_leads >= self.total_cap:
            return False
        
        # Check country support
        if country and country not in self.countries:
            return False
        
        return True
    
    def increment_daily_sent(self):
        """Increment daily sent counter"""
        self.current_daily_sent += 1
        self.save(update_fields=['current_daily_sent'])
    
    def update_stats(self):
        """Update partner statistics"""
        from leads.models import Lead
        leads = self.leads.all()
        self.total_leads = leads.count()
        
        # Calculate success rate (approved + deposit + ftd leads)
        successful_leads = leads.filter(status__in=['approved', 'deposit', 'ftd']).count()
        self.success_rate = (successful_leads / self.total_leads * 100) if self.total_leads > 0 else 0
        
        # Calculate total revenue based on deal type
        if self.deal_type == 'CPA':
            # CPA: pay for conversions (deposit + ftd)
            converted_leads = leads.filter(status__in=['deposit', 'ftd']).count()
            self.total_revenue = converted_leads * self.deal_value
        elif self.deal_type == 'CPL':
            # CPL: pay for all sent leads
            sent_leads = leads.filter(status__in=['sent', 'approved', 'deposit', 'ftd']).count()
            self.total_revenue = sent_leads * self.deal_value
        elif self.deal_type == 'RevShare':
            # RevShare: percentage of lead values
            total_value = leads.filter(value__isnull=False).aggregate(
                total=models.Sum('value')
            )['total'] or 0
            self.total_revenue = total_value * (self.deal_value / 100)
        
        self.save()


class PartnerWebhook(models.Model):
    """Track webhooks sent to partners"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('timeout', 'Timeout'),
    ]
    
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='webhooks')
    lead = models.ForeignKey('leads.Lead', on_delete=models.CASCADE, related_name='webhooks')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    request_payload = models.JSONField()
    response_data = models.JSONField(null=True, blank=True)
    response_status_code = models.PositiveIntegerField(null=True, blank=True)
    response_time = models.DurationField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    retry_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['partner', 'status']),
            models.Index(fields=['lead', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.partner.name} -> {self.lead.name} ({self.status})"
    
    def mark_sent(self):
        """Mark webhook as sent"""
        self.status = 'sent'
        self.sent_at = timezone.now()
        self.save()
    
    def mark_success(self, response_data=None, response_time=None):
        """Mark webhook as successful"""
        self.status = 'success'
        self.response_data = response_data
        self.response_time = response_time
        self.completed_at = timezone.now()
        self.save()
    
    def mark_failed(self, error_message=None, response_status_code=None):
        """Mark webhook as failed"""
        self.status = 'failed'
        self.error_message = error_message or ''
        self.response_status_code = response_status_code
        self.completed_at = timezone.now()
        self.retry_count += 1
        self.save()


class PartnerStats(models.Model):
    """Daily partner statistics"""
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='daily_stats')
    date = models.DateField()
    leads_sent = models.PositiveIntegerField(default=0)
    leads_approved = models.PositiveIntegerField(default=0)
    leads_rejected = models.PositiveIntegerField(default=0)
    leads_converted = models.PositiveIntegerField(default=0)
    revenue_generated = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    average_response_time = models.DurationField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['partner', 'date']
        ordering = ['-date']
        indexes = [
            models.Index(fields=['partner', 'date']),
            models.Index(fields=['date']),
        ]
    
    def __str__(self):
        return f"{self.partner.name} - {self.date}"
