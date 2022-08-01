export function getAPIBaseInfo(rawDir: string) {
  const handlerDir = `${rawDir
    .split(process.cwd())[1]
    .substring(1)
    .replace(/\\/g, '/')}`;
  const path = handlerDir.split('/').slice(-1)[0];
  const cors = {
    origin: '*',
    headers: [
      'Content-Type',
      'X-Amz-Date',
      'Authorization',
      'X-Api-Key',
      'X-Amz-Security-Token',
      'X-Amz-User-Agent',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Header',
      'Access-Control-Allow-Origin',
    ],
  };
  return { handlerDir, path, cors };
}
