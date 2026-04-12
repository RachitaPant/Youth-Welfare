'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDistricts, useKhelMaidaans } from '@/hooks/useInfrastructure';
import InfrastructureForm from '@/components/officer/InfrastructureForm';

export default function KhelMaidaanPage() {
  const router = useRouter();
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { districts, loading: loadingDistricts } = useDistricts();
  const { maidaans, meta, loading, error, page, setPage } = useKhelMaidaans(selectedDistrictId || undefined);
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
              {showForm ? 'Register New Khel Maidaan' : 'Khel Maidaan'}
            </h2>
            {showForm && <p className="text-xs text-gray-500 mt-0.5">Define playground size, sports fields, and POC</p>}
          </div>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            New Maidaan
          </button>
        )}
      </div>

      {showForm ? (
        <InfrastructureForm 
          type="KHEL_MAIDAAN"
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
                onChange={(e) => setSelectedDistrictId(e.target.value)}
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
            <button
              onClick={() => setSelectedDistrictId('')}
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
                <p className="text-sm">Loading maidaans...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 px-4">
                <p className="text-red-500 text-sm mb-2 font-medium">{error}</p>
                <button 
                  onClick={() => setPage(page)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : maidaans.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <i className="fas fa-running text-3xl mb-3 text-gray-200"></i>
                <p className="text-sm">No khel maidaans found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-left">
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">Name</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">Location</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">District</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px]">Status</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 uppercase tracking-wider text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {maidaans.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-900 font-medium">{m.name}</td>
                        <td className="px-6 py-4 text-gray-600">{m.location || '—'}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium uppercase">
                            {m.district.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                            m.isActive ? 'bg-green-100 text-green-700 shadow-sm' : 'bg-red-100 text-red-600 shadow-sm'
                          }`}>
                            {m.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3 font-medium">
                            <button className="text-xs text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                            <button className="text-xs text-amber-600 hover:text-amber-800 transition-colors">
                              {m.isActive ? 'Deactivate' : 'Activate'}
                            </button>
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

          {/* Pagination Container */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-[13px] text-gray-500 px-1">
              <p>
                Showing page <span className="font-semibold text-gray-700">{meta.page}</span> of <span className="font-semibold text-gray-700">{meta.totalPages}</span> (<span className="font-semibold text-gray-700">{meta.total}</span> total)
              </p>
              <div className="flex gap-2">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => setPage(meta.page - 1)}
                  className="px-4 py-1.5 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition-all font-medium active:scale-95 bg-white disabled:pointer-events-none"
                >
                  Previous
                </button>
                <button
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage(meta.page + 1)}
                  className="px-4 py-1.5 border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100 transition-all font-medium active:scale-95 bg-white disabled:pointer-events-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
