<template>
    <book-page :classify="classify"></book-page>
</template>

<script>
    import bookPage from '../component/book/bookPage.vue'

    export default {
        name: 'book-zs',
        components: {
            'book-page': bookPage
        },
        data () {
            return {
                classify: '志书类'
            }
        }
    }
</script>

<style>

</style>