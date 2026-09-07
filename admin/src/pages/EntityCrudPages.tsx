import React, { useState } from 'react';
import { CrudView } from '../components/CrudView';
import { FieldDef, ProductItem, ProjectItem, TeamMemberItem, PartnerItem } from '../types';
import { mockDb } from '../api';
import { useAuth } from '../context/AuthContext';

// ==========================================
// 1. Export Products Page
// ==========================================
const productFields: FieldDef[] = [
  { key: 'name', label: 'Product Name', type: 'text', required: true, placeholder: 'e.g. Black Tiger Shrimp (HOSO)' },
  {
    key: 'category',
    label: 'Category',
    type: 'select',
    options: ['Seafood', 'Agriculture', 'Industrial', 'Materials'],
    required: true,
  },
  { key: 'origin', label: 'Origin Source', type: 'text', placeholder: 'e.g. Khulna / Cox’s Bazar, Bangladesh' },
  { key: 'packaging', label: 'Packaging / Grade', type: 'text', placeholder: 'e.g. Master Carton / IQF / Block' },
  {
    key: 'status',
    label: 'Supply Status',
    type: 'select',
    options: ['In Stock', 'Seasonal', 'On Order'],
    required: true,
  },
  { key: 'featured', label: 'Featured on Homepage', type: 'boolean' },
  { key: 'image', label: 'Product Image URL', type: 'image', placeholder: '/images/story-seafood.jpg' },
  { key: 'tags', label: 'Tags / Specs', type: 'array' },
  { key: 'description', label: 'Product Specifications', type: 'textarea', translatable: true, required: true },
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Black Tiger Shrimp (Penaeus monodon)',
    category: 'Seafood',
    origin: 'Coastal Khulna & Satkhira, Bangladesh',
    packaging: 'IQF / Semi-IQF Block Frozen, 1kg / 2kg inner cartons',
    status: 'In Stock',
    featured: true,
    image: '/images/story-seafood.jpg',
    tags: ['BAP Certified', 'Export Grade', 'HACCP Compliant'],
    description: 'Direct origin procurement from coastal aquaculture farms. Rigorous cold chain maintained from harvest to blast freezing at -40°C.',
  },
  {
    id: 'prod-2',
    name: 'Freshwater Giant River Prawn (Galda)',
    category: 'Seafood',
    origin: 'Barisal & Bagerhat, Bangladesh',
    packaging: 'Head-on shell-on (HOSO), custom buyer grading',
    status: 'In Stock',
    featured: true,
    image: '/images/story-seafood-closeup.jpg',
    tags: ['Export Grade', 'Wild & Farmed'],
    description: 'Premium sweet-flesh river prawns, graded and packed according to European and Middle Eastern retail requirements.',
  },
  {
    id: 'prod-3',
    name: 'Fresh Export Potatoes (Diamond / Granola)',
    category: 'Agriculture',
    origin: 'Bogra & Rangpur belt, Bangladesh',
    packaging: '10kg, 25kg, 50kg mesh bags',
    status: 'Seasonal',
    featured: false,
    image: '/images/story-vegetable-market.jpg',
    tags: ['Grade A', 'Phytosanitary Certified'],
    description: 'High dry-matter table potatoes, washed and graded under strict phytosanitary guidelines for bulk sea cargo export.',
  },
  {
    id: 'prod-4',
    name: 'Structural Reinforcement Deformed Steel Bars',
    category: 'Materials',
    origin: 'Chittagong Industrial Zone, Bangladesh',
    packaging: 'Bundled standard 12m length with color-coded tags',
    status: 'In Stock',
    featured: true,
    image: '/images/materials-detail.jpg',
    tags: ['Grade 500W', 'BUET Tested', 'ASTM A615'],
    description: 'High-strength thermo-mechanically treated rebar for mega-infrastructure, flyover, and bridge construction projects.',
  },
];

