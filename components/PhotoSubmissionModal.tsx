'use client';

import { useState, useEffect } from 'react';
import { infrastructureApi, District } from '@/lib/api/infrastructure';
import { useBlocks } from '@/hooks/useInfrastructure';

interface PhotoSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PhotoSubmissionModal({ isOpen, onClose }: PhotoSubmissionModalProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    playerName: '',
    playerMobile: '',
    playerEmail: '',
    districtId: '',
    blockName: '',
    competitionName: '',
    prizeReceived: '',
    photo: null as File | null,
    photoPreview: ''
  });

  const { blocks, loading: loadingBlocks } = useBlocks(form.districtId || undefined);

  useEffect(() => {
    if (isOpen) {
      setLoadingDistricts(true);
      infrastructureApi.getDistricts()
        .then(res => setDistricts(res.data))
        .catch(() => {})
        .finally(() => setLoadingDistricts(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({
        ...form,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleDistrictChange = (id: string) => {
    setForm({
      ...form,
      districtId: id,
      blockName: '' // Reset block when district changes
    });
  };

  const resetAndClose = () => {
    setSuccess(false);
    setForm({
      playerName: '',
      playerMobile: '',
      playerEmail: '',
      districtId: '',
      blockName: '',
      competitionName: '',
      prizeReceived: '',
      photo: null,
      photoPreview: ''
    });
    onClose();
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check text-green-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#1e3a8a] mb-2">Submission Received!</h2>
          <p className="text-gray-500 mb-8">Thank you for sharing your achievement. Your photo will be reviewed by our team and added to the gallery soon.</p>
          <button
            onClick={resetAndClose}
            className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-bold hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-100"
          >
            Great, Thanks!
          </button>
        </div>
      </div>
    );
  }

  const inp = "w-full px-4 py-3 border-2 border-[#e5e7eb] rounded-xl text-sm text-[#1e293b] outline-none focus:border-[#1e3a8a] transition-all bg-gray-50/50";
  const label = "block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl relative my-auto animate-in fade-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/30 rounded-t-[32px]">
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a]">Submit Achievement Photo</h2>
            <p className="text-sm text-gray-500 mt-1">Share your success with the youth of Uttarakhand</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Row 1: Player Name */}
          <div>
            <label className={label}>Player Name <span className="text-red-500">*</span></label>
            <input 
              type="text"
              required
              value={form.playerName}
              onChange={e => setForm({...form, playerName: e.target.value})}
              placeholder="Enter your full name"
              className={inp}
            />
          </div>

          {/* Row 2: Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={label}>Mobile Number <span className="text-red-500">*</span></label>
              <input 
                type="tel"
                required
                value={form.playerMobile}
                onChange={e => setForm({...form, playerMobile: e.target.value})}
                placeholder="10-digit mobile number"
                className={inp}
              />
            </div>
            <div>
              <label className={label}>Email Address</label>
              <input 
                type="email"
                value={form.playerEmail}
                onChange={e => setForm({...form, playerEmail: e.target.value})}
                placeholder="Email (optional)"
                className={inp}
              />
            </div>
          </div>

          {/* Row 3: District & Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={label}>District <span className="text-red-500">*</span></label>
              <select
                required
                value={form.districtId}
                onChange={e => handleDistrictChange(e.target.value)}
                className={inp + " appearance-none cursor-pointer"}
                disabled={loadingDistricts}
              >
                <option value="">Select District</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Block <span className="text-red-500">*</span></label>
              <select
                required
                value={form.blockName}
                onChange={e => setForm({...form, blockName: e.target.value})}
                disabled={!form.districtId || loadingBlocks}
                className={inp + " appearance-none cursor-pointer disabled:opacity-50"}
              >
                <option value="">{form.districtId ? 'Select Block' : 'Select District First'}</option>
                {blocks.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Competition & Prize */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={label}>Competition Name <span className="text-red-500">*</span></label>
              <input 
                type="text"
                required
                value={form.competitionName}
                onChange={e => setForm({...form, competitionName: e.target.value})}
                placeholder="e.g. Khel Mahakumbh 2026"
                className={inp}
              />
            </div>
            <div>
              <label className={label}>Prize / Award Received <span className="text-red-500">*</span></label>
              <select
                required
                value={form.prizeReceived}
                onChange={e => setForm({...form, prizeReceived: e.target.value})}
                className={inp + " appearance-none cursor-pointer"}
              >
                <option value="">Select Achievement</option>
                <option>1st Prize / Gold Medal</option>
                <option>2nd Prize / Silver Medal</option>
                <option>3rd Prize / Bronze Medal</option>
                <option>Participation Certificate</option>
                <option>Other / Custom Honor</option>
              </select>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className={label}>Achievement Photo <span className="text-red-500">*</span></label>
            <div className="relative">
              {!form.photoPreview ? (
                <div className="border-2 border-dashed border-gray-200 rounded-[24px] p-10 text-center hover:border-[#1e3a8a] hover:bg-blue-50/30 transition-all group bg-gray-50/30">
                  <input 
                    type="file" 
                    accept="image/*"
                    required
                    onChange={handlePhotoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                    <i className="fas fa-cloud-upload-alt text-[#1e3a8a] text-2xl"></i>
                  </div>
                  <p className="text-sm font-bold text-[#1e293b]">Click or drag to upload</p>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB · High resolution preferred</p>
                </div>
              ) : (
                <div className="relative aspect-video rounded-[24px] overflow-hidden border-2 border-gray-100 group">
                  <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                    <p className="text-white text-xs font-medium truncate pr-4">{form.photo?.name}</p>
                    <button 
                      type="button"
                      onClick={() => setForm({...form, photo: null, photoPreview: ''})}
                      className="bg-white/20 backdrop-blur-md text-white p-2 rounded-lg hover:bg-red-500 transition-colors"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#1e3a8a] text-white py-4 rounded-xl font-bold hover:bg-[#1e40af] transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {submitting ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Submitting Info...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  Submit to Gallery
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
