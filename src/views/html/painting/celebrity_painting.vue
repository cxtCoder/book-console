<template>
    <painting-page :classify="classify"></painting-page>
</template>

<script>
    import paintingPage from '../component/painting/paintingPage.vue'

    export default {
        name: 'celebrity_painting',
        components: {
            'painting-page': paintingPage
        },
        data () {
            return {
                classify: '名人书画'
            }
        }
    }
</script>

<style>

</style>