from django.db import models
import uuid


class RoutingRule(models.Model):
    FALLBACK_CHOICES = [
        ('hold', 'Hold'),
        ('distribute', 'Distribute'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(default=1)  # Lower number = higher priority
    
    # Conditions
    countries = models.JSONField(default=list)  # List of country codes
    time_of_day = models.CharField(max_length=50, blank=True)  # e.g., "09:00-17:00"
    day_of_week = models.JSONField(default=list, blank=True)  # e.g., ["monday", "tuesday"]
    source = models.ForeignKey('leads.Source', on_delete=models.CASCADE, null=True, blank=True)
    
    # Partner priority and fallback
    partner_priority = models.JSONField(default=list)  # List of partner IDs in priority order
    fallback_action = models.CharField(max_length=20, choices=FALLBACK_CHOICES, default='hold')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['priority', 'name']
    
    def __str__(self):
        return f"{self.name} (Priority: {self.priority})"
    
    def matches_conditions(self, lead):
        """Check if this rule matches the given lead"""
        # Check country
        if self.countries and lead.country not in self.countries:
            return False
        
        # Check source
        if self.source and lead.source != self.source:
            return False
        
        # Add time and day checks here if needed
        
        return True
