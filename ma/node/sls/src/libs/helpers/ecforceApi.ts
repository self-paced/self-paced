/* eslint-disable max-lines-per-function */
import { Context } from '../../functions/trpc/context';
import {
  dListCustomersFromSegmentResponse,
  dListSegmentsResponse,
} from './dummyData';

const callEcforceApi = async <T>(
  ctx: Context,
  params: { url: string; method: string; headers?: HeadersInit }
) => {
  const { jwt } = ctx;
  const res = await fetch(params.url, {
    method: params.method,
    headers: {
      Authorization: `Token token="${jwt.ecfToken}"`,
      ...params.headers,
    },
  });
  return (await res.json()) as EcforceResponse<T>;
};

export type EcforceResponse<T> = {
  data: T;
  meta: {
    total_count: number;
    page: number;
    per: number;
    count: number;
    total_pages: number;
  };
  links: {
    self: string;
    prev: string | null;
    first: string;
    next: string | null;
    last: string;
  };
};

export type SegmentItem = {
  id: string;
  type: 'search_query';
  attributes: {
    id: number;
    token: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
};

export type CustomerItem = {
  id: string;
  type: string;
  attributes: {
    id: number;
    authentication_token: string | null;
    number: string;
    state: string;
    human_state_name: string;
    customer_rank_name: string | null;
    email: string;
    mobile_email: string | null;
    sex: unknown;
    job: unknown;
    birth: string | null;
    buy_times: number;
    buy_total: number;
    point: number;
    point_expired_at: string | null;
    customer_type_name: string | null;
    optin: boolean;
    line_id: string | null;
    mail_delivery_stop: boolean;
    np_royal_customer: boolean;
    blacklist: boolean;
    blacklist_reasons: string;
    labels: string;
    coupon_codes: string;
    link_number: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  relationships: {
    billing_address: {
      data: {
        id: string;
        type: string;
      };
    };
    shipping_addresses: {
      data: unknown[];
    };
    notes: {
      data: unknown[];
    };
    orders: {
      data: unknown[];
    };
    subs_orders: {
      data: unknown[];
    };
    one_d_color_answers: {
      data: unknown[];
    };
    credit_cards: {
      data: unknown[];
    };
  };
};

const ecforceApi = {
  listSegments: async (ctx: Context) => {
    const url = `${ctx.req.headers.origin}/api/v2/admin/search_queries?page=1&per=100&type=customer`; // TODO: 現状は１００件のセグメントしか表示できない
    return process.env.NODE_ENV === 'development'
      ? dListSegmentsResponse
      : await callEcforceApi<SegmentItem[]>(ctx, {
          url,
          method: 'GET',
        });
  },
  listCustomersFromSegment: async (
    ctx: Context,
    input: { page: number; token: string }
  ) => {
    const url = `${ctx.req.headers.origin}/api/v2/admin/customers?per=100&page=${input.page}&q[token]=${input.token}`;
    return process.env.NODE_ENV === 'development'
      ? dListCustomersFromSegmentResponse[input.token]
      : await callEcforceApi<CustomerItem[]>(ctx, {
          url,
          method: 'GET',
        });
  },
};

export default ecforceApi;
