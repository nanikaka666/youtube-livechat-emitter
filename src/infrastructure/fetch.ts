import axios from "axios";

export async function post(url: string, postData: object): Promise<string> {
  const res = await axios.post(url, postData);
  return res.data as string;
}

export async function get(url: string): Promise<string> {
  const res = await axios.get(url);
  return res.data as string;
}
