export type UserRole = 'admin' | 'manager' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  status: 'active' | 'inactive';
  lastActive?: string;
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export type PermissionResource =
  | 'dashboard'
  | 'products'
  | 'projects'
  | 'leads'
  | 'hero'
  | 'team'
  | 'partners'
  | 'users'
  | 'settings';

export type RolePermissions = Record<
  UserRole,
  Partial<Record<PermissionResource, PermissionAction[]>>
>;

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'image' | 'icon' | 'array' | 'boolean' | 'date';
  options?: string[]; // for select
  required?: boolean;
  translatable?: boolean; // optional AI auto-translate badge/feature
  placeholder?: string;
  description?: string;
}

export interface LeadApplication {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  sector: 'Export' | 'Seafood' | 'Agriculture' | 'Construction' | 'Government Tender' | 'General';
  status: 'Pending' | 'Reviewing' | 'Approved' | 'Rejected';
  budget?: string;
  message: string;
  notes?: string;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  bgImage: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'Seafood' | 'Agriculture' | 'Industrial' | 'Materials';
  origin: string;
  packaging: string;
  status: 'In Stock' | 'Seasonal' | 'On Order';
  featured: boolean;
  image: string;
  description: string;
  tags: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  category: 'Construction' | 'Infrastructure' | 'Supply' | 'Engineering';
  location: string;
  status: 'Ongoing' | 'Completed' | 'In Planning';
  client: string;
  image: string;
  description: string;
  completionDate?: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  image: string;
  bio: string;
  order: number;
}

export interface PartnerItem {
  id: string;
  name: string;
  category: 'Buyer' | 'Supplier' | 'Logistics Partner' | 'Institutional';
  country: string;
  logo: string;
  status: 'Active' | 'Pending';
  partnershipYear: number;
}
