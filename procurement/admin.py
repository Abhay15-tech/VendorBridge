from django.contrib import admin
from .models import RFQ, RFQItem, Quotation, Approval, PurchaseOrder, Invoice

class RFQItemInline(admin.TabularInline):
    model = RFQItem
    extra = 1

@admin.register(RFQ)
class RFQAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'quantity', 'deadline', 'status']
    list_filter = ['status']
    inlines = [RFQItemInline]

@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = ['id', 'rfq', 'vendor', 'quoted_price', 'status']
    list_filter = ['status']

@admin.register(Approval)
class ApprovalAdmin(admin.ModelAdmin):
    list_display = ['id', 'rfq', 'approver', 'decision']
    list_filter = ['decision']

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'po_number', 'rfq', 'vendor', 'amount', 'status']
    list_filter = ['status']

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['id', 'invoice_number', 'purchase_order', 'total', 'status']
    list_filter = ['status']
