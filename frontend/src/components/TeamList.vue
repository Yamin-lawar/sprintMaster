<template>
  <div class="wrapper" id="wrapper">
    <div class="page-wrapper">
        <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="teamLoader"></b-spinner>

          <div class="page-header">
            <div class="page-title align-left">
              <div class="title">Team</div>
              <div class="description align-left">Lorem ipsum dolor sit amet consectetur.</div>
            </div>
            
            <div class="align-right add-button">
              <input class="button" type="button" v-on:click="openAddTeam('open')" value="Add Team">
            </div>
          </div>

         <modal name="hello-world" height="auto" width="80%" :maxWidth="480" :scrollable="true" :adaptive="true" class="vue-modal team">
            <AddTeam v-on:closeAddTeam="openAddTeam('close')" v-on:handleEditTeamForm="editTeamForm"  v-on:handleTeamForm="saveTeam" :currentData="currentData" />
         </modal>
         <vue-good-table
            :columns="columns"
            :rows="rows"
            :search-options="{
                enabled: true,
                placeholder: 'Search'
            }"
            :pagination-options="{
                enabled: true,
                mode: 'records',
                perPage: 10,
            }"
         >
         <template slot="table-row" slot-scope="props">
          <span v-if="props.column.field == 'option'" class="option">
            <a><b-icon icon="pencil-square" v-on:click="editTeamPoup(props.formattedRow)"></b-icon></a> 
            <a><b-icon icon="trash-fill" v-on:click="deleteTeamAction(props.formattedRow['_id'])"></b-icon></a>
          </span>
          
        </template>
      </vue-good-table>
    </div>
  </div>    
</template>

<script>
import AddTeam from './AddTeam'
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'

export default {
    name: "TeamList",
    computed: {...mapGetters(["teams","teamLoader","creationFlag"]),
      trackAddFlag () {
        return this.$store.getters.creationFlag
      },
      trackListFlag () {
       return this.$store.getters.teams
      }
    },
    watch:{
      creationFlag(newValue, oldValue) {
        if(newValue == true && newValue !== oldValue){
             this.$modal.hide('hello-world'); 
             this.resetCreationFlag();

        }
      },
      teams(newValue, oldValue){
            this.rows = JSON.parse(JSON.stringify(newValue))
      }
    },
    components:{
      AddTeam
    },
    data(){
      const allTeamData = JSON.parse(JSON.stringify(this.$store.getters.teams))  
      const columnData = [
        {
          label: 'Name',
          field: 'name',
          width: '200px'
        },
        {
          label: 'Skills',
          field: 'skills',
          width: '400px'
        },
        {
          label: 'Created On',
          field: 'createdAt',
          width: '200px',
          formatFn: this.formatDateFn
        },
        {
          label: 'Option',
          field: 'option',
          width: '150px'
        }
        ,{
          label: 'id',
          field: '_id',
          hidden: true
        }
      ]
      if(Object.keys(allTeamData).length > 0){
        return {
            currentData: {},
            columns: columnData,
            rows: this.$store.getters.teams
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
    ...mapActions(['addTeam', 'resetCreationFlag', 'getTeam', 'editTeam','deleteTeam']),
    openAddTeam(action){
      if(action == 'open'){
         this.currentData = {};
        this.$modal.show('hello-world');  
      }else{
        this.$modal.hide('hello-world'); 
      }
    },
    saveTeam(resObj){
      console.log(resObj,'resObj in add')
      this.addTeam(resObj);
    },
    editTeamForm(resObj){
      console.log(resObj,'resObj')
      this.editTeam(resObj);
    },
    editTeamPoup(teamObj){
      this.currentData = teamObj;
      this.$modal.show('hello-world', teamObj);    
      console.log(teamObj,'edit team')
    },
    deleteTeamAction(id){
      Vue.$confirm({
        title: 'Delete team?',
        message: 'If you delete the team data will be gone forever. Are you sure you want to proceed?',
        button: {
          yes: 'Delete',
          no: 'Cancel'
        },
        callback: confirm => {
           confirm ? this.deleteTeam(id) : ''
           
        }
      })  
      
    },
    formatDateFn(value){
      return new Date(value * 1).toLocaleDateString("en-CA")
    }
    
  },
  created() {
    this.getTeam();
  }
  
}
</script>

<style scoped>

</style>