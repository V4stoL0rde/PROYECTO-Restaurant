<template>

    <HederViewVue></HederViewVue>
    <section class="vh-100">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-6 text-black">
  
          <div class="d-flex align-items-center px-5 ms-xl-4">
            <img src="../assets/logo-h.png" alt="300" width="350" >
           
          </div>
  
          <div class="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
  
            <form style="width: 23rem;">
  
              <h3 class="fw-normal mb-3 pb-3" style="letter-spacing: 1px;">Log in</h3>

              <div v-if="logged">

                <div class="form-outline mb-4">
                <input type="input" id="form2Example18" class="form-control form-control-lg" v-model="nombre" />
                <label class="form-label" for="form2Example18">Username</label>
              </div>
              <div class="form-outline mb-4">
                <input type="input" id="form2Example18" class="form-control form-control-lg" v-model="correo" />
                <label class="form-label" for="form2Example18">Correo</label>
              </div>
              <div class="form-outline mb-4">
                <select
                  class="form-control form-control-lg"
                  v-model="role"
                  id="role"
                >
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="TRABAJADOR">TRABAJADOR</option>
                </select>
                <label class="form-label" for="role">Tipo de Usuario</label>
              </div>

              <div class="form-outline mb-4">
                <input type="password" id="form2Example20" class="form-control form-control-lg" v-model="nuevaContrasena" />
                <label class="form-label" for="form2Example20">Nueva contraseña</label>
                </div>
                <div class="form-outline mb-4">
                <input type="password" id="form2Example21" class="form-control form-control-lg" v-model="confirmarContrasena" />
                <label class="form-label" for="form2Example21">Confirmar nueva contraseña</label>
                </div>

              <div class="pt-1 mb-4">
                <button @click="login()" class="btn btn-info btn-lg btn-block" type="button">enviar</button>
              </div>


              </div>
  
            
                <!-- Nuevos campos de entrada -->
  <div v-if="loggedIn">
    <div class="form-outline mb-4">
      <input type="input" id="form2Example19" class="form-control form-control-lg" v-model="codigo" />
      <label class="form-label" for="form2Example19">Código</label>
    </div>
   
    <div class="pt-1 mb-4">
      <button @click="confirmar()" class="btn btn-info btn-lg btn-block" type="button">Confirmar</button>
    </div>
  </div>
 
  
            </form>
  
          </div>
  
        </div>
        <div class="col-sm-6 px-0 d-none d-sm-block">
          <img src="../assets/login.jpg"
            alt="Login image" class="w-100 vh-100" style="object-fit: cover; object-position: left;">
        </div>
      </div>
    </div>
  </section>
  </template>
  
  <script>
  
  import axios from 'axios'
  import HederViewVue from '@/components/HederView.vue'
  
  export default {
    name: 'LoginView',
  
    components:{
    HederViewVue
  },
    data: function(){
      return {
        nombre: '',
        correo:'',
      loggedIn: false,
      logged: true,
      codigo: '',
      nuevaContrasena: '',
      confirmarContrasena: '',
      role: "CLIENTE"
        
      }
    },
    methods:{
      login(){
        if (this.nuevaContrasena == this.confirmarContrasena) {
          axios.post('http://localhost:3000/api/users/nuevo-usuario', {Username:this.nombre,correo:this.correo,password:this.confirmarContrasena,role:this.role})
          .then( data =>{
            console.log(data.data)
            this.loggedIn=true;
            this.logged=false;
          })
        }
        else{
            window.alert("las contraseñas no son iguales")
        }
        
         
      },
      confirmar() {
            axios.post('http://localhost:3000/api/users/nuevo', {Username:this.nombre,code:this.codigo})
          .then( data =>{
            console.log(data.data)
           
          })
        }
    }
  }
  
  </script>
  
  
  <style>
  .wrapper {
    display: flex;
    align-items: center;
    flex-direction: column; 
    justify-content: center;
    width: 100%;
    min-height: 100%;
    padding: 40px;
  }
  </style>