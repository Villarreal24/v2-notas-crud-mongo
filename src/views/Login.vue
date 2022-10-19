<template>
  <div class="container">
    <h1>Login</h1>
    <form @submit.prevent="login()">
      <input type="email" placeholder="Email" class="form-control my-2" v-model="usuario.email" />
      <input type="text" placeholder="Contraseña" class="form-control my-2" v-model="usuario.pass" />
      <b-button class="btn-block" type="submit"> Acceder </b-button>
    </form>
    <div v-if="mensaje != ''">
      <p class="text-danger">{{ mensaje }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      usuario: {
        email: "yareli@gmail.com", pass: "123456789"
      },
      mensaje: ''
    }
  },
  methods: {
    ...mapActions(['guardarUsuario']),
    login() {
      this.axios
        .post('/login', this.usuario)
        .then(res => {
          const token = res.data.token

          this.guardarUsuario(token);
          this.$router.push({ name: 'notas' });
        })
        .catch((err) => {
          this.mensaje = err.response.data.mensaje
        });
    }
  }
};
</script>