<template>
    <div>
       <div style="text-align: center;font-size: 40px;">404</div>
    </div>
</template>

<script type="es6">
    export default {
        name: 'NotFoundComponent',
        data () {
            return {

            }
        },
        props: [''],
        watch: {
            '$route':'init'
        },
        mounted () {

        },
        methods: {
            init(){

            },
        }
    }
</script>
