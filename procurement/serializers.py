from rest_framework import serializers
from .models import RFQ, RFQItem, Quotation, Approval, PurchaseOrder, Invoice

class RFQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RFQItem
        fields = '__all__'

class RFQSerializer(serializers.ModelSerializer):
    items = RFQItemSerializer(many=True, required=False)

    class Meta:
        model = RFQ
        fields = '__all__'
        read_only_fields = ['status', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        rfq = RFQ.objects.create(**validated_data)
        for item in items_data:
            RFQItem.objects.create(rfq=rfq, **item)
        return rfq

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                RFQItem.objects.create(rfq=instance, **item)
                
        return instance

class QuotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quotation
        fields = '__all__'
        read_only_fields = ['status', 'submitted_at']

class ApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Approval
        fields = '__all__'
        read_only_fields = ['approved_at']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrder
        fields = '__all__'
        read_only_fields = ['po_number', 'vendor', 'amount', 'status', 'generated_at', 'selected_quotation']

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['invoice_number', 'subtotal', 'tax', 'total', 'invoice_date', 'status']
