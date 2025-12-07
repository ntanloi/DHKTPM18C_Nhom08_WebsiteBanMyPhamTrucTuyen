import { useCallback, useEffect, useRef, useState } from 'react';
import type { District, Province, Ward } from '../types/AddressSelector';
import axios from 'axios';

const API_URL = 'https://provinces.open-api.vn/api';

const api = axios.create({baseURL: API_URL})

type LoadingState = {
    provinces: boolean;
    districts: boolean;
    wards: boolean;
}

export const useAddress = () => {
  const cache = useRef<{ provinces?: Province[]; districts: Record<number, District[]>; wards: Record<number, Ward[]> }>({districts: {}, wards: {}});
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([])
  const [loading, setLoading] = useState<LoadingState>({provinces: false, districts: false, wards: false});
  const [error, setError] = useState<string | null>(null)

  const fetchProvince = useCallback(async () => {
    if(cache.current?.provinces) {
        setProvinces(cache.current.provinces);
        return;
    }

    setError(null);
    setLoading((s) => ({...s, provinces: true}))

    try {
        const res = await api.get<Province[]>("/?depth=1");
        const data = res.data || [];
        cache.current.provinces = data;
        setProvinces(data);
    } catch (e) {
        console.error(e);
        setError("Cant loading province list")
    } finally {
        setLoading(s => ({...s, provinces: false}))
    }
  }, []) 

  const fetchDistricts = useCallback(async (province_code: number) => {
    if(!province_code) {
        setDistricts([])
        setWards([])
        return;
    }

    if(cache.current.districts[province_code]) {
        setDistricts(cache.current.districts[province_code]);
        return;
    }
    
    setError(null);
    setLoading(s => ({...s, districts: true}));

    try {
        const res = await api.get<{ districts: District[] }>(`/p/${province_code}?depth=2`);
        const data = res.data.districts || [];
        cache.current.districts[province_code] = data;
        setDistricts(data)
    } catch (e) {
        console.error(e);
        setError("Cant loading district list")
    } finally {
        setLoading(s => ({...s, districts: false}))
    }
  }, [])

  const fetchWards = useCallback(async (district_code: number) => {
    if(!district_code) {
        setWards([])
        return;
    }

    if(cache.current.wards[district_code]) {
        setWards(cache.current.wards[district_code]);
        return;
    }

    setError(null)
    setLoading(s => ({...s, wards: true}))

    try {
        // Fetch wards separately to avoid depth=3 cost
        const res = await api.get<{wards: Ward[]}>(`/d/${district_code}?depth=2`);
        const data = res.data.wards || [];
        cache.current.wards[district_code] = data;
        setWards(data)
    } catch (e) {
        console.error(e);
        setError("Cant loading ward list")
    } finally {
        setLoading(s => ({...s, wards: false}))
    }
  }, [])

  useEffect(() => { fetchProvince()}, [fetchProvince])

  return { provinces, districts, wards, fetchDistricts, fetchWards, loading, error}
};