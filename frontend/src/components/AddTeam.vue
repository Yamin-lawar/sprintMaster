<template>
  <div>
     Add team
     <form @submit="saveTeam">
        <b-form-group label-cols="4" label-cols-lg="2" label="Name" label-for="input-default">
            <input type="hidden" id="id" v-model="id" name="id" />
            <input type="text" id="name" v-model="name" name="name" placeholder="name"  class="normalBox">
            <div class="error" v-if="$v.name.$dirty && !$v.name.required">Please enter name</div>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="Skills" label-for="input-default">
          <textarea id="skills" v-model="skills" name="skills" placeholder="skills" class="normalBox"/>
          <div class="notes">Please add multiple skills with comma seprated</div>
        </b-form-group>
        <input type="submit" value="Save">
        <input type="button" value="Cancel" v-on:click="closePopup">
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
          requestObj.id = this.id
          this.$emit('handleEditTeamForm', requestObj)
        }else{
          this.$emit('handleTeamForm', requestObj)
        }
        
        console.log(this.name, this.skills, 'check the form content')
      },
      
    },
    data(){
      return {
        id: this.currentData.id,
        name: this.currentData.name,
        skills: this.currentData.skill
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