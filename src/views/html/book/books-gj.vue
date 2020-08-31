<template>
    <book-page :classify="classify"></book-page>
</template>

<script>
    import bookPage from '../component/book/bookPage.vue'

    export default {
        name: 'book-gj',
        components: {
            'book-page': bookPage
        },
        data () {
            return {
                classify: '工具类'
            }
        }
    }
</script>

<style>

</style>