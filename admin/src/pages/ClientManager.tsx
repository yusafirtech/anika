import React, { useEffect, useState } from 'react';
import { CrudView } from '../components/CrudView';
import { FieldDef, ClientItem } from '../types';
import { backendApi } from '../api';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const clientFields: FieldDef[] = [
  { key: 'name', label: 'Client / Company Name', type: 'text', required: true, placeholder: 'e.g. Gulf Horizon Trading LLC' },
  { key: 'contactPerson', label: 'Contact Person', type: 'text', placeholder: 'e.g. Tariq Al-Mansoor' },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'contact@client.com' },
  { key: 'phone', label: 'Phone', type: 'text', placeholder: '+971 4 882 1920' },
  { key: 'address', label: 'Address / Country', type: 'text', placeholder: 'e.g. Dubai, United Arab Emirates' },
  { key: 'sector', label: 'Industry / Sector', type: 'text', placeholder: 'e.g. Seafood' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['Active', 'Inactive', 'Prospect'],
    required: true,
  },
  { key: 'logo', label: 'Logo (Optional)', type: 'image' },
  { key: 'clientSince', label: 'Client Since', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

export const ClientManager: React.FC = () => {
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    backendApi.clients.getAll().then((data) => {
      if (!cancelled) {
        setItems(data);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (item: Partial<ClientItem>) => {
    if (item.id && items.some((c) => c.id === item.id)) {
      const { client } = await backendApi.clients.update(item.id, item);
      setItems(items.map((c) => (c.id === client.id ? { ...c, ...client } : c)));
    } else {
      const { client } = await backendApi.clients.create({ status: 'Active', ...item });
      setItems([client, ...items]);
    }
  };

  const handleDelete = async (id: string) => {
    setItems(items.filter((c) => c.id !== id));
    await backendApi.clients.delete(id);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <CrudView
      title="Client Management"
      subtitle="Maintain the company's client relationships — contact details, sector, status, and account notes."
      fields={clientFields}
      items={items}
      onSave={handleSave}
      onDelete={handleDelete}
      canCreate={hasPermission('clients', 'create')}
      canEdit={hasPermission('clients', 'edit')}
      canDelete={hasPermission('clients', 'delete')}
    />
  );
};
