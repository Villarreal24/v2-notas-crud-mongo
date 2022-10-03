<template>
  <div class="container">
    <h1>Notas</h1>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripcion</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
    data() {
        return {
            notas: []
        }
    },
    created() {
        this.listarNotas();
    },
    methods: {
        listarNotas() {
            this.axios.get('/nota')
            .then(res => console.log(res))
            .catch(e => console.log(e))
        }
    }, 
}
</script>