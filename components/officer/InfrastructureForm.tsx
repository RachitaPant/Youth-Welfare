'use client';

import { useState, useEffect } from 'react';
import { useDistricts, useBlocks } from '@/hooks/useInfrastructure';
import { useCreateInfra, useUpdateInfra } from '@/hooks/useOfficer';
import { InfraType, InfrastructureItem } from '@/lib/api/officerApi';
import { OfficerProfile } from '@/lib/api/officerApi';

type InfraFormType = 'HALL' | 'STADIUM' | 'YOUTH_HOSTEL' | 'VOCATIONAL_CENTER' | 'INDOOR_GYM' | 'OPEN_GYM' | 'KHEL_MAIDAAN';

interface InfrastructureFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  type: InfraFormType;
  mode?: 'create' | 'edit';
  initialData?: InfrastructureItem;
  officer: OfficerProfile;
}

const typeLabels: Record<string, string> = {
  HALL:               'Multipurpose Hall',
  STADIUM:            'Mini Stadium',
  YOUTH_HOSTEL:       'Youth Hostel',
  VOCATIONAL_CENTER:  'Vocational Training Center',
  INDOOR_GYM:         'Indoor Gym',
  OPEN_GYM:           'Open Gym',
  KHEL_MAIDAAN:       'Khel Maidaan',
};

const sidebarSteps = ['Basic Information', 'Point of Contact', 'Core Facilities'];

