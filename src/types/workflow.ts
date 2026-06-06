export enum WorkflowStatus {
  RFQ_CREATED = 'RFQ_CREATED',
  RFQ_SENT = 'RFQ_SENT',
  QUOTATION_RECEIVED = 'QUOTATION_RECEIVED',
  UNDER_COMPARISON = 'UNDER_COMPARISON',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PO_GENERATED = 'PO_GENERATED',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  INVOICE_SENT = 'INVOICE_SENT',
  COMPLETED = 'COMPLETED',
}

export interface RFQ {
  id: string;
  title: string;
  department: string;
  status: WorkflowStatus | string;
  deadline: string;
  items: number;
  budget: number;
  createdBy: string;
  createdAt: string;
}

export interface Quotation {
  id: string;
  rfqId: string;
  vendor: string;
  totalAmount: number;
  status: WorkflowStatus | string;
  date: string;
  deliveryDays: number;
}

export interface PurchaseOrder {
  id: string;
  rfqId: string;
  quotationId: string;
  vendor: string;
  amount: number;
  date: string;
  status: WorkflowStatus | string;
  deliveryDate: string;
}

export interface Invoice {
  id: string;
  poId: string;
  vendor: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetRole: string; // 'Admin', 'Officer', 'Manager', 'Vendor', or 'All'
  targetUser?: string; // Optional specific user
}

export interface ActivityLogEntry {
  id: string | number;
  module: string;
  action: string;
  actor: string;
  target: string;
  time: string;
  timestamp: string;
  status: 'success' | 'info' | 'warning' | 'destructive';
  description: string;
  oldStatus?: string;
  newStatus?: string;
}
