export interface InputGRNCreate {
  supplierRefNo?: string;
  notes?: string;
}

export interface InputGRNUpdate {
  id?: string;
  supplierRefNo?: string;
  notes?: string;
}

export interface InputInventoryCreate {
  grnId?: string;
  runId?: string;
  agentId?: string;
  productId?: string;
  packagingId?: string;
  quantity?: number;
  unitPrice?: string;
  salesRef?: string;
  notes?: string;
}

export interface InputInventoryUpdate {
  id?: string;
  quantity?: number;
  unitPrice?: string;
  salesRef?: string;
  notes?: string;
}
