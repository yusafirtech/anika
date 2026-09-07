import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach bearer token
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response interceptor: handle 401 redirects & error normalization
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// Mock Storage Layer for Frontend-only Demo
// (Ensures the Admin Panel is immediately functional without requiring an active backend)
// ==========================================

const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'Tariq Al-Mansoor',
    company: 'Gulf Horizon Trading LLC',
    email: 'tariq@gulfhorizon.ae',
    phone: '+971 4 882 1920',
    sector: 'Seafood',
    status: 'Pending',
    budget: '$150,000 - $300,000',
    message: 'Seeking bulk supply contracts for Black Tiger shrimp and freshwater prawn for Q4 retail distribution in Dubai and Qatar.',
    notes: 'Requested export certificate and cold-chain compliance specs.',
    createdAt: '2026-09-06T10:14:00Z',
  },
  {
    id: 'lead-2',
    name: 'Marcus Vance',
    company: 'EuroAsia Logistics BV',
    email: 'm.vance@euroasialog.nl',
    phone: '+31 20 592 3311',
    sector: 'Agriculture',
    status: 'Reviewing',
    budget: '$80,000 - $120,000',
    message: 'Inquiring about organic potato and fresh vegetable cargo freight schedules from Chittagong port to Rotterdam.',
    notes: 'Reviewed preliminary packing standards.',
    createdAt: '2026-09-05T14:30:00Z',
  },
  {
    id: 'lead-3',
    name: 'Eng. Rafiqul Islam',
    company: 'Padma Bridge Rail Extension Project',
    email: 'rafiqul.project@padmarail.gov.bd',
    phone: '+880 1711 902341',
    sector: 'Government Tender',
    status: 'Approved',
    budget: '$1,200,000',
    message: 'Specification submission for high-grade structural reinforcement steel and aggregate grading tender package 04.',
    notes: 'Contract awarded. Signed preliminary NDA.',
    createdAt: '2026-09-02T09:00:00Z',
  },
  {
    id: 'lead-4',
    name: 'Sarah Chen',
    company: 'Pacific Rim Supply Partners',
    email: 'schen@pacrimsupply.sg',
    phone: '+65 6722 8901',
    sector: 'Export',
    status: 'Pending',
    budget: '$500,000+',
    message: 'Exploring annual partnership for frozen seafood processing and custom private label packaging.',
    createdAt: '2026-09-07T08:20:00Z',
  }
];

const INITIAL_HERO = [
  {
    id: 'hero-1',
    title: 'Building. Supplying. Exporting. Connecting.',
    subtitle: 'ANIKA TRADING & CO. connects Bangladesh capabilities with projects, supply chains and international markets.',
    badgeText: 'One Company · Multiple Sectors · One Connected Business',
    bgImage: '/images/hero-port-supply-route.jpg',
    ctaText: 'START A CONVERSATION',
    ctaLink: '/contact',
    active: true,
    order: 1,
  },
  {
    id: 'hero-2',
    title: 'Global Grade Seafood & Agricultural Export',
    subtitle: 'Certified processing, cold chain discipline, and direct B2B supply lines from origin to international ports.',
    badgeText: 'International B2B Supply',
    bgImage: '/images/story-seafood.jpg',
    ctaText: 'EXPLORE EXPORT',
    ctaLink: '/export',
    active: true,
    order: 2,
  },
  {
    id: 'hero-3',
    title: 'Infrastructure & Construction Execution',
    subtitle: 'End-to-end materials logistics, site engineering coordination, and institutional tender delivery.',
    badgeText: 'Construction & Government Tender',
    bgImage: '/images/project-bridge.jpg',
    ctaText: 'VIEW PROJECTS',
    ctaLink: '/projects',
    active: false,
    order: 3,
  }
];

const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Managing Director',
    email: 'admin@anikatrading.com',
    role: 'admin',
    department: 'Executive Board',
    status: 'active',
    lastActive: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-2',
    name: 'Operations Manager',
    email: 'operations@anikatrading.com',
    role: 'manager',
    department: 'Supply & Logistics',
    status: 'active',
    lastActive: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-3',
    name: 'Content & Media Editor',
    email: 'editor@anikatrading.com',
    role: 'editor',
    department: 'Marketing & Brand',
    status: 'active',
    lastActive: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-4',
    name: 'Trade Analyst (Auditor)',
    email: 'analyst@anikatrading.com',
    role: 'viewer',
    department: 'Trade Compliance',
    status: 'inactive',
    lastActive: '5 days ago',
  }
];

import { LeadApplication, HeroSlide, User } from './types';

function getStored<T>(key: string, fallback: T): T {
  const data = localStorage.getItem(`anika_admin_${key}`);
  if (!data) {
    localStorage.setItem(`anika_admin_${key}`, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  localStorage.setItem(`anika_admin_${key}`, JSON.stringify(value));
}

export const mockDb = {
  getLeads: (): LeadApplication[] => getStored('leads', INITIAL_LEADS as LeadApplication[]),
  saveLeads: (leads: LeadApplication[]) => setStored('leads', leads),
  getHero: (): HeroSlide[] => getStored('hero', INITIAL_HERO as HeroSlide[]),
  saveHero: (slides: HeroSlide[]) => setStored('hero', slides),
  getUsers: (): User[] => getStored('users', INITIAL_USERS as User[]),
  saveUsers: (users: User[]) => setStored('users', users),
  getCollection: <T>(name: string, fallback: T[]): T[] => getStored(name, fallback),
  saveCollection: <T>(name: string, data: T[]) => setStored(name, data),
};
