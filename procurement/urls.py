from django.urls import path
from . import views

urlpatterns = [
    # RFQ
    path('rfq/create/', views.RFQCreateAPIView.as_view()),
    path('rfq/', views.RFQListAPIView.as_view()),
    path('rfq/<int:pk>/', views.RFQRetrieveUpdateDestroyAPIView.as_view()),
    path('rfq/<int:pk>/publish/', views.RFQPublishAPIView.as_view()),
    path('rfq/<int:pk>/status/', views.RFQStatusUpdateAPIView.as_view()),

    # RFQ Items
    path('rfq-item/create/', views.RFQItemCreateAPIView.as_view()),
    path('rfq-item/', views.RFQItemListAPIView.as_view()),
    path('rfq-item/<int:pk>/', views.RFQItemRetrieveUpdateDestroyAPIView.as_view()),

    # Quotations
    path('quotation/submit/', views.QuotationSubmitAPIView.as_view()),
    path('quotation/<int:pk>/', views.QuotationRetrieveUpdateDestroyAPIView.as_view()),
    path('quotation/rfq/<int:rfq_id>/', views.QuotationListByRFQAPIView.as_view()),
    path('quotation/<int:pk>/status/', views.QuotationStatusUpdateAPIView.as_view()),
    path('quotation/compare/<int:rfq_id>/', views.QuotationCompareAPIView.as_view()),

    # Approvals
    path('approval/approve/', views.ApproveRFQAPIView.as_view()),
    path('approval/reject/', views.RejectRFQAPIView.as_view()),
    path('approval/<int:rfq_id>/', views.ApprovalRetrieveAPIView.as_view()),

    # Purchase Orders
    path('po/generate/', views.PurchaseOrderGenerateAPIView.as_view()),
    path('po/', views.PurchaseOrderListAPIView.as_view()),
    path('po/<int:pk>/', views.PurchaseOrderRetrieveAPIView.as_view()),
    path('po/<int:pk>/status/', views.PurchaseOrderStatusUpdateAPIView.as_view()),

    # Invoices
    path('invoice/generate/', views.InvoiceGenerateAPIView.as_view()),
    path('invoice/', views.InvoiceListAPIView.as_view()),
    path('invoice/<int:pk>/', views.InvoiceRetrieveAPIView.as_view()),
    path('invoice/<int:pk>/status/', views.InvoiceStatusUpdateAPIView.as_view()),
]
