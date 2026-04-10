'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDistricts, useMangalDals } from '@/hooks/useInfrastructure';
import MangalDalRegistrationForm from '@/components/officer/MangalDalRegistrationForm';

export default function MahilaMangalDalPage() {
  const router = useRouter();
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const { districts, loading: loadingDistricts } = useDistricts();
  const { dals, loading, error } = useMangalDals(selectedDistrictId || undefined, 'MAHILA');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/officer/me`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/officer/login');
          return;
        }
      })
      .catch(() => router.push('/officer/login'))
      .finally(() => setAuthLoading(false));
  }, [router]);

  // Derived blocks from the fetched dals
  const blocks = useMemo(() => {
    if (!dals) return [];
    const uniqueBlocks = new Map();
    dals.forEach(dal => {
      if (dal.block) {
        uniqueBlocks.set(dal.block.id, dal.block.name);
      }
    });
    return Array.from(uniqueBlocks.entries()).map(([id, name]) => ({ id, name }));
  }, [dals]);

  // Filtered dals based on block selection
  const filteredDals = useMemo(() => {
    if (!selectedBlockId) return dals;
    return dals.filter(dal => dal.block?.id === selectedBlockId);
  }, [dals, selectedBlockId]);

  if (authLoading) {
    return <div className="p-6 text-gray-500 text-sm">Loading…</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          {showForm && (
            <button 
              onClick={() => setShowForm(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
              title="Back to List"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {showForm ? 'New Mahila Mangal Dal Registration' : 'Mahila Mangal Dal'}
            </h2>
            {showForm && <p className="text-xs text-gray-500 mt-0.5">Fill in the details to register a new dal in the system</p>}
          </div>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            New Mahila Mangal Dal
          </button>
        )}
      </div>

      {showForm ? (
        <MangalDalRegistrationForm 
          type="MAHILA"
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          {/* Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex flex-wrap gap-4 items-center shadow-sm">
            <div className="flex items-center gap-2">
              <select
                value={selectedDistrictId}
                onChange={(e) => {
                  setSelectedDistrictId(e.target.value);
                  setSelectedBlockId(''); // Reset block when district changes
                }}
                disabled={loadingDistricts}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 min-w-[180px] bg-white"
              >
                <option value="">All Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedBlockId}
                onChange={(e) => setSelectedBlockId(e.target.value)}
                disabled={loading || !selectedDistrictId || blocks.length === 0}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 min-w-[180px] bg-white"
              >
                <option value="">{selectedDistrictId ? (blocks.length > 0 ? 'All Blocks' : 'No Blocks Found') : 'Select District First'}</option>
                {blocks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setSelectedDistrictId('');
                setSelectedBlockId('');
              }}
              className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <i className="fas fa-circle-notch fa-spin text-2xl mb-2"></i>
                <p className="text-sm">Loading Mangal Dals...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 px-4">
                <p className="text-red-500 text-sm mb-2 font-medium">{error}</p>
              </div>
            ) : filteredDals.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <i className="fas fa-users text-3xl mb-3 text-gray-200"></i>
                <p className="text-sm">No Mangal Dals found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-left">
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">S.No</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">Name</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">Affiliation No</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">Chairperson</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">District</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">Block</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDals.map((dal) => (
                      <tr key={dal.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-600 font-mono text-[12px]">{dal.serialNo}</td>
                        <td className="px-6 py-4 text-gray-900 font-medium">{dal.name}</td>
                        <td className="px-6 py-4 text-gray-600 font-mono text-[12px]">{dal.affiliationNo}</td>
                        <td className="px-6 py-4 text-gray-600">{dal.chairperson}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium uppercase">
                            {dal.block.district.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[11px] font-medium lowercase">
                            {dal.block.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3 font-medium">
                            <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                            <button className="text-xs text-red-500 hover:text-red-700 transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
