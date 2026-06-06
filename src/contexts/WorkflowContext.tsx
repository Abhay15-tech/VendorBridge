import React, { createContext, useContext, useState } from 'react';
import { 
  WorkflowStatus, RFQ, Quotation, PurchaseOrder, Invoice, Notification, ActivityLogEntry 
} from '@/types/workflow';
import { rfqs as mockRfqs, quotations as mockQuotations, purchaseOrders as mockPos, invoices as mockInvoices } from '@/data/mockData';

type WorkflowContextType = {
  rfqs: RFQ[];
  quotations: Quotation[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  notifications: Notification[];
  activities: ActivityLogEntry[];
  
  createRFQ: (rfq: Omit<RFQ, 'id' | 'status' | 'createdAt'>) => void;
  submitQuotation: (quotation: Omit<Quotation, 'id' | 'status' | 'date'>) => void;
  approveQuotation: (quotationId: string, approverName: string) => void;
  rejectQuotation: (quotationId: string, rejectorName: string) => void;
  markRead: (notificationId: string) => void;
};

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  // Initialize with mock data mapped to new structure
  const [rfqs, setRfqs] = useState<RFQ[]>(mockRfqs.map(r => ({
    ...r, 
    createdBy: 'System', 
    createdAt: '2024-01-01',
    status: r.status === 'Published' ? WorkflowStatus.RFQ_SENT : r.status
  })));
  
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations.map(q => ({
    ...q,
    status: q.status === 'Submitted' ? WorkflowStatus.QUOTATION_RECEIVED : 
            q.status === 'Shortlisted' ? WorkflowStatus.PENDING_APPROVAL : 
            q.status === 'Rejected' ? WorkflowStatus.REJECTED : q.status
  })));
  
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPos.map(po => ({
    ...po,
    rfqId: 'RFQ-2024-001', // Mocking relationship
    quotationId: 'QT-8823',
    status: po.status === 'Pending' ? WorkflowStatus.PO_GENERATED : WorkflowStatus.COMPLETED
  })));
  
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices.map(inv => ({
    ...inv,
    status: inv.status as any
  })));

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'notif-1', type: 'system', title: 'System Updated', message: 'Welcome to the automated ERP workflow.', timestamp: new Date().toISOString(), isRead: false, targetRole: 'All' }
  ]);
  
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);

  // Helper to add activity
  const addActivity = (module: string, action: string, actor: string, target: string, desc: string, status: 'success'|'info'|'warning'|'destructive' = 'info') => {
    const newActivity: ActivityLogEntry = {
      id: Date.now().toString(),
      module, action, actor, target, description: desc, status,
      time: 'Just now',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Helper to add notification
  const notify = (title: string, message: string, targetRole: string, targetUser?: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      type: 'workflow',
      title, message, targetRole, targetUser,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const createRFQ = (data: Omit<RFQ, 'id' | 'status' | 'createdAt'>) => {
    const newId = `RFQ-2026-${String(rfqs.length + 1).padStart(3, '0')}`;
    const rfq: RFQ = {
      ...data,
      id: newId,
      status: WorkflowStatus.RFQ_CREATED,
      createdAt: new Date().toISOString()
    };
    setRfqs(prev => [rfq, ...prev]);
    addActivity('RFQ', 'Created', data.createdBy, newId, 'RFQ Created and ready to be sent.', 'success');
    notify('New RFQ Drafted', `${newId} was created by ${data.createdBy}.`, 'Manager');
  };

  const submitQuotation = (data: Omit<Quotation, 'id' | 'status' | 'date'>) => {
    const newId = `QT-90${quotations.length + 1}`;
    const quote: Quotation = {
      ...data,
      id: newId,
      status: WorkflowStatus.QUOTATION_RECEIVED,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Update RFQ status
    setRfqs(prev => prev.map(r => r.id === data.rfqId ? { ...r, status: WorkflowStatus.QUOTATION_RECEIVED } : r));
    setQuotations(prev => [quote, ...prev]);
    
    addActivity('Quotation', 'Submitted', data.vendor, newId, `Quotation submitted for ${data.rfqId}`, 'info');
    notify('Quotation Received', `Vendor ${data.vendor} submitted bid ${newId} for ${data.rfqId}.`, 'Officer');
  };

  const approveQuotation = (quotationId: string, approverName: string) => {
    const quote = quotations.find(q => q.id === quotationId);
    if (!quote) return;

    // 1. Update Quote & RFQ to APPROVED
    setQuotations(prev => prev.map(q => q.id === quotationId ? { ...q, status: WorkflowStatus.APPROVED } : q));
    setRfqs(prev => prev.map(r => r.id === quote.rfqId ? { ...r, status: WorkflowStatus.APPROVED } : r));
    
    addActivity('Approval', 'Approved', approverName, quotationId, `Quotation approved for ${quote.vendor}. Generating PO...`, 'success');
    notify('Quotation Approved', `Your quotation ${quotationId} was approved!`, 'Vendor', quote.vendor);

    // 2. Auto Generate PO
    const newPoId = `PO-2026-${String(purchaseOrders.length + 1).padStart(4, '0')}`;
    const newPo: PurchaseOrder = {
      id: newPoId,
      rfqId: quote.rfqId,
      quotationId: quote.id,
      vendor: quote.vendor,
      amount: quote.totalAmount,
      date: new Date().toISOString().split('T')[0],
      status: WorkflowStatus.PO_GENERATED,
      // Default delivery date to 30 days from now
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setTimeout(() => {
      setPurchaseOrders(prev => [newPo, ...prev]);
      addActivity('Purchase Order', 'Auto-Generated', 'System', newPoId, `PO automatically generated from approved quote ${quote.id}`, 'success');
      notify('PO Generated', `Purchase Order ${newPoId} has been generated.`, 'Officer');
      
      // 3. Auto Generate Invoice
      setTimeout(() => {
        const newInvId = `INV-2026-${String(invoices.length + 1).padStart(4, '0')}`;
        const newInv: Invoice = {
          id: newInvId,
          poId: newPoId,
          vendor: quote.vendor,
          amount: quote.totalAmount,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Unpaid'
        };
        setInvoices(prev => [newInv, ...prev]);
        addActivity('Invoice', 'Auto-Generated', 'System', newInvId, `Invoice automatically generated for ${newPoId}`, 'info');
        notify('Invoice Generated', `Invoice ${newInvId} is ready for payment.`, 'Vendor', quote.vendor);
        
      }, 800);
    }, 800);
  };

  const rejectQuotation = (quotationId: string, rejectorName: string) => {
    const quote = quotations.find(q => q.id === quotationId);
    if (!quote) return;

    setQuotations(prev => prev.map(q => q.id === quotationId ? { ...q, status: WorkflowStatus.REJECTED } : q));
    addActivity('Approval', 'Rejected', rejectorName, quotationId, `Quotation rejected.`, 'destructive');
    notify('Quotation Rejected', `Your quotation ${quotationId} was not selected.`, 'Vendor', quote.vendor);
  };

  const markRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  return (
    <WorkflowContext.Provider value={{
      rfqs, quotations, purchaseOrders, invoices, notifications, activities,
      createRFQ, submitQuotation, approveQuotation, rejectQuotation, markRead
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}
