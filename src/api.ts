import { IUser } from '@/interfaces';

const apiBaseURL = 'https://jsonplaceholder.typicode.com';

export default {
  handleError(response: Response): void {
    if (!response.ok) {
      throw new Error('Something went wrong...');
    }
  },
  async getUsers(): Promise<IUser[]> {
    const response = await fetch(`${apiBaseURL}/users`);

    this.handleError(response);

    return await response.json();
  },
  async createUser(user: IUser): Promise<{ id: number }> {
    delete user.id;

    const response = await fetch(`${apiBaseURL}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });

    this.handleError(response);

    return await response.json();
  },
  async updateUser(user: IUser): Promise<{ id: number }> {
    const response = await fetch(`${apiBaseURL}/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });

    this.handleError(response);

    return await response.json();
  },
  async deleteUser(user: IUser): Promise<void> {
    const response = await fetch(`${apiBaseURL}/users/${user.id}`, {
      method: 'DELETE',
    });

    this.handleError(response);
  },
};
