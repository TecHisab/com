export type NavigationTab =
  | 'home'
  | 'about'
  | 'services'
  | 'software'
  | 'training'
  | 'pricing'
  | 'blog'
  | 'contact'
  | 'software-tax'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'refund-policy'
  | 'tax-disclaimer';

export type UserRole = 'guest' | 'customer' | 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  company?: string;
  avatarUrl?: string;
  joinedDate: string;
}

export interface ServiceTechnicalSpecs {
  architecture: string;
  security: string;
  delivery: string;
  protocol: string;
  compliance: string;
}

export type ServiceCategoryKey =
  | 'accounting'
  | 'payroll'
  | 'tax'
  | 'technology'
  | 'bpo'
  | 'training';

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategoryKey;
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  deliverables: string[];
  idealFor: string;
  iconName: string;
  tag?: string;
  startingRate?: string;
  techSpecs?: ServiceTechnicalSpecs;
}

export type SoftwareDemoKey =
  | 'business'
  | 'erp'
  | 'cloud-accounting'
  | 'retail-manager'
  | 'pos-pro'
  | 'trade-manager'
  | 'inventory-pro'
  | 'one'
  | 'jibon'
  | 'calculators';

export interface SoftwareProduct {
  id: string;
  name: string;
  badge: string;
  statusLabel: string;
  tagline: string;
  category: string;
  mainFunctionality: string;
  description: string;
  longDescription: string;
  iconName: string;
  isAvailable: boolean;
  monthlyPriceLabel: string;
  annualPriceLabel: string;
  startingPrice: string;
  demoTabKey: SoftwareDemoKey;
  modules: string[];
  features: string[];
  specs: {
    deployment: string;
    security: string;
    integrations: string[];
    compliance: string[];
  };
  faqs: { question: string; answer: string }[];
}

export interface CourseItem {
  id: string;
  title: string;
  category: 'accounting' | 'office' | 'technology' | 'tax' | 'finance' | 'bundle';
  categoryLabel: string;
  level: string;
  duration: string;
  sessions: string;
  shortDesc: string;
  fullDesc: string;
  curriculum: string[];
  features: string[];
  toolsCovered: string[];
  regularFee: number | null;
  feeDisplay: string;
  nextBatch: string;
  certificateProvided: boolean;
  iconName: string;
}

export type TrainingCourse = CourseItem;

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | string;
  annualPrice: number | string;
  popular?: boolean;
  highlighted?: boolean;
  description?: string;
  targetAudience?: string;
  category: 'software' | 'accounting-bpo' | 'individual-software';
  features: string[];
  limits: string;
  ctaText: string;
}

export type PricingTier = PricingPlan;

export interface ProductPricingItem {
  id: string;
  softwareName: string;
  subtitle: string;
  badge?: string;
  category: string;
  iconName: string;
  monthlyPrice: number;
  annualPrice: number;
  billingUnit: 'per month' | 'per year';
  popular?: boolean;
  limits: string;
  features: string[];
  ctaText: string;
  demoTabKey?: SoftwareDemoKey;
}

export interface ServiceChargeItem {
  id: string;
  serviceName: string;
  startingPrice: string;
  billingCycle: string;
  scopeSummary: string;
  inclusions: string[];
  iconName: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category:
    | 'Accounting & Finance'
    | 'Bangladesh Tax'
    | 'VAT & Mushak'
    | 'Excel & Google Sheets'
    | 'QuickBooks & Xero'
    | 'Business Technology'
    | 'Software Tutorials'
    | 'Professional Training'
    | 'Business Management';
  author: {
    name: string;
    role: string;
  };
  date: string;
  updatedAt?: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  tags: string[];
  content: string[];
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceCategory: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'in-progress' | 'converted';
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredBatch: string;
  submittedAt: string;
  status: 'pending' | 'confirmed';
}

export interface TaxRuleConfig {
  taxYear: string;
  assessmentYear: string;
  generalExemptionLimit: number;
  womenAndSeniorLimit: number;
  disabledLimit: number;
  freedomFighterLimit: number;
  disabledDependentBonus: number;
  taxSlabs: {
    incomeCap: number;
    rate: number;
  }[];
  minTaxByLocation: {
    dhakaChittagongCityCorporation: number;
    otherCityCorporation: number;
    nonCityArea: number;
    newTaxpayer: number;
  };
  investmentRebateMaxCap: number;
  rebateRateOnTaxableIncome: number;
  rebateRateOnInvestment: number;
  dpsAnnualLimit: number;
  salaryDeductionCap: number;
}
