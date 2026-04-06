'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  infrastructureApi,
  District,
  Block,
  MiniStadium,
  MultipurposeHall,
  MangalDal,
} from '@/lib/api/infrastructure';
import { PaginationMeta } from '@/lib/api';

// ─── useDistricts ─────────────────────────────────────────────────────────────

export function useDistricts() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    infrastructureApi.getDistricts()
      .then(res => setDistricts(res.data))
      .catch(err => setError(err.message ?? 'Failed to load districts'))
      .finally(() => setLoading(false));
  }, []);

  return { districts, loading, error };
}

// ─── useBlocks ────────────────────────────────────────────────────────────────

export function useBlocks(districtId?: string) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!districtId) { setBlocks([]); return; }
    setLoading(true);
    setError(null);
    infrastructureApi.getBlocks({ districtId })
      .then(res => setBlocks(res.data))
      .catch(err => setError(err.message ?? 'Failed to load blocks'))
      .finally(() => setLoading(false));
  }, [districtId]);

  return { blocks, loading, error };
}

// ─── useMiniStadiums ──────────────────────────────────────────────────────────

export function useMiniStadiums(districtId?: string) {
  const [stadiums, setStadiums] = useState<MiniStadium[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const load = useCallback((distId?: string, pg = 1) => {
    if (!distId) { setStadiums([]); setMeta(null); return; }
    setLoading(true);
    setError(null);
    infrastructureApi.getMiniStadiums({ districtId: distId, page: pg, limit })
      .then(res => { setStadiums(res.data); setMeta(res.meta); setPage(pg); })
      .catch(err => setError(err.message ?? 'Failed to load mini-stadiums'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(districtId, 1); }, [districtId, load]);

  return { stadiums, meta, loading, error, page, setPage: (p: number) => load(districtId, p) };
}

// ─── useMultipurposeHalls ─────────────────────────────────────────────────────

export function useMultipurposeHalls(districtId?: string) {
  const [halls, setHalls] = useState<MultipurposeHall[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const load = useCallback((distId?: string, pg = 1) => {
    if (!distId) { setHalls([]); setMeta(null); return; }
    setLoading(true);
    setError(null);
    infrastructureApi.getMultipurposeHalls({ districtId: distId, page: pg, limit })
      .then(res => { setHalls(res.data); setMeta(res.meta); setPage(pg); })
      .catch(err => setError(err.message ?? 'Failed to load multipurpose halls'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(districtId, 1); }, [districtId, load]);

  return { halls, meta, loading, error, page, setPage: (p: number) => load(districtId, p) };
}

// ─── useMangalDals ────────────────────────────────────────────────────────────

export function useMangalDals(blockId?: string, dalType?: 'MAHILA' | 'YUVAK') {
  const [dals, setDals] = useState<MangalDal[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((blkId?: string) => {
    if (!blkId) { setDals([]); setMeta(null); return; }
    setLoading(true);
    setError(null);
    infrastructureApi.getMangalDals({ blockId: blkId, dalType, limit: 200 })
      .then(res => { setDals(res.data); setMeta(res.meta); })
      .catch(err => setError(err.message ?? 'Failed to load Mangal Dals'))
      .finally(() => setLoading(false));
  }, [dalType]);

  useEffect(() => { load(blockId); }, [blockId, load]);

  return { dals, meta, loading, error };
}
