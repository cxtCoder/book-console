<template>
    <book-page :classify="classify"></book-page>
</template>

<script>
    import bookPage from '../component/book/bookPage.vue'

    export default {
        name: 'book-wx',
        components: {
            'book-page': bookPage
        },
        data () {
            return {
                classify: '文学类'
            }
        }
    }
</script>

<style>

</style>