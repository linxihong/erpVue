<template>
    <div id="app" class="wrap">
        <mainSkeleton v-if="!init"></mainSkeleton>
        <template v-else>
            <router-view></router-view>
        </template>
    </div>
</template>

<script>
    import mainSkeleton from './skeleton.vue'
    export default {
        name: 'app',
        data() {
            return {
                resolution: 'high',
                init: false,
                isRouterAlive:true,
            }
        },
        components: {
            mainSkeleton
        },
        mounted() {
            setTimeout(() => {
                this.init = true
            }, 250);
            this.jungleResolution();
            window.screenWidth = document.body.clientWidth;
            window.fullHeight = document.body.clientHeight;
            this.$store.state.screenWid = window.screenWidth;
            this.$store.state.screenHei = window.fullHeight;
            window.onresize = () => {
                window.screenWidth = document.body.clientWidth;
                window.fullHeight = document.body.clientHeight;
                this.$store.state.screenWid = window.screenWidth;
                this.$store.state.screenHei = window.fullHeight;
            };
        },
        methods: {
            jungleResolution() {
                let WrapWidth = document.querySelector('.wrap').offsetWidth;
                if (WrapWidth <= 1500 && WrapWidth > 1300) {
                    this.resolution = 'low';
                } else if (WrapWidth <= 1920 && WrapWidth > 1500) {
                    this.resolution = 'high';
                } else if (WrapWidth <= 1300) {
                    this.resolution = 'tiny';
                }
                sessionStorage.setItem('resolution', this.resolution);
                this.$store.state.resolution = this.resolution;
            }
        }
    }

</script>

<style lang="less">
    @import './assets/basis.less';
    @import './assets/template.less';
    @import "./assets/_common.less";
    @import "./assets/css/master";

    #app {
        height: 100%;
    }
</style>
