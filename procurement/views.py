from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
from .models import RFQ, RFQItem, Quotation, Approval, PurchaseOrder, Invoice
from .serializers import (
    RFQSerializer, RFQItemSerializer, QuotationSerializer, ApprovalSerializer,
    PurchaseOrderSerializer, InvoiceSerializer
)
from .permissions import (
    IsProcurementOfficer, IsVendor, IsManagerOrApprover, IsPOOrInvoiceAuthorized
)

User = get_user_model()

TAX_RATE = Decimal('0.18')


# --- RFQ ---

class RFQCreateAPIView(generics.CreateAPIView):
    queryset = RFQ.objects.all()
    serializer_class = RFQSerializer
    permission_classes = [IsAuthenticated, IsProcurementOfficer]

class RFQListAPIView(generics.ListAPIView):
    queryset = RFQ.objects.all()
    serializer_class = RFQSerializer
    permission_classes = [IsAuthenticated]

class RFQRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RFQ.objects.all()
    serializer_class = RFQSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if getattr(getattr(self.request.user, 'role', None), 'name', None) != 'Procurement Officer':
            raise PermissionDenied("Only a Procurement Officer can update an RFQ.")
        super().perform_update(serializer)

    def perform_destroy(self, instance):
        if getattr(getattr(self.request.user, 'role', None), 'name', None) != 'Procurement Officer':
            raise PermissionDenied("Only a Procurement Officer can delete an RFQ.")
        super().perform_destroy(instance)

class RFQPublishAPIView(APIView):
    permission_classes = [IsAuthenticated, IsProcurementOfficer]

    def patch(self, request, pk):
        try:
            rfq = RFQ.objects.get(pk=pk)
            rfq.status = 'Published'
            rfq.save(update_fields=['status'])
            return Response({'status': rfq.status})
        except RFQ.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class RFQStatusUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsProcurementOfficer]

    def patch(self, request, pk):
        try:
            rfq = RFQ.objects.get(pk=pk)
            new_status = request.data.get('status')
            if new_status in dict(RFQ.STATUS_CHOICES):
                rfq.status = new_status
                rfq.save(update_fields=['status'])
                return Response({'status': rfq.status})
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except RFQ.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# --- RFQ Items ---

class RFQItemCreateAPIView(generics.CreateAPIView):
    queryset = RFQItem.objects.all()
    serializer_class = RFQItemSerializer
    permission_classes = [IsAuthenticated, IsProcurementOfficer]

class RFQItemListAPIView(generics.ListAPIView):
    queryset = RFQItem.objects.all()
    serializer_class = RFQItemSerializer
    permission_classes = [IsAuthenticated]

class RFQItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RFQItem.objects.all()
    serializer_class = RFQItemSerializer
    permission_classes = [IsAuthenticated, IsProcurementOfficer]


# --- Quotations ---

class QuotationSubmitAPIView(generics.CreateAPIView):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer
    permission_classes = [IsAuthenticated, IsVendor]

    def create(self, request, *args, **kwargs):
        rfq_id = request.data.get('rfq')
        if not rfq_id:
            raise ValidationError({"rfq": "This field is required."})
        try:
            rfq = RFQ.objects.get(pk=rfq_id)
            if rfq.status != 'Published' or timezone.now() > rfq.deadline:
                raise ValidationError({"rfq": "RFQ is not published or deadline has passed."})
        except (RFQ.DoesNotExist, ValueError, TypeError):
            raise ValidationError({"rfq": "RFQ not found or invalid."})

        return super().create(request, *args, **kwargs)

class QuotationRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quotation.objects.all()
    serializer_class = QuotationSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if getattr(getattr(self.request.user, 'role', None), 'name', None) != 'Vendor':
            raise PermissionDenied("Only a Vendor can update a Quotation.")
        quote = self.get_object()
        if timezone.now() > quote.rfq.deadline:
            raise ValidationError({"detail": "Cannot update after RFQ deadline."})
        serializer.save(status='Updated')

    def perform_destroy(self, instance):
        if getattr(getattr(self.request.user, 'role', None), 'name', None) != 'Vendor':
            raise PermissionDenied("Only a Vendor can delete a Quotation.")
        super().perform_destroy(instance)

class QuotationListByRFQAPIView(generics.ListAPIView):
    serializer_class = QuotationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quotation.objects.filter(rfq_id=self.kwargs.get('rfq_id'))

class QuotationStatusUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            quote = Quotation.objects.get(pk=pk)
            new_status = request.data.get('status')
            if new_status in dict(Quotation.STATUS_CHOICES):
                quote.status = new_status
                quote.save(update_fields=['status'])
                return Response({'status': quote.status})
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Quotation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class QuotationCompareAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, rfq_id):
        sort_by = request.query_params.get('sort_by', 'lowest_price')
        order_args = ['delivery_days', 'quoted_price'] if sort_by == 'fastest_delivery' else ['quoted_price', 'delivery_days']

        qs = Quotation.objects.select_related('vendor').filter(rfq_id=rfq_id).order_by(*order_args)
        if not qs.exists():
            return Response([])

        lowest_price = min(q.quoted_price for q in qs)

        data = [{
            'quotation_id': q.id,
            'vendor_name': getattr(q.vendor, 'name', str(q.vendor)),
            'quoted_price': q.quoted_price,
            'delivery_days': q.delivery_days,
            'vendor_rating': getattr(q.vendor, 'rating', None),
            'is_lowest_price': q.quoted_price == lowest_price
        } for q in qs]

        return Response(data)


