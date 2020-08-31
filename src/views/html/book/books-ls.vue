<template>
    <book-page :classify="classify"></book-page>
</template>

<script>
    import bookPage from '../component/book/bookPage.vue'

    export default {
        name: 'book-ls',
        components: {
            'book-page': bookPage
        },
        data () {
            return {
                classify: '历史类'
            }
        }
    }
</script>

<style>

</style>