export const ExportProductsPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<ProductItem[]>(() =>
    mockDb.getCollection('products', INITIAL_PRODUCTS)
  );

  const handleSave = (item: Partial<ProductItem>) => {
    let updated: ProductItem[];
    if (item.id && items.some((p) => p.id === item.id)) {
      updated = items.map((p) => (p.id === item.id ? ({ ...p, ...item } as ProductItem) : p));
    } else {
      updated = [
        ...items,
        {
          ...item,
          id: `prod-${Date.now()}`,
          tags: item.tags || [],
          featured: !!item.featured,
        } as ProductItem,
      ];
    }
    setItems(updated);
    mockDb.saveCollection('products', updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((p) => p.id !== id);
    setItems(updated);
    mockDb.saveCollection('products', updated);
  };

  return (
    <CrudView
      title="Export &amp; Trade Products"
      subtitle="Manage product specifications, grading, origin, and international export catalog items."
      fields={productFields}
      items={items}
      onSave={handleSave}
      onDelete={handleDelete}
      canCreate={hasPermission('products', 'create')}
      canEdit={hasPermission('products', 'edit')}
      canDelete={hasPermission('products', 'delete')}
    />
  );
};

// ==========================================
// 2. Projects Page
// ==========================================
const projectFields: FieldDef[] = [
  { key: 'name', label: 'Project Title', type: 'text', required: true, placeholder: 'e.g. Infrastructure & Environment' },
  {
    key: 'category',
    label: 'Sector Category',
    type: 'select',
    options: ['Construction', 'Infrastructure', 'Supply', 'Engineering'],
    required: true,
  },
  { key: 'location', label: 'Project Location', type: 'text', placeholder: 'e.g. Bangladesh' },
  { key: 'client', label: 'Client / Authority', type: 'text', placeholder: 'e.g. Roads & Highways Department' },
  {
    key: 'status',
    label: 'Execution Status',
    type: 'select',
    options: ['Ongoing', 'Completed', 'In Planning'],
    required: true,
  },
  { key: 'completionDate', label: 'Target Completion', type: 'date' },
  { key: 'image', label: 'Cover Image URL', type: 'image', placeholder: '/images/project-bridge.jpg' },
  { key: 'description', label: 'Project Scope & Details', type: 'textarea', required: true },
];

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'Infrastructure & Environment Project',
    category: 'Infrastructure',
    location: 'Dhaka & Chittagong Corridor, Bangladesh',
    client: 'Ministry of Road Transport and Bridges',
    status: 'Ongoing',
    completionDate: '2027-06-30',
    image: '/images/project-bridge.jpg',
    description: 'Infrastructure-scale civil engineering, structural rebar logistics, and site coordination.',
  },
  {
    id: 'proj-2',
    name: 'Commercial High-Rise Development',
    category: 'Construction',
    location: 'Gulshan, Dhaka, Bangladesh',
    client: 'Apex Urban Estates',
    status: 'Ongoing',
    completionDate: '2026-12-15',
    image: '/images/project-building.jpg',
    description: 'Ground-up structural building construction, coordinated across materials, manpower, and MEP requirements.',
  },
  {
    id: 'proj-3',
    name: 'Bulk Riverine Dredging & Site Logistics',
    category: 'Engineering',
    location: 'Mongla Port Access Channel, Bangladesh',
    client: 'Mongla Port Authority',
    status: 'Ongoing',
    completionDate: '2026-11-01',
    image: '/images/project-engineering.jpg',
    description: 'Channel stabilization, aggregate transport, and materials supply logistics for institutional facilities.',
  },
];

export const ProjectsPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<ProjectItem[]>(() =>
    mockDb.getCollection('projects', INITIAL_PROJECTS)
  );

  const handleSave = (item: Partial<ProjectItem>) => {
    let updated: ProjectItem[];
    if (item.id && items.some((p) => p.id === item.id)) {
      updated = items.map((p) => (p.id === item.id ? ({ ...p, ...item } as ProjectItem) : p));
    } else {
      updated = [...items, { ...item, id: `proj-${Date.now()}` } as ProjectItem];
    }
    setItems(updated);
    mockDb.saveCollection('projects', updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((p) => p.id !== id);
    setItems(updated);
    mockDb.saveCollection('projects', updated);
  };

  return (
    <CrudView
      title="Engineering &amp; Construction Projects"
      subtitle="Showcase institutional contracts, ongoing infrastructure execution, and supply delivery milestones."
      fields={projectFields}
      items={items}
      onSave={handleSave}
      onDelete={handleDelete}
      canCreate={hasPermission('projects', 'create')}
      canEdit={hasPermission('projects', 'edit')}
      canDelete={hasPermission('projects', 'delete')}
    />
  );
};

