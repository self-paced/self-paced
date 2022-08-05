export const constants = Object.freeze({
  projectName: 'ma',
  whitelistIPs: [
    // SPST IPs
    '52.193.12.150/32',
    '52.193.100.124/32',
    '52.193.233.214/32',
    '13.230.151.192/32',
    '13.115.209.203/32',
    '54.238.133.70/32',
    '54.199.141.109/32',
  ],
});

export type ConstantsType = typeof constants;
