<template>
  <div class="popup">
    <!-- header -->
    <div class="popup-header">
      <b-icon icon="card-checklist" class="rounded-circle header-icon"></b-icon>
      <span class="popup-title">{{formType}} Sprint</span>
      <span class="align-right close" v-on:click="closePopup">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"/></svg>
      </span>
    </div>

     <form @submit="saveSprint">
       <!-- body -->
      <div class="popup-body">
        <b-form-group label="Name" label-for="name">
            <input type="hidden" id="id" v-model="id" name="id" />
            <input type="text" id="name" v-model="name" name="name" placeholder="Enter name"  class="normalBox">
            <div class="error" v-if="$v.name.$dirty && !$v.name.required">Please enter name</div>
        </b-form-group> 
        <b-form-group label="Code" label-for="code">
          <input type="text" id="code" v-model="code" name="code" placeholder="Enter code"  class="normalBox">
          <div class="error" v-if="$v.code.$dirty && !$v.code.required">Please enter code</div>
        </b-form-group>
        <b-form-group label="Start Date" label-for="startDate">
          <date-picker id="startDate" v-model="startDate" valueType="format" format="YYYY-MM-DD" class="normalBox" placeholder="Select start date"></date-picker>
          <div class="error" v-if="$v.startDate.$dirty && !$v.startDate.required">Please enter start date</div>
        </b-form-group>
        <b-form-group label="End Date" label-for="endDate">
          <date-picker id="endDate" v-model="endDate" valueType="format" format="YYYY-MM-DD" class="normalBox" placeholder="Select end date"></date-picker>
          <div class="error" v-if="$v.endDate.$dirty && !$v.endDate.required">Please enter end date</div>
        </b-form-group>
         <b-form-group label="Hours" label-for="hours">
          <input type="text" id="hours" v-model="hours" name="hours" placeholder="Enter working hours"  class="normalBox">
          <div class="error" v-if="$v.hours.$dirty && (!$v.hours.required || !$v.hours.decimal)">Please enter sprint working hours in numeric</div>
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
import { required, decimal } from 'vuelidate/lib/validators'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
export default {
    name: "AddSprint",
    components: { DatePicker },
    props:['currentData'],
    methods:{
      closePopup(){
         this.$emit('closeAddSprint', 'close')
      },
      saveSprint(e){
        e.preventDefault();
        this.$v.$touch();
        if (this.$v.$invalid) {
            return;
        }
        const userData = JSON.parse(JSON.stringify(this.$store.getters.currentUser))
        let requestObj =  {name: this.name, code: this.code, startDate: this.startDate, endDate: this.endDate, sprintHours: parseFloat(this.hours), createdBy: userData._id};
        console.log(requestObj,'userData')
        if(this.id !== undefined){
          requestObj.sprintId = this.id
          delete requestObj.createdBy
          this.$emit('handleEditSprintForm', requestObj)
        }else{
          this.$emit('handleSprintForm', requestObj)
        }
        
        console.log(this.name, this.code, 'check the form content')
      },
      
    },
    data(){
      return {
        id: this.currentData._id,
        name: this.currentData.name,
        code: this.currentData.code,
        startDate: this.currentData.startDate,
        endDate: this.currentData.endDate,
        hours: this.currentData.hours,
        formType: !this.currentData._id ? "Add" : "Edit",
      }
    },
    validations: {
      name: {
        required
      },
      code: {
        required
      },
      startDate: {
        required
      },
      endDate: {
        required
      },
      hours: {
        required,
        decimal	
      }
     
    }
}
</script>

<style scoped>

</style>