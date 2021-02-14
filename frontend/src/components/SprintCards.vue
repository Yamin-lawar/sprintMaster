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
                                        <span class="highlight-text">out of 5</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="score-card">
                                    <div class="allocation-container">
                                        <div class="title">Allocation</div>
                                        <div class="team">
                                            <div class="team-member"><img src="../assets/user1.jpeg"><span class="tooltip-text"><div class="name">Joey Tribbiani</div>joey@o2h.com</span></div>
                                            <div class="team-member"><img src="../assets/user5.png"><span class="tooltip-text"><div class="name">Rachel Green</div> rachel@o2h.com</span></div>
                                            <div class="team-member"><img src="../assets/user4.jpeg"><span class="tooltip-text"><div class="name">Monica Geller</div> monica@o2h.com</span></div>
                                            <div class="team-member"><img src="../assets/user2.jpeg"><span class="tooltip-text"><div class="name">Chandler Bing</div> chandler@o2h.com</span></div>
                                            <div class="team-member"><img src="../assets/user1.jpeg"><span class="tooltip-text"><div class="name">Joey Tribbiani</div>joey@o2h.com</span></div>
                                            <div class="team-member"><img src="../assets/user5.png"><span class="tooltip-text"><div class="name">Rachel Green</div> rachel@o2h.com</span></div>
                                            <div class="team-member"><img src="../assets/user4.jpeg"><span class="tooltip-text"><div class="name">Monica Geller</div> monica@o2h.com</span></div>
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
                                            {{projectData.completion}}% of targeted tasks completed
                                            <p>Days left: 1</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- cards container ends -->
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "sprintCards",
    computed: {
       
    },
    props:['projectData'],
    methods:{
       
    },
    created() {
    }
}
</script>