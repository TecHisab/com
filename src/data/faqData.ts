export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'services' | 'tax' | 'software' | 'training';
}

export const FAQ_LIST: FAQItem[] = [
  {
    category: 'general',
    question: 'What is TecHisab and how does your model help businesses?',
    answer:
      'TecHisab is an ITES & FINTEC company that combines professional Accounting, Finance, Tax & VAT support, Payroll and BPO operations with Business Software, Website Development, Digital Automation and Practical Training under one roof.',
  },
  {
    category: 'services',
    question: 'How does outsourced accounting and bookkeeping work?',
    answer:
      'After reviewing your transaction volume and business scope, we establish a structured voucher and document sharing workflow. We record daily entries, reconcile bank and counterparty balances, and prepare clear monthly financial and MIS statements.',
  },
  {
    category: 'tax',
    question: 'Does TecHisab assist with both individual and corporate tax & VAT support?',
    answer:
      'Yes. We provide income tax computation and return preparation support for individuals and companies, TDS and advance tax calculations, as well as VAT documentation, Mushak working files and return preparation assistance under applicable Bangladesh laws.',
  },
  {
    category: 'software',
    question: 'Are your website software demos live production accounts or interactive previews?',
    answer:
      'The interactive tools embedded on our Software page are browser-based sandboxes designed so you can test workflows (double-entry ledgers, tax slab math, payroll TDS, POS cart, and Jibon mobile views) before requesting a live workspace setup for your company.',
  },
  {
    category: 'software',
    question: 'Can software and service prices vary by requirement?',
    answer:
      'Yes. Listed monthly and annual software fees as well as starting service charges are indicative introductory prices and may vary according to package scope, user count, branch structure and business requirements.',
  },
  {
    category: 'training',
    question: 'Are TecHisab training programs available online and in Chittagong?',
    answer:
      'Yes. We conduct live interactive online batches alongside scheduled in-person workshops and corporate team training at our Chittagong facility near Hakkani Pump, Naya Bazar Biswa Road More.',
  },
  {
    category: 'general',
    question: 'How do you handle client financial confidentiality?',
    answer:
      'Client financial data, tax files and business records are treated strictly confidentially with scoped access controls and non-disclosure commitments—never shared with or sold to third parties.',
  },
];
