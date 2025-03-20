<template>
  <vee-form @submit="onSubmit" :validation-schema="schema">
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { useUserStore } from "@/stores/user";
import { mapActions } from "pinia";
import { ErrorMessage } from "vee-validate";

export default {
  name: "AppLogin",
  components: {
    ErrorMessage,
  },
  data() {
    return {
      schema: {
        email: "required|email",
        password: "required|min:6|max:100",
      },
    };
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),

    async onSubmit(values) {
      try {
        await this.authenticate(values);
        window.location.reload();
      } catch (e) {
        console.error(e.message);
      }
    },
  },
};
</script>
