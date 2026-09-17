import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type VendorStats = {
  orders: number;
  revenue: number;
  rating: number;
};

export type VendorInfo = {
  businessType: string;
  legalName: string;
  gstNumber: string;
  panNumber: string;
  registeredAddress: string;
};

export type OwnerInfo = {
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
};

export type StoreInfo = {
  category: string;
  description: string;
  storeCode: string;
  onboardedLabel: string;
};

export type ProfileCore = {
  storeName: string;
  vendorCode: string;
  avatarInitials: string;
  status: string;
  kycVerified: boolean;
  stats: VendorStats;
  vendor: VendorInfo;
  owner: OwnerInfo;
  store: StoreInfo;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  line2: string;
  isPrimary: boolean;
};

export type DocumentStatus = 'verified' | 'pending' | 'rejected';

export type ProfileDocument = {
  id: string;
  name: string;
  status: DocumentStatus;
  uploadedLabel: string;
  rejectionReason?: string;
};

export type BankDetails = {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
};

export type NotificationPrefGroup = 'Orders' | 'Inventory' | 'Payments' | 'System';

export type NotificationPref = {
  key: string;
  label: string;
  description: string;
  group: NotificationPrefGroup;
  locked: boolean;
  enabled: boolean;
};

const INITIAL_PROFILE: ProfileCore = {
  storeName: 'Sharma Kirana Store',
  vendorCode: 'VND-2847',
  avatarInitials: 'RS',
  status: 'Active',
  kycVerified: true,
  stats: { orders: 847, revenue: 184320, rating: 4.7 },
  vendor: {
    businessType: 'Proprietorship',
    legalName: 'Sharma Kirana Store',
    gstNumber: '07AAACS1234F1Z5',
    panNumber: 'AAACS1234F',
    registeredAddress: '14B Lal Bahadur Nagar, Hyderabad, Telangana – 500032',
  },
  owner: {
    name: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@example.com',
    dateOfBirth: '12 Jun 1985',
  },
  store: {
    category: 'Grocery & Daily Essentials',
    description: 'Neighbourhood kirana store serving fresh groceries and daily essentials since 2015.',
    storeCode: 'STR-4471',
    onboardedLabel: '15 Jan 2024',
  },
};

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-store',
    label: 'Store Address',
    line1: '14B Lal Bahadur Nagar',
    line2: 'Hyderabad, Telangana – 500032',
    isPrimary: true,
  },
  {
    id: 'addr-warehouse',
    label: 'Warehouse',
    line1: '22 Industrial Estate, Phase 2',
    line2: 'Hyderabad, Telangana – 500055',
    isPrimary: false,
  },
];

const INITIAL_DOCUMENTS: ProfileDocument[] = [
  { id: 'doc-pan', name: 'PAN Card', status: 'verified', uploadedLabel: 'Uploaded 15 Jan' },
  { id: 'doc-aadhaar', name: 'Aadhaar Card', status: 'verified', uploadedLabel: 'Uploaded 15 Jan' },
  { id: 'doc-gst', name: 'GST Certificate', status: 'verified', uploadedLabel: 'Uploaded 15 Jan' },
  { id: 'doc-shop-license', name: 'Shop License', status: 'verified', uploadedLabel: 'Uploaded 15 Jan' },
  { id: 'doc-bank-proof', name: 'Bank Proof (Passbook)', status: 'verified', uploadedLabel: 'Uploaded 15 Jan' },
];

const INITIAL_BANK_DETAILS: BankDetails = {
  accountHolderName: 'Rajesh Sharma',
  accountNumber: '****2847',
  ifsc: 'HDFC0001234',
  bankName: 'HDFC Bank',
};

const INITIAL_NOTIFICATION_PREFS: NotificationPref[] = [
  { key: 'new-order', label: 'New Order', description: 'Alert when a new order arrives', group: 'Orders', locked: true, enabled: true },
  { key: 'order-updates', label: 'Order Updates', description: 'Status changes for active orders', group: 'Orders', locked: true, enabled: true },
  { key: 'order-cancelled', label: 'Order Cancelled', description: 'When an order is cancelled', group: 'Orders', locked: true, enabled: true },
  { key: 'low-stock', label: 'Low Stock Alerts', description: 'When stock falls below threshold', group: 'Inventory', locked: false, enabled: true },
  { key: 'out-of-stock', label: 'Out of Stock', description: 'Item goes out of stock', group: 'Inventory', locked: false, enabled: true },
  { key: 'restock-reminders', label: 'Restock Reminders', description: 'Scheduled restock suggestions', group: 'Inventory', locked: false, enabled: false },
  { key: 'settlement-credited', label: 'Settlement Credited', description: 'Weekly settlement deposited', group: 'Payments', locked: false, enabled: true },
  { key: 'payment-received', label: 'Payment Received', description: 'Customer payment confirmation', group: 'Payments', locked: false, enabled: true },
  { key: 'deductions', label: 'Deductions', description: 'Commission and fee deductions', group: 'Payments', locked: false, enabled: false },
  { key: 'app-updates', label: 'App Updates', description: 'New app version available', group: 'System', locked: false, enabled: true },
  { key: 'policy-changes', label: 'Policy Changes', description: 'Terms and policy updates', group: 'System', locked: false, enabled: true },
  { key: 'marketing', label: 'Marketing', description: 'Promotions and offers from Verdant', group: 'System', locked: false, enabled: false },
];