// ==========================================
// 3. Team Members Page
// ==========================================
const teamFields: FieldDef[] = [
  { key: 'name', label: 'Full Name', type: 'text', required: true },
  { key: 'role', label: 'Designation', type: 'text', required: true, placeholder: 'e.g. Head of Export Logistics' },
  { key: 'department', label: 'Department', type: 'text', placeholder: 'e.g. International Trade' },
  { key: 'email', label: 'Contact Email', type: 'text' },
  { key: 'order', label: 'Display Order', type: 'number' },
  { key: 'image', label: 'Profile Photo URL', type: 'image' },
  { key: 'bio', label: 'Executive Bio', type: 'textarea' },
];

const INITIAL_TEAM: TeamMemberItem[] = [
  {
    id: 'team-1',
    name: 'K. M. Tareq',
    role: 'Chief Executive Officer & Founder',
    department: 'Executive Board',
    email: 'k.tareq@anikatrading.com',
    order: 1,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Over two decades of multi-sector trading experience connecting Bangladesh supply lines to worldwide markets.',
  },
  {
    id: 'team-2',
    name: 'S. N. Rahman',
    role: 'Director of International Export',
    department: 'Trade & Export',
    email: 'rahman@anikatrading.com',
    order: 2,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Leads seafood cold-chain compliance and agricultural produce export operations across Europe and the GCC.',
  },
];

export const TeamPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [items, setItems] = useState<TeamMemberItem[]>(() =>
    mockDb.getCollection('team', INITIAL_TEAM)
  );

  const handleSave = (item: Partial<TeamMemberItem>) => {
    let updated: TeamMemberItem[];
    if (item.id && items.some((p) => p.id === item.id)) {
      updated = items.map((p) => (p.id === item.id ? ({ ...p, ...item } as TeamMemberItem) : p));
    } else {
      updated = [...items, { ...item, id: `team-${Date.now()}` } as TeamMemberItem];
    }
    setItems(updated);
    mockDb.saveCollection('team', updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((p) => p.id !== id);
    setItems(updated);
    mockDb.saveCollection('team', updated);
  };

  return (
    <CrudView
      title="Corporate Leadership &amp; Team"
      subtitle="Manage corporate directory, board members, and sector leads displayed on the About page."
      fields={teamFields}
      items={items}
      onSave={handleSave}
      onDelete={handleDelete}
      canCreate={hasPermission('team', 'create')}
      canEdit={hasPermission('team', 'edit')}
      canDelete={hasPermission('team', 'delete')}
    />
  );
};

// ==========================================
// 4. Partners Page
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
  const [items, setItems] = useState<PartnerItem[]>(() =>
    mockDb.getCollection('partners', INITIAL_PARTNERS)
  );

  const handleSave = (item: Partial<PartnerItem>) => {
    let updated: PartnerItem[];
    if (item.id && items.some((p) => p.id === item.id)) {
      updated = items.map((p) => (p.id === item.id ? ({ ...p, ...item } as PartnerItem) : p));
    } else {
      updated = [...items, { ...item, id: `part-${Date.now()}` } as PartnerItem];
    }
    setItems(updated);
    mockDb.saveCollection('partners', updated);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((p) => p.id !== id);
    setItems(updated);
    mockDb.saveCollection('partners', updated);
  };

  return (
    <CrudView
      title="Global Partners &amp; Institutional Clients"
      subtitle="Maintain verified international buyer relationships, logistics carriers, and government agencies."
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
