/* eslint-disable max-lines-per-function */
import axios, { AxiosRequestHeaders } from 'axios';
import { Context } from '../../functions/trpc/context';
import {
  dListCustomersFromSegmentResponse,
  dListSegmentsResponse,
  dSignInWithCookieResponse,
} from './dummyData';

/**
 * ローカルからdemoショップのデータを連携したい場合
 * こちらのフラグを`false`にする
 *
 * ※ クッキーを削除し、ログイン済みのdemoショップの`_ec_force_session`クッキーを設定する必要がある
 */
const DUMMY_FLAG = true;

const callEcforceApi = async <T>(
  ctx: Context,
  params: { url: string; method: string; headers?: AxiosRequestHeaders }
) => {
  const { jwt } = ctx;
  const res = await axios(params.url, {
    method: params.method,
    headers: {
      ...(jwt?.ecfToken && { Authorization: `Token token="${jwt.ecfToken}"` }),
      ...params.headers,
    },
  });

  return res.data as T;
};

export type EcfPaginatedResponse<T> = {
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

export type EcfUser = {
  id: number;
  email: string;
  authentication_token: string;
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

export type AddressItem = {
  id: string;
  type: string;
  attributes: {
    id: number;
    name01: string;
    name02: string;
    kana01: string;
    kana02: string;
    company_name: string;
    zip01: string;
    zip02: string;
    addr01: string;
    addr02: string;
    addr03: string;
    tel01: string;
    tel02: string;
    tel03: string;
    tel01_received: string;
    tel02_received: string;
    tel03_received: string;
    fax01: string;
    fax02: string;
    fax03: string;
    prefecture_id: number;
    prefecture_name: string;
    full_name: string;
    full_kana: string;
    full_tel: string;
    full_fax: string;
    full_zip: string;
    full_address: string;
    full_address_with_space: string;
    created_at: string;
    updated_at: string;
  };
};

const DEV_ORIGINS = ['http://localhost:4040', 'https://dev-ma.ec-force.com'];

export const getOrigin = (ctx: Context) => {
  const origin =
    ctx.req.headers.origin ??
    `${new URL(ctx.req.headers.referer ?? '').origin}`;
  return DEV_ORIGINS.includes(origin ?? '')
    ? 'https://demo35.ec-force.com'
    : origin;
};

const ecforceApi = {
  signInWithCookie: async (ctx: Context) => {
    const url = `${getOrigin(ctx)}/api/v2/admins/sign_in_with_cookie`;
    return process.env.NODE_ENV === 'development' && DUMMY_FLAG
      ? dSignInWithCookieResponse
      : await callEcforceApi<EcfUser>(ctx, {
          url,
          method: 'POST',
          headers: {
            cookie: ctx.req.headers?.cookie as string,
          },
        });
  },
  listSegments: async (ctx: Context) => {
    const url = `${getOrigin(
      ctx
    )}/api/v2/admin/search_queries?page=1&per=100&type=customer&include_group=1`; // TODO: 現状は１００件のセグメントしか表示できない
    return process.env.NODE_ENV === 'development' && DUMMY_FLAG
      ? dListSegmentsResponse
      : await callEcforceApi<EcfPaginatedResponse<SegmentItem[]>>(ctx, {
          url,
          method: 'GET',
        });
  },
  listCustomersFromSegment: async (
    ctx: Context,
    input: { page: number; token: string }
  ) => {
    const url = `${getOrigin(ctx)}/api/v2/admin/customers?per=100&page=${
      input.page
    }&q[token]=${input.token}&include=billing_address`;
    return process.env.NODE_ENV === 'development' && DUMMY_FLAG
      ? dListCustomersFromSegmentResponse[input.token]
      : await callEcforceApi<
          EcfPaginatedResponse<CustomerItem[]> & { included: AddressItem[] }
        >(ctx, {
          url,
          method: 'GET',
        });
  },
};

export default ecforceApi;
