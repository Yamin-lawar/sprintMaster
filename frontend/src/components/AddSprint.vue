<template>
  <div>
     Add Sprint
     <form @submit="saveSprint">
        <b-form-group label-cols="4" label-cols-lg="2" label="Name" label-for="input-default">
            <input type="hidden" id="id" v-model="id" name="id" />
            <input type="text" id="name" v-model="name" name="name" placeholder="name"  class="normalBox">
            <div class="error" v-if="$v.name.$dirty && !$v.name.required">Please enter name</div>
        </b-form-group> 
        <b-form-group label-cols="4" label-cols-lg="2" label="Code" label-for="input-default">
          <input type="text" id="code" v-model="code" name="code" placeholder="code"  class="normalBox">
          <div class="error" v-if="$v.name.$dirty && !$v.name.required">Please enter code</div>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="Start Date" label-for="input-default">
          <input type="text" id="startDate" v-model="startDate" name="startDate" placeholder="Starting date"  class="normalBox">
          <div class="error" v-if="$v.startDate.$dirty && !$v.startDate.required">Please enter start date</div>
        </b-form-group>
        <b-form-group label-cols="4" label-cols-lg="2" label="End Date" label-for="input-default">
          <input type="text" id="endDate" v-model="endDate" name="endDate" placeholder="End date"  class="normalBox">
          <div class="error" v-if="$v.endDate.$dirty && !$v.endDate.required">Please enter end date</div>
        </b-form-group>
        <input type="submit" value="Save">
        <input type="button" value="Cancel" class="button" v-on:click="closePopup">
    </form>
  </div>          
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
    name: "AddSprint",
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
        let requestObj =  {name: this.name, code: this.code, startDate: this.startDate, endDate: this.endDate};
        if(this.id !== undefined){
          requestObj.id = this.id
          this.$emit('handleEditSprintForm', requestObj)
        }else{
          this.$emit('handleSprintForm', requestObj)
        }
        
        console.log(this.name, this.code, 'check the form content')
      },
      
    },
    data(){
      return {
        id: this.currentData.id,
        name: this.currentData.name,
        code: this.currentData.code,
        startDate: this.currentData.startDate,
        endDate: this.currentData.endDate
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
      }
     
    }
}
</script>

<style scoped>

</style>