import axios from "axios";

export async function post(url: string, postData: object): Promise<object> {
  const res = await axios.post(url, postData);
  return res.data as object;
}
