import { IUser } from '@/interfaces';
import { API_URL } from '@/config';

// I have realized just '/users' endpoints.
// Others are the same but require more code.

// If I had more time I'd like to change this
// realization to Components <=> Vuex <=> API.

// I prefer the axios package, but as we definitely know that it's
// a testing project, I have tried not to use external dependencies.

export default {
  handleError(response: Response): void {
    if (!response.ok) {
      throw new Error('Something went wrong...');
    }
  },
  async getUsers(): Promise<IUser[]> {
    const response = await fetch(`${API_URL}/users`);

    this.handleError(response);

    return await response.json();
  },
  async createUser(user: IUser): Promise<{ id: number }> {
    delete user.id;

    // This works incorrectly. Initially I have 10 users,
    // but this function always returns { id: 11 }.
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });

    this.handleError(response);

    return await response.json();
  },
  async updateUser(user: IUser): Promise<{ id: number }> {
    const response = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });

    this.handleError(response);

    return await response.json();
  },
  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });

    this.handleError(response);
  },
};
