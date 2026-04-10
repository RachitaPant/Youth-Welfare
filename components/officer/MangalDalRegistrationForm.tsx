'use client';

import { useState } from 'react';
import { useDistricts, useBlocks } from '@/hooks/useInfrastructure';

interface MangalDalRegistrationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  type: 'MAHILA' | 'YUVAK';
}

const sidebarSteps = [
  'Dal Information',
  'Office Bearers',
  'Location & Registration',
];

export default function MangalDalRegistrationForm({ 
  onSuccess, 
  onCancel, 
  type 
}: MangalDalRegistrationFormProps) {
  const { districts } = useDistricts();
  
  const [form, setForm] = useState({
    name: '',
    presidentName: '',
    presidentPhone: '',
    presidentEmail: '',
    secretaryName: '',
    secretaryPhone: '',
    secretaryEmail: '',
    districtId: '',
    blockId: '',
    registrationNo: '',
    validityFrom: '',
    validityDate: '',
  });

  const { blocks, loading: loadingBlocks } = useBlocks(form.districtId);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const typeLabel = type === 'MAHILA' ? 'Mahila' : 'Yuvak';

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleFromDateChange = (val: string) => {
    set('validityFrom', val);
    if (val) {
      const from = new Date(val);
      if (!isNaN(from.getTime())) {
        const until = new Date(from);
        until.setFullYear(from.getFullYear() + 5);
        set('validityDate', until.toISOString().split('T')[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Placeholder submission
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-check text-green-600 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-[#1e3a8a] mb-3">
          Dal Registered Successfully!
        </h2>
        <p className="text-[#6b7280] mb-6">
          The {typeLabel} Mangal Dal has been added to the system.
        </p>
        <div className="bg-[#eff6ff] border-2 border-[#1e3a8a] rounded-xl px-8 py-4">
          <p className="text-sm text-[#6b7280] mb-1">Registration Reference</p>
          <p className="text-xl font-bold text-[#1e3a8a] tracking-widest uppercase">
            {form.registrationNo || 'PENDING'}
          </p>
        </div>
      </div>
    );
  }

  // Field styling helpers
  const inp = "w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#374151] outline-none focus:border-[#1e3a8a] transition-all bg-white hover:border-gray-300";
  const sel = inp + " appearance-none cursor-pointer";

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar Steps */}
      <aside className="lg:w-[260px] flex-shrink-0 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
          <h3 className="text-base font-bold text-[#1e3a8a] mb-4 flex items-center gap-2">
            <i className="fas fa-list-check" /> Form Sections
          </h3>
          <div className="flex flex-col gap-3">
            {sidebarSteps.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-3 text-sm text-gray-500 py-1"
              >
                <span className="w-8 h-8 bg-[#eff6ff] text-[#1e3a8a] rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={onCancel}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
            >
              <i className="fas fa-arrow-left text-xs" />
              Cancel & Return
            </button>
          </div>
        </div>
      </aside>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
        {/* Section 1: Dal Information */}
        <fieldset className="bg-white rounded-2xl p-6 pt-5 border border-gray-200 shadow-sm min-w-0">
          <legend className="text-lg font-bold text-[#1e3a8a] flex items-center gap-3 mb-2 pb-1 border-b border-gray-100 w-full">
            <span className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center text-sm shadow-sm">01</span>
            {typeLabel} Mangal Dal Information
          </legend>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Name of the Dal <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder={`e.g. Adarsh ${typeLabel} Mangal Dal`}
                className={inp}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Registration Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={form.registrationNo}
                  onChange={e => set('registrationNo', e.target.value)}
                  placeholder="Official Reg ID"
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Validity From <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={form.validityFrom}
                  onChange={e => handleFromDateChange(e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Validity Until <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  value={form.validityDate}
                  onChange={e => set('validityDate', e.target.value)}
                  className={inp}
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Section 2: Office Bearers */}
        <fieldset className="bg-white rounded-2xl p-6 pt-5 border border-gray-200 shadow-sm min-w-0">
          <legend className="text-lg font-bold text-[#1e3a8a] flex items-center gap-3 mb-2 pb-1 border-b border-gray-100 w-full">
            <span className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center text-sm shadow-sm">02</span>
            Office Bearers (President & Secretary)
          </legend>
          <div className="grid gap-8">
            {/* President */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-50">President Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.presidentName}
                    onChange={e => set('presidentName', e.target.value)}
                    placeholder="Enter President's name"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    value={form.presidentPhone}
                    onChange={e => set('presidentPhone', e.target.value)}
                    placeholder="10-digit mobile"
                    className={inp}
                  />
                </div>
              </div>
            </div>

            {/* Secretary */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-50">Secretary Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.secretaryName}
                    onChange={e => set('secretaryName', e.target.value)}
                    placeholder="Enter Secretary's name"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    value={form.secretaryPhone}
                    onChange={e => set('secretaryPhone', e.target.value)}
                    placeholder="10-digit mobile"
                    className={inp}
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Section 3: Location */}
        <fieldset className="bg-white rounded-2xl p-6 pt-5 border border-gray-200 shadow-sm min-w-0">
          <legend className="text-lg font-bold text-[#1e3a8a] flex items-center gap-3 mb-2 pb-1 border-b border-gray-100 w-full">
            <span className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center text-sm shadow-sm">03</span>
            Location Details
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">District <span className="text-red-500">*</span></label>
              <select
                required
                value={form.districtId}
                onChange={e => {
                  set('districtId', e.target.value);
                  set('blockId', '');
                }}
                className={sel}
              >
                <option value="">Select District</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <i className="fas fa-chevron-down absolute right-4 bottom-4 text-gray-400 pointer-events-none text-xs" />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Block <span className="text-red-500">*</span></label>
              <select
                required
                disabled={!form.districtId || loadingBlocks}
                value={form.blockId}
                onChange={e => set('blockId', e.target.value)}
                className={sel}
              >
                <option value="">{loadingBlocks ? 'Loading Blocks...' : 'Select Block'}</option>
                {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <i className="fas fa-chevron-down absolute right-4 bottom-4 text-gray-400 pointer-events-none text-xs" />
            </div>
          </div>
        </fieldset>

        {/* Submit Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto bg-[#1e3a8a] text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#1e40af] transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-[#1e3a8a]/20"
          >
            {submitting ? (
              <i className="fas fa-circle-notch fa-spin" />
            ) : (
              <i className="fas fa-paper-plane" />
            )}
            Register This Dal
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full md:w-auto px-10 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
