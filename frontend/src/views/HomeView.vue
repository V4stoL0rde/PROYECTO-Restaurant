<template>
  <div>
    <HederViewVue></HederViewVue>
    
    <h1>MENU PROXIMAMENTE</h1>
    <p>Bienvenido, {{ username }}</p>

  
    <MyFooter></MyFooter>
  </div>
</template>
<script >

import HederViewVue from '@/components/HederView.vue';
import MyFooter from '@/components/FooterVue.vue';



export default{

  

name:"FormNue",

data() {
    return {
      username: ''
    };
  },

components:{
  HederViewVue,
  MyFooter
  
},

mounted() {
    this.username = localStorage.getItem("Username");
  }




}


</script>

<style>


</style>