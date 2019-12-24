<!--
  -- @file 回车可选择的下拉table框
  -- @author linxl <linxianliang@live.com>
  -- @copyright 2018 ZL
  -- inputWidth - 选择框的宽度。形如:'250px'
  -- selectTHs - 下拉table的表头；如果不传递这个参数，select下拉框不是table而是列表
     数组的对象必须包含label以及prop两个属性，分别对应表格内容的显示名以及字段名。形如:
     [{label:'名称',prop:'name'},{label:'代码',prop:'code'}]
  -- selectTds - 下拉列表的内容
  -- selectLabel - 下拉选项的label
  -- selectValue - 下拉选项的value
  -- selectKey - 下拉选项的key
  -- @getList - 获取选项的方法
  -- @setObj- 传递所选对象
  -- @setVal - 传递输入框的值
  --
  -->
<template>
    <div class="el-input el-input--small" :style="{width: inputWidth}">
        <input
            :class="disabled ? 'not-click' : ''"
            :disabled="disabled"
            :placeholder="placeholder"
            zl-type="select"
            class="el-input__inner"
            v-model.trim="inputValueData"
            @keydown.enter="enterSearchList($el)"
            @keydown.shift.exact="enterShift"
            @keydown.down="selectDown"
            @keydown.up="selectUp"
            @focus="inputFocus($event,$el)"
        />
        <span class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-input__icon select-enter-icon"></i></span></span>
        <div class="el-select-dropdown el-popper select-list" :style="{position: 'fixed',left:inputX,top:inputY,bottom:_inputY}" :x-placement="isTopStart ? 'top-start' : 'bottom-start'" v-if="status.isShow">
            <div class="el-scrollbar">
                <div class="el-select-dropdown__wrap el-scrollbar__wrap _el-scrollbar__wrap">
                    <ul class="el-scrollbar__view el-select-dropdown__list">
                        <div class="select-th" v-if="selectTHs.length">
                            <span v-for="item in selectTHs">&nbsp;{{ item.label }}</span>
                        </div>
                        <li class="el-select-dropdown__item select-li"
                            v-for="(item,index) in selectTds"
                            :class="[hoverIndex === index ?'hover':'',selectIndex === index ? 'selected':'']"
                            @click="clickItem(index)">
                            <div class="select-td" v-for="v in selectTHs" v-if="selectTHs.length">
                                <span>&nbsp;{{ item[v.prop] }}&nbsp;</span>
                            </div>
                            <div class="select-td" v-if="!selectTHs.length">
                                <span>&nbsp;{{ item[selectLabel] }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="el-scrollbar__bar is-horizontal">
                    <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
                </div>
                <div class="el-scrollbar__bar is-vertical">
                    <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
                </div>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 35px;"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                inputX: 'inherit',
                _inputX: 'inherit',
                inputY: 'inherit',
                _inputY: 'inherit',
                isTopStart: false,
                inputItem: {},
                hoverIndex: 0,
                selectIndex: -1,
                enterCount: 0,
                status: {
                    isShow: false,
                },
                inputValueData: '',
                oldValue: '',
                isChoose: false,
                scrollLeft: 0
            }
        },
        props: {
            'version': {
                type: String,
                default: 'v2'
            },
            'inputValue': {
                type: String,
                default: ''
            },
            'inputWidth': {
                type: String,
                default: ''
            },
            'selectTHs': {
                type: Array,
                default: function() {
                    return []
                }
            },
            'selectTds': {
                type: Array,
                default: function() {
                    return []
                }
            },
            'selectLabel': {
                type: String
            },
            'selectValue': {
                type: String
            },
            'selectKey': {
                type: String
            },
            'placeholder': {
                type: String,
                default: ''
            },
            'disabled': {
                type: Boolean,
                default: false
            }
        },
        watch: {
            'status.isShow':function(newVal) {
                const inputs = document.getElementsByTagName('input');
                if(newVal) {
                    document.querySelector('body').addEventListener('click', this.initStatus);
                }else {
                    Array.from(inputs).forEach((v,i) => {
                        if(v.getAttribute('zl-type') === 'selected') {
                            v.setAttribute('zl-type','select');
                        }
                    });
                    document.querySelector('body').removeEventListener('click', this.initStatus);
                }
            },
            'inputValue':{
                handler: function(val,oldVal) {
                    this.inputValueData = val;
                },
                immediate: true
            },
            'inputValueData': {
                handler: function(val,oldVal) {
                    if(val) {
                        if(!this.isChoose) {
                            this.$emit('setVal',val)
                        }
                    }
                }
            },
           /* 'scrollLeft': {
                handler: function(val,oldVal) {
                    if(val > oldVal) {
                        this.inputX = this._inputX - val;
                        if(this.inputX < this._inputX) {
                            this.inputX = this._inputX;
                        }
                    }else {
                        this.inputX = this._inputX + val;
                    }
                }
            }*/
        },
        mounted() {
            //this.handleScroll();
        },
        methods: {
            handleScroll() {
                const $table = document.querySelector('.childtable').querySelector('.el-table__body-wrapper');
                $table.addEventListener('scroll',() => {
                    this.scrollLeft = $table.scrollLeft;
                })
            },
            initStatus() {
                this.status.isShow = false;
                this.enterCount = 0;
            },
            enterSearchList(el) {
                this.enterSearchListV2(el);
                return;
                // 保留旧方法
                this.status.isShow = true;
                if(this.inputValueData) {
                    this.$nextTick(() => {
                        this.selectTds.filter((item,index) => {
                            if(this.inputItem == item) {
                                this.selectIndex = index;
                            }
                        })
                    })
                }else {
                    this.selectIndex = -1;
                }
                if(!this.enterCount) {
                    //第一次回车
                    this.enterCount = 1;
                    this.$emit('getList',this.inputValueData);
                }else if(this.enterCount === 1) {
                    //第二次回车
                    this.inputValueData = this.selectTds[this.hoverIndex] ? this.selectTds[this.hoverIndex][this.selectLabel] : null;
                    this.inputItem = this.selectTds[this.hoverIndex] ? this.selectTds[this.hoverIndex] : {};
                    this.clickItem(this.hoverIndex);
                    if(this.inputValueData) {
                        el.getElementsByTagName('input')[0].setAttribute('zl-type','selected');
                    }
                }
            },
            enterSearchListV2(el) {
                this.status.isShow = true;
                if(this.inputValueData) {
                    this.$nextTick(() => {
                        this.selectTds.filter((item,index) => {
                            if(this.inputItem == item) {
                                this.selectIndex = index;
                            }
                        })
                    })
                }else {
                    this.selectIndex = -1;
                }

                if(this.oldValue !== this.inputValueData || !this.enterCount) {
                    this.oldValue = this.inputValueData;
                    //第一次回车
                    this.enterCount = 1;
                    this.$emit('getList',this.inputValueData);
                }else if(this.enterCount === 1) {
                    //第二次回车
                    this.inputValueData = this.selectTds[this.hoverIndex] ? this.selectTds[this.hoverIndex][this.selectLabel] : null;
                    this.inputItem = this.selectTds[this.hoverIndex] ? this.selectTds[this.hoverIndex] : {};
                    this.clickItem(this.hoverIndex);
                    if(this.inputValueData) {
                        el.getElementsByTagName('input')[0].setAttribute('zl-type','selected');
                    }
                    this.$nextTick(() => {
                        this.$emit('selected', this);
                    })

                }
            },
            inputFocus(event,el) {
                this.inputX = $(el).offset().left + 'px';
                this._inputX = $(el).offset().left + 'px';
                if((this.$store.state.screenHei - $(el).offset().top) < 280) {
                    this.inputY = 'inherit';
                    this._inputY = this.$store.state.screenHei - $(el).offset().top - 6 + 'px';
                    this.isTopStart = true;
                }else {
                    this.inputY = $(el).offset().top + 24 + 'px';
                    this._inputY = 'inherit';
                    this.isTopStart = false;
                }
                this.$emit('inputFocus', event);
            },
            enterShift() {
                this.initStatus();
            },
            clickItem(index) {
                //this.selectIndex = index;
                this.inputValueData = this.selectTds[index] ? this.selectTds[index][this.selectLabel] : null;
                this.inputItem = this.selectTds[index] ? this.selectTds[index] : {};
                this.initStatus();
                this.isChoose = true;
                this.$emit('setObj',this.inputItem);
                this.hoverIndex = 0;
            },
            selectDown() {
                if(this.status.isShow) {
                    if(this.hoverIndex < this.selectTds.length -1) {
                        this.hoverIndex += 1;
                    }else {
                        this.hoverIndex = this.selectTds.length - 1;
                    }
                }else {
                    this.$emit('goDown')
                }
            },
            selectUp() {
                if(this.status.isShow) {
                    if(this.hoverIndex > 0) {
                        this.hoverIndex -= 1;
                    }else {
                        this.hoverIndex = 0;
                    }
                }else {
                    this.$emit('goUp')
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .select-th {
        display: inline-flex;
        text-align: center;
        font-weight: bold;
        height: 34px;
        line-height: 34px;
        width: 100%;
        padding: 0 20px;
        color: black;
        span {
            flex: 3;
            min-width: 50px;
            &:first-child {
                flex: 1;
            }
        }
    }
    .select-td {
        display: inline-flex;
        text-align: center;
        flex: 3;
        min-width: 50px;
        color: #000;
        &:first-child {
            flex: 2;
            color: gray;
        }
    }
    .select-li {
        width: 100%;
        .select-td {
            float: left;
        }
        &:hover {
            background: #CFE8DC !important;
            .select-td {
                color: #fff;
                &:first-child {
                    float: left;
                    color: #fff;
                }
            }
        }
    }
    .hover {
        .select-td {
            color: #fff;
            &:first-child {
                color: #fff;
            }
        }
    }
    .select-enter-icon {
        cursor: default;
        position: absolute;
        top: 8px;
        right: 0;
        width: 16px;
        height: 100%;
        background: url('../assets/images/enter.png') no-repeat;
    }
    .not-click {
        cursor: not-allowed;
    }
    ._el-scrollbar__wrap {
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
