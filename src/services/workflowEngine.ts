import type { WorkflowStep } from '../types';

export interface SyntheticComplaintRecord {
  complaintId: string;
  customerName: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'ESCALATED';
  summary: string;
  doNotClose: boolean;
  notes: string[];
  lastUpdated: string;
}

export interface SyntheticOrderRecord {
  orderId: string;
  item: string;
  amount: number;
  deliveryStatus: string;
  expectedDate: string;
  trackingValid: boolean;
}

// Synthetic in-memory database as specified in the blueprint
const SYNTHETIC_COMPLAINTS: Record<string, SyntheticComplaintRecord> = {
  '4812': {
    complaintId: '4812',
    customerName: 'Rahul Verma',
    category: 'Broadband Connectivity & Latency',
    status: 'OPEN',
    summary: 'Intermittent packet drop and fiber link sync error',
    doNotClose: true,
    notes: ['Initial ticket raised 2 days ago', 'Technician visit pending verification'],
    lastUpdated: '2026-09-05 18:40 IST',
  },
  '8831': {
    complaintId: '8831',
    customerName: 'Pooja Sharma',
    category: 'Billing & Overcharge',
    status: 'IN_PROGRESS',
    summary: 'Excess deduction on payment gateway',
    doNotClose: false,
    notes: ['Refund initiated to primary bank account'],
    lastUpdated: '2026-09-04 11:20 IST',
  },
};

const SYNTHETIC_ORDERS: Record<string, SyntheticOrderRecord> = {
  ORD98765: {
    orderId: 'ORD98765',
    item: 'Noise-Cancelling Studio Headset',
    amount: 2499,
    deliveryStatus: 'In Transit — Arriving Tomorrow',
    expectedDate: 'Tomorrow by 4 PM',
    trackingValid: true,
  },
};

export const INITIAL_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'step-voice-input',
    title: '1. Voice Input',
    description: 'Acoustic audio stream received via WebRTC/LiveKit',
    status: 'idle',
  },
  {
    id: 'step-language-segments',
    title: '2. Language Segments',
    description: 'Detect Hindi, English, and mixed switch boundaries',
    status: 'idle',
  },
  {
    id: 'step-normalization',
    title: '3. Normalization',
    description: 'Preserve raw transcript while standardizing entities',
    status: 'idle',
  },
  {
    id: 'step-entity-protection',
    title: '4. Entity Protection',
    description: 'Lock critical IDs, numbers, and negative constraints',
    status: 'idle',
  },
  {
    id: 'step-intent-reasoning',
    title: '5. Intent Reasoning',
    description: 'Classify support workflow intent without language drift',
    status: 'idle',
  },
  {
    id: 'step-tool-action',
    title: '6. Support Tool Action',
    description: 'Execute synthetic CRM lookup with protected parameters',
    status: 'idle',
  },
  {
    id: 'step-response-policy',
    title: '7. Response Policy',
    description: 'Select Mirror Mix, English, or Hindi generation prompt',
    status: 'idle',
  },
  {
    id: 'step-rime-tts',
    title: '8. Rime Arcana V3',
    description: 'Synthesize seamless bilingual speech via /ws3',
    status: 'idle',
  },
];

export class WorkflowEngine {
  public static lookupComplaint(complaintId: string): SyntheticComplaintRecord | null {
    return SYNTHETIC_COMPLAINTS[complaintId] || {
      complaintId,
      customerName: 'Bilingual User',
      category: 'General Customer Support',
      status: 'OPEN',
      summary: 'Automated lookup record for session',
      doNotClose: true,
      notes: ['Retrieved via BhashaFlow Code-Switching Engine'],
      lastUpdated: new Date().toLocaleTimeString(),
    };
  }

  public static lookupOrder(orderId: string): SyntheticOrderRecord | null {
    const cleanId = orderId.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return SYNTHETIC_ORDERS[cleanId] || {
      orderId: cleanId,
      item: 'Standard Parcel Delivery',
      amount: 1499,
      deliveryStatus: 'Processed & In Dispatch',
      expectedDate: 'Within 48 hours',
      trackingValid: true,
    };
  }

  public static updateComplaintNotes(
    complaintId: string,
    newNote: string,
    doNotCloseConstraint: boolean
  ): SyntheticComplaintRecord {
    const record = this.lookupComplaint(complaintId)!;
    record.notes.push(newNote);
    if (doNotCloseConstraint) {
      record.doNotClose = true;
      record.status = 'OPEN';
    }
    record.lastUpdated = new Date().toLocaleTimeString();
    return record;
  }
}
