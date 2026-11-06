import React, { useEffect, useState } from 'react';
import { CrudView } from '../components/CrudView';
import { FieldDef, PartnerItem, TradeShowItem } from '../types';
import { backendApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const CollectionLoader: React.FC = () => (
  <div className="flex h-64 w-full items-center justify-center text-slate-400">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

// ==========================================
// Global Partners
// ==========================================
const partnerFields: FieldDef[] = [
  { key: 'name', label: 'Company / Partner Name', type: 'text', required: true },
  {
    key: 'category',
    label: 'Partner Type',
    type: 'select',
    options: ['Buyer', 'Supplier', 'Logistics Partner', 'Institutional'],
    required: true,
  },
  { key: 'country', label: 'Origin / Base Country', type: 'text', required: true },
  { key: 'partnershipYear', label: 'Partner Since (Year)', type: 'number' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['Active', 'Pending'],
    required: true,
  },
  { key: 'logo', label: 'Logo Image URL', type: 'image' },
];

const INITIAL_PARTNERS: PartnerItem[] = [
  {
    id: 'part-1',
    name: 'Gulf Horizon Trading Group',
    category: 'Buyer',
    country: 'United Arab Emirates',
    partnershipYear: 2021,
    status: 'Active',
    logo: '/images/story-business-network.jpg',
  },
  {
    id: 'part-2',
    name: 'Rotterdam Fresh Cargo B.V.',
    category: 'Logistics Partner',
    country: 'Netherlands',
    partnershipYear: 2023,
    status: 'Active',
    logo: '/images/story-global-connection.jpg',
  },
];

// ==========================================
// Trade Show Calendar
// ==========================================
const tradeShowFields: FieldDef[] = [
  { key: 'eventName', label: 'Event / Exhibition Name', type: 'text', required: true },
  { key: 'startDate', label: 'Start Date', type: 'date', required: true },
  { key: 'endDate', label: 'End Date', type: 'date' },
  { key: 'location', label: 'Location (City, Country / Venue)', type: 'text', required: true },
  { key: 'boothNumber', label: 'Booth / Stand Number', type: 'text' },
  { key: 'website', label: 'Official Event Website', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'image', label: 'Banner Image', type: 'image' },
];

const INITIAL_TRADESHOWS: TradeShowItem[] = [];

export const TradeShowsPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<TradeShowItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    backendApi.collections.get<TradeShowItem>('tradeshows', INITIAL_TRADESHOWS).then((data) => {
      if (!cancelled) {
        setItems(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (item: Partial<TradeShowItem>): Promise<boolean> => {
    let updated: TradeShowItem[];
    if (item.id && items.some((t) => t.id === item.id)) {
      updated = items.map((t) => (t.id === item.id ? ({ ...t, ...item } as TradeShowItem) : t));
    } else {
      updated = [...items, { ...item, id: `show-${Date.now()}` } as TradeShowItem];
    }
    const ok = await backendApi.collections.save('tradeshows', updated);
    if (ok) setItems(updated);
    return ok;
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    const updated = items.filter((t) => t.id !== id);
    const ok = await backendApi.collections.save('tradeshows', updated);
    if (ok) setItems(updated);
    return ok;
  };

  if (isLoading) return <CollectionLoader />;

  return (
    <CrudView
      title="Trade Show Calendar"
      subtitle="Exhibitions and trade shows ANIKA attends — shown on the public Trade Shows page so buyers know where to meet in person."
      fields={tradeShowFields}
      items={items}
      onSave={handleSave}
      onDelete={handleDelete}
      canCreate={hasPermission('tradeshows', 'create')}
      canEdit={hasPermission('tradeshows', 'edit')}
      canDelete={hasPermission('tradeshows', 'delete')}
    />
  );
};

export const PartnersPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<PartnerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    backendApi.collections.get<PartnerItem>('partners', INITIAL_PARTNERS).then((data) => {
      if (!cancelled) {
        setItems(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (item: Partial<PartnerItem>): Promise<boolean> => {
    let updated: PartnerItem[];
    if (item.id && items.some((p) => p.id === item.id)) {
      updated = items.map((p) => (p.id === item.id ? ({ ...p, ...item } as PartnerItem) : p));
    } else {
      updated = [...items, { ...item, id: `part-${Date.now()}` } as PartnerItem];
    }
    const ok = await backendApi.collections.save('partners', updated);
    if (ok) setItems(updated);
    return ok;
  };

  const handleDelete = async (id: string): Promise<boolean> => {
    const updated = items.filter((p) => p.id !== id);
    const ok = await backendApi.collections.save('partners', updated);
    if (ok) setItems(updated);
    return ok;
  };

  if (isLoading) return <CollectionLoader />;

  return (
    <CrudView
      title="Global Partners"
      subtitle="Maintain verified international buyer relationships, logistics carriers, and government agencies shown on the public Partners page."
      fields={partnerFields}
      items={items}
      onSave={handleSave}
      onDelete={handleDelete}
      canCreate={hasPermission('partners', 'create')}
      canEdit={hasPermission('partners', 'edit')}
      canDelete={hasPermission('partners', 'delete')}
    />
  );
};
