<template>
  <div class="popup">
    <!-- header -->
    <div class="popup-header">
      <b-icon icon="people-fill" class="rounded-circle header-icon"></b-icon>
      <span class="popup-title">{{formType}} team</span>
      <span class="align-right close" v-on:click="closePopup">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/></svg>
      </span>
    </div>
     
    <form @submit="saveTeam">
      <!-- body -->
      <div class="popup-body">
        <b-form-group label="Name" label-for="name">
          <input type="hidden" id="id" v-model="id" name="id" />
          <input type="text" id="name" v-model="name" name="name" placeholder="Enter name"  class="normalBox">
          <div class="error" v-if="$v.name.$dirty && !$v.name.required">Please enter name</div>
        </b-form-group> 
        <b-form-group label="Skills" label-for="skills" description="Please add multiple skills with comma seprated">
          <textarea id="skills" v-model="skills" name="skills" placeholder="Enter skills" class="normalBox"/>
        </b-form-group>
      </div>
      <!-- footer -->
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
export default {
    name: "AddTeam",
    props:['currentData'],
    methods:{
      closePopup(){
         this.$emit('closeAddTeam', 'close')
      },
      saveTeam(e){
        e.preventDefault();
        this.$v.$touch();
        if (this.$v.$invalid) {
            return;
        }
        let requestObj =  {name: this.name, skills: this.skills};
        if(this.id !== undefined){
          requestObj._id = this.id
          this.$emit('handleEditTeamForm', requestObj)
        }else{
          this.$emit('handleTeamForm', requestObj)
        }
        
        console.log(this.name, this.skills, 'check the form content')
      },
      
    },
    data(){
      return {
        id: this.currentData._id,
        name: this.currentData.name,
        skills: this.currentData.skills,
        formType: !this.currentData._id ? "Add" : "Edit"
      }
    },
    validations: {
      name: {
        required
      }
     
    }
}
</script>

<style scoped>

</style>