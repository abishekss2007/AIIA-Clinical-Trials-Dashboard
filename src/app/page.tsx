'use client';

import {
  ArrowRight,
  Bell,
  BriefcaseMedical,
  ChevronDown,
  Filter,
  FolderKanban,
  GraduationCap,
  HeartPulse,
  KeyRound,
  LockKeyhole,
  MonitorCog,
  Plus,
  Search,
  ShieldCheck,
  UserCircle2,
  Users,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { apiBaseUrl } from '@/lib/config';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const roleNavMap = {
  'Principal Investigator': [
    'Dashboard',
    'Studies & Sites',
    'Participants',
    'Visits & Interventions',
    'Ayurveda Assessments / CRFs',
    'Safety & Pharmacovigilance',
    'Ethics & CTRI Compliance',
    'Documents & Consent',
    'Data Queries & Deviations',
    'Reports & Interoperability',
    'Audit Trail',
    'Security & Administration',
  ],
  'Research Coordinator': [
    'Dashboard',
    'Participants',
    'Visits & Interventions',
    'Ayurveda Assessments / CRFs',
    'Safety & Pharmacovigilance',
    'Documents & Consent',
    'Data Queries & Deviations',
    'Reports & Interoperability',
    'Audit Trail',
  ],
  'Pharmacovigilance Officer': [
    'Dashboard',
    'Safety & Pharmacovigilance',
    'Ethics & CTRI Compliance',
    'Participants',
    'Reports & Interoperability',
    'Audit Trail',
    'Security & Administration',
  ],
  'Ethics Committee Member': [
    'Dashboard',
    'Ethics & CTRI Compliance',
    'Participants',
    'Safety & Pharmacovigilance',
    'Documents & Consent',
    'Reports & Interoperability',
    'Audit Trail',
  ],
  Monitor: [
    'Dashboard',
    'Studies & Sites',
    'Participants',
    'Visits & Interventions',
    'Data Queries & Deviations',
    'Reports & Interoperability',
    'Audit Trail',
  ],
  Sponsor: [
    'Dashboard',
    'Studies & Sites',
    'Safety & Pharmacovigilance',
    'Ethics & CTRI Compliance',
    'Reports & Interoperability',
    'Audit Trail',
  ],
  'Institution Leadership': [
    'Dashboard',
    'Studies & Sites',
    'Reports & Interoperability',
    'Security & Administration',
    'Audit Trail',
  ],
  'Auditor / Regulator': [
    'Dashboard',
    'Reports & Interoperability',
    'Audit Trail',
    'Security & Administration',
  ],
  'System Administrator': [
    'Dashboard',
    'Security & Administration',
    'Studies & Sites',
    'Audit Trail',
    'Reports & Interoperability',
  ],
} as const;

const roleCards = [
  {
    name: 'Principal Investigator',
    label: 'Assigned-study oversight · MFA required',
    icon: BriefcaseMedical,
  },
  {
    name: 'Research Coordinator',
    label: 'Participant, visit, and consent entry',
    icon: Users,
  },
  {
    name: 'Pharmacovigilance Officer',
    label: 'AE/SAE review and reporting timelines · MFA required',
    icon: HeartPulse,
  },
  {
    name: 'Ethics Committee Member',
    label: 'Ethics approvals, amendments, consent, and safety review',
    icon: ShieldCheck,
  },
  {
    name: 'Monitor',
    label: 'Monitoring, protocol deviations, and data-quality checks',
    icon: MonitorCog,
  },
  {
    name: 'Sponsor',
    label: 'Sponsor-level study and safety oversight, where applicable',
    icon: FolderKanban,
  },
  {
    name: 'Institution Leadership',
    label: 'Portfolio-level KPIs only; no participant-level identifiers',
    icon: GraduationCap,
  },
  {
    name: 'Auditor / Regulator',
    label: 'Read-only compliance reports and audit history · MFA required',
    icon: LockKeyhole,
  },
  {
    name: 'System Administrator',
    label: 'Users, roles, and configuration · MFA required',
    icon: KeyRound,
  },
] as const;

const recruitmentTrend = [
  { month: 'Jan', planned: 20, actual: 16 },
  { month: 'Feb', planned: 35, actual: 30 },
  { month: 'Mar', planned: 50, actual: 42 },
  { month: 'Apr', planned: 65, actual: 54 },
  { month: 'May', planned: 80, actual: 62 },
  { month: 'Jun', planned: 95, actual: 78 },
];

const sitePerformance = [
  { site: 'New Delhi (AIIA)', target: 50, enrolled: 42, status: 'Healthy' },
  { site: 'Goa', target: 25, enrolled: 24, status: 'Healthy' },
  { site: 'Bengaluru', target: 25, enrolled: 12, status: 'At risk' },
];

const alertData = [
  { label: 'Critical', value: 1 },
  { label: 'Warning', value: 3 },
  { label: 'Information', value: 2 },
];

const alertColors = ['#dc2626', '#f59e0b', '#0f172a'];

const studies = [
  {
    id: 'AIIA-001',
    title: 'Ayurvedic formulation as add-on therapy in knee osteoarthritis',
    type: 'Interventional',
    pi: 'Dr. Ananya Nair',
    sites: 3,
    recruit: '78 / 95',
    status: 'Active',
    ctri: 'Registered',
    ethics: 'Active',
    health: 68,
    sae: 1,
    action: 'Open',
  },
  {
    id: 'AIIA-002',
    title: 'Yoga and herbal decoction in stress-related insomnia',
    type: 'Behavioral',
    pi: 'Dr. R. Malhotra',
    sites: 2,
    recruit: '44 / 60',
    status: 'Active',
    ctri: 'Registered',
    ethics: 'Active',
    health: 72,
    sae: 0,
    action: 'Open',
  },
  {
    id: 'AIIA-003',
    title: 'Tinospora-based protocol for chronic fatigue management',
    type: 'Observational',
    pi: 'Dr. K. Iyer',
    sites: 1,
    recruit: '18 / 40',
    status: 'Paused',
    ctri: 'Submitted',
    ethics: 'Pending',
    health: 41,
    sae: 0,
    action: 'Review',
  },
];

const auditFeed = [
  { time: '09:42', user: 'Dr. Ananya Nair', role: 'PI', action: 'SAE-014 signed off', module: 'Safety' },
  { time: '09:15', user: 'R. Soni', role: 'PV Officer', action: 'Updated causality assessment', module: 'PV Review' },
  { time: '08:54', user: 'N. Bhandari', role: 'Coordinator', action: 'Visit attended and intervention logged', module: 'Visits' },
  { time: '08:26', user: 'E. Mehta', role: 'IEC Member', action: 'Approval expiry reminder acknowledged', module: 'Ethics' },
];

const safetyCases = [
  {
    id: 'SAE-014',
    subject: 'SUB-AIIA-001-042',
    study: 'AIIA-001',
    event: 'Severe breathing difficulty',
    severity: 'Severe',
    seriousness: 'Yes',
    status: 'PV Review',
    due: '18h 59m remaining',
    owner: 'PV Officer',
  },
  {
    id: 'AE-321',
    subject: 'SUB-AIIA-001-018',
    study: 'AIIA-001',
    event: 'Mild dyspepsia',
    severity: 'Mild',
    seriousness: 'No',
    status: 'Submitted',
    due: '3d',
    owner: 'Coordinator',
  },
];

const momentumData = [
  { name: 'Recruitment', value: 78 },
  { name: 'Dose completion', value: 70 },
  { name: 'Visit adherence', value: 82 },
  { name: 'Data quality', value: 88 },
];

const fhirSample = `{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "ResearchStudy",
        "id": "AIIA-001",
        "title": "Ayurvedic formulation as add-on therapy in knee osteoarthritis"
      }
    }
  ]
}`;

const odfMapping = [
  { internal: 'Subject ID', cdash: 'Subject identifier', odm: 'ODM ItemData', sdtm: 'DM.USUBJID' },
  { internal: 'Assessment date', cdash: 'Assessment date', odm: 'ODM ItemData', sdtm: 'CE.USDTC' },
  { internal: 'Adverse event term', cdash: 'AE term', odm: 'ODM ItemData', sdtm: 'AE.AETERM' },
  { internal: 'Consent version', cdash: 'Consent version', odm: 'ODM ItemData', sdtm: 'SUPPDM.QVAL' },
];

const complianceRows = [
  { item: 'IEC renewal due', owner: 'EC Secretariat', due: '15 days', priority: 'High', status: 'Open' },
  { item: 'Protocol amendment awaiting review', owner: 'PI', due: '23 days', priority: 'Medium', status: 'Draft' },
  { item: 'CTRI update due', owner: 'Study Coordinator', due: '12 days', priority: 'Medium', status: 'Open' },
  { item: 'Safety report follow-up due', owner: 'PV Officer', due: '4 days', priority: 'Critical', status: 'Open' },
];

const securityControls = [
  'RBAC and least privilege',
  'TLS-protected communication',
  'Encryption at rest and backups',
  'Private networking and access logs',
  'MFA for privileged roles',
  'Synthetic demo data only',
];

function StatusPill({ label, tone = 'slate' }: { label: string; tone?: 'green' | 'amber' | 'red' | 'navy' | 'slate' | 'orange' }) {
  const styles = {
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    navy: 'bg-slate-900 text-white border-slate-900',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles[tone]}`}>{label}</span>;
}

function MetricCard({ title, value, subtext, tone = 'navy' }: { title: string; value: string; subtext: string; tone?: 'navy' | 'orange' | 'green' | 'amber' | 'red' | 'slate' }) {
  const tones = {
    navy: 'bg-slate-900 text-white',
    orange: 'bg-orange-100 text-orange-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</div>
      <div className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${tones[tone]}`}>{value}</div>
      <div className="mt-3 text-xs text-slate-500">{subtext}</div>
    </div>
  );
}

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<(typeof roleCards)[number]['name']>('Principal Investigator');
  const [activeSection, setActiveSection] = useState<string>('Dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [selectedCase, setSelectedCase] = useState('SAE-014');
  const [auditEntries, setAuditEntries] = useState(auditFeed);

  const navItems = roleNavMap[selectedRole];

  const handleRoleSelect = (role: (typeof roleCards)[number]['name']) => {
    setSelectedRole(role);
    setOtpOpen(true);
    setActiveSection(roleNavMap[role][0]);
  };

  const verifyOtp = () => {
    if (otpValue === '482913' || otpValue.length === 6) {
      setIsLoggedIn(true);
      setOtpOpen(false);
      setOtpValue('');
      const newEntry = {
        time: 'Now',
        user: selectedRole,
        role: selectedRole,
        action: 'Prototype login verified',
        module: 'Access Control',
      };
      setAuditEntries((prev) => [newEntry, ...prev]);
    }
  };

  const switchRole = (role: (typeof roleCards)[number]['name']) => {
    setSelectedRole(role);
    setActiveSection(roleNavMap[role][0]);
  };

  const currentCase = safetyCases.find((item) => item.id === selectedCase) ?? safetyCases[0];

  const renderDashboard = () => {
    const roleSpecificHeading =
      selectedRole === 'Principal Investigator'
        ? 'Principal Investigator overview'
        : selectedRole === 'Pharmacovigilance Officer'
          ? 'Safety and PV operations'
          : selectedRole === 'Ethics Committee Member'
            ? 'Ethics review dashboard'
            : selectedRole === 'Institution Leadership'
              ? 'Portfolio leadership overview'
              : 'Operational dashboard';

    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-300">Study AIIA-001</div>
              <h2 className="mt-3 text-3xl font-semibold">Trial Health Score: 68 / 100</h2>
            </div>
            <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-slate-200">{roleSpecificHeading}</div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <div>
              <div className="mb-2 text-sm text-slate-300">Health score calculation</div>
              <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-[68%] rounded-full bg-orange-400" />
              </div>
              <p className="text-sm text-slate-300">
                Health Score uses configurable recruitment, compliance, safety, visit, consent, and data-quality rules. Every score change is explainable and auditable.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              <div className="mb-2 font-semibold text-white">Score drivers</div>
              <ul className="space-y-2">
                <li>Recruitment: 78 enrolled vs 95 planned by today; 18% behind; score impact -12</li>
                <li>Ethics approval expires in 15 days; impact -8</li>
                <li>Five missed follow-up visits; impact -7</li>
                <li>One SAE pending PV review; impact -5</li>
                <li>No participant requires re-consent; impact 0</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Needs Attention Now</h3>
            </div>
            <div className="space-y-4">
              {[{ severity: 'Critical', text: 'SAE SAE-014 · SUB-AIIA-001-042', detail: 'Severe breathing difficulty. Configured reporting target: 18h 59m remaining.', action: 'Open SAE', onClick: () => { setActiveSection('Safety & Pharmacovigilance'); setSelectedCase('SAE-014'); } }, { severity: 'Warning', text: 'Ethics Committee approval expires in 15 days', detail: 'Review continuing review submission and renewal pack.', action: 'Open compliance record', onClick: () => setActiveSection('Ethics & CTRI Compliance') }, { severity: 'Warning', text: '5 missed follow-up visits', detail: 'Follow-up tasks require coordinator review.', action: 'Review visits', onClick: () => setActiveSection('Visits & Interventions') }, { severity: 'Information', text: 'Slow recruitment at Bengaluru — 12 of 25 enrolled', detail: 'Consider reallocation of site resources.', action: 'Open site', onClick: () => setActiveSection('Studies & Sites') }].map((item) => (
                <button key={item.text} type="button" onClick={item.onClick} className="flex w-full items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300">
                  <div className="flex gap-3">
                    <div className={`mt-1 h-2.5 w-2.5 rounded-full ${item.severity === 'Critical' ? 'bg-red-500' : item.severity === 'Warning' ? 'bg-amber-400' : 'bg-slate-500'}`} />
                    <div>
                      <div className="flex items-center gap-2"><span className="font-semibold text-slate-900">{item.text}</span>{item.severity === 'Critical' ? <StatusPill label="Critical" tone="red" /> : item.severity === 'Warning' ? <StatusPill label="Warning" tone="amber" /> : <StatusPill label="Info" tone="slate" />}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.detail}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">{item.action}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Open alerts by severity</h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={alertData} dataKey="value" nameKey="label" innerRadius={42} outerRadius={70} paddingAngle={2}>
                    {alertData.map((entry, index) => (
                      <Cell key={entry.label} fill={alertColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              {alertData.map((entry, index) => (
                <div key={entry.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: alertColors[index] }} />{entry.label}</div>
                  <strong className="text-slate-900">{entry.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <MetricCard title="Active studies" value="3" subtext="Portfolio" tone="navy" />
          <MetricCard title="Recruitment" value="78 / 100" subtext="Target met 78%" tone="green" />
          <MetricCard title="Dose completion" value="70 / 78" subtext="On track" tone="orange" />
          <MetricCard title="Missed visits" value="5" subtext="Requires review" tone="amber" />
          <MetricCard title="Open AE / SAE" value="6 / 1" subtext="PV queue" tone="red" />
          <MetricCard title="Ethics items due soon" value="3" subtext="15 days max" tone="navy" />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Cumulative recruitment: planned vs actual</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recruitmentTrend}>
                  <defs>
                    <linearGradient id="plannedFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="actualFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="planned" stroke="#0f172a" fill="url(#plannedFill)" strokeWidth={2} />
                  <Area type="monotone" dataKey="actual" stroke="#f59e0b" fill="url(#actualFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Study momentum</h3>
            <div className="space-y-4">
              {momentumData.map((row) => (
                <div key={row.name}>
                  <div className="mb-1 flex justify-between text-sm text-slate-600"><span>{row.name}</span><span>{row.value}%</span></div>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-slate-900" style={{ width: `${row.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Site performance</h3>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Site</th>
                    <th className="px-4 py-3 font-medium">Target</th>
                    <th className="px-4 py-3 font-medium">Enrolled</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sitePerformance.map((site) => (
                    <tr key={site.site} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-800">{site.site}</td>
                      <td className="px-4 py-3 text-slate-600">{site.target}</td>
                      <td className="px-4 py-3 text-slate-600">{site.enrolled}</td>
                      <td className="px-4 py-3"><StatusPill label={site.status} tone={site.status === 'At risk' ? 'amber' : 'green'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Study milestones timeline</h3>
            <div className="space-y-4">
              {[
                { label: 'Protocol approved', date: '02 May 2025', tone: 'green' },
                { label: 'Ethics active', date: '13 Jun 2025', tone: 'green' },
                { label: 'CTRI registered', date: '21 Jun 2025', tone: 'green' },
                { label: 'Enrollment continues', date: 'Target: Aug 2025', tone: 'amber' },
                { label: 'Continuing review due', date: 'Within 15 days', tone: 'amber' },
              ].map((event) => (
                <div key={event.label} className="flex items-start gap-3">
                  <div className={`mt-1 h-3 w-3 rounded-full ${event.tone === 'green' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div>
                    <div className="font-medium text-slate-800">{event.label}</div>
                    <div className="text-sm text-slate-500">{event.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent activity / audit feed</h3>
            </div>
            <div className="space-y-3">
              {auditEntries.slice(0, 5).map((entry) => (
                <div key={`${entry.time}-${entry.action}`} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                  <div>
                    <div className="font-medium text-slate-800">{entry.action}</div>
                    <div className="text-xs text-slate-500">{entry.user} · {entry.role} · {entry.module}</div>
                  </div>
                  <div className="text-xs font-medium text-slate-500">{entry.time}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Prototype disclaimer</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-700">Prototype environment — synthetic demo data only.</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Designed to support GCP and ALCOA+ controls. Production use requires institutional review, security testing, and validation for intended use.</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">CTRI integration requires authorized access to an official interface. Live formulation or terminology licensing is separate from this prototype.</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStudies = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"><Filter className="h-4 w-4" /> Filters</div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"><Search className="h-4 w-4" /> Study status</div>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">+ Create study</button>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Study ID</th>
              <th className="px-4 py-3 font-medium">Study title</th>
              <th className="px-4 py-3 font-medium">Study type</th>
              <th className="px-4 py-3 font-medium">PI</th>
              <th className="px-4 py-3 font-medium">Sites</th>
              <th className="px-4 py-3 font-medium">Recruitment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">CTRI</th>
              <th className="px-4 py-3 font-medium">Ethics</th>
              <th className="px-4 py-3 font-medium">Health</th>
              <th className="px-4 py-3 font-medium">Open SAE</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((study) => (
              <tr key={study.id} className="border-t border-slate-200 align-top">
                <td className="px-4 py-3 font-semibold text-slate-900">{study.id}</td>
                <td className="px-4 py-3 text-slate-700">{study.title}</td>
                <td className="px-4 py-3 text-slate-600">{study.type}</td>
                <td className="px-4 py-3 text-slate-600">{study.pi}</td>
                <td className="px-4 py-3 text-slate-600">{study.sites}</td>
                <td className="px-4 py-3 text-slate-600">{study.recruit}</td>
                <td className="px-4 py-3"><StatusPill label={study.status} tone={study.status === 'Paused' ? 'amber' : 'green'} /></td>
                <td className="px-4 py-3"><StatusPill label={study.ctri} tone="slate" /></td>
                <td className="px-4 py-3"><StatusPill label={study.ethics} tone="green" /></td>
                <td className="px-4 py-3 font-medium text-slate-800">{study.health}</td>
                <td className="px-4 py-3 text-slate-600">{study.sae}</td>
                <td className="px-4 py-3"><button type="button" className="text-sm font-medium text-slate-900 underline underline-offset-4">{study.action}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSafety = () => (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Open AE cases" value="6" subtext="Current queue" tone="amber" />
        <MetricCard title="Open SAE cases" value="1" subtext="Total serious" tone="red" />
        <MetricCard title="Safety reports awaiting PV review" value="2" subtext="Due soon" tone="navy" />
        <MetricCard title="Configured deadlines approaching" value="4" subtext="T+6h to T+18h" tone="orange" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">AE / SAE queue</h3>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"><Plus className="h-4 w-4" /> New case</button>
          </div>
          <div className="space-y-3">
            {safetyCases.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedCase(item.id)} className={`w-full rounded-2xl border p-4 text-left ${selectedCase === item.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2"><span className="font-semibold text-slate-900">{item.id}</span><StatusPill label={item.status} tone={item.status === 'PV Review' ? 'amber' : 'slate'} /></div>
                    <div className="mt-2 text-sm text-slate-600">{item.subject} · {item.event}</div>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <div>{item.due}</div>
                    <div className="mt-1 font-medium text-slate-800">{item.owner}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">{currentCase.id}</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between"><span>Subject</span><strong className="text-slate-900">{currentCase.subject}</strong></div>
            <div className="flex items-center justify-between"><span>Study</span><strong className="text-slate-900">{currentCase.study}</strong></div>
            <div className="flex items-center justify-between"><span>Event</span><strong className="text-slate-900">{currentCase.event}</strong></div>
            <div className="flex items-center justify-between"><span>Severity</span><StatusPill label={currentCase.severity} tone="red" /></div>
            <div className="flex items-center justify-between"><span>Seriousness</span><StatusPill label={currentCase.seriousness} tone="amber" /></div>
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-amber-700">
              Prototype regulatory timeline: configured 24-hour initial notification target and 14-day detailed report target are shown only when configured for the study and applicable rule source.
            </div>
            <button type="button" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white" onClick={() => setActiveSection('Audit Trail')}>
              Open related audit trail <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEthics = () => (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Ethics reference" value="IEC/AIIA/2025/117" subtext="Current approval" tone="navy" />
        <MetricCard title="Approval status" value="Active" subtext="15 days remaining" tone="green" />
        <MetricCard title="CTRI status" value="Registered" subtext="Update due in 12 days" tone="orange" />
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Task</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Due date</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Audit</th>
            </tr>
          </thead>
          <tbody>
            {complianceRows.map((row) => (
              <tr key={row.item} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-800">{row.item}</td>
                <td className="px-4 py-3 text-slate-600">{row.owner}</td>
                <td className="px-4 py-3 text-slate-600">{row.due}</td>
                <td className="px-4 py-3"><StatusPill label={row.priority} tone={row.priority === 'Critical' ? 'red' : row.priority === 'High' ? 'amber' : 'slate'} /></td>
                <td className="px-4 py-3"><StatusPill label={row.status} tone="green" /></td>
                <td className="px-4 py-3 text-slate-700 underline underline-offset-4">Linked</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">FHIR R4 prototype mapping</h3>
          <StatusPill label="Prototype export" tone="orange" />
        </div>
        <pre className="overflow-x-auto rounded-2xl bg-slate-900 p-4 text-xs text-slate-100">{fhirSample}</pre>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Internal field to CDISC mapping</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Internal AyurCTMS field</th>
                <th className="px-4 py-3 font-medium">CDASH concept</th>
                <th className="px-4 py-3 font-medium">ODM item</th>
                <th className="px-4 py-3 font-medium">Future SDTM variable</th>
              </tr>
            </thead>
            <tbody>
              {odfMapping.map((row) => (
                <tr key={row.internal} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-800">{row.internal}</td>
                  <td className="px-4 py-3 text-slate-600">{row.cdash}</td>
                  <td className="px-4 py-3 text-slate-600">{row.odm}</td>
                  <td className="px-4 py-3 text-slate-600">{row.sdtm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Audit Trail</h3>
          <StatusPill label="Append-only prototype" tone="navy" />
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <MetricCard title="Critical actions with audit" value="100%" subtext="Synthetic test" tone="green" />
          <MetricCard title="Corrections with reasons" value="8" subtext="Recorded" tone="orange" />
          <MetricCard title="Unsigned critical actions" value="0" subtext="Prototype checks" tone="navy" />
          <MetricCard title="Hash continuity" value="Verified" subtext="Chain reference" tone="slate" />
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          {auditEntries.slice(0, 8).map((entry) => (
            <div key={`${entry.time}-${entry.action}-${entry.user}`} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium text-slate-800">{entry.action}</div>
                <div className="text-xs text-slate-500">{entry.user} · {entry.role} · {entry.module}</div>
              </div>
              <div className="text-xs text-slate-500">{entry.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Prototype vs production</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 font-semibold text-amber-800">Prototype</div>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>• Synthetic data only</li>
              <li>• No live external integration</li>
              <li>• No public AI API receives data</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 font-semibold text-slate-800">Production design</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• AIIA/government-controlled, India-resident infrastructure</li>
              <li>• Security review, testing, and validation required</li>
              <li>• Institutional approval and policy-controlled keys</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Security controls</h3>
        <div className="flex flex-wrap gap-2">
          {securityControls.map((item) => (
            <StatusPill key={item} label={item} tone="slate" />
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvaluation = () => (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Mandatory field completion" value="94%" subtext="Synthetic test" tone="green" />
        <MetricCard title="Validation error rate" value="2.1%" subtext="Prototype" tone="orange" />
        <MetricCard title="Role-permission tests" value="100%" subtext="Permitted checks" tone="navy" />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Evaluation dimensions</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            'Data accuracy and quality',
            'Data integrity',
            'Safety and regulatory timeliness',
            'Interoperability',
            'Access control',
            'Pilot readiness',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );

  const sectionMap: Record<string, ReactNode> = {
    Dashboard: renderDashboard(),
    'Studies & Sites': renderStudies(),
    'Safety & Pharmacovigilance': renderSafety(),
    'Ethics & CTRI Compliance': renderEthics(),
    'Reports & Interoperability': renderReports(),
    'Audit Trail': renderAudit(),
    'Security & Administration': renderSecurity(),
    'Evaluation & Metrics': renderEvaluation(),
  };

  const roleDashboardTitle =
    selectedRole === 'Principal Investigator'
      ? 'AIIA-001 portfolio overview'
      : selectedRole === 'Pharmacovigilance Officer'
        ? 'PV review queue'
        : selectedRole === 'Ethics Committee Member'
          ? 'Ethics and consent oversight'
          : selectedRole === 'Institution Leadership'
            ? 'Leadership aggregate portfolio'
            : 'Operational summary';

  return (
    <div className="min-h-screen bg-[#edf1f4] text-slate-900">
      {!isLoggedIn ? (
        <div className="flex min-h-screen items-center justify-center bg-[#e9eef4] px-6 py-10">
          <div className="w-full max-w-6xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-bold text-slate-900">Ayur<span className="text-[#f59e0b]">CTMS</span></div>
                <div className="text-sm text-slate-500">Clinical Trial Management for Ayurveda Research</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Prototype environment — synthetic demo data only.</div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">API target: {apiBaseUrl}</div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {roleCards.map(({ name, label, icon: Icon }) => (
                <button key={name} type="button" onClick={() => handleRoleSelect(name)} className="flex min-h-[140px] flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left shadow-sm transition hover:border-slate-300 hover:bg-white">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-slate-900 p-2.5 text-white"><Icon className="h-5 w-5" /></div>
                    {name.includes('MFA') ? <StatusPill label="MFA required" tone="amber" /> : null}
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-slate-900">{name}</div>
                    <div className="mt-2 text-sm text-slate-600">{label}</div>
                  </div>
                </button>
              ))}
            </div>
            {otpOpen ? (
              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 text-sm uppercase tracking-[0.18em] text-slate-500">Prototype MFA simulation only</div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <input
                    value={otpValue}
                    onChange={(event) => setOtpValue(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit OTP"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-lg outline-none focus:border-slate-500"
                  />
                  <button type="button" onClick={verifyOtp} className="h-12 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white">Verify</button>
                  <button type="button" onClick={() => setOtpValue('482913')} className="h-12 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700">Use demo code</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen">
          <aside className="w-[260px] shrink-0 bg-slate-900 px-4 py-5 text-white">
            <div className="mb-8 flex items-center gap-3 px-2">
              <div className="h-9 w-9 rounded-xl bg-orange-500/15 p-2 text-center text-lg font-bold text-orange-400">A</div>
              <div>
                <div className="text-2xl font-bold"><span className="text-white">Ayur</span><span className="text-orange-400">CTMS</span></div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Clinical Trial Management</div>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveSection(item)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${activeSection === item ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="inline-flex h-4 w-4 items-center justify-center text-[10px]">•</span>
                  {item}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 bg-[#edf1f4]">
            <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-medium text-slate-700">AIIA-001</div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-800">Current study</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
                    <span className="font-medium text-slate-800">Role:</span>
                    {selectedRole}
                  </div>
                  <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" onClick={() => switchRole('Pharmacovigilance Officer')}>
                    Switch role
                  </button>
                  <div className="relative">
                    <Bell className="h-5 w-5 text-slate-600" />
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
                    <UserCircle2 className="h-6 w-6 text-slate-700" />
                    <div className="text-sm text-slate-700">AIIA Admin</div>
                  </div>
                </div>
              </div>
            </header>

            <div className="p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Dashboard</div>
                  <h1 className="mt-1 text-3xl font-semibold text-slate-900">{roleDashboardTitle}</h1>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"><ShieldCheck className="h-4 w-4" /> Security status: Verified</div>
              </div>

              {sectionMap[activeSection] ?? renderDashboard()}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
