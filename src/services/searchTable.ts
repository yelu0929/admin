import request from '@/utils/request';
import { serchData } from '@/components/SearchTable/SearchTable'

export async function getServices(params: serchData) {
  return request(params.url, {
    method: params.method,
    data: params.data,
  });
}
