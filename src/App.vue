<template>
  <div id="app">
    <header>The App</header>
    <form v-if="adding || editing" @submit.prevent="submitForm">
      <div class="subheader">{{ adding ? 'New' : 'Update' }} item</div>
      <input v-model="name" placeholder="Name" />
      <input v-model="email" placeholder="Email" />
      <button type="submit">
        {{ adding ? 'Add' : 'Save' }}
      </button>
      <button @click="hideForm">Cancel</button>
      <div v-if="errors.length" class="error">
        {{ errorMessage }}
      </div>
    </form>
    <button v-else @click="showAddForm">Add item</button>
    <div class="filter">
      Filter:
      <input v-model="filterString" placeholder="Name or email..." />
    </div>
    <div v-if="filteredItems.length">
      <table class="table">
        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Action</th>
        </thead>
        <tr v-for="(item, index) in filteredItems" :key="index">
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

    return {
      items: items,
      name: '',
      email: '',
      adding: false,
      editing: false,
      currentIndex: -1,
      filterString: '',
      errors: [''],
    };
  },
  mounted() {
    const defaultItems: IItem[] = [
      { name: 'Andy', email: 'tech@sym.ru' },
      { name: 'Julia', email: 'jpike@yandex.ru' },
    ];

    this.items = defaultItems;
  },
  computed: {
    errorMessage() {
      return `${this.$data.errors.join(' and ')} should not be empty.`;
    },
    filteredItems() {
      const str = this.$data.filterString.trim().toLowerCase();

      return str === ''
        ? this.$data.items
        : this.$data.items.filter(
            (item: IItem) =>
              item.name.toLowerCase().includes(str) ||
              item.email.toLowerCase().includes(str),
          );
    },
  },
  methods: {
    showAddForm() {
      this.adding = true;
      this.editing = false;
      this.name = '';
      this.email = '';
      this.errors = [];
    },
    showEditForm(index: number) {
      const item = this.items[index];

      this.adding = false;
      this.editing = true;
      this.name = item.name;
      this.email = item.email;
      this.errors = [];
      this.currentIndex = index;
    },
    validateForm() {
      this.errors = [];

      if (this.name.trim() === '') {
        this.errors.push('Name');
      }
      if (this.email.trim() === '') {
        this.errors.push('Email');
      }
    },
    submitForm() {
      this.validateForm();

      if (this.errors.length === 0) {
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
.filter {
  margin: 32px auto 12px;
}
.table {
  margin: auto;
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
