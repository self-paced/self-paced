const MESSAGES = {
  required: (fieldName: string) => `「${fieldName}」は必須です。`,
  url: (fieldName: string) => `「${fieldName}」は不正です。`,
};

const v = {
  MESSAGES,
};

export default v;
