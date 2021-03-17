<template>
    <div class="header" id="header">
        <RouterLink :to="'/'" class="logo link"><span>SprintMaster</span></RouterLink>
        <div class="align-right">
            <div class="user-details">
                <div class="user-image">
                    <img src="../../assets/user4.jpeg" class="image">
                </div>
                <div class="user-info">
                    <div>Devanshi Shah</div>
                    <div class="user-mail">devanshi@o2h.com</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"Header"
}
</script>
<style scoped>

</style>