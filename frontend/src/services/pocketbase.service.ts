import PocketBase, { RecordListQueryParams } from "pocketbase";

const pb = new PocketBase('http://localhost:8090/');

pb.autoCancellation(false);

export async function getList(
  collection: string,
  page = 1,
  perPage = 10,
  queryParams: RecordListQueryParams | undefined = undefined
) {
  const res = await pb.collection(collection).getList(page, perPage, queryParams);
  return res;
}

export async function get(
  collection: string,
  id: string,
  queryParams?: RecordListQueryParams | undefined
) {
  const res = await pb.collection(collection).getOne(id, queryParams);
  return res;
}

export async function create(
  collection: string,
  bodyParams: {} | undefined,
  queryParams?: RecordListQueryParams | undefined
) {
  const res = await pb.collection(collection).create(bodyParams, queryParams);
  return res;
}

export async function update(
  collection: string,
  id: string,
  bodyParams: {} | undefined,
  queryParams?: RecordListQueryParams | undefined
) {
  const res = await pb.collection(collection).update(id, bodyParams, queryParams);
  return res;
}

export default pb;
