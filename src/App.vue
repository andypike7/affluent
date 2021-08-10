<template>
  <div id="app">
    <header>The App</header>
    <button v-if="!adding && !editing" @click="showAddForm">Add item</button>
    <form v-if="adding || editing" @submit.prevent="submitForm">
      <div class="subheader">{{ adding ? 'New' : 'Update' }} item</div>
      <input v-model="name" placeholder="Name" />
      <input v-model="email" placeholder="Email" />
      <button type="submit">
        {{ adding ? 'Add' : 'Save' }}
      </button>
      <button @click="hideForm">Cancel</button>
      <div v-if="errorMessage !== null" class="error">
        {{ errorMessage }}
      </div>
    </form>
    <div v-if="items.length">
      <table class="table">
        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Action</th>
        </thead>
        <tr v-for="(item, index) in items" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>
            <button @click="showEditForm(index)">Edit</button>
            <button @click="removeItem(index)">Remove</button>
          </td>
        </tr>
      </table>
    </div>
    <div v-else class="no-items">No items found</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface IItem {
  name: string;
  email: string;
}

export default Vue.extend({
  name: 'App',
  data() {
    const items: IItem[] = [];
    const errorMessage: string | null = null;

    return {
      items: items,
      name: '',
      email: '',
      errorMessage,
      adding: false,
      editing: false,
      currentIndex: -1,
    };
  },
  mounted() {
    const defaultItems: IItem[] = [
      { name: 'Andy', email: 'tech@sym.ru' },
      { name: 'Julia', email: 'jpike@yandex.ru' },
    ];

    this.items = defaultItems;
  },
  methods: {
    showAddForm() {
      this.name = '';
      this.email = '';
      this.adding = true;
      this.editing = false;
      this.errorMessage = null;
    },
    showEditForm(index: number) {
      const item = this.items[index];

      this.adding = false;
      this.editing = true;
      this.name = item.name;
      this.email = item.email;
      this.currentIndex = index;
      this.errorMessage = null;
    },
    validateForm() {
      const errors = [];

      if (this.name.trim() === '') {
        errors.push('Name');
      }
      if (this.email.trim() === '') {
        errors.push('Email');
      }
      return errors;
    },
    submitForm() {
      const errors = this.validateForm();

      if (errors.length) {
        this.errorMessage = `${errors.join(' and ')} should not be empty.`;
      } else {
        this.errorMessage = null;
        if (this.adding) {
          this.items.push({
            name: this.name,
            email: this.email,
          });
          console.log(`Added (${this.items.length})`);
        } else {
          const item = this.items[this.currentIndex];

          item.name = this.name;
          item.email = this.email;
        }
        this.hideForm();
      }
    },
    removeItem(index: number) {
      if (confirm('Are you sure?')) {
        this.items.splice(index, 1);
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
.table {
  margin: 30px auto;
  min-width: 500px;
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
.no-items {
  margin-top: 30px;
}
</style>
