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
             <div class="error" v-if="$v.smj.$dirty && !$v.smj.required">Please select SMJ</div>
        </b-form-group>  
        <b-form-group label-cols="4" label-cols-lg="2" label="Deputy SMJ" label-for="input-default">
             <b-form-select v-model="deputySmj" :options="dsmjOptions"></b-form-select>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="PO" label-for="input-default">
             <b-form-select v-model="po" :options="poOptions"></b-form-select>
            <div class="error" v-if="$v.po.$dirty && !$v.po.required">Please select PO</div>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="SPO" label-for="input-default">
             <b-form-select v-model="spo" :options="spoOptions"></b-form-select>
        </b-form-group>  
        <b-form-group label-cols="4" label-cols-lg="2" label="Status" label-for="input-default">
             <b-form-select v-model="status" :options="statusOptions"></b-form-select>
            <div class="error" v-if="$v.status.$dirty && !$v.status.required">Please select project status</div>
        </b-form-group>
       
        <input type="submit" value="Save">
        <input type="button" value="Cancel" class="button" v-on:click="closePopup">
    </form>
  </div>          
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import user from '../store/modules/user';
export default {
    name: "AddProject",
    props:['currentData','userData'],
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
        console.log(this.deputySmj,'this.deputySMJ')
        let requestObj =  {
            name: this.name, 
            code: this.code,
            smj: this.smj,
            dsmj: this.deputySmj,
            po: this.po,
            spo: this.spo,
            status: this.status
        };
        if(this.id !== undefined){
          requestObj._id = this.id
          this.$emit('handleEditProjectForm', requestObj)
        }else{
          this.$emit('handleProjectForm', requestObj)
        }
        
      },
      
    },
    data(){
     
      let userOption = [{
           "value": null,
           "text": "Please select user"
        }]
      console.log(this.userData,'this.userData')  
      if(this.userData !== undefined){
        
        this.userData.map((userArray) =>{
         userOption.push({
            "value": userArray._id,
            "text": userArray.firstName
         })
      })
      }  
      return {
         id: this.currentData._id,
         name: this.currentData.name, 
         code: this.currentData.code,
         smj: this.currentData['smj._id'] !== undefined ? this.currentData['smj._id'] : null,
         deputySmj: this.currentData['dsmj._id'] !== undefined ? this.currentData['dsmj._id'] : null,
         po: this.currentData['po._id'] !== undefined ? this.currentData['po._id'] : null,
         spo: this.currentData['spo._id'] !== undefined ? this.currentData['spo._id'] : null,
         status: this.currentData.status !== undefined ? this.currentData.status : null,
         smjOptions: userOption,
         dsmjOptions: userOption,
         poOptions: userOption,
         spoOptions: userOption,
         /*poOptions: [
            { value: null, text: 'Please select user' },
            { value: 'a', text: 'This is First option' },
            { value: 'b', text: 'Selected Option' },
            { value: 'c', text: 'This is an option with object value' },
         ],*/
         statusOptions: [
            { value: null, text: 'Please select status' },
            { value: 'Active', text: 'Active' },
            { value: 'Completed', text: 'Completed' },
            { value: 'Onhold', text: 'Onhold'},
            { value: 'Pending', text: 'Pending'} 
         ]
      }
    },
    validations: {
      name: {
        required
      },
      code: {
        required
      },
      smj: {
        required
      },
      po: {
        required
      },
      status: {
        required
      }
     
    }
}
</script>

<style scoped>

</style>