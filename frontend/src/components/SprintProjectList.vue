<template>
<!-- Table starts-->
            <div class="table-responsive">
                <table class="table tableHover" style="overflow-x:auto;">
                        <!--Table head-->
                        <thead>
                        <tr>
                            <th scope="row" class="th-xs">#</th>
                            <th class="th-lg">Task description</th>
                            <th class="th-sm">Assignee</th>
                            <th class="th-xs">Team</th>
                            <th class="th-xs">Hours</th>
                            <th class="th-sm">Status</th>
                            <th class="th-md">Target Achievement</th>
                            <th class="th-xs">Action</th>
                        </tr>
                        </thead>
                        <!--Table head-->
                        <!--Table body-->
                        <tbody>
                        <tr v-for="taskData in projectData.task" :key="taskData._id">
                            <th scope="row">1</th>
                            <td>{{taskData.name}}</td>
                            <td class="assignee-select">
                                <!-- Select dropdown will have view-only class for user with view permission -->
                                <div class="custom-select-wrapper view-only"> 
                                     <b-avatar variant="info" class="selectedPerson" :src="taskData.user !== undefined && taskData.user !== null ? taskData.user.avtaar : ''" ></b-avatar>
                                    <div class="person">{{taskData.user !== undefined && taskData.user !== null? `${taskData.user.firstName} ${taskData.user.lastName}`: 'No user found'}}</div>
                                </div>
                            </td>
                            <td>Backend</td>
                            <td>{{taskData.hours}}</td>
                            <td class="status-select">
                                <!-- Select dropdown will have view-only class for user with view permission -->
                                <div class="custom-select-wrapper view-only">
                                <div class="red">{{taskData.status}}</div>
                            </div>
                            </td>
                            <td>{{taskData.completion}}%</td>
                            <td>
                                <div class="action">
                                    <img class="icon" src="../assets/chat.svg">
                                </div>
                            </td>
                        </tr>

                        

                        </tbody>
                        <!--Table body-->
            </table>
        </div>
        <!-- Table ends -->
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "SprintProjectList",
    computed: {
       
    },
    props:['projectData'],
    methods:{
       
    },
    created() {
    }
}
</script>