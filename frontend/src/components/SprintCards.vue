<template>
<!-- cards container starts -->
                    <div class="cards-container">
                        <div class="row">
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="score-card">
                                    <div class="person-container">
                                        <div class="person-image">
                                            <img src="../assets/user1.jpeg">
                                        </div>
                                        <div class="person-name">{{`${projectData.po.firstName} ${projectData.po.lastName}`}}</div>
                                        <div class="person-position">Product Owner</div>
                                    </div>
                                    <div class="score-container">
                                        Sprint Score
                                        <div class="score">{{projectData.poRanking !== null ? projectData.poRanking : '-'}}</div>
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
                                        <div class="person-position">Guruji</div>
                                    </div>
                                    <div class="score-container">
                                        Sprint Score
                                        <div class="score">{{projectData.gurujiRanking !== null ? projectData.gurujiRanking : '-'}}</div>
                                        <span class="highlight-text">out of 10</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="score-card">
                                    <div class="allocation-container">
                                        <div class="title">Allocation</div>
                                        <div class="team" v-for="allocatedUserInProject in projectData.allocatedUsers" :key="allocatedUserInProject !== null ? allocatedUserInProject._id : null">
                                            <div class="team-member" v-if="allocatedUserInProject !== null">
                                                <b-avatar variant="info" :src="allocatedUserInProject.avtaar !== undefined ? allocatedUserInProject.avtaar : ''" ></b-avatar>
                                                <span class="tooltip-text"><div class="name">{{allocatedUserInProject.firstName}} {{allocatedUserInProject.lastName}}</div>{{allocatedUserInProject.email}}</span></div>
                                            </div>
                                        <div class="allocation-bar">
                                            <img src="../assets/allocation.png">
                                        </div>
                                        <div class="allocation-percentage">
                                            <span class="highlight-text">{{projectData.projectWiseAllocation.toFixed(1)}}%</span> of total resources
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="score-card">
                                    <div class="task-container">
                                        <div class="title">Task Completion</div>
                                        <div class="completion-bar">
                                            <div id="projectCompletionChart">
                                                <apexchart type="radialBar" height="120" :options="chartOptions" :series="series"></apexchart>
                                            </div>
    
                                        </div>
                                        <div class="completion-percentage">
                                            {{projectData.completion}}% of targeted tasks completed
                                            <p>Days left: {{daysLeft}}</p>
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- cards container ends -->
</template>
<script>
export default {
    name: "sprintCards",
    computed: {
       
    },
    props:['projectData','daysLeft'],
    methods:{
    },
    data(){
        return {
            series: [this.projectData.completion],
            chartOptions: {
                chart: {
                type: 'radialBar',
                },
                plotOptions: {
                radialBar: {
                    hollow: {
                        size: '50%',
                    }
                },
                },
                labels: [''],
            }
        }
    },
    created() {
    }
}
</script>