type ProfileContextValue = {
  profile: ProfileCore;
  updateVendorInfo: (value: Partial<VendorInfo>) => void;
  updateOwnerInfo: (value: Partial<OwnerInfo>) => void;
  updateStoreInfo: (value: Partial<StoreInfo>) => void;
  updateProfileBasics: (value: { storeName?: string; avatarInitials?: string }) => void;

  addresses: Address[];
  getAddress: (addressId: string) => Address | undefined;
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, value: Partial<Address>) => void;
  removeAddress: (addressId: string) => void;
  setPrimaryAddress: (addressId: string) => void;

  documents: ProfileDocument[];
  getDocument: (documentId: string) => ProfileDocument | undefined;
  replaceDocument: (documentId: string) => void;
  addDocument: (document: ProfileDocument) => void;

  bankDetails: BankDetails;
  updateBankDetails: (value: Partial<BankDetails>) => void;

  notificationPrefs: NotificationPref[];
  toggleNotificationPref: (key: string) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileCore>(INITIAL_PROFILE);
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [documents, setDocuments] = useState<ProfileDocument[]>(INITIAL_DOCUMENTS);
  const [bankDetails, setBankDetails] = useState<BankDetails>(INITIAL_BANK_DETAILS);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPref[]>(INITIAL_NOTIFICATION_PREFS);

  const updateVendorInfo = useCallback((value: Partial<VendorInfo>) => {
    setProfile(prev => ({ ...prev, vendor: { ...prev.vendor, ...value } }));
  }, []);

  const updateOwnerInfo = useCallback((value: Partial<OwnerInfo>) => {
    setProfile(prev => ({ ...prev, owner: { ...prev.owner, ...value } }));
  }, []);

  const updateStoreInfo = useCallback((value: Partial<StoreInfo>) => {
    setProfile(prev => ({ ...prev, store: { ...prev.store, ...value } }));
  }, []);

  const updateProfileBasics = useCallback((value: { storeName?: string; avatarInitials?: string }) => {
    setProfile(prev => ({ ...prev, ...value }));
  }, []);

  const getAddress = useCallback(
    (addressId: string) => addresses.find(a => a.id === addressId),
    [addresses],
  );

  const addAddress = useCallback((address: Address) => {
    setAddresses(prev => [...prev, address]);
  }, []);

  const updateAddress = useCallback((addressId: string, value: Partial<Address>) => {
    setAddresses(prev => prev.map(a => (a.id === addressId ? { ...a, ...value } : a)));
  }, []);

  const removeAddress = useCallback((addressId: string) => {
    setAddresses(prev => prev.filter(a => a.id !== addressId));
  }, []);

  const setPrimaryAddress = useCallback((addressId: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isPrimary: a.id === addressId })));
  }, []);

  const getDocument = useCallback(
    (documentId: string) => documents.find(d => d.id === documentId),
    [documents],
  );

  const replaceDocument = useCallback((documentId: string) => {
    setDocuments(prev =>
      prev.map(d =>
        d.id === documentId
          ? { ...d, status: 'pending', uploadedLabel: 'Uploaded just now', rejectionReason: undefined }
          : d,
      ),
    );
  }, []);

  const addDocument = useCallback((document: ProfileDocument) => {
    setDocuments(prev => [...prev, document]);
  }, []);

  const updateBankDetails = useCallback((value: Partial<BankDetails>) => {
    setBankDetails(prev => ({ ...prev, ...value }));
  }, []);

  const toggleNotificationPref = useCallback((key: string) => {
    setNotificationPrefs(prev =>
      prev.map(pref => (pref.key === key && !pref.locked ? { ...pref, enabled: !pref.enabled } : pref)),
    );
  }, []);

  const value = useMemo(
    () => ({
      profile,
      updateVendorInfo,
      updateOwnerInfo,
      updateStoreInfo,
      updateProfileBasics,
      addresses,
      getAddress,
      addAddress,
      updateAddress,
      removeAddress,
      setPrimaryAddress,
      documents,
      getDocument,
      replaceDocument,
      addDocument,
      bankDetails,
      updateBankDetails,
      notificationPrefs,
      toggleNotificationPref,
    }),
    [
      profile,
      updateVendorInfo,
      updateOwnerInfo,
      updateStoreInfo,
      updateProfileBasics,
      addresses,
      getAddress,
      addAddress,
      updateAddress,
      removeAddress,
      setPrimaryAddress,
      documents,
      getDocument,
      replaceDocument,
      addDocument,
      bankDetails,
      updateBankDetails,
      notificationPrefs,
      toggleNotificationPref,
    ],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
