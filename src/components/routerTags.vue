/**
* @date 2017/11/25
* @desc 页签。
* 1.在erp_pc/admin.vue 放置<routerTags></routerTags>即可。
* 2.数据保存参考sidebar.vue 页面，handleSelect()方法中  this.$store.state.navtaglist.push(item);
* @param this.$store.state.navtaglist : 页签数组，用于保存点击的页签数据
**/
<template>
    <div ref="scrollCon"  @DOMMouseScroll="handlescroll" @mousewheel="handlescroll" class="m-routerTags">
        <div ref="scrollBody" class="m-routerTags-wrapper" :style="{left: tagBodyLeft + 'px'}">
		    <el-tag v-for="tag in $store.state.navtaglist" :key="tag.name" closable
			:type="tag.type" @close="handleClose(tag)" :class="{'active':$store.state.activenavItem.route.path == tag.route.path}"
            @mousedown.native="closeTag($event,tag)">
                <span class="tagText" @click="handleTagClick(tag)">
                    {{tag.name}}
                </span>
            </el-tag>
        </div>
    </div>
</template>

<script >
    export default {
        name: 'routerTags',
        data () {
            return {
                tagBodyLeft: 62,
            }
        },
        watch:{
            '$store.state.navtaglist'(val){
                if (this.$refs.scrollBody.offsetWidth>this.$refs.scrollCon.offsetWidth){
                    setTimeout(()=>{
                        this.tagBodyLeft = this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth;
                    },200)
                }
            }
        },
        mounted () {
            this.tagActived();
        },
        methods: {
            //页面刷新之后首次赋值
            //匹配页签
            tagActived() {
                let _status = false;
                this.$store.state.navtaglist.forEach(tag => {
                    if (tag.route.path==this.$store.state.activenavItem.route.path){
                        _status = true;
                    }
                });
                _status == true?'': this.$store.state.navtaglist.push(this.$store.state.activenavItem);
            },
            handleTagClick(tag){
                this.$router.push(tag.route);
                this.$store.state.activenavItem = tag;
                sessionStorage.setItem('activenavItem', JSON.stringify(tag));
            },
            handlescroll (e) {
                const type = e.type;
                let delta = 0;
                if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                    delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40;

                }
                let left = 0;
                if(delta > 0) {
                    left = Math.min(62, this.tagBodyLeft + delta);
                }else {
                    if (this.$refs.scrollCon.offsetWidth - 100 < this.$refs.scrollBody.offsetWidth) {
                        if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollCon.offsetWidth + 100)) {
                            left = this.tagBodyLeft;
                        } else {
                            left = Math.max(this.tagBodyLeft + delta, this.$refs.scrollCon.offsetWidth - this.$refs.scrollBody.offsetWidth );
                        }
                    } else {
                        this.tagBodyLeft = 0;
                    }
                }
                this.tagBodyLeft = left;
            },
            handleClose(tag) {
                 this.$store.state.order_Code = '';
                //页签长度为则不能关闭
                if(this.$store.state.navtaglist.length<2) {
                    return false;
                }else {
                    let
                        navtaglist = this.$store.state.navtaglist,
                        currentIndex = this.$store.state.navtaglist.indexOf(tag);
                    //关闭的页签为页签列表的最后一个时，打开倒数第二个页签；否则，打开下一个页签
                    if((navtaglist.length-1) === currentIndex) {
                        this.handleTagClick(navtaglist[currentIndex-1])
                    }else {
                        this.handleTagClick(navtaglist[currentIndex+1])
                    }
                    setTimeout(() => {
                        this.$store.state.navtaglist.splice(this.$store.state.navtaglist.indexOf(tag), 1);
                    })
                    // if(tag.route.path==this.$route.path){
                    //     return false;
                    // }
                    // this.$router.go(-1);
                    // this.$store.state.navtaglist.splice(this.$store.state.navtaglist.indexOf(tag), 1);
                    // setTimeout(() => {
                    //     if(_.filter(this.$store.state.navtaglist,{defaulturl:this.$route.name}).length) {
                    //         this.$store.state.activenavItem = _.filter(this.$store.state.navtaglist,{defaulturl:this.$route.name})[0];
                    //     }
                    // });
                    // let newIndex = this.$store.state.navtaglist.indexOf(tag)-1;
                    // if(newIndex === 1) {
                    //     this.$store.state.activenavItem = this.$store.state.navtaglist[newIndex];
                    // }
                }
            },
            closeTag(event,tag) {
                if(event.button === 1) {
                    this.handleClose(tag);
                }
            }
        }
    }
</script>

<style lang="less" scope type="text/less">

    .point.active{
        background: #2d8cf0;
    }

    .m-routerTags{
        height: 64px;
        overflow: hidden;
        width: 100%;
        /*background-color: #fff;*/
    }
    .m-routerTags-wrapper{
        position: absolute;
        left:0;
        top:0;
        overflow-x: auto;
        white-space: nowrap;
        /*background-color: #fff;*/
        /*padding: 10px 15px;*/
        box-sizing: border-box;
        .el-tag {
            background-color: #fafafa;
            display: inline-block;
            padding: 0 10px;
            height: 64px;
            line-height: 64px;
            font-size: 1.4rem;
            color: #bebebe;
            border-radius: 0px;
            box-sizing: border-box;
            border: 1px solid #e0e0e0;
            border-top:none;
            border-left:none;
            white-space: nowrap;
            cursor: pointer;
        }
        .el-tag.active{
            background: #fff;
            color: #1cc87e;
            border-bottom:#fff;
            padding: 0 10px;
        }
        .tagText{
            display: inline-block;
        }
        /*.el-tag .el-icon-close{

        }*/

        .el-tag + .el-tag{
            margin-left:0;
        }
    }
</style>
