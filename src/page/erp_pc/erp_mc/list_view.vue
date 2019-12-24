<template>
    <div class="page-secondnav page-commonnav" :class="{'f-nav__close':secfoldable==false}">
        <transition name="fade" mode="out-in">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
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
        methods: {
            handleSecfoldable (val) {
                this.secfoldable = val;
            }
        }
    }
</script>
