from django.db import models, transaction
from django.conf import settings
from vendors.models import Vendor

class RFQ(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Published', 'Published'),
        ('Quotation Received', 'Quotation Received'),
        ('Under Review', 'Under Review'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('PO Generated', 'PO Generated'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    quantity = models.PositiveIntegerField(default=1)
    deadline = models.DateTimeField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class RFQItem(models.Model):
    rfq = models.ForeignKey(RFQ, related_name='items', on_delete=models.CASCADE)
    item_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    specification = models.TextField()

    def __str__(self):
        return f"{self.item_name} ({self.quantity})"

class Quotation(models.Model):
    STATUS_CHOICES = [
        ('Submitted', 'Submitted'),
        ('Updated', 'Updated'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    rfq = models.ForeignKey(RFQ, related_name='quotations', on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, related_name='quotations', on_delete=models.CASCADE)
    quoted_price = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_days = models.PositiveIntegerField()
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Submitted')
    submitted_at = models.DateTimeField(auto_now_add=True)

class Approval(models.Model):
    DECISION_CHOICES = [
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    rfq = models.ForeignKey(RFQ, related_name='approvals', on_delete=models.CASCADE)
    approver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    remarks = models.TextField(blank=True, null=True)
    decision = models.CharField(max_length=50, choices=DECISION_CHOICES)
    approved_at = models.DateTimeField(auto_now_add=True)

class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('Created', 'Created'),
        ('Sent', 'Sent'),
        ('Completed', 'Completed'),
    ]

    po_number = models.CharField(max_length=50, unique=True, blank=True)
    rfq = models.OneToOneField(RFQ, on_delete=models.CASCADE)
    selected_quotation = models.OneToOneField(Quotation, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Created')
    generated_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.po_number:
            with transaction.atomic():
                last_po = PurchaseOrder.objects.select_for_update().order_by('id').last()
                po_id = last_po.id + 1 if last_po else 1
                self.po_number = f"PO-{po_id:04d}"
        super().save(*args, **kwargs)

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Generated', 'Generated'),
        ('Paid', 'Paid'),
    ]

    invoice_number = models.CharField(max_length=50, unique=True, blank=True)
    purchase_order = models.OneToOneField(PurchaseOrder, on_delete=models.CASCADE)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax = models.DecimalField(max_digits=12, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2, blank=True)
    invoice_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Draft')

    def save(self, *args, **kwargs):
        self.total = self.subtotal + self.tax
        if not self.invoice_number:
            with transaction.atomic():
                last_inv = Invoice.objects.select_for_update().order_by('id').last()
                inv_id = last_inv.id + 1 if last_inv else 1
                self.invoice_number = f"INV-{inv_id:04d}"
        super().save(*args, **kwargs)
