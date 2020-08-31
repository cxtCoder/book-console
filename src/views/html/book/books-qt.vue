<template>
    <book-page :classify="classify"></book-page>
</template>

<script>
    import bookPage from '../component/book/bookPage.vue'

    export default {
        name: 'book-qt',
        components: {
            'book-page': bookPage
        },
        data () {
            return {
                classify: '其他类'
            }
        }
    }
</script>

<style>

</style>