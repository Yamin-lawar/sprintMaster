<template>
  <div class="popup">
    <!-- header -->
    <div class="popup-header">
      <b-icon icon="person-fill" class="rounded-circle header-icon"></b-icon>
      <span class="popup-title">{{formType}} User</span>
      <span class="align-right close" v-on:click="closePopup">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/></svg>
      </span>
    </div>

     <form @submit="saveUser">
       <!-- body -->
      <div class="popup-body">
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="Name" label-for="firstName">
              <input type="hidden" id="id" v-model="id" name="id" />
              <input type="text" id="firstName" v-model="firstName" name="firstName" placeholder="First Name"  class="normalBox">
              <div class="error" v-if="$v.firstName.$dirty && !$v.firstName.required">Please enter first name</div>
            </b-form-group> 
          </div>
          <div class="col-md-6">
            <b-form-group label="Last Name" label-for="lastName">
              <input type="text" id="lastName" v-model="lastName" name="lastName" placeholder="Last Name"  class="normalBox">
              <div class="error" v-if="$v.lastName.$dirty && !$v.lastName.required">Please enter last name</div> 
            </b-form-group> 
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <b-form-group label="Email" label-for="email">
              <input type="text" id="email" v-model="email" name="email" placeholder="Email"  class="normalBox" :disabled="formType == 'Edit'">
              <div class="error" v-if="$v.email.$dirty && !$v.email.required || !$v.email.email">Please enter proper email</div>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="Mobile no" label-for="mobileNo">
              <input type="text" id="mobileNo" v-model="mobileNo" name="mobileNo" placeholder="Mobile No"  class="normalBox">
              <div class="error" v-if="$v.mobileNo.$dirty && !$v.mobileNo.required">Please enter mobile number</div>
            </b-form-group> 
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <b-form-group label="Skills" label-for="skills" description="Please add multiple skills with comma seprated">
              <textarea id="skills" v-model="skills" name="skills" placeholder="skills" class="normalBox"/>
            </b-form-group>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <b-form-group label="Avtaar" label-for="avatar">
              <b-form-file
                  v-model="avtaar"
                  :state="Boolean(avtaar)"
                  placeholder="Choose a file or drop it here..."
                  drop-placeholder="Drop file here..."
                  accept="image/jpeg, image/png, image/gif"
                  id="avatar"
              ></b-form-file>
              <div class="mt-3">Selected file: {{ avtaar ? avtaar.name : '' }}</div>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="Team" label-for="team">
              <b-form-select v-model="userTeam" :options="options" id="team"></b-form-select>
              <!--<div class="error" v-if="$v.team.$dirty && !$v.team.required">Please Select team</div> -->
            </b-form-group> 
          </div>
        </div>
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