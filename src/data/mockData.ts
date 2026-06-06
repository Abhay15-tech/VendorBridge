export const vendors = [
  { id: "VND-1001", name: "TechCorp Industries", category: "Hardware", status: "Active", rating: 4.8, contactPerson: "Sarah Johnson", email: "sarah.j@techcorp.com", phone: "+1 (555) 123-4567", location: "San Jose, CA", joinedDate: "2023-01-15", onTimeDelivery: "98%", totalOrders: 145, spend: 1250000 },
  { id: "VND-1002", name: "Global Office Supplies", category: "Stationery", status: "Active", rating: 4.2, contactPerson: "Michael Chen", email: "m.chen@globaloffice.com", phone: "+1 (555) 987-6543", location: "Chicago, IL", joinedDate: "2023-03-22", onTimeDelivery: "95%", totalOrders: 320, spend: 85000 },
  { id: "VND-1003", name: "CloudSystems Inc", category: "Software", status: "Under Review", rating: 0, contactPerson: "Elena Rodriguez", email: "elena@cloudsystems.io", phone: "+1 (555) 456-7890", location: "Austin, TX", joinedDate: "2024-05-10", onTimeDelivery: "N/A", totalOrders: 0, spend: 0 },
  { id: "VND-1004", name: "Apex Logistics", category: "Services", status: "Active", rating: 4.6, contactPerson: "David Smith", email: "d.smith@apexlogistics.com", phone: "+1 (555) 222-3333", location: "New York, NY", joinedDate: "2022-11-05", onTimeDelivery: "99%", totalOrders: 85, spend: 450000 },
  { id: "VND-1005", name: "SecureNet Solutions", category: "Software", status: "Inactive", rating: 3.5, contactPerson: "James Wilson", email: "j.wilson@securenet.com", phone: "+1 (555) 777-8888", location: "Seattle, WA", joinedDate: "2021-08-19", onTimeDelivery: "82%", totalOrders: 42, spend: 120000 }
];

export const spendData = [
  { month: 'Jan', amount: 150000, target: 160000 },
  { month: 'Feb', amount: 180000, target: 160000 },
  { month: 'Mar', amount: 140000, target: 160000 },
  { month: 'Apr', amount: 210000, target: 180000 },
  { month: 'May', amount: 190000, target: 180000 },
  { month: 'Jun', amount: 250000, target: 200000 },
  { month: 'Jul', amount: 220000, target: 200000 },
];

export const vendorPerformanceData = [
  { name: 'TechCorp', delivery: 98, quality: 95, cost: 88 },
  { name: 'Global Office', delivery: 95, quality: 90, cost: 92 },
  { name: 'Apex Logistics', delivery: 99, quality: 85, cost: 80 },
  { name: 'SecureNet', delivery: 82, quality: 75, cost: 70 },
];

export const rfqs = [
  { id: "RFQ-2024-001", title: "Office Laptops Q3", department: "IT", status: "Published", deadline: "2024-07-15", items: 50, budget: 60000 },
  { id: "RFQ-2024-002", title: "Server Racks Migration", department: "Infrastructure", status: "Draft", deadline: "2024-08-01", items: 12, budget: 120000 },
  { id: "RFQ-2024-003", title: "Marketing Event Materials", department: "Marketing", status: "Closed", deadline: "2024-06-01", items: 5, budget: 15000 },
];

export const quotations = [
  { id: "QT-8821", rfqId: "RFQ-2024-001", vendor: "TechCorp Industries", totalAmount: 58500, status: "Submitted", date: "2024-07-10", deliveryDays: 14 },
  { id: "QT-8822", rfqId: "RFQ-2024-001", vendor: "Global Office Supplies", totalAmount: 62000, status: "Rejected", date: "2024-07-11", deliveryDays: 7 },
  { id: "QT-8823", rfqId: "RFQ-2024-001", vendor: "SecureNet Solutions", totalAmount: 59000, status: "Shortlisted", date: "2024-07-12", deliveryDays: 10 },
];

export const purchaseOrders = [
  { id: "PO-9901", vendor: "TechCorp Industries", amount: 58500, date: "2024-07-18", status: "Pending", deliveryDate: "2024-08-01" },
  { id: "PO-9850", vendor: "Apex Logistics", amount: 12400, date: "2024-05-22", status: "Delivered", deliveryDate: "2024-06-15" },
];

export const invoices = [
  { id: "INV-1029", poId: "PO-9850", vendor: "Apex Logistics", amount: 12400, issueDate: "2024-06-15", dueDate: "2024-07-15", status: "Unpaid" },
  { id: "INV-1010", poId: "PO-9700", vendor: "Global Office Supplies", amount: 4500, issueDate: "2024-05-01", dueDate: "2024-06-01", status: "Paid" },
];
