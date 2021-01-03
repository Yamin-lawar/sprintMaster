<template>
  <div>
     <span>{{formType}} User</span>
     <form @submit="saveUser">
        <b-form-group label-cols="4" label-cols-lg="2" label="Name" label-for="input-default">
            <input type="hidden" id="id" v-model="id" name="id" />
            <input type="text" id="firstName" v-model="firstName" name="firstName" placeholder="First Name"  class="normalBox">
            <div class="error" v-if="$v.firstName.$dirty && !$v.firstName.required">Please enter first name</div>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="Last Name" label-for="input-default">
            <input type="text" id="lastName" v-model="lastName" name="lastName" placeholder="Last Name"  class="normalBox">
             <div class="error" v-if="$v.lastName.$dirty && !$v.lastName.required">Please enter last name</div> 
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="Email" label-for="input-default">
            <input type="text" id="email" v-model="email" name="email" placeholder="Email"  class="normalBox" :disabled="formType == 'Edit'">
            <div class="error" v-if="$v.email.$dirty && !$v.email.required || !$v.email.email">Please enter proper email</div>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="Skills" label-for="input-default">
          <textarea id="skills" v-model="skills" name="skills" placeholder="skills" class="normalBox"/>
          <div class="notes">Please add multiple skills with comma seprated</div>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="Mobile no" label-for="input-default">
            <input type="text" id="mobileNo" v-model="mobileNo" name="mobileNo" placeholder="Mobile No"  class="normalBox">
            <div class="error" v-if="$v.mobileNo.$dirty && !$v.mobileNo.required">Please enter mobile number</div>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="Avtaar" label-for="input-default">
            <b-form-file
                v-model="avtaar"
                :state="Boolean(avtaar)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                accept="image/jpeg, image/png, image/gif"
            ></b-form-file>
            <div class="mt-3">Selected file: {{ avtaar ? avtaar.name : '' }}</div>
        </b-form-group>
         <b-form-group label-cols="4" label-cols-lg="2" label="Team" label-for="input-default">
             <b-form-select v-model="userTeam" :options="options"></b-form-select>
            <!--<div class="error" v-if="$v.team.$dirty && !$v.team.required">Please Select team</div> -->
        </b-form-group> 
        <input type="submit" value="Save">
        <input type="button" value="Cancel" class="button" v-on:click="closePopup">
    </form>
  </div>          
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
    name: "AddUser",
    props:['currentData','teamData'],
    methods:{
      closePopup(){
         this.$emit('closeAddUser', 'close')
      },
      saveUser(e){
        e.preventDefault();
        this.$v.$touch();
        if (this.$v.$invalid) {
            return;
        }
        let requestObj =  {
            firstName: this.firstName, 
            lastName: this.lastName,
            email: this.email,
            skills: this.skills,
            mobileNo: this.mobileNo,
            avtaar: "www.google.com",//this.avtaar,
            team: this.userTeam
        };
        if(this.id !== undefined){
          requestObj._id = this.id
          delete requestObj.email
          this.$emit('handleEditUserForm', requestObj)
        }else{
          this.$emit('handleUserForm', requestObj)
        }
        
      },
     
    },
    data(){
        let teamOption = [{
           "value": null,
           "text": "Please select team"
        }]
        this.teamData.map((teamArray) =>{
         teamOption.push({
            "value": teamArray._id,
            "text": teamArray.name
         })
        })
      return {
         id: this.currentData._id,
         firstName: this.currentData.firstName, 
         lastName: this.currentData.lastName,
         email: this.currentData.email,
         skills: this.currentData.skills,
         mobileNo: this.currentData.mobileNo,
         avtaar: this.currentData.avtaar,
         userTeam: !this.currentData['team.name'] ? null : this.currentData['team._id'],
         options: teamOption,
         formType: !this.currentData._id ? "Add" : "Edit"
      }
    },
    validations: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      email: {
        required,
        email
      },
      mobileNo: {
        required
      },
      
     
    }
}
</script>

<style scoped>

</style>