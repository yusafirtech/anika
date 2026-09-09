import React, { useEffect, useState } from 'react';
import { CrudView } from '../components/CrudView';
import { FieldDef, PartnerItem } from '../types';
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

  const handleSave = (item: Partial<PartnerItem>) => {
    let updated: PartnerItem[];
    if (item.id && items.some((p) => p.id === item.id)) {
      updated = items.map((p) => (p.id === item.id ? ({ ...p, ...item } as PartnerItem) : p));
    } else {
      updated = [...items, { ...item, id: `part-${Date.now()}` } as PartnerItem];
    }
    setItems(updated);
    backendApi.collections.save('partners', updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((p) => p.id !== id);
    setItems(updated);
    backendApi.collections.save('partners', updated);
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
