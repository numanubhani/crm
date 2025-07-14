from django.db import models
from django.utils import timezone


class DashboardStats(models.Model):
    """Daily dashboard statistics"""
    date = models.DateField(unique=True)
    total_leads = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    active_partners = models.PositiveIntegerField(default=0)
    today_leads = models.PositiveIntegerField(default=0)
    today_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    pending_leads = models.PositiveIntegerField(default=0)
    average_partner_response = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Stats for {self.date}"


class AnalyticsSnapshot(models.Model):
    """Periodic analytics snapshots"""
    PERIOD_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)
    date = models.DateField()
    
    # Lead analytics
    leads_by_source = models.JSONField(default=dict)
    leads_by_country = models.JSONField(default=dict)
    partner_performance = models.JSONField(default=list)
    revenue_by_deal = models.JSONField(default=dict)
    conversion_funnel = models.JSONField(default=list)
    time_series_data = models.JSONField(default=list)
    payout_calculations = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['period', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.period.title()} analytics for {self.date}"
