'use client';

import { useState, useMemo } from 'react';
import { useDistricts } from '@/hooks/useInfrastructure';
import { useCurrentOfficer, useOfficerMangalDals, useDeleteMangalDal } from '@/hooks/useOfficer';
import MangalDalRegistrationForm from './MangalDalRegistrationForm';

interface MangalDalPageProps {
  type: 'MAHILA' | 'YUVAK';
}

export default function MangalDalPage({ type }: MangalDalPageProps) {
  const { data: officer, isLoading: officerLoading } = useCurrentOfficer();
  const { districts } = useDistricts();

  const isDO = officer?.role === 'DO_PRD';

  const officerDistrictId = districts.find(
    (d) => officer && d.name.toLowerCase().includes(officer.district.toLowerCase())
  )?.id ?? '';

  const [filterDistrictId, setFilterDistrictId] = useState('');
  const [filterBlockId, setFilterBlockId] = useState('');
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [editItem, setEditItem] = useState<any | null>(null);

  const activeDistrictId = filterDistrictId || officerDistrictId || undefined;

  const { data, isLoading, isError, error, refetch } = useOfficerMangalDals(
    type,
    activeDistrictId
  );

  const deleteMutation = useDeleteMangalDal();

  const dals = data?.data ?? [];

  // Unique blocks from fetched dals (for filter)
  const blockOptions = useMemo(() => {
    const map = new Map<string, string>();
    dals.forEach((d: any) => {
      if (d.block) map.set(d.block.id, d.block.name);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [dals]);

  const filteredDals = useMemo(() => {
    if (!filterBlockId) return dals;
    return dals.filter((d: any) => d.block?.id === filterBlockId);
  }, [dals, filterBlockId]);

  const typeLabel = type === 'MAHILA' ? 'Mahila' : 'Yuvak';

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to delete');
    }
  };

  if (officerLoading) return <div className="p-6 text-gray-500 text-sm">Loading…</div>;
  if (!officer) return null;

  if (view === 'create' || view === 'edit') {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-5">
          <button
            onClick={() => { setView('list'); setEditItem(null); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-600 transition-all shadow-sm"
          >
            <i className="fas fa-arrow-left" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {view === 'edit' ? `Edit ${typeLabel} Mangal Dal` : `New ${typeLabel} Mangal Dal Registration`}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in the details to register a dal</p>
          </div>
        </div>
        <MangalDalRegistrationForm
          type={type}
          mode={view}
          initialData={editItem ?? undefined}
          officer={officer}
          onSuccess={() => { setView('list'); setEditItem(null); refetch(); }}
          onCancel={() => { setView('list'); setEditItem(null); }}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{typeLabel} Mangal Dal</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {officer.district}{officer.block ? ` › ${officer.block}` : ''}
          </p>
        </div>
        <button
          onClick={() => setView('create')}
          className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <i className="fas fa-plus" />
          New {typeLabel} Mangal Dal
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex flex-wrap gap-4 items-center shadow-sm">
        {/* District filter for DO_PRD */}
        {isDO && (
          <select
            value={filterDistrictId}
            onChange={(e) => { setFilterDistrictId(e.target.value); setFilterBlockId(''); }}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px] bg-white"
          >
            <option value="">— My District ({officer.district}) —</option>
            {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        )}
        {/* Block filter */}
        <select
          value={filterBlockId}
          onChange={(e) => setFilterBlockId(e.target.value)}
          disabled={isLoading || blockOptions.length === 0}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px] bg-white disabled:opacity-50"
        >
          <option value="">{blockOptions.length > 0 ? 'All Blocks' : 'No Blocks'}</option>
          {blockOptions.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        {(filterDistrictId || filterBlockId) && (
          <button onClick={() => { setFilterDistrictId(''); setFilterBlockId(''); }} className="text-sm text-gray-400 hover:text-blue-600 font-medium">Clear</button>
        )}
        <span className="text-xs text-gray-400 ml-auto">{filteredDals.length} records</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <i className="fas fa-circle-notch fa-spin text-2xl mb-2" />
            <p className="text-sm">Loading Mangal Dals…</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20 px-4">
            <p className="text-red-500 text-sm mb-3">{(error as Error).message}</p>
            <button onClick={() => refetch()} className="text-xs text-blue-600 hover:underline">Try again</button>
          </div>
        ) : filteredDals.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <i className="fas fa-users text-3xl mb-3 text-gray-200" />
            <p className="text-sm font-medium">No {typeLabel} Mangal Dals found.</p>
            <button onClick={() => setView('create')} className="mt-4 text-sm text-blue-600 hover:underline">
              + Register the first one
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-6 py-3 text-[11px] font-semibold text-gray-700 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-gray-700 uppercase tracking-wider">Village Name</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-gray-700 uppercase tracking-wider">Affiliation No</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-gray-700 uppercase tracking-wider">Chairperson</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-gray-700 uppercase tracking-wider">District</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-gray-700 uppercase tracking-wider">Block</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDals.map((dal: any) => (
                  <tr key={dal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 font-mono text-[12px]">{dal.serialNo}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{dal.name}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-[12px]">{dal.affiliationNo}</td>
                    <td className="px-6 py-4 text-gray-600">{dal.chairperson}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium uppercase">
                        {dal.block?.district?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[11px] font-medium">
                        {dal.block?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => { setEditItem(dal); setView('edit'); }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dal.id, dal.name)}
                          disabled={deleteMutation.isPending}
                          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
