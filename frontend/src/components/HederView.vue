<template>



<Header>

  <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">restaurante</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <router-link class="nav-link active" to="/">Menu</router-link>
        <router-link class="nav-link active" to="/login">iniciar sesión</router-link>
        <router-link v-if="this.rols==='ADMIN' || this.rols==='TRABAJADOR' || this.rols==='CLIENTE'"  @click="logout" class="nav-link text-danger" to="/login">Cerrar Sesión</router-link>

         
      </div>
    </div>
  </div>
</nav>

</Header>


</template>


<script>


export default{
  name:"AppVue",


data(){
    return {
    rols:""
        
    }
},
mounted:function(){

  this.rols = localStorage.getItem("role");
        console.log(this.rols)
        

},
methods: {
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("Username");
    localStorage.removeItem("role");
    this.$router.push("/login"); // Redirige a la pantalla de login
  }
}

};
</script>

<style>

.navbar-nav .nav-link  {
  color: #ffffff; /* Establece el color de fuente que desees */
}
.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}
</style>