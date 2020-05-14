<template>
    <div class="wrapper">
          <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="teamLoader"></b-spinner>
         <div><input type="button" v-on:click="openAddTeam('open')" value="Add Team"></div>
         <modal name="hello-world" height="400">
            <AddTeam v-on:closeAddTeam="openAddTeam('close')" v-on:handleTeamForm="saveTeam" />
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
            <span>Edit {{props.formattedRow['id']}} </span> 
          </span>
          
        </template>
         </vue-good-table>
    </div>    
</template>

<script>
import AddTeam from './AddTeam'
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "TeamList",
    computed: {...mapGetters(["teams","teamLoader","creationFlag"]),
    trackAddFlag () {
       return this.$store.getters.creationFlag
    }
    },
    watch:{
      trackAddFlag(newValue, oldValue) {
        if(newValue == true && newValue !== oldValue){
             this.$modal.hide('hello-world'); 
             this.resetCreationFlag();

        }
        console.log(`My store value for 'doneTodosCount' changed to ${newValue}, new value ${oldValue} old value`);
      }
    },
    components:{
      AddTeam
    },
    data(){
    return {
      columns: [
        {
          label: 'Name',
          field: 'name',
          width: '200px'
        },
        {
          label: 'Skills',
          field: 'skill',
          width: '400px'
        },
        {
          label: 'Created On',
          field: 'createdAt',
          type: 'date',
          dateInputFormat: 'yyyy-mm-dd',
          dateOutputFormat: 'yyyy-mm-dd',
          width: '200px'
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
        { id:1, name:"Frontend", skill: 'React, Vue, Javascipt', createdAt: '2011-10-31',option:''},
        { id:2, name:"Backend", skill: 'PHP, Laravel, NodeJs NestJS', createdAt: '2011-10-31',option:''},
        { id:3, name:"Mobile", skill: 'Native IOS, Native Android, Flutter, React native', createdAt: '2011-10-30',option:''},
        { id:4, name:"HTML", skill: 'HTML, CSS, SCSS', createdAt: '2011-10-11',option:''},
        { id:5, name:"Design", skill: 'Photoshop, Indesign, Illustration', createdAt: '2011-10-21',option:''},
        { id:6, name:"BA", skill: 'Documentation, Requerment gathering, JIRA, Agile', createdAt: '2011-10-31',option:''},
      ],
    };
  },
  methods:{
    ...mapActions(['addTeam', 'resetCreationFlag', 'getTeam']),
    openAddTeam(action){
      if(action == 'open'){
        this.$modal.show('hello-world');  
      }else{
        this.$modal.hide('hello-world'); 
      }
    },
    saveTeam(resObj){
      this.addTeam(resObj);
     
    },
  },
  created() {
    this.getTeam();
  }
  
}
</script>

<style scoped>

</style>