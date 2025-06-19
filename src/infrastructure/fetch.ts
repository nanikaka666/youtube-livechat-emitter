import axios from "axios";

export async function post(url: string, data: object): Promise<string> {
  const res = await axios.post(url, data);
  return res.data as string;
}

export async function get(url: string): Promise<string> {
  const res = await axios.get(url);
  return res.data as string;
}
