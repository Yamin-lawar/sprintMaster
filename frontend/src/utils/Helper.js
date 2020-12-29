import Vue from 'vue'
export const notify = (errorMessage, title ,type) => {
    Vue.notify({
        group: 'sprint',
        title: title,
        text: errorMessage,
        type: type,
        ignoreDuplicates: true,
     })
}