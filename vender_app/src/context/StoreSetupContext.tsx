import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type StoreProfileData = {
  storeName: string;
  description: string;
  primaryCategory: string;
  subCategory: string;
  tags: string[];
  minimumOrderValue: string;
  avgPrepTime: string;
};

export type StoreLocationData = {
  address: string;
  cityState: string;
  latitude: number;
  longitude: number;
};

export type StoreAddressData = {
  buildingShopNo: string;
  street: string;
  landmark: string;
  area: string;
  pincode: string;
  city: string;
  state: string;
  contactNumber: string;
  sameAsBusinessAddress: boolean;
  location: StoreLocationData;
};

export type DaySchedule = {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
};

export type OperatingHoursData = {
  sameEveryDay: boolean;
  defaultOpen: string;
  defaultClose: string;
  breakEnabled: boolean;
  weeklySchedule: DaySchedule[];
};

export type HolidayClosureItem = {
  id: string;
  title: string;
  date: string;
  daysClosed: number;
  note: string;
};

export type FulfillmentType = 'delivery' | 'pickup' | 'both';

export type DeliverySlab = {
  id: string;
  range: string;
  charge: string;
};

export type DeliverySettingsData = {
  fulfillmentType: FulfillmentType;
  deliveryRadiusKm: number;
  minimumOrderForDelivery: string;
  chargeType: string;
  slabs: DeliverySlab[];
  freeDeliveryAbove: string;
};

export type DeliverySlot = {
  id: string;
  label: string;
  window: string;
  totalSlots: number;
  usedSlots: number;
};

export type ServiceAvailabilityData = {
  slotsEnabled: boolean;
  slots: DeliverySlot[];
  maxSimultaneousOrders: string;
  autoPauseAtCapacity: boolean;
};

export type StoreStatusValue = 'open' | 'closed' | 'temporarily-closed';

export type TempClosureData = {
  reason: string;
  customMessage: string;
  fromDate: string;
  toDate: string;
  closeFromTime: string;
  reopenAt: string;
  notifyCustomers: boolean;
};

type StoreSetupData = {
  profile?: StoreProfileData;
  logoUploaded?: boolean;
  logoUrl?: string;
  coverImageUploaded?: boolean;
  coverImageUrl?: string;
  address?: StoreAddressData;
  operatingHours?: OperatingHoursData;
  holidays: HolidayClosureItem[];
  delivery?: DeliverySettingsData;
  serviceAvailability?: ServiceAvailabilityData;
  storeStatus: StoreStatusValue;
  tempClosure?: TempClosureData;
};

type StoreSetupContextValue = {
  data: StoreSetupData;
  updateProfile: (value: StoreProfileData) => void;
  setLogoUploaded: (value: boolean, url?: string) => void;
  setCoverImageUploaded: (value: boolean, url?: string) => void;
  updateAddress: (value: StoreAddressData) => void;
  updateOperatingHours: (value: OperatingHoursData) => void;
  addHoliday: (value: HolidayClosureItem) => void;
  removeHoliday: (id: string) => void;
  updateDelivery: (value: DeliverySettingsData) => void;
  updateServiceAvailability: (value: ServiceAvailabilityData) => void;
  setStoreStatus: (value: StoreStatusValue) => void;
  updateTempClosure: (value: TempClosureData) => void;
};

const StoreSetupContext = createContext<StoreSetupContextValue | null>(null);

const DEFAULT_HOLIDAYS: HolidayClosureItem[] = [
  { id: 'diwali', title: 'Diwali', date: '01 Nov 2024', daysClosed: 2, note: 'Festival closure' },
  { id: 'dussehra', title: 'Dussehra', date: '12 Oct 2024', daysClosed: 1, note: 'Festival closure' },
  { id: 'republic-day', title: 'Republic Day', date: '26 Jan 2025', daysClosed: 1, note: 'National holiday' },
];

export function StoreSetupProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<StoreSetupData>({
    holidays: DEFAULT_HOLIDAYS,
    storeStatus: 'open',
  });

  const updateProfile = useCallback((value: StoreProfileData) => {
    setData(prev => ({ ...prev, profile: value }));
  }, []);
  const setLogoUploaded = useCallback((value: boolean, url?: string) => {
    setData(prev => ({ ...prev, logoUploaded: value, logoUrl: url ?? prev.logoUrl }));
  }, []);
  const setCoverImageUploaded = useCallback((value: boolean, url?: string) => {
    setData(prev => ({ ...prev, coverImageUploaded: value, coverImageUrl: url ?? prev.coverImageUrl }));
  }, []);
  const updateAddress = useCallback((value: StoreAddressData) => {
    setData(prev => ({ ...prev, address: value }));
  }, []);
  const updateOperatingHours = useCallback((value: OperatingHoursData) => {
    setData(prev => ({ ...prev, operatingHours: value }));
  }, []);
  const addHoliday = useCallback((value: HolidayClosureItem) => {
    setData(prev => ({ ...prev, holidays: [...prev.holidays, value] }));
  }, []);
  const removeHoliday = useCallback((id: string) => {
    setData(prev => ({ ...prev, holidays: prev.holidays.filter(item => item.id !== id) }));
  }, []);
  const updateDelivery = useCallback((value: DeliverySettingsData) => {
    setData(prev => ({ ...prev, delivery: value }));
  }, []);
  const updateServiceAvailability = useCallback((value: ServiceAvailabilityData) => {
    setData(prev => ({ ...prev, serviceAvailability: value }));
  }, []);
  const setStoreStatus = useCallback((value: StoreStatusValue) => {
    setData(prev => ({ ...prev, storeStatus: value }));
  }, []);
  const updateTempClosure = useCallback((value: TempClosureData) => {
    setData(prev => ({ ...prev, tempClosure: value }));
  }, []);

  const value = useMemo(
    () => ({
      data,
      updateProfile,
      setLogoUploaded,
      setCoverImageUploaded,
      updateAddress,
      updateOperatingHours,
      addHoliday,
      removeHoliday,
      updateDelivery,
      updateServiceAvailability,
      setStoreStatus,
      updateTempClosure,
    }),
    [
      data,
      updateProfile,
      setLogoUploaded,
      setCoverImageUploaded,
      updateAddress,
      updateOperatingHours,
      addHoliday,
      removeHoliday,
      updateDelivery,
      updateServiceAvailability,
      setStoreStatus,
      updateTempClosure,
    ],
  );

  return <StoreSetupContext.Provider value={value}>{children}</StoreSetupContext.Provider>;
}

export function useStoreSetup() {
  const context = useContext(StoreSetupContext);
  if (!context) {
    throw new Error('useStoreSetup must be used within a StoreSetupProvider');
  }
  return context;
}
