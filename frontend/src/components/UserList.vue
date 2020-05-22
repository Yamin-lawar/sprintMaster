<template>
    <div class="wrapper">
          <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="userLoader"></b-spinner>
         <div><input type="button" v-on:click="openAddUser('open')" value="Add User"></div>
         <modal name="user-popup" height="auto" :scrollable="true">
            <AddUser v-on:closeAddUser="openAddUser('close')" v-on:handleEditUserForm="editUserForm"  v-on:handleUserForm="saveUser" :currentData="currentData" />
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
    }
    },
    watch:{
      trackAddFlag(newValue, oldValue) {
        if(newValue == true && newValue !== oldValue){
             this.$modal.hide('user-popup'); 
             this.resetUserCreationFlag();

        }
      }
    },
    components:{
      AddUser
    },
    data(){
    return {
      currentData: {},
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
          label: 'Team',
          field: 'team'
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
        { id:1, firstName:"Yamin", lastName:"Lawar", email:"yamin@o2h.com", skills: 'React, Vue, Javascipt, Node, PHP, Laravel, Nest, Mysql, Mongo',mobileNo: '+91 9725763162', avtaar:'', team: 'Frontend', option:''},
        { id:1, firstName:"Disha", lastName:"Thakkar", email:"disha@o2h.com", skills: 'React, Javascipt, Laravel',mobileNo: '+91 9725763162', avtaar:'https://placekitten.com/300/300', team: 'Frontend', option:''},
        { id:1, firstName:"Akshay", lastName:"Soni", email:"axay@o2h.com", skills: 'React, PHP, Javascipt, Node, Mysql, Firebase, React native, Python',mobileNo: '+91 9725763162', avtaar:'www.google.com', team: 'Frontend', option:''},
        { id:1, firstName:"Nitin", lastName:"Kachaadiya", email:"nitin@o2h.com", skills: 'IOS, React native, Nest',mobileNo: '+91 9725763162', avtaar:'www.google.com', team: 'Backend', option:''},
        { id:1, firstName:"Priyanka", lastName:"Patel", email:"priyanka@o2h.com", skills: 'React, PHP, Javascipt, Laravel, Mysql',mobileNo: '+91 9725763162', avtaar:'www.google.com', team: 'Frontend', option:''},
        { id:1, firstName:"Sadik", lastName:"Dhantrelia", email:"sadik@o2h.com", skills: 'HTML, CSS, Jquery',mobileNo: '+91 9725763162', avtaar:'www.google.com', team: 'HTML', option:''}
      ],
    };
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
  created() {
    this.getUser();
  }
  
}
</script>

<style scoped>

</style>