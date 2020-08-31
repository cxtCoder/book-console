<template>
    <relic-page :classify="classify"></relic-page>
</template>

<script>
    import relicPage from '../component/relic/relicPage.vue'

    export default {
        name: 'historical_relic',
        components: {
            'relic-page': relicPage
        },
        data () {
            return {
                classify: '文物古迹'
            }
        }
    }
</script>

<style>

</style>