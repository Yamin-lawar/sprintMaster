<template>
    <div class="wrapper" id="wrapper">
          <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="sprintLoader"></b-spinner>
         <div class="align-right"><input class="button" type="button" v-on:click="openAddSprint('open')" value="Add Sprint"></div>
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
    },
    trackListFlag () {
       return this.$store.getters.sprints
    }
    },
    watch:{
      trackAddFlag(newValue, oldValue) {
        if(newValue == true && newValue !== oldValue){
             this.$modal.hide('sprint-popup'); 
             this.resetSprintCreationFlag();

        }
      },
      sprints(newValue, oldValue){
            this.rows = JSON.parse(JSON.stringify(newValue))
      }
    },
    components:{
      AddSprint
    },
    data(){
    const allSprintData = JSON.parse(JSON.stringify(this.$store.getters.sprints)) 
    const columnData = [
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
          formatFn: this.formatDateFn
        },
        {
          label: 'End Date',
          field: 'endDate',
          formatFn: this.formatDateFn
        },
        {
          label: 'No of Hours',
          field: 'sprintHours'
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
    ]
    if(Object.keys(allSprintData).length > 0){
        return {
            currentData: {},
            columns: columnData,
            rows: this.$store.getters.sprints
        };
    }else{
        return {
          currentData: {},
          columns: columnData,
          rows: [],
        }
    }
    
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
    },
    formatDateFn(value){
      
      return new Date(value).toLocaleDateString("en-GB")
    }
    
  },
  created() {
    this.getSprint();
  }
  
}
</script>

<style scoped>

</style>