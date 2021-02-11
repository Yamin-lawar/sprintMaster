<template>
  <div class="wrapper" id="wrapper">
    <div class="page-wrapper">
        <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="userLoader"></b-spinner>

          <div class="page-header">
            <div class="page-title align-left">
              <div class="title">Users</div>
              <div class="description align-left">Lorem ipsum dolor sit amet consectetur.</div>
            </div>
            
            <div class="align-right add-button">
              <input class="button" type="button" v-on:click="openAddUser('open')" value="Add User">
            </div>
          </div>

         <modal name="user-popup" height="auto" width="80%" :maxWidth="600" :adaptive="true" class="vue-modal" :scrollable="true">
            <AddUser v-on:closeAddUser="openAddUser('close')" v-on:handleEditUserForm="editUserForm"  v-on:handleUserForm="saveUser" :currentData="currentData" :teamData="this.$store.getters.teams" />
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
                mode: 'pages',
                perPage: 10,
            }"
         >
         
         <template slot="table-row" slot-scope="props">              
          <span v-if="props.column.field == 'option'">
            <span><b-icon icon="pencil-square" v-on:click="editUserPoup(props.formattedRow)"></b-icon></span> 
            <span><b-icon icon="trash-fill" v-on:click="deleteUserAction(props.formattedRow['_id'])"></b-icon></span>
          </span>
          <span v-else-if="props.column.field == 'avtaar'">
            <span>
                <b-avatar variant="info" :src="props.formattedRow['avtaar']" ></b-avatar>
            </span> 
          </span>  
        </template>
        
      </vue-good-table>
    </div>
  </div>    
</template>

<script>
import AddUser from './AddUser'
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue'

export default {
    name: "UserList",
    computed: {...mapGetters(["allUsers","userLoader","creationUserFlag","teams"]),
    
    trackAddFlag () {
       return this.$store.getters.creationUserFlag
    },
    trackListFlag () {
       return this.$store.getters.allUsers
    }
    },
    watch:{
      creationUserFlag(newValue, oldValue) {
        console.log(newValue,'newValue',oldValue)
        if(newValue == true && newValue !== oldValue){
             this.$modal.hide('user-popup'); 
             this.resetUserCreationFlag();

        }
      },
      allUsers(newValue, oldValue){
            this.rows = JSON.parse(JSON.stringify(newValue))
      }
    },
    components:{
      AddUser
    },
    data(){
    const allUserData = JSON.parse(JSON.stringify(this.$store.getters.allUsers))
    const columnData = [
          {
            label: 'FirstName',
            field: 'firstName'
          },
          {
            label: 'LastName',
            field: 'lastName',
          },
          {
            label: 'Email',
            field: 'email'
          },
          {
            label: 'Skills',
            field: 'skills'
          },
          {
            label: 'Mobile No',
            field: 'mobileNo'
          },
          {
            label: 'Team',
            field: 'team.name'
          },
          {
            label: 'Avtaar',
            field: 'avtaar'
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
            label: 'teamId',
            field: 'team._id',
            hidden: true
          }
        ]
    if(Object.keys(allUserData).length > 0){
        return {
            currentData: {},
            columns: columnData,
            rows: this.$store.getters.allUsers
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
    ...mapActions(['addUser', 'resetUserCreationFlag', 'getUser', 'editUser','deleteUser','getTeam']),
    openAddUser(action){
      if(action == 'open'){
         this.currentData = {};
        this.$modal.show('user-popup',{scrollable:true});  
      }else{
        this.$modal.hide('user-popup'); 
      }
    },
    saveUser(resObj){
      this.addUser(resObj)
    },
    editUserForm(resObj){
      this.editUser(resObj);
    },
    editUserPoup(userObj){
      this.currentData = userObj;
      this.$modal.show('user-popup');    
    },
    deleteUserAction(id){
      Vue.$confirm({
        title: 'Are you sure?',
        message: 'Are you sure you want to delete user?',
        button: {
          yes: 'Yes',
          no: 'Cancel'
        },
        callback: confirm => {
           confirm ? this.deleteUser(id) : ''
           
        }
      })
      
    }
    
  },
  mounted() {
    this.getUser();
    this.getTeam();
  }
  
}
</script>

<style scoped>

</style>