export default function InfrastructureForm({
  onSuccess,
  onCancel,
  type,
  mode = 'create',
  initialData,
  officer,
}: InfrastructureFormProps) {
  const { districts } = useDistricts();

  const isDO = officer.role === 'DO_PRD';
  const isBO = officer.role === 'BO_PRD';

  // Resolve officer's district UUID from the district list
  const officerDistrictId = districts.find(
    (d) => d.name.toLowerCase().includes(officer.district.toLowerCase())
  )?.id ?? '';

  const [form, setForm] = useState({
    name:       initialData?.name ?? '',
    location:   initialData?.location ?? '',
    districtId: initialData?.districtId ?? '',
    pocName:    initialData?.pocName ?? '',
    pocPhone:   initialData?.pocPhone ?? '',
    pocEmail:   initialData?.pocEmail ?? '',
    imageUrl:   initialData?.imageUrl ?? '',
    facilities: initialData?.facilities ?? '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl ?? '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const createMutation = useCreateInfra(type as InfraType);
  const updateMutation = useUpdateInfra(type as InfraType);
  const mutation = mode === 'edit' ? updateMutation : createMutation;

  // Auto-fill district for DO_PRD/BO_PRD
  useEffect(() => {
    if ((isDO || isBO) && officerDistrictId && !form.districtId) {
      setForm((f) => ({ ...f, districtId: officerDistrictId }));
    }
  }, [officerDistrictId, isDO, isBO]);

  const typeLabel = typeLabels[type] || 'Infrastructure';

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to Cloudinary if configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset    = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (cloudName && preset) {
      setUploadingImage(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', preset);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: fd }
        );
        const data = await res.json();
        if (data.secure_url) set('imageUrl', data.secure_url);
      } catch (_) {
        // Image upload failed silently; URL will be empty
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const payload = {
      name:       form.name,
      location:   form.location,
      districtId: form.districtId || officerDistrictId,
      pocName:    form.pocName,
      pocPhone:   form.pocPhone,
      pocEmail:   form.pocEmail || undefined,
      imageUrl:   form.imageUrl || undefined,
      facilities: form.facilities,
    };

    try {
      if (mode === 'edit' && initialData) {
        await (updateMutation.mutateAsync as any)({ id: initialData.id, data: payload });
      } else {
        await (createMutation.mutateAsync as any)(payload);
      }
      setSubmitted(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <i className="fas fa-check text-green-600 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-[#1e3a8a] mb-3">
          {mode === 'edit' ? 'Updated!' : 'Registered!'}
        </h2>
        <p className="text-[#6b7280] mb-6">
          The {typeLabel} has been successfully {mode === 'edit' ? 'updated' : 'added'}.
        </p>
        <div className="bg-[#eff6ff] border-2 border-[#1e3a8a] rounded-xl px-8 py-4">
          <p className="text-sm text-[#6b7280] mb-1">Entity Name</p>
          <p className="text-xl font-bold text-[#1e3a8a] tracking-tight truncate max-w-[300px]">{form.name}</p>
        </div>
      </div>
    );
  }

  const inp  = "w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#374151] outline-none focus:border-[#1e3a8a] transition-all bg-white hover:border-gray-300";
  const sel  = inp + " appearance-none cursor-pointer";
  const area = "w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-lg text-sm text-[#374151] outline-none focus:border-[#1e3a8a] transition-all bg-white hover:border-gray-300 resize-none";
  const isMutating = mutation.isPending || uploadingImage;

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar */}
      <aside className="lg:w-[260px] flex-shrink-0 flex flex-col gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-6">
          <h3 className="text-base font-bold text-[#1e3a8a] mb-4 flex items-center gap-2">
            <i className="fas fa-list-check" /> Form Sections
          </h3>
          <div className="flex flex-col gap-4">
            {sidebarSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-3 text-sm text-gray-500 py-1">
                <span className="w-8 h-8 bg-[#eff6ff] text-[#1e3a8a] rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
          {/* Jurisdiction badge */}
          <div className="mt-6 pt-4 border-t border-gray-100 space-y-1">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Your Jurisdiction</p>
            <p className="text-sm font-semibold text-teal-700">{officer.district}</p>
            {officer.block && <p className="text-xs text-teal-500">{officer.block} Block</p>}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button onClick={onCancel} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors">
              <i className="fas fa-arrow-left text-xs" /> Cancel & Return
            </button>
          </div>
        </div>
      </aside>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle" /> {formError}
          </div>
        )}

        {/* Section 01: Basic Info */}
        <fieldset className="bg-white rounded-2xl p-6 pt-5 border border-gray-200 shadow-sm min-w-0">
          <legend className="text-lg font-bold text-[#1e3a8a] flex items-center gap-3 mb-2 pb-1 border-b border-gray-100 w-full">
            <span className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center text-sm shadow-sm">01</span>
            {typeLabel} Basic Details
          </legend>
          <div className="grid gap-6 py-4">
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Infrastructure Name <span className="text-red-500">*</span></label>
              <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={`e.g. ${typeLabel} - Dehradun Central`} className={inp} />
            </div>
            <div className={`grid grid-cols-1 gap-6 ${!isDO && !isBO ? 'md:grid-cols-2' : ''}`}>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Full Location/Address <span className="text-red-500">*</span></label>
                <input type="text" required value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Street, Landmark, City" className={inp} />
              </div>
              {/* District selector: hidden for BO_PRD, read-only for DO_PRD */}
              {!isBO && (
                <div className="relative">
                  <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">
                    District <span className="text-red-500">*</span>
                    {isDO && <span className="ml-2 text-[10px] text-teal-600 normal-case font-normal">(your jurisdiction)</span>}
                  </label>
                  {isDO ? (
                    <input
                      type="text"
                      readOnly
                      value={officer.district}
                      className={inp + ' bg-gray-50 cursor-not-allowed text-gray-500'}
                    />
                  ) : (
                    <>
                      <select required value={form.districtId} onChange={(e) => set('districtId', e.target.value)} className={sel}>
                        <option value="">Select District</option>
                        {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                      <i className="fas fa-chevron-down absolute right-4 bottom-4 text-gray-400 pointer-events-none text-xs" />
                    </>
                  )}
                </div>
              )}
              {/* BO_PRD: show read-only district + block */}
              {isBO && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">District</label>
                    <input type="text" readOnly value={officer.district} className={inp + ' bg-gray-50 cursor-not-allowed text-gray-500'} />
                  </div>
                  {officer.block && (
                    <div>
                      <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Block</label>
                      <input type="text" readOnly value={officer.block} className={inp + ' bg-gray-50 cursor-not-allowed text-gray-500'} />
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-3 uppercase tracking-tight">Infrastructure Image</label>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative group flex-1 w-full">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" id="image-upload" />
                  <label htmlFor="image-upload" className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#e5e7eb] rounded-xl p-8 bg-gray-50 group-hover:bg-[#f8fafc] group-hover:border-[#1e3a8a] transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-[#1e3a8a]">
                      {uploadingImage ? <i className="fas fa-circle-notch fa-spin text-xl" /> : <i className="fas fa-cloud-upload-alt text-xl" />}
                    </div>
                    <span className="text-sm font-bold text-[#1e3a8a]">{uploadingImage ? 'Uploading…' : 'Click to upload'}</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG or WebP (max 5MB)</span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="w-full md:w-[240px] h-[140px] rounded-xl border-2 border-[#e5e7eb] overflow-hidden bg-white shadow-sm">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && (
                <p className="text-[11px] text-amber-500 mt-2 italic">Configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME + UPLOAD_PRESET to enable image uploads.</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Section 02: POC */}
        <fieldset className="bg-white rounded-2xl p-6 pt-5 border border-gray-200 shadow-sm min-w-0">
          <legend className="text-lg font-bold text-[#1e3a8a] flex items-center gap-3 mb-2 pb-1 border-b border-gray-100 w-full">
            <span className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center text-sm shadow-sm">02</span>
            Point of Contact Details
          </legend>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">POC Full Name <span className="text-red-500">*</span></label>
                <input type="text" required value={form.pocName} onChange={(e) => set('pocName', e.target.value)} placeholder="Contact person's name" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Mobile Number <span className="text-red-500">*</span></label>
                <input type="tel" required value={form.pocPhone} onChange={(e) => set('pocPhone', e.target.value)} placeholder="10-digit mobile number" className={inp} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Email Address</label>
              <input type="email" value={form.pocEmail} onChange={(e) => set('pocEmail', e.target.value)} placeholder="poc@example.com" className={inp} />
            </div>
          </div>
        </fieldset>

        {/* Section 03: Facilities */}
        <fieldset className="bg-white rounded-2xl p-6 pt-5 border border-gray-200 shadow-sm min-w-0">
          <legend className="text-lg font-bold text-[#1e3a8a] flex items-center gap-3 mb-2 pb-1 border-b border-gray-100 w-full">
            <span className="w-8 h-8 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center text-sm shadow-sm">03</span>
            Core Facilities
          </legend>
          <div className="py-4">
            <label className="block text-sm font-semibold text-[#374151] mb-2 uppercase tracking-tight">Available Facilities <span className="text-red-500">*</span></label>
            <textarea required rows={5} value={form.facilities} onChange={(e) => set('facilities', e.target.value)} placeholder="List facilities e.g. Badminton Court, Sound System, Parking, etc." className={area} />
          </div>
        </fieldset>

        {/* Actions */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
          <button
            type="submit"
            disabled={isMutating}
            className="w-full md:w-auto bg-[#1e3a8a] text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#1e40af] transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-[#1e3a8a]/20"
          >
            {isMutating ? <i className="fas fa-circle-notch fa-spin" /> : <i className={mode === 'edit' ? 'fas fa-save' : 'fas fa-plus'} />}
            {mode === 'edit' ? 'Save Changes' : 'Add Infrastructure'}
          </button>
          <button type="button" onClick={onCancel} className="w-full md:w-auto px-10 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
