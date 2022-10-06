<template>
  <div class="container">
    <h1>Notas</h1>

    <!-- Alerta -->
    <b-alert
      :show="dismissCountDown"
      :variant="mensaje.color"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      <p>{{ mensaje.texto }}...</p>
      <b-progress
        :variant="mensaje.color"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>

    <!-- Formulario Editar -->
    <form @submit.prevent="editarNota(notaEditar)" v-if="editar">
      <h3 class="text-center">Agregar nueva Nota</h3>
      <input
        type="text"
        placeholder="Ingrese un Nombre"
        class="form-control my-2"
        v-model="notaEditar.nombre"
      />
      <input
        type="text"
        placeholder="Ingrese una descripcion"
        class="form-control my-2"
        v-model="notaEditar.descripcion"
      />
      <b-button class="btn-sm btn-block btn-warning" type="submit"
        >Editar</b-button
      >
      <b-button class="btn-sm mx-2" @click="editar = false">Cancelar</b-button>
    </form>

    <!-- Formulario Agregar -->
    <form @submit.prevent="agregarNota(nota)" v-if="!editar">
      <h3 class="text-center">Agregar nueva Nota</h3>
      <input
        type="text"
        placeholder="Ingrese un Nombre"
        class="form-control my-2"
        v-model="nota.nombre"
      />
      <input
        type="text"
        placeholder="Ingrese una descripcion"
        class="form-control my-2"
        v-model="nota.descripcion"
      />
      <b-button class="btn-sm btn-block btn-success" type="submit"
        >Agregar</b-button
      >
    </form>

    <!-- Tabla -->
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripcion</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in notas" :key="index">
          <th scope="row">{{ item._id }}</th>
          <td>{{ item.nombre }}</td>
          <td>{{ item.descripcion }}</td>
          <td>
            <b-button
              class="btn-warning btn-sm mx-2"
              @click="activarEdicion(item._id)"
              >Actualizar</b-button
            >
            <b-button
              class="btn-danger btn-sm mx-2"
              @click="eliminarNota(item._id)"
              >Eliminar</b-button
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notas: [],
      nota: { nombre: "", descripcion: "" },
      notaEditar: { nombre: "", descripcion: "" },
      editar: false,
      mensaje: { color: "success", texto: "" },
      dismissSecs: 5,
      dismissCountDown: 0,
    };
  },
  created() {
    this.listarNotas();
  },
  methods: {
    alerta() {
      this.mensaje.color = "success";
      this.mensaje.texto = "Probando alerta";
      this.showAlert();
    },
    listarNotas() {
      this.axios
        .get("/nota")
        .then((res) => {
          // console.log(res.data);
          this.notas = res.data;
        })
        .catch((e) => console.log(e.response));
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    agregarNota(item) {
      this.axios
        .post("nueva-nota", item)
        .then((res) => {
          // Agrega al inicio de nuestro array notas
          this.notas.unshift(res.data);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.texto = "Notas Agregada!";
          this.mensaje.color = "success";
        })
        .catch((e) => {
          console.log(e.response.data.error.errors.nombre.message);

          // Alerta de mensaje
          this.showAlert();
          this.mensaje.color = "danger";
          this.mensaje.texto = e.response.data.error.errors.nombre.message;
        });
      this.nota = {};
      // this.agregar = false;
      this.listarNotas();
    },
    activarEdicion(id) {
      this.editar = true;
      this.axios
        .get(`/nota/${id}`)
        .then((res) => {
          this.notaEditar = res.data;
        })
        .catch((e) => console.log(e));
    },
    editarNota(item) {
      this.axios
        .put(`/nota/${item._id}`, item)
        .then((res) => {
          const index = this.notas.findIndex(n => n._id === res.data._id);
          this.notas[index].nombre = res.data.nombre;
          this.notas[index].descripcion = res.data.descripcion;

          // Alerta de mensaje
          this.mensaje.texto = "Nota editada!";
          this.mensaje.color = "success";
          this.showAlert();
          this.editar = false;
        })
        .catch((e) => console.log(e));
    },
    eliminarNota(id) {
      this.axios
        .delete(`/nota/${id}`)
        .then((res) => {
          const index = this.notas.findIndex((item) => {
            item._id === res.data._id;
          });
          this.notas.splice(index, 1);

          // Alerta de mensaje
          this.mensaje.texto = "Notas eliminada!";
          this.mensaje.color = "danger";
          this.showAlert();
          this.listarNotas();
        })
        .catch((e) => console.log(e));
    },
  },
};
</script>