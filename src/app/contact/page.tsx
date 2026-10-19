'use client';

import { useState } from 'react';
import InstitutionalHeader from '@/components/layout/InstitutionalHeader';
import InstitutionalFooter from '@/components/layout/InstitutionalFooter';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('author_inquiry');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate instant recording of inquiry
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <InstitutionalHeader />

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: 'Contact Office' }]} />

        {/* Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-md border border-blue-100">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Editorial &amp; Institutional Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0b1b3d] tracking-tight leading-tight">
            Contact &amp; Registered Office
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            Get in touch with the editorial team, peer-review coordinators, or institutional representatives of MANI Research Organization (MRO). We guarantee responses to scholarly and author queries within 24–48 business hours.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Registered Office & Details (Col 1-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5 text-xs">
              <h2 className="text-base font-bold text-[#0b1b3d] border-b border-slate-100 pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-700" />
                <span>Registered Corporate Office</span>
              </h2>

              <div className="space-y-3 text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-xs">MANI Market Private Limited</strong>
                    <p className="leading-relaxed mt-0.5 font-serif">
                      Kuntinavalasa Village, Mentada Mandal,<br />
                      Vizianagaram District, Andhra Pradesh - 535580, India.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 font-mono text-[11px]">
                  <p>
                    <span className="text-slate-500 font-sans font-semibold">CIN:</span>{' '}
                    <strong className="text-slate-900">U58130AP2026PTC127065</strong>
                  </p>
                  <p>
                    <span className="text-slate-500 font-sans font-semibold">GSTIN:</span>{' '}
                    <strong className="text-slate-900">37AAVCM2351A1ZI</strong>
                  </p>
                  <p>
                    <span className="text-slate-500 font-sans font-semibold">Founder:</span>{' '}
                    <span className="text-slate-900 font-sans font-bold">Nangireddy Manikanta</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Dedicated Email Inboxes
                </h3>
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800 block text-[11px]">Editorial &amp; Peer Review:</span>
                    <a href="mailto:editorial@maniresearch.org" className="text-sky-700 hover:underline font-mono">
                      editorial@maniresearch.org
                    </a>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800 block text-[11px]">Production &amp; Submissions:</span>
                    <a href="mailto:submissions@maniresearch.org" className="text-sky-700 hover:underline font-mono">
                      submissions@maniresearch.org
                    </a>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800 block text-[11px]">Corporate &amp; Grievance Redressal:</span>
                    <a href="mailto:support@manimarket.in" className="text-sky-700 hover:underline font-mono">
                      support@manimarket.in
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Office Hours: Monday – Saturday, 09:00 to 18:00 IST</span>
              </div>
            </div>
          </div>

          {/* Interactive Contact Form (Col 6-12) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-[#0b1b3d] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-700" />
                  <span>Send an Institutional Inquiry</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete the form below to route your request to the appropriate editorial office.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-950">Inquiry Dispatched Successfully</h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{name}</strong>. Your correspondence has been logged with reference ID <code className="font-mono font-bold">MRO-{Date.now().toString().slice(-6)}</code>. An editorial coordinator will reply to <strong>{email}</strong> within 24–48 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setSubject('');
                      setMessage('');
                    }}
                    suppressHydrationWarning
                    className="mt-2 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Rajesh Pedada"
                        suppressHydrationWarning
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="researcher@university.edu"
                        suppressHydrationWarning
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      Inquiry Nature / Department <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      suppressHydrationWarning
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-600 bg-white"
                    >
                      <option value="author_inquiry">Author &amp; Manuscript Tracking Query</option>
                      <option value="reviewer_application">Reviewer Board Application / Evaluation Inquiry</option>
                      <option value="ethics_grievance">Publication Ethics &amp; COPE Grievance</option>
                      <option value="special_issue">Special Issue Proposal / Editorial Partnership</option>
                      <option value="corporate_legal">Corporate / Legal / General Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Query regarding Manuscript ID #d4e36f74 revision status"
                      suppressHydrationWarning
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                      Detailed Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide your institutional affiliation, relevant manuscript ID if applicable, and detailed questions..."
                      suppressHydrationWarning
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-600 bg-slate-50 focus:bg-white transition leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    suppressHydrationWarning
                    className="w-full py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Dispatching Message...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Official Correspondence</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
