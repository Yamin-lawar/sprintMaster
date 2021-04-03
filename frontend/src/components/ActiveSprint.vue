<template>
    <div class="wrapper" id="wrapper">
        <div id="active-sprint">
            <div class="sprint-header clearfix">
                <div class="sprint-info">
                    <div class="page-title">Active Sprint</div>
                    <div class="current-sprint-week">{{dateOfSprint}}</div>
                </div>
                <div class="search-container align-right">
                    <input placeholder="Search" class="search"/>
                    <b-icon icon="search"></b-icon>
                </div>
            </div>
            <div class="accordion">
                <!-- project data start here -->
                <div v-for="projectData in activeSprint.projects" :key="projectData._id">
                    <input type="checkbox" name="accordion" v-bind:id="projectData._id" class="accordion-input">
                    <label v-bind:for="projectData._id" class="accordion-label">
                        <img src="../assets/Visibly.png">
                        <div class="project-info">
                            <span class="project-name">{{projectData.name}}</span>
                            <span class="project-code">{{projectData.code}} </span>
                        </div>
                        <div class="team">
                             <div class="team-member" v-if="projectData.smj !== undefined">
                                <b-avatar variant="info" :src="projectData.smj.avtaar !== undefined ? projectData.smj.avtaar : ''" ></b-avatar>
                                <span class="tooltip-text"><div class="name">{{projectData.smj.firstName}} {{projectData.smj.lastName}}</div>{{projectData.smj.email}}</span>
                            </div>
                            <div class="team-member" v-if="projectData.dsmj !== null">
                                <b-avatar variant="info" :src="projectData.dsmj.avtaar !== undefined ? projectData.dsmj.avtaar : ''" ></b-avatar>
                                <span class="tooltip-text"><div class="name">{{projectData.dsmj.firstName}} {{projectData.dsmj.lastName}}</div>{{projectData.dsmj.email}}</span>
                            </div>
                            <div class="team-member" v-if="projectData.po !== null">
                                <b-avatar variant="info" :src="projectData.po.avtaar !== undefined ? projectData.po.avtaar : ''" ></b-avatar>
                                <span class="tooltip-text"><div class="name">{{projectData.po.firstName}} {{projectData.po.lastName}}</div>{{projectData.po.email}}</span>
                            </div>
                            <div class="team-member" v-if="projectData.spo !== null">
                                <b-avatar variant="info" :src="projectData.spo.avtaar !== undefined ? projectData.spo.avtaar : ''" ></b-avatar>
                                 <span class="tooltip-text"><div class="name">{{projectData.spo.firstName}} {{projectData.spo.lastName}}</div>{{projectData.spo.email}}</span>
                            </div>
                        </div>
                        <div class="sprint-task-status approved">{{projectData.approvalStatus}}</div>
                    </label>

                    <div class="accordion-content">
                        <SprintCards :projectData="projectData" :daysLeft="daysLeft" />
                        <SprintProjectList :projectData="projectData" />
                    </div>  
                </div> 
                <!-- project data end here -->
                <!-- static project list for now for demo of editable fields -->
                <div>
                    <input type="checkbox" name="accordion" id="project2" class="accordion-input">
                    <label for="project2" class="accordion-label"> 
                        <img src="../assets/JA.png">
                        <div class="project-info">
                            <span class="project-name">Joint Analytics</span>
                            <span class="project-code">JA30-C11AS</span>
                        </div>
                        <div class="team">
                            <div><img src="../assets/user4.jpeg"></div>
                            <div><img src="../assets/user1.jpeg"></div>
                            <div><img src="../assets/user5.png"></div>
                        </div>
                        <div class="sprint-task-status pending">Pending</div>
                    </label>
                    <div class="accordion-content">
                    <div class="cards-container">
                            <div class="row">
                                <div class="col-md-3 col-sm-6 col-xs-12">
                                    <div class="score-card">
                                        <div class="person-container">
                                            <div class="person-image">
                                                <img src="../assets/user1.jpeg">
                                            </div>
                                            <div class="person-name">Prashant Shah</div>
                                            <div class="person-position">SPO</div>
                                        </div>
                                        <div class="score-container">
                                            Sprint Score
                                            <div class="score">4.5
                                                <!-- Permission block -->
                                                <img src="../assets/edit.svg">
                                                <!-- Permission block -->
                                            </div>
                                            <span class="highlight-text">out of 5</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 col-sm-6 col-xs-12">
                                    <div class="score-card">
                                        <div class="person-container">
                                            <div class="person-image">
                                                <img src="../assets/user1.jpeg">
                                            </div>
                                            <div class="person-name">Chris Heron</div>
                                            <div class="person-position">Product owner</div>
                                        </div>
                                        <div class="score-container">
                                            Sprint Score
                                            <div class="score">4.0
                                                <!-- Permission block -->
                                                <img src="../assets/edit.svg">
                                                <!-- Permission block -->
                                            </div>
                                            <span class="highlight-text">out of 5</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 col-sm-6 col-xs-12">
                                    <div class="score-card">
                                        <div class="allocation-container">
                                            <div class="title">Allocation</div>
                                            <div class="team">
                                                <div><img src="../assets/user1.jpeg"></div>
                                                <div><img src="../assets/user5.png"></div>
                                                <div><img src="../assets/user4.jpeg"></div>
                                                <div><img src="../assets/user2.jpeg"></div>
                                                <div><img src="../assets/user1.jpeg"></div>
                                                <div><img src="../assets/user5.png"></div>
                                                <div><img src="../assets/user4.jpeg"></div>
                                            </div>
                                            <div class="allocation-bar">
                                                <img src="../assets/allocation.png">
                                            </div>
                                            <div class="allocation-percentage">
                                                <span class="highlight-text">50%</span> of total resources
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 col-sm-6 col-xs-12">
                                    <div class="score-card">
                                        <div class="task-container">
                                            <div class="title">Task Completion</div>
                                            <div class="completion-bar">
                                                <img src="../assets/completion.png">
                                            </div>
                                            <div class="completion-percentage">
                                                85% of targeted tasks completed
                                                <p>Days left: 1</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Permission block -->
                        <div class="button-container">
                            <a class="button">
                                Edit
                                <img class="icon" src="../assets/edit1.svg">
                            </a>
                        </div>
                        <!-- Permission block -->
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
                            <tr>
                                <th scope="row">1</th>
                                <td><input type="text" name="task" value="Live bugs of campaign and feed"></td>
                                <td class="assignee-select">
                                    <div class="custom-select-wrapper">
                                    <img id="selectedPerson" style="width: 25px;" src="https://1sfj1635wrts49n9bz3kpi6y-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/no-image-found.png">
                                    <select class="personList" v-on:change="handleChange()">
                                        <option class="default person" data-imagesrc="https://1sfj1635wrts49n9bz3kpi6y-wpengine.netdna-ssl.com/wp-content/uploads/2019/07/no-image-found.png">Select</option>
                                        <option class="jaya person" data-imagesrc="https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1036&q=80">Jaya</option>
                                        <option class="payal person" data-imagesrc="https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">Payal</option>
                                        <option class="dimple person" data-imagesrc="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80">Dimple</option>
                                        <option class="yamin person" data-imagesrc="https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80">Yamin</option>
                                    </select>
                                    </div>
                                </td>
                                <td> </td>
                                <td><input type="text" name="task" value="40"></td>
                                <td class="status-select">
                                    <div class="custom-select-wrapper">
                                    <select id="statusList" class="color" v-on:change="handleBackground()">
                                        <option class="color">Select</option>
                                        <option class="pink color">New</option>
                                        <option class="blue color">In progress</option>
                                        <option class="red color">On hold</option>
                                        <option class="green color">Done</option>
                                    </select>
                                </div>
                                </td>
                                <td><input type="text" name="task" value="71"></td>
                                <td>
                                    <div class="action">
                                        <!-- <img class="icon" src="../assets/chat.svg"> -->
                                        <img class="icon" src="../assets/delete.svg">
                                    </div>
                                </td>
                            </tr>
                            
                            </tbody>
                            <!--Table body-->
                        </table>
                        </div>
                        <!-- Table ends -->
                        <!-- Permission block -->
                        <div class="button-container">
                            <a class="button">
                                Add
                                <img class="icon" src="../assets/add.svg">
                            </a>
                            <a class="button">
                                Save
                                <img class="icon" src="../assets/checked.svg">
                            </a>
                        </div>
                        <!-- Permission block -->
                    </div>
                </div>

                <div>
                    <input type="checkbox" name="accordion" id="project3" class="accordion-input">
                    <label for="project3" class="accordion-label">
                        <img src="../assets/ot.png">
                        <div class="project-info">
                            <span class="project-name">o2h Tech</span>
                            <span class="project-code">OT40-D8SD</span>
                        </div>
                        <div class="team">
                            <div><img src="../assets/user4.jpeg"></div>
                            <div><img src="../assets/user2.jpeg"></div>
                            <div><img src="../assets/user3.jpeg"></div>
                            <div><img src="../assets/user1.jpeg"></div>
                        </div>
                        <div class="sprint-task-status approved">Approved</div>
                    </label>
                    <div class="accordion-content">
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
                                <!-- <th class="th-xs">Action</th> -->
                            </tr>
                            </thead>
                            <!--Table head-->
                            <!--Table body-->
                            <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Live bugs of campaign and feed</td>
                                <td class="assignee-select">
                                    <!-- Select dropdown will have view-only class for user with view permission -->
                                    <div class="custom-select-wrapper view-only"> 
                                        <img class="selectedPerson" style="width: 30px;" src="https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1036&q=80">
                                        <div class="person">Jaya</div>
                                    </div>
                                </td>
                                <td>Backend</td>
                                <td>40</td>
                                <td class="status-select">
                                    <!-- Select dropdown will have view-only class for user with view permission -->
                                    <div class="custom-select-wrapper view-only">
                                    <div class="red">On hold</div>
                                </div>
                                </td>
                                <td>71%</td>
                                <!-- <td>
                                    <div class="action">
                                        <img class="icon" src="../assets/chat.svg">
                                    </div>
                                </td> -->
                            </tr>

                            <tr>
                                <th scope="row">2</th>
                                <td>Campaign bugs</td>
                                <td class="assignee-select">
                                    <div class="custom-select-wrapper view-only">
                                        <img class="selectedPerson" style="width: 30px;" src="https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
                                        <div class="person">Payal</div>
                                    </div>
                                </td>
                                <td>Design</td>
                                <td>16</td>
                                <td class="status-select">
                                    <div class="custom-select-wrapper view-only">
                                    <div class="green">Done</div>
                                </div>
                                </td>
                                <td>100%</td>
                                <!-- <td>
                                    <div class="action">
                                        <img class="icon" src="../assets/chat.svg">
                                    </div>
                                </td> -->
                            </tr>

                            <tr>
                                <th scope="row">3</th>
                                <td>Verify bugs </td>
                                <td class="assignee-select">
                                    <div class="custom-select-wrapper view-only">
                                        <img class="selectedPerson" style="width: 30px;" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80">
                                        <div class="person">Dimple</div>
                                    </div>
                                </td>
                                <td>QA</td>
                                <td>40</td>
                                <td class="status-select">
                                    <div class="custom-select-wrapper view-only">
                                    <div class="pink">New</div>
                                </div>
                                </td>
                                <td>25%</td>
                                <!-- <td>
                                    <div class="action">
                                        <img class="icon" src="../assets/chat.svg">
                                    </div>
                                </td> -->
                            </tr>

                            <tr>
                                <th scope="row">4</th>
                                <td>NPS intergration </td>
                                <td class="assignee-select">
                                    <div class="custom-select-wrapper view-only">
                                        <img class="selectedPerson" style="width: 30px;" src="https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80">
                                        <div class="person">Yamin</div>
                                    </div>
                                </td>
                                <td>Frontend</td>
                                <td>32</td>
                                <td class="status-select">
                                    <div class="custom-select-wrapper view-only">
                                    <div class="blue">In progress</div>
                                </div>
                                </td>
                                <td>88%</td>
                                <!-- <td>
                                    <div class="action">
                                        <img class="icon" src="../assets/chat.svg">
                                    </div>
                                </td> -->
                            </tr>

                            </tbody>
                            <!--Table body-->
                        </table>
                        </div>
                        <!-- Table ends -->
                    </div>
                </div>
            </div>
        </div>
    </div>   
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SprintCards from './SprintCards'
import moment from 'moment'
import SprintProjectList from './SprintProjectList'
export default {
    name: "ActiveSprint",
    computed: {
        ...mapGetters(["activeSprint"])
    },
    watch:{
      activeSprint(newValue, oldValue){
            this.dateOfSprint = `${moment(newValue.startDate).format('MMMM DD')} - ${moment(newValue.endDate).format('MMMM DD')}` 
      }
    },
    data(){
        return{
            daysLeft: Math.floor((Date.parse(new Date(this.$store.getters.activeSprint.endDate).toLocaleDateString("en-CA")) - Date.parse(new Date().toLocaleDateString("en-CA")) ) / 86400000),
            dateOfSprint: `${moment(this.$store.getters.activeSprint.startDate).format('MMMM DD')} - ${moment(this.$store.getters.activeSprint.endDate).format('MMMM DD')}` 
        }
    }, 
    components:{
      SprintCards,
      SprintProjectList
    },
    methods:{
        ...mapActions(['getActiveSprint']),
        handleChange () {
            let image = document.querySelector('.personList option:checked').getAttribute("data-imagesrc");
            document.querySelector('#selectedPerson').setAttribute('src', image); 
        },
        handleBackground () {
            let color = document.querySelector("#statusList option:checked").getAttribute('class');
            document.querySelector('#statusList').setAttribute('class', color); 
        }
    },
    created() {
        this.getActiveSprint();
    }
}
</script>