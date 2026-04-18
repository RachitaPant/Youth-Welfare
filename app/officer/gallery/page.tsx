'use client';

import { useState } from 'react';
import {
  useAllGallery,
  useApproveGallery,
  useRejectGallery,
  useUpdateGallery,
  useDeleteGallery,
} from '@/hooks/useOfficer';

type StatusFilter = '' | 'PENDING' | 'APPROVED' | 'REJECTED';

const STATUS_TABS: { label: string; value: StatusFilter; color: string }[] = [
  { label: 'All',      value: '',          color: 'text-gray-600'   },
  { label: 'Pending',  value: 'PENDING',   color: 'text-amber-600'  },
  { label: 'Approved', value: 'APPROVED',  color: 'text-green-600'  },
  { label: 'Rejected', value: 'REJECTED',  color: 'text-red-500'    },
];

export default function OfficerGalleryPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useAllGallery(statusFilter || undefined);
  const approve = useApproveGallery();
  const reject  = useRejectGallery();
  const update  = useUpdateGallery();
  const del     = useDeleteGallery();

  const items = data?.data ?? [];

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditDesc(item.description);
  };

  const saveEdit = (id: string) => {
    update.mutate({ id, data: { description: editDesc } }, {
      onSuccess: () => setEditingId(null),
    });
  };

  const confirmDelete = (id: string) => {
    del.mutate(id, { onSuccess: () => setConfirmDeleteId(null) });
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING:  'bg-amber-100 text-amber-700',
      APPROVED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-600',
    };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-5xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Gallery Management</h2>
        <p className="text-sm text-gray-500 mt-0.5">Review, edit, and delete gallery submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              statusFilter === tab.value
                ? 'bg-teal-700 text-white shadow-sm'
                : `${tab.color} hover:bg-gray-50`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="text-center py-16 text-gray-400">
            <i className="fas fa-circle-notch fa-spin text-2xl mb-2 block" />
            Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <i className="fas fa-images text-3xl mb-2 text-gray-200 block" />
            No submissions found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item: any) => (
              <div key={item.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4 items-start">
                  {/* Images strip */}
                  <div className="flex gap-2 flex-shrink-0">
                    {item.mediaUrls?.slice(0, 3).map((url: string, i: number) => (
                      <div key={i} className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {i === 2 && item.mediaUrls.length > 3 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                            +{item.mediaUrls.length - 3}
                          </div>
                        )}
                      </div>
                    ))}
                    {(!item.mediaUrls || item.mediaUrls.length === 0) && (
                      <div className="w-20 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300">
                        <i className="fas fa-image text-xl" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-800">{item.fullName}</span>
                        {statusBadge(item.status)}
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mb-2">
                      {item.mobile}{item.email && ` · ${item.email}`}
                      {item.district && ` · ${item.district.name}`}
                      {item.blockName && ` › ${item.blockName}`}
                    </p>

                    {/* Description — view or edit */}
                    {editingId === item.id ? (
                      <div className="space-y-2 mb-3">
                        <textarea
                          value={editDesc}
                          onChange={e => setEditDesc(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(item.id)}
                            disabled={update.isPending}
                            className="px-3 py-1.5 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {update.isPending ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-save" />}
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                    )}

                    {/* Actions */}
                    {editingId !== item.id && (
                      <div className="flex flex-wrap gap-2">
                        {item.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => approve.mutate({ id: item.id })}
                              disabled={approve.isPending}
                              className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1.5"
                            >
                              <i className="fas fa-check" /> Approve
                            </button>
                            <button
                              onClick={() => reject.mutate({ id: item.id })}
                              disabled={reject.isPending}
                              className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 disabled:opacity-50 flex items-center gap-1.5"
                            >
                              <i className="fas fa-times" /> Reject
                            </button>
                          </>
                        )}
                        {item.status === 'REJECTED' && (
                          <button
                            onClick={() => approve.mutate({ id: item.id })}
                            disabled={approve.isPending}
                            className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-200 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <i className="fas fa-redo" /> Re-approve
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(item)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 flex items-center gap-1.5"
                        >
                          <i className="fas fa-pen" /> Edit
                        </button>
                        {confirmDeleteId === item.id ? (
                          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                            <span className="text-xs text-red-600 font-medium">Delete?</span>
                            <button
                              onClick={() => confirmDelete(item.id)}
                              disabled={del.isPending}
                              className="text-xs font-bold text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              {del.isPending ? <i className="fas fa-circle-notch fa-spin" /> : 'Yes'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs font-bold text-gray-400 hover:text-gray-600"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 flex items-center gap-1.5"
                          >
                            <i className="fas fa-trash" /> Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
