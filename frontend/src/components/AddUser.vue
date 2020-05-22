<template>
  <div>
     Add User 
     <form @submit="saveUser">
        <b-form-group label-cols="4" label-cols-lg="2" label="Name" label-for="input-default">
            <input type="hidden" id="id" v-model="id" name="id" />
            <input type="text" id="firstName" v-model="firstName" name="firstName" placeholder="First Name"  class="normalBox">
            <div class="error" v-if="$v.firstName.$dirty && !$v.firstName.required">Please enter first name</div>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="Last Name" label-for="input-default">
            <input type="text" id="lastName" v-model="lastName" name="lastName" placeholder="Last Name"  class="normalBox">
            <!-- <div class="error" v-if="$v.lastName.$dirty && !$v.lastName.required">Please enter last name</div> -->
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="Email" label-for="input-default">
            <input type="text" id="email" v-model="email" name="email" placeholder="Email"  class="normalBox">
            <!--<div class="error" v-if="$v.email.$dirty && !$v.email.required">Please enter email</div>-->
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="Skills" label-for="input-default">
          <textarea id="skills" v-model="skills" name="skills" placeholder="skills" class="normalBox"/>
          <div class="notes">Please add multiple skills with comma seprated</div>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="Mobile no" label-for="input-default">
            <input type="text" id="mobileNo" v-model="mobileNo" name="mobileNo" placeholder="Mobile No"  class="normalBox">
          <!--  <div class="error" v-if="$v.mobileNo.$dirty && !$v.mobileNo.required">Please enter mobile number</div>-->
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
            <!--<div class="error" v-if="$v.avtaar.$dirty && !$v.avtaar.required">Please enter Avtaar</div>-->
        </b-form-group>
         <b-form-group label-cols="4" label-cols-lg="2" label="Team" label-for="input-default">
             <b-form-select v-model="selected" :options="options"></b-form-select>
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
    name: "AddUser",
    props:['currentData'],
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
            avtaar: this.avtaar,
            team: this.team

        };
        if(this.id !== undefined){
          requestObj.id = this.id
          this.$emit('handleEditUserForm', requestObj)
        }else{
          this.$emit('handleUserForm', requestObj)
        }
        
      },
      
    },
    data(){
      return {
         id: this.currentData.id,
         firstName: this.currentData.firstName, 
         lastName: this.currentData.lastName,
         email: this.currentData.email,
         skills: this.currentData.skills,
         mobileNo: this.currentData.mobileNo,
         avtaar: this.currentData.avtaar,
         selected: this.currentData.team !== undefined ? this.currentData.team : null ,
         options: [
            { value: null, text: 'Please select an option' },
            { value: 'a', text: 'This is First option' },
            { value: 'b', text: 'Selected Option' },
            { value: 'c', text: 'This is an option with object value' },
         ]
      }
    },
    validations: {
      firstName: {
        required
      }
     
    }
}
</script>

<style scoped>

</style>