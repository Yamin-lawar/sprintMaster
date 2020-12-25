<template>
    <div class="wrapper" >
          <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="userLoader"></b-spinner>
         <div><input type="button" v-on:click="openAddUser('open')" value="Add User"></div>
         <modal name="user-popup" height="auto" :scrollable="true">
            <AddUser v-on:closeAddUser="openAddUser('close')" v-on:handleEditUserForm="editUserForm"  v-on:handleUserForm="saveUser" :currentData="currentData" />
         </modal>
         <div>{{rows}}</div>
         <vue-good-table
            ref="table"
            :columns="columns"
            :rows="rows"
            mode="remote"
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
            <span><b-icon icon="pencil-square" v-on:click="editUserPoup(props.formattedRow)"></b-icon></span> 
            <span><b-icon icon="trash" v-on:click="deleteUserAction(props.formattedRow['id'])"></b-icon></span>
          </span>
          <span v-else-if="props.column.field == 'avtaar'">
            <span>
                <b-avatar variant="info" :src="props.formattedRow['avtaar']" ></b-avatar>
            </span> 
          </span>  
        </template>
        
         </vue-good-table>
    </div>    
</template>

<script>
import AddUser from './AddUser'
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "UserList",
    computed: {...mapGetters(["allUsers","userLoader","creationUserFlag"]),
    
    trackAddFlag () {
       return this.$store.getters.creationUserFlag
    },
    trackListFlag () {
       return this.$store.getters.allUsers
    }
    },
    watch:{
      trackAddFlag(newValue, oldValue) {
        if(newValue == true && newValue !== oldValue){
             this.$modal.hide('user-popup'); 
             this.resetUserCreationFlag();

        }
      },
      allUsers(newValue, oldValue){
          console.log(JSON.parse(JSON.stringify(newValue)),'JSON.parse(JSON.stringify(newValue))')
          this.rows = newValue
          //console.log(JSON.parse(JSON.stringify(newValue)),'newValue')
          //Vue.set(this.rows, rodws);
      }
    },
    components:{
      AddUser
    },
    data(){
    const allUserData = JSON.parse(JSON.stringify(this.$store.getters.allUsers))
    console.log(allUserData,'allUserData')
    if(Object.keys(allUserData).length > 0){
          return {
        currentData: {},
        mainRows: [],
        columns: [
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
          }
        ],
        rows: this.$store.getters.allUsers
      };
    }else{
      return {
        componentKey: 0,
        currentData: {},
        columns: [],
        rows: []
      }
    }
    
  },
  methods:{
    ...mapActions(['addUser', 'resetUserCreationFlag', 'getUser', 'editUser','deleteUser']),
    openAddUser(action){
      if(action == 'open'){
         this.currentData = {};
        this.$modal.show('user-popup',{scrollable:true});  
      }else{
        this.$modal.hide('user-popup'); 
      }
    },
    saveUser(resObj){
      console.log(resObj,'resObj in add')
      this.addUser(resObj);
    },
    editUserForm(resObj){
      console.log(resObj,'resObj')
      this.editUser(resObj);
    },
    editUserPoup(userObj){
      this.currentData = userObj;
      this.$modal.show('user-popup');    
      console.log(userObj,'edit user')
    },
    deleteUserAction(id){
      this.deleteUser(id)
      console.log(id,'ods')
    }
    
  },
  mounted() {
    this.getUser();
  }
  
}
</script>

<style scoped>

</style>