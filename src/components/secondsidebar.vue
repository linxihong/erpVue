/**
* @date 2017/11/22
* @desc 二级导航
**/
<template>
    <div class="el-second-navbar">
        <div class="f-nav">
            <div class="f-nav-wrapper">
                <div class="f-nav-title">{{secondnav.name}}</div>
                <el-menu :default-active="secondnavstatus" :unique-opened="true" class="el-menu-vertical"
                         :click="handlesnavClick" @open="handlesnavOpen" @close="handlesnavClose" router>
                    <div v-for="(item,indexa) in secondnav.list" key="item">
                        <el-menu-item :index="item.route.name" :route="item.route" v-if="!item.children||item.children.length==0">
                            {{item.name}}
                        </el-menu-item>

                        <el-submenu :index="item.route.name" v-if="item.children&&item.children.length!=0">
                            <span slot="title">{{item.name}}</span>
                            <el-menu-item :index="subitem.route.name" v-for="(subitem,subindexa) in item.children"
                                          key="item" :route="subitem.route">
                                {{subitem.name}}
                            </el-menu-item>
                        </el-submenu>
                    </div>
                </el-menu>
            </div>
        </div>
        <div class="f-nav-collapse">
            <span class="icon-collapse-left" @click="handleFold(false)"><i class="fa fa-navicon"></i></span>
            <span class="icon-collapse-right" @click="handleFold(true)"><i class="fa fa-navicon"></i></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'secondsidebar',
        data () {
            return {
                foldstatus: this.foldable,
                secondnav: this.$store.state.navSecondChildren,
                activeroute: "/master/listview/block3"
            }
        },
        props: ['foldable', 'secnav'],
        watch: {
            'this.$store.state.navSecondChildren'(val){
                this.$emit("navSecondChildren", val);
            },
            foldstatus(val){
                this.$emit("on-secfoldable-change", val);
            },
            secondnav(val){
                //console.log('secondnav', val)
            },
        },
        mounted () {
            //console.log('mounted',this.$store.state.navSecondChildren)
        },
        methods: {
            handleFold (status) {
                this.foldstatus = status;
            },
            handlesnavOpen (key, keyPath) {
                ////console.log('handlesnavOpen', key, keyPath)
            },
            handlesnavClose (key, keyPath) {
                ////console.log('handlesnavClose', key, keyPath)
            },
            handlesnavClick (key, keyPath) {
                ////console.log('handlesnavClick')
            }
        }
    }
</script>
