<template>
    <div class="page-secondnav page-commonnav">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script type="es6">
    export default {
        name: 'list',
        data () {
            return {
                secfoldable: true,
            }
        },
        mounted () {

        },
        methods: {
            handleSecfoldable (val) {
                this.secfoldable = val;
            }
        }
    }


</script>
