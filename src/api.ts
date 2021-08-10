import { IUser } from '@/interfaces';

const apiBaseURL = 'https://jsonplaceholder.typicode.com';

export default {
  async apiGetUsers(): Promise<IUser[]> {
    const response = await fetch(`${apiBaseURL}/users`);

    return response.ok ? await response.json() : null;
  },
};
