<template>
  <div>
     Add Project 
     <form @submit="saveProject">
        <b-form-group label-cols="4" label-cols-lg="2" label="Name" label-for="input-default">
            <input type="hidden" id="id" v-model="id" name="id" />
            <input type="text" id="name" v-model="name" name="name" placeholder="Name"  class="normalBox">
            <div class="error" v-if="$v.name.$dirty && !$v.name.required">Please enter project name</div>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="code" label-for="input-default">
            <input type="text" id="code" v-model="code" name="code" placeholder="Code"  class="normalBox">
             <div class="error" v-if="$v.code.$dirty && !$v.code.required">Please enter project code</div>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="SMJ" label-for="input-default">
             <b-form-select v-model="smj" :options="smjOptions"></b-form-select>
            <!--<div class="error" v-if="$v.team.$dirty && !$v.team.required">Please Select team</div>-->
        </b-form-group>  
        <b-form-group label-cols="4" label-cols-lg="2" label="Deputy SMJ" label-for="input-default">
             <b-form-select v-model="deputySmj" :options="smjOptions"></b-form-select>
            <!--<div class="error" v-if="$v.team.$dirty && !$v.team.required">Please Select team</div>-->
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="PO" label-for="input-default">
             <b-form-select v-model="po" :options="poOptions"></b-form-select>
            <!--<div class="error" v-if="$v.team.$dirty && !$v.team.required">Please Select team</div>-->
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="SPO" label-for="input-default">
             <b-form-select v-model="spo" :options="poOptions"></b-form-select>
            <!--<div class="error" v-if="$v.team.$dirty && !$v.team.required">Please Select team</div>-->
        </b-form-group>  
        <b-form-group label-cols="4" label-cols-lg="2" label="Status" label-for="input-default">
             <b-form-select v-model="status" :options="statusOptions"></b-form-select>
            <!--<div class="error" v-if="$v.team.$dirty && !$v.team.required">Please Select team</div>-->
        </b-form-group>
       
        <input type="submit" value="Save">
        <input type="button" value="Cancel" v-on:click="closePopup">
    </form>
  </div>          
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
    name: "AddProject",
    props:['currentData'],
    methods:{
      closePopup(){
         this.$emit('closeAddProject', 'close')
      },
      saveProject(e){
        e.preventDefault();
        this.$v.$touch();
        if (this.$v.$invalid) {
            return;
        }
        let requestObj =  {
            name: this.name, 
            code: this.code,
            smj: this.smj,
            deputySMJ: this.deputySMJ,
        };
        if(this.id !== undefined){
          requestObj.id = this.id
          this.$emit('handleEditProjectForm', requestObj)
        }else{
          this.$emit('handleProjectForm', requestObj)
        }
        
      },
      
    },
    data(){
      return {
         id: this.currentData.id,
         name: this.currentData.name, 
         code: this.currentData.code,
         smj: this.currentData.status !== undefined ? this.currentData.smj : null,
         deputySmj: this.currentData.status !== undefined ? this.currentData.deputySmj : null,
         po: this.currentData.status !== undefined ? this.currentData.po : null,
         spo: this.currentData.status !== undefined ? this.currentData.spo : null,
         status: this.currentData.status !== undefined ? this.currentData.status : null,
         smjOptions: [
            { value: null, text: 'Please select user' },
            { value: 'a', text: 'This is First option' },
            { value: 'b', text: 'Selected Option' },
            { value: 'c', text: 'This is an option with object value' },
         ],
         poOptions: [
            { value: null, text: 'Please select user' },
            { value: 'a', text: 'This is First option' },
            { value: 'b', text: 'Selected Option' },
            { value: 'c', text: 'This is an option with object value' },
         ],
         statusOptions: [
            { value: null, text: 'Please select status' },
            { value: 'Active', text: 'Active' },
            { value: 'Completed', text: 'Completed' },
         ]
      }
    },
    validations: {
      name: {
        required
      },
      code: {
        required
      }
     
    }
}
</script>

<style scoped>

</style>