# --- Approvals ---

def _resolve_rfq_and_approver(data, user):
    """Validate and fetch the RFQ (with row lock) and use request.user."""
    rfq_id = data.get('rfq')
    if not rfq_id:
        raise ValidationError({"rfq": "This field is required."})

    try:
        rfq = RFQ.objects.select_for_update().get(pk=rfq_id)
    except (RFQ.DoesNotExist, ValueError, TypeError):
        raise ValidationError({"rfq": "RFQ not found or invalid."})

    return rfq, user

class ApproveRFQAPIView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrApprover]

    @transaction.atomic
    def post(self, request):
        rfq, approver = _resolve_rfq_and_approver(request.data, request.user)

        if rfq.status == 'Approved':
            raise ValidationError({"rfq": "RFQ is already approved."})
        if rfq.status == 'Rejected':
            raise ValidationError({"rfq": "RFQ has been rejected and cannot be approved."})

        approval = Approval.objects.create(
            rfq=rfq,
            approver=approver,
            remarks=request.data.get('remarks', ''),
            decision='Approved'
        )
        rfq.status = 'Approved'
        rfq.save(update_fields=['status'])
        return Response(ApprovalSerializer(approval).data, status=status.HTTP_201_CREATED)

class RejectRFQAPIView(APIView):
    permission_classes = [IsAuthenticated, IsManagerOrApprover]

    @transaction.atomic
    def post(self, request):
        rfq, approver = _resolve_rfq_and_approver(request.data, request.user)

        if rfq.status == 'Rejected':
            raise ValidationError({"rfq": "RFQ is already rejected."})
        if rfq.status == 'Approved':
            raise ValidationError({"rfq": "RFQ has been approved and cannot be rejected."})

        approval = Approval.objects.create(
            rfq=rfq,
            approver=approver,
            remarks=request.data.get('remarks', ''),
            decision='Rejected'
        )
        rfq.status = 'Rejected'
        rfq.save(update_fields=['status'])
        return Response(ApprovalSerializer(approval).data, status=status.HTTP_201_CREATED)

class ApprovalRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = ApprovalSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        rfq_id = self.kwargs.get('rfq_id')
        approval = Approval.objects.filter(rfq_id=rfq_id).last()
        if not approval:
            from django.http import Http404
            raise Http404
        return approval


# --- Purchase Orders ---

class PurchaseOrderGenerateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsPOOrInvoiceAuthorized]

    @transaction.atomic
    def post(self, request):
        rfq_id = request.data.get('rfq_id')
        if not rfq_id:
            raise ValidationError({"rfq_id": "This field is required."})

        try:
            rfq = RFQ.objects.select_for_update().get(pk=rfq_id)
        except (RFQ.DoesNotExist, ValueError, TypeError):
            raise ValidationError({"rfq_id": "RFQ not found or invalid."})

        if rfq.status != 'Approved':
            raise ValidationError({"rfq_id": "RFQ must be Approved to generate a Purchase Order."})

        accepted_quote = rfq.quotations.filter(status='Accepted').first()
        if not accepted_quote:
            raise ValidationError({"rfq_id": "No accepted quotation found for this RFQ."})

        po = PurchaseOrder.objects.create(
            rfq=rfq,
            selected_quotation=accepted_quote,
            vendor=accepted_quote.vendor,
            amount=accepted_quote.quoted_price,
            status='Created'
        )

        rfq.status = 'PO Generated'
        rfq.save(update_fields=['status'])

        return Response(PurchaseOrderSerializer(po).data, status=status.HTTP_201_CREATED)

class PurchaseOrderListAPIView(generics.ListAPIView):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]

class PurchaseOrderRetrieveAPIView(generics.RetrieveAPIView):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]

class PurchaseOrderStatusUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            po = PurchaseOrder.objects.get(pk=pk)
            new_status = request.data.get('status')
            if new_status in dict(PurchaseOrder.STATUS_CHOICES):
                po.status = new_status
                po.save(update_fields=['status'])
                return Response({'status': po.status})
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except PurchaseOrder.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


# --- Invoices ---

class InvoiceGenerateAPIView(APIView):
    permission_classes = [IsAuthenticated, IsPOOrInvoiceAuthorized]

    @transaction.atomic
    def post(self, request):
        po_id = request.data.get('purchase_order_id')
        if not po_id:
            raise ValidationError({"purchase_order_id": "This field is required."})

        try:
            po = PurchaseOrder.objects.get(pk=po_id)
        except (PurchaseOrder.DoesNotExist, ValueError, TypeError):
            raise ValidationError({"purchase_order_id": "Purchase Order not found or invalid."})

        if hasattr(po, 'invoice'):
            raise ValidationError({"purchase_order_id": "Invoice already generated for this Purchase Order."})

        subtotal = po.amount
        tax = subtotal * TAX_RATE

        invoice = Invoice.objects.create(
            purchase_order=po,
            subtotal=subtotal,
            tax=tax,
            status='Generated'
        )

        return Response(InvoiceSerializer(invoice).data, status=status.HTTP_201_CREATED)

class InvoiceListAPIView(generics.ListAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

class InvoiceRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

class InvoiceStatusUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            inv = Invoice.objects.get(pk=pk)
            new_status = request.data.get('status')
            if new_status in dict(Invoice.STATUS_CHOICES):
                inv.status = new_status
                inv.save(update_fields=['status'])
                return Response({'status': inv.status})
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Invoice.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
