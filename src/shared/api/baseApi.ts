import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_BASE_URL } from '@/shared/config';

/**
 * Neutral API slice: no domain endpoints yet.
 * Future slices can use `baseApi.injectEndpoints(...)`.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: [] as const,
  endpoints: () => ({}),
});
