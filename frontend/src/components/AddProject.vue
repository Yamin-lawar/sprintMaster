<template>
  <div class="popup">

    <div class="popup-header">
      <b-icon icon="layout-text-sidebar" class="rounded-circle header-icon"></b-icon>
      <span class="popup-title">{{formType}} Project</span>
      <span class="align-right close" v-on:click="closePopup">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/></svg>
      </span>
    </div>
     <!-- Add Project  -->
     <form @submit="saveProject">
       <div class="popup-body">
         <div class="row">
           <div class="col-md-6">
             <b-form-group label="Name" label-for="name">
              <input type="hidden" id="id" v-model="id" name="id" />
              <input type="text" id="name" v-model="name" name="name" placeholder="Enter project name"  class="normalBox">
              <div class="error" v-if="$v.name.$dirty && !$v.name.required">Please enter project name</div>
            </b-form-group> 
            </div>
            <div class="col-md-6">
              <b-form-group label="code" label-for="code">
                <input type="text" id="code" v-model="code" name="code" placeholder="Enter project code"  class="normalBox">
                <div class="error" v-if="$v.code.$dirty && !$v.code.required">Please enter project code</div>
              </b-form-group> 
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <b-form-group label="SMJ" label-for="smj">
                <b-form-select v-model="smj" :options="smjOptions" id="smj"></b-form-select>
                <div class="error" v-if="$v.smj.$dirty && !$v.smj.required">Please select SMJ</div>
              </b-form-group> 
            </div>
            <div class="col-md-6">
              <b-form-group label="Deputy SMJ" label-for="dsmj">
                <b-form-select v-model="deputySmj" :options="dsmjOptions" id="dsmj"></b-form-select>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <b-form-group label="PO" label-for="po">
                <b-form-select v-model="po" :options="poOptions" id="po"></b-form-select>
                <div class="error" v-if="$v.po.$dirty && !$v.po.required">Please select PO</div>
              </b-form-group> 
            </div>
            <div class="col-md-6">
              <b-form-group label="SPO" label-for="spo">
                <b-form-select v-model="spo" :options="spoOptions" id="spo"></b-form-select>
              </b-form-group> 
            </div>
          </div>
        <b-form-group label="Status" label-for="status">
             <b-form-select v-model="status" :options="statusOptions" id="status"></b-form-select>
            <div class="error" v-if="$v.status.$dirty && !$v.status.required">Please select project status</div>
        </b-form-group>
        </div>
       
        <div class="popup-footer clearfix">
        <div class="button-wrapper align-right">
          <input type="submit" value="Save" class="button">
          <input type="button" value="Cancel" class="button" v-on:click="closePopup">
        </div>
        </div>
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
         formType: !this.currentData._id ? "Add" : "Edit",
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