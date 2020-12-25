<template>
    <div class="wrapper" id="wrapper">
          <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="projectLoader"></b-spinner>
         <div class="align-right"><input class="button" type="button" v-on:click="openAddProject('open')" value="Add Project"></div>
         <modal name="project-popup" height="auto" :scrollable="true">
            <AddProject v-on:closeAddProject="openAddProject('close')" v-on:handleEditProjectForm="editProjectForm"  v-on:handleProjectForm="saveProject" :currentData="currentData" />
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
            <span><b-icon icon="pencil-square" v-on:click="editProjectPopup(props.formattedRow)"></b-icon></span> 
            <span><b-icon icon="trash" v-on:click="deleteProjectAction(props.formattedRow['id'])"></b-icon></span>
          </span>
        </template>
        
         </vue-good-table>
    </div>    
</template>

<script>
import AddProject from './AddProject'
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "Projects",
    computed: {...mapGetters(["projects","projectLoader","creationProjectFlag"]),
    trackAddFlag () {
       return this.$store.getters.creationProjectFlag
    }
    },
    watch:{
      trackAddFlag(newValue, oldValue) {
        if(newValue == true && newValue !== oldValue){
             this.$modal.hide('project-popup'); 
             this.resetProjectCreationFlag();

        }
      }
    },
    components:{
      AddProject
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
          label: 'SMJ',
          field: 'smj'
        },
        {
          label: 'Deputy SMJ',
          field: 'deputySMJ'
        },
        {
          label: 'PO',
          field: 'po'
        },
        {
          label: 'SPO',
          field: 'spo'
        },
        {
          label: 'Sub Projects',
          field: 'subProjects'
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
        { id:1, name:"Visibly", code:"VS-1-RT5", smj:"Disha", deputySMJ: 'Axay',po: 'Chris Heron', spo:'', subProjects: 3, status: 'Active', option:''},
        { id:1, name:"AICITC", code:"CI-1-RT5", smj:"Nitin", deputySMJ: 'Nikunj',po: 'Nilesh Dagia', spo:'Hemal', subProjects: 1,status: 'Active',option:''},
        { id:1, name:"Zephx", code:"ZX-1-RT5", smj:"Nitin", deputySMJ: 'Yamin',po: 'James sore', spo:'Sunil', subProjects: 2, status: 'Active',option:''},
        { id:1, name:"SMV", code:"SM-1-RT5", smj:"Yuvraj", deputySMJ: 'Himani',po: 'Archa', spo:'', subProjects: 1, status: 'Active',option:''},
        { id:1, name:"Warushka", code:"WX-1-RT5", smj:"Sadik", deputySMJ: 'Payal',po: 'Archa', spo:'', subProjects: 1, status: 'Active',option:''},
        { id:1, name:"O2h Tech", code:"O2-1-RT5", smj:"Nisarg", deputySMJ: 'Adarsh',po: 'Craig', spo:'Prashant', subProjects: 1,status: 'Active',option:''}
      ],
    };
  },
  methods:{
    ...mapActions(['addProject', 'resetProjectCreationFlag', 'getProject', 'editProject','deleteProject']),
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
      this.deleteProject(id)
      console.log(id,'ods')
    }
    
  },
  created() {
    this.getProject();
  }
  
}
</script>

<style scoped>

</style>