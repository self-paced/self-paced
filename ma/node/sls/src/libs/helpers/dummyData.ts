import {
  CustomerItem,
  EcfPaginatedResponse,
  EcfUser,
  SegmentItem,
} from './ecforceApi';

const dMeta = {
  meta: {
    total_count: 1,
    page: 1,
    per: 100,
    count: 1,
    total_pages: 1,
  },
  links: {
    self: 'https://demo35.ec-force.com/api/v2/admin/customers?page=1&per=100',
    prev: null,
    first: 'https://demo35.ec-force.com/api/v2/admin/customers?page=1&per=1',
    next: 'https://demo35.ec-force.com/api/v2/admin/customers?page=&per=100',
    last: 'https://demo35.ec-force.com/api/v2/admin/customers?page=1&per=100',
  },
};

export const dSignInWithCookieResponse: EcfUser = {
  id: 1,
  email: 'ma@super-studio.jp',
  authentication_token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
};

export const dListSegmentsResponse: EcfPaginatedResponse<SegmentItem[]> = {
  data: [
    {
      id: '1',
      type: 'search_query',
      attributes: {
        id: 1,
        token: '15407622-2adb-4f47-a1c9-5c23bbe57b64',
        name: 'segment A - 村上',
        created_at: '2022/08/15 20:08:06',
        updated_at: '2022/08/15 20:08:06',
      },
    },
    {
      id: '2',
      type: 'search_query',
      attributes: {
        id: 2,
        token: '6c118f31-510f-4560-aa78-d6934e39dca4',
        name: 'segment B - ハヴィ、河端、菊池',
        created_at: '2022/08/15 20:08:06',
        updated_at: '2022/08/15 20:08:06',
      },
    },
    {
      id: '3',
      type: 'search_query',
      attributes: {
        id: 3,
        token: '54703b4b-c618-4088-80ea-49c5c99d5b7e',
        name: 'segment C - 中川',
        created_at: '2022/08/15 20:08:06',
        updated_at: '2022/08/15 20:08:06',
      },
    },
    {
      id: '4',
      type: 'search_query',
      attributes: {
        id: 4,
        token: '2y43d62r-y53v-34rf-3r4r-3rrwr4t434t3',
        name: 'segment D - ハヴィ',
        created_at: '2022/08/15 20:08:06',
        updated_at: '2022/08/15 20:08:06',
      },
    },
  ],
  ...dMeta,
};

const dCustomer: CustomerItem = {
  id: '1',
  type: 'customer',
  attributes: {
    id: 3,
    authentication_token: null,
    number: '9999999999',
    state: 'member',
    human_state_name: '会員',
    customer_rank_name: null,
    email: 'xxxx@super-studio.jp',
    mobile_email: null,
    sex: null,
    job: null,
    birth: null,
    buy_times: 0,
    buy_total: 0,
    point: 0,
    point_expired_at: null,
    customer_type_name: 'ネット',
    optin: false,
    line_id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    mail_delivery_stop: false,
    np_royal_customer: false,
    blacklist: false,
    blacklist_reasons: '',
    labels: '',
    coupon_codes: '',
    link_number: null,
    created_at: '2022/08/16 14:11:28',
    updated_at: '2022/08/16 14:11:28',
    deleted_at: null,
  },
  relationships: {
    billing_address: {
      data: {
        id: '9',
        type: 'address',
      },
    },
    shipping_addresses: {
      data: [],
    },
    notes: {
      data: [],
    },
    orders: {
      data: [],
    },
    subs_orders: {
      data: [],
    },
    one_d_color_answers: {
      data: [],
    },
    credit_cards: {
      data: [],
    },
  },
};

export const dListCustomersFromSegmentResponse: {
  [key: string]: EcfPaginatedResponse<CustomerItem[]>;
} = {
  '15407622-2adb-4f47-a1c9-5c23bbe57b64': {
    data: [
      {
        // 村上
        ...dCustomer,
        id: '1',
        attributes: {
          ...dCustomer.attributes,
          id: 1,
          line_id: 'U047bb714204750b1fac84038db302a12',
        },
      },
    ],
    ...dMeta,
  },
  '6c118f31-510f-4560-aa78-d6934e39dca4': {
    data: [
      {
        // Ravi
        ...dCustomer,
        id: '2',
        attributes: {
          ...dCustomer.attributes,
          id: 2,
          line_id: 'Uabe224d99d896c04a0fc5730a8c58cb4',
        },
      },
      {
        // 河端
        ...dCustomer,
        id: '3',
        attributes: {
          ...dCustomer.attributes,
          id: 3,
          line_id: 'U54e5269306edf7d6a33fe44099a02fe2',
        },
      },
      {
        // 菊池
        ...dCustomer,
        id: '4',
        attributes: {
          ...dCustomer.attributes,
          id: 4,
          line_id: 'U97e07eaecdc08925a9bec89f31216e08',
        },
      },
    ],
    ...dMeta,
  },
  '54703b4b-c618-4088-80ea-49c5c99d5b7e': {
    data: [
      {
        // 中川
        ...dCustomer,
        id: '5',
        attributes: {
          ...dCustomer.attributes,
          id: 5,
          line_id: 'U2b5ef79a4c8085f615df92b7753a9e83',
        },
      },
    ],
    ...dMeta,
  },
  '2y43d62r-y53v-34rf-3r4r-3rrwr4t434t3': {
    data: [
      {
        // Ravi
        ...dCustomer,
        id: '2',
        attributes: {
          ...dCustomer.attributes,
          id: 2,
          line_id: 'Uabe224d99d896c04a0fc5730a8c58cb4',
        },
      },
    ],
    ...dMeta,
  },
};
