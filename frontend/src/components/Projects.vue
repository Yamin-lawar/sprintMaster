<template>
    <div class="wrapper" id="wrapper">
          <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="projectLoader"></b-spinner>
         <div class="align-right"><input class="button" type="button" v-on:click="openAddProject('open')" value="Add Project"></div>
         <modal name="project-popup" height="auto" :scrollable="true">
            <AddProject v-on:closeAddProject="openAddProject('close')" v-on:handleEditProjectForm="editProjectForm"  v-on:handleProjectForm="saveProject" :currentData="currentData" :userData="this.$store.getters.allUsers" />
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
                perPage: 10,
            }"
         >
         <template slot="table-row" slot-scope="props">              
          <span v-if="props.column.field == 'option'">
            <span><b-icon icon="pencil-square" v-on:click="editProjectPopup(props.formattedRow)"></b-icon></span> 
            <span><b-icon icon="trash" v-on:click="deleteProjectAction(props.formattedRow['_id'])"></b-icon></span>
          </span>
        </template>
        
         </vue-good-table>
    </div>    
</template>

<script>
import AddProject from './AddProject'
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'

export default {
    name: "Projects",
    computed: {...mapGetters(["projects","projectLoader","creationProjectFlag","allUsers"]),
    trackAddFlag () {
       return this.$store.getters.creationProjectFlag
    },
    trackListFlag () {
       return this.$store.getters.projects
    }
    },
    watch:{
      trackAddFlag(newValue, oldValue) {
        if(newValue == true && newValue !== oldValue){
             this.$modal.hide('project-popup'); 
             this.resetProjectCreationFlag();

        }
      },
      projects(newValue, oldValue){
            this.rows = JSON.parse(JSON.stringify(newValue))
      }
    },
    components:{
      AddProject
    },
    data(){
      
      const allProjectData = JSON.parse(JSON.stringify(this.$store.getters.projects)) 
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
          label: 'SMJ',
          field: 'smj.firstName'
        },
        {
          label: 'Deputy SMJ',
          field: 'dsmj.firstName'
        },
        {
          label: 'PO',
          field: 'po.firstName'
        },
        {
          label: 'SPO',
          field: 'spo.firstName'
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
          field: '_id',
          hidden: true
        },
        {
          label: 'smjId',
          field: 'smj._id',
          hidden: true
        },
        {
          label: 'dsmjId',
          field: 'dsmj._id',
          hidden: true
        },
        {
          label: 'poId',
          field: 'po._id',
          hidden: true
        },
        {
          label: 'spoId',
          field: 'spo._id',
          hidden: true
        }
      ]
    if(Object.keys(allProjectData).length > 0){
        return {
            currentData: {},
            columns: columnData,
            rows: this.$store.getters.projects
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
    ...mapActions(['addProject', 'resetProjectCreationFlag', 'getProject', 'editProject','deleteProject','getUser']),
    openAddProject(action){
      if(action == 'open'){
         this.currentData = {};
        this.$modal.show('project-popup',{scrollable:true});  
      }else{
        this.$modal.hide('project-popup'); 
      }
    },
    saveProject(resObj){
      console.log(resObj,'resObj in add')
      this.addProject(resObj);
    },
    editProjectForm(resObj){
      console.log(resObj,'resObj')
      this.editProject(resObj);
    },
    editProjectPopup(projectObj){
      this.currentData = projectObj;
      console.log(projectObj,'projectObj');
      this.$modal.show('project-popup');    
      console.log(projectObj,'edit project')
    },
    deleteProjectAction(id){
      Vue.$confirm({
        title: 'Are you sure?',
        message: 'Are you sure you want to delete project?',
        button: {
          yes: 'Yes',
          no: 'Cancel'
        },
        callback: confirm => {
           confirm ? this.deleteProject(id) : ''
        }
      })  
    }
    
  },
  created() {
    this.getProject();
    const allUserData = JSON.parse(JSON.stringify(this.$store.getters.allUsers))
    if(Object.keys(allUserData).length == 0){
       this.getUser();
    }
   
  }
  
}
</script>

<style scoped>

</style>