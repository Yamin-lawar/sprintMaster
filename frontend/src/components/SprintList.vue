<template>
    <div class="wrapper">
          <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="sprintLoader"></b-spinner>
         <div><input type="button" v-on:click="openAddSprint('open')" value="Add Sprint"></div>
         <modal name="sprint-popup" height="auto" :scrollable="true">
            <AddSprint v-on:closeAddSprint="openAddSprint('close')" v-on:handleEditSprintForm="editSprintForm"  v-on:handleSprintForm="saveSprint" :currentData="currentData" />
         </modal>
         <vue-good-table
            :columns="columns"
            :rows="rows"
            :search-options="{
                enabled: true
            }"
            :pagination-options="{
                enabled: true,
                mode: 'records',
                perPage: 5,
            }"
         >
         <template slot="table-row" slot-scope="props">              
          <span v-if="props.column.field == 'option'">
            <span><b-icon icon="pencil-square" v-on:click="editSprintPopup(props.formattedRow)"></b-icon></span> 
            <span><b-icon icon="trash" v-on:click="deleteSprintAction(props.formattedRow['id'])"></b-icon></span>
          </span>
        </template>
        
         </vue-good-table>
    </div>    
</template>

<script>
import AddSprint from './AddSprint'
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "SprintList",
    computed: {...mapGetters(["sprints","sprintLoader","creationSprintFlag"]),
    trackAddFlag () {
       return this.$store.getters.creationSprintFlag
    }
    },
    watch:{
      trackAddFlag(newValue, oldValue) {
        if(newValue == true && newValue !== oldValue){
             this.$modal.hide('sprint-popup'); 
             this.resetSprintCreationFlag();

        }
      }
    },
    components:{
      AddSprint
    },
    data(){
    return {
      currentData: {},
      columns: [
        {
          label: 'Name',
          field: 'name'
        },
        {
          label: 'Code',
          field: 'code',
        },
        {
          label: 'Start Date',
          field: 'startDate',
          type: 'date',
          dateInputFormat: 'yyyy-mm-dd',
          dateOutputFormat: 'yyyy-mm-dd'
        },
        {
          label: 'End Date',
          field: 'endDate',
          type: 'date',
          dateInputFormat: 'yyyy-mm-dd',
          dateOutputFormat: 'yyyy-mm-dd',
        },
        {
          label: 'No of Hours',
          field: 'noOfHours'
        },
        {
          label: 'Status',
          field: 'status'
        },
        {
          label: 'Option',
          field: 'option',
          width: '150px'
        }
        ,{
          label: 'id',
          field: 'id',
          hidden: true
        }
      ],
      rows: [
        { id:1, name:"April-1", code:"SP-1-RT5", startDate:"2020-04-11", endDate: '2020-04-18',noOfHours: 40, status:'Schedule', option:''},
        { id:2, name:"April-2", code:"SP-1-RT5", startDate:"2020-04-11", endDate: '2020-04-18',noOfHours: 40, status:'Active', option:''},
        { id:3, name:"April-3", code:"SP-1-RT5", startDate:"2020-04-11", endDate: '2020-04-18',noOfHours: 40, status:'Completed', option:''},
        { id:4, name:"April-4", code:"SP-1-RT5", startDate:"2020-04-11", endDate: '2020-04-18',noOfHours: 40, status:'Completed',option:''},
        { id:5, name:"April-5", code:"SP-1-RT5", startDate:"2020-04-11", endDate: '2020-04-18',noOfHours: 40, status:'Completed',option:''},
        { id:6, name:"April-6", code:"SP-1-RT5", startDate:"2020-04-11", endDate: '2020-04-18',noOfHours: 40, status:'Completed',option:''}
      ],
    };
  },
  methods:{
    ...mapActions(['addSprint', 'resetSprintCreationFlag', 'getSprint', 'editSprint','deleteSprint']),
    openAddSprint(action){
      if(action == 'open'){
         this.currentData = {};
        this.$modal.show('sprint-popup',{scrollable:true});  
      }else{
        this.$modal.hide('sprint-popup'); 
      }
    },
    saveSprint(resObj){
      console.log(resObj,'resObj in add')
      this.addSprint(resObj);
    },
    editSprintForm(resObj){
      console.log(resObj,'resObj')
      this.editSprint(resObj);
    },
    editSprintPopup(sprintObj){
      this.currentData = sprintObj;
      console.log(sprintObj,'sprintObj');
      this.$modal.show('sprint-popup');    
      console.log(sprintObj,'edit sprint')
    },
    deleteSprintAction(id){
      this.deleteSprint(id)
      console.log(id,'ods')
    }
    
  },
  created() {
    this.getSprint();
  }
  
}
</script>

<style scoped>

</style>