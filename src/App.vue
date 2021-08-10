<template>
  <div id="app">
    <header>Users list</header>
    <form v-if="adding || editing" @submit.prevent="submitForm">
      <div class="subheader">{{ adding ? 'New' : 'Update' }} user</div>
      <input v-model="currentUser.name" placeholder="Name" />
      <input v-model="currentUser.email" placeholder="Email" />
      <input v-model="currentUser.website" placeholder="Website" />
      <input v-model="currentUser.phone" placeholder="Phone" />
      <button type="submit">
        {{ adding ? 'Add' : 'Save' }}
      </button>
      <button @click="hideForm">Cancel</button>
      <div v-if="errors.length" class="error">
        {{ errorMessage }}
      </div>
    </form>
    <button v-else @click="showAddForm">Add user</button>
    <div class="filter">
      Filter:
      <input v-model="filterString" placeholder="Name or email..." />
    </div>
    <div v-if="filteredUsers && filteredUsers.length">
      <table class="table">
        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Phone</th>
          <th>Action</th>
        </thead>
        <tr v-for="(user, index) in filteredUsers" :key="index">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.website }}</td>
          <td>{{ user.phone }}</td>
          <td>
            <button @click="showEditForm(index)">Edit</button>
            <button @click="removeUser(index)">Remove</button>
          </td>
        </tr>
      </table>
    </div>
    <div v-else class="no-users">No users found</div>
    <button @click="getUsers">Refresh</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IUser } from '@/interfaces';
import api from '@/api';

const emptyUser: IUser = {
  name: '',
  email: '',
  website: '',
  phone: '',
};

export default Vue.extend({
  name: 'App',
  data() {
    const users: IUser[] = [];

    return {
      users,
      currentUser: emptyUser,
      adding: false,
      editing: false,
      currentIndex: -1,
      filterString: '',
      errors: [''],
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
      this.users = await api.apiGetUsers();
    },
    showAddForm() {
      this.adding = true;
      this.editing = false;
      this.currentUser = { ...emptyUser };
      this.errors = [];
    },
    showEditForm(index: number) {
      this.adding = false;
      this.editing = true;
      this.currentUser = this.filteredUsers[index];
      this.errors = [];
      this.currentIndex = index;
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
    submitForm() {
      this.validateForm();

      if (this.errors.length === 0) {
        if (this.adding) {
          this.users.push(this.currentUser);
        } else {
          this.users[this.currentIndex] = this.currentUser;
        }
        this.hideForm();
      }
    },
    removeUser(index: number) {
      if (confirm('Are you sure?')) {
        this.users.splice(index, 1);
        if (this.editing && index === this.currentIndex) {
          this.hideForm();
        }
      }
    },
    hideForm() {
      this.adding = false;
      this.editing = false;
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
    &:last-of-type {
      width: 140px;
      text-align: center;
    }
  }
}
.no-users {
  margin-top: 30px;
}
</style>
