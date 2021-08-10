<template>
  <div id="app">
    <header>Users list</header>
    <!-- In a real project, I'd like to use popup instead of an inline form. -->
    <!-- So, logic is a bit witred but not extra dependencies are requred. -->
    <button v-if="state === State.IDLE" @click="showAddForm">Add user</button>
    <form v-else @submit.prevent="submitForm">
      <div class="subheader">
        {{ state === State.ADDITION ? 'New' : 'Update' }} user
      </div>
      <input v-model="currentUser.name" placeholder="Name" ref="focus" />
      <input v-model="currentUser.email" placeholder="Email" />
      <input v-model="currentUser.website" placeholder="Website" />
      <input v-model="currentUser.phone" placeholder="Phone" />
      <button type="submit" :disabled="isInProcess">
        {{ state === State.ADDITION ? 'Add' : 'Save' }}
      </button>
      <button @click="state = State.IDLE">Cancel</button>
      <div v-if="errors.length" class="error">
        {{ errorMessage }}
      </div>
    </form>
    <div class="filter">
      Filter:
      <input v-model="filterString" placeholder="Name or email..." />
    </div>
    <div v-if="filteredUsers && filteredUsers.length">
      <table class="table">
        <thead>
          <th>id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Phone</th>
          <th>Action</th>
        </thead>
        <tr v-for="(user, index) in filteredUsers" :key="index">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.website }}</td>
          <td>{{ user.phone }}</td>
          <td>
            <button
              @click="showEditForm(index)"
              :disabled="disabledActions.includes(user.id)"
            >
              Edit
            </button>
            <button
              @click="removeUser(user)"
              :disabled="disabledActions.includes(user.id)"
            >
              Remove
            </button>
          </td>
        </tr>
      </table>
    </div>
    <div v-else class="no-users">No users found</div>
    <!-- I thought this action will reload really changed data, unfortunately not. -->
    <button @click="getUsers">Refresh</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IUser } from '@/interfaces';
import api from '@/api';

const emptyUser: IUser = {
  id: 0,
  name: '',
  email: '',
  website: '',
  phone: '',
};

enum State {
  IDLE,
  ADDITION,
  EDITING,
}

export default Vue.extend({
  name: 'App',
  data: () => {
    const users: IUser[] = [];

    return {
      users,
      currentUser: emptyUser,
      filterString: '',
      errors: [] as string[],
      isInProcess: false,
      isInDeletion: false,
      disabledActions: [] as number[],
      state: State.IDLE,
      State,
    };
  },
  async mounted() {
    await this.getUsers();
  },
  computed: {
    errorMessage: function (): string {
      return `${this.errors.join(' and ')} should not be empty.`;
    },
    filteredUsers: function (): IUser[] {
      // In a real project it's better to split string into words.
      const str = this.filterString.trim().toLowerCase();

      return str === ''
        ? this.users
        : this.users.filter(
            (user: IUser) =>
              user.name.toLowerCase().includes(str) ||
              user.email.toLowerCase().includes(str),
          );
    },
  },
  methods: {
    async getUsers() {
      try {
        this.users = await api.getUsers();
      } catch (error) {
        console.error(error);
      }
    },
    showAddForm() {
      this.state = State.ADDITION;
      this.currentUser = { ...emptyUser };
      this.errors = [];
    },
    showEditForm(index: number) {
      this.state = State.EDITING;
      this.currentUser = { ...this.filteredUsers[index] };
      this.errors = [];
    },
    validateForm() {
      this.errors = [];

      if (this.currentUser.name.trim() === '') {
        this.errors.push('Name');
      }
      if (this.currentUser.email.trim() === '') {
        this.errors.push('Email');
      }
    },
    async submitForm() {
      this.validateForm();

      if (this.errors.length === 0) {
        this.isInProcess = true;

        try {
          if (this.state === State.ADDITION) {
            const response = await api.createUser(this.currentUser);

            this.currentUser.id = response.id;
            this.users.push(this.currentUser);
          } else {
            await api.updateUser(this.currentUser);

            const index = this.users.findIndex(
              (user) => user.id === this.currentUser.id,
            );

            if (index !== -1) {
              this.users[index] = this.currentUser;
            }
          }
          this.state = State.IDLE;
        } catch (error) {
          console.error(error);
        }

        this.isInProcess = false;
      }
    },
    async removeUser(user: IUser) {
      // I don't use `confirm` in real projects, this is a test project exception.
      if (confirm('Are you sure?') && user.id !== undefined) {
        this.disabledActions.push(user.id);
        this.isInDeletion = true;

        try {
          await api.deleteUser(user.id);

          const index = this.users.indexOf(user);

          this.users.splice(index, 1);

          const disabledIndex = this.disabledActions.indexOf(user.id);

          if (disabledIndex > -1) {
            this.disabledActions.splice(disabledIndex, 1);
          }

          // Not required, but more correct.
          if (this.state === State.EDITING && user.id === this.currentUser.id) {
            this.state = State.IDLE;
          }
        } catch (error) {
          console.error(error);
        }

        this.isInDeletion = false;
      }
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Verdana;
  text-align: center;
  font-size: 16px;
  button,
  input {
    padding: 5px;
    margin: 0 5px;
    font-size: 16px;
  }
}
header {
  font-size: 24px;
  margin: 32px auto;
  font-weight: bold;
}
.subheader {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}
.error {
  color: red;
  margin-top: 10px;
}
.filter {
  margin: 32px auto 0;
}
.table {
  margin: 32px auto;
  min-width: 1000px;
  border-collapse: collapse;
  td {
    text-align: left;
    padding: 10px;
    border: 1px solid black;
    &:first-of-type {
      width: 22px;
      text-align: right;
    }
    &:last-of-type {
      width: 140px;
      text-align: center;
    }
  }
}
.no-users {
  margin: 30px;
}
</style>
