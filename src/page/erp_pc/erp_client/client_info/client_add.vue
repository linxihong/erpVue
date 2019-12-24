<template>
    <div class="common-wrap">
        <div class="common-left" :style="{width: (100 - otherVariable.contentWidth) + '%'}" v-show="!otherVariable.isSpread">
            <div class="not-allowed-wrap" @click="handleNotAllowed" v-if="isShowNotAllowed"></div>
            <!--按钮区域-->
            <div class="common-btn-wrap">
                <el-button class="btn-cyan add-btnII" @click="handleAdd" style="text-align: center">新增私人客户</el-button>
                <el-button v-if="isHasEnterprise" class="btn-cyan add-btnII" @click="openEnterprise">新增企业公司</el-button>
                <!--<el-button class="btn-cyan add-btnII" @click="openProxy">代理</el-button>-->
                <el-button @click="handleRefresh">刷新</el-button>
            </div>
            <!--搜索区域-->
            <CommonSearch
                :isShowStatus="isShowStatus"
                :propData="searchProp"
                :searchForm="searchForm"
                @getData="getSearchList"
            >
            </CommonSearch>
            <!--表格区域-->
            <CommonTable
                ref="commontable"
                :isShowStatus="isShowStatus"
                :propData="tableProp"
                :otherVariable="otherVariable"
                :tableData="tableData"
                @handleDetail="handleDetail"
            >
            </CommonTable>
            <!--分页区域-->
            <CommonPagination
                :pageObj="pageObj"
                @getData="getData"
            >
            </CommonPagination>
        </div>
        <div class="common-right" :style="{width: otherVariable.contentWidth + '%'}">
            <!--详情区域-->
            <CommonDetail
                marginTop="30px"
                :showicon="true"
                :isShowStatus="isShowStatus"
                :otherVariable="otherVariable"
                :propData="formProp"
                :detailForm="detailForm"
                @toggleSpread="toggleSpread"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
                @handleCancel="handleCancel"
                @handleSave="handleSave"
            >
                <template slot="head-form-title">
                    <div class="head-form-title">
                        <span>{{otherVariable.detailTitle}}</span>
                    </div>
                </template>
            </CommonDetail>
            <!--新增/编辑区域-->
            <transition name="popup">
                <CommonAdd
                    marginTop="30px"
                    v-show="isShowStatus.isPopUp"
                    :otherVariable="otherVariable"
                    :addForm="addOrEditForm"
                    @handleCancel="handleCancel"
                    @handleSave="handleSave"
                >
                    <template slot="head-form-title">
                        <div class="head-form-title">
                            <span>{{otherVariable.popupTitle}}</span>
                        </div>
                    </template>
                    <template slot="custom-add-form">
                        <el-form ref="addOrEditForm" :rules="mainRules" :model="addOrEditForm" :inline="otherVariable.isInlineForm" label-width="120px" class="inline-form-add">
                            <el-form-item label="代码" prop="fcode" >
                                <el-input v-model="addOrEditForm.fcode"></el-input>
                            </el-form-item>
                            <el-form-item label="名称" prop="fname">
                                <el-input v-model="addOrEditForm.fname"></el-input>
                            </el-form-item>
                            <el-form-item label="别名" prop="aliasname">
                                <el-input v-model="addOrEditForm.aliasname"></el-input>
                            </el-form-item>
                            <el-form-item label="联系人" prop="linkman">
                                <el-input v-model="addOrEditForm.linkman"></el-input>
                            </el-form-item>
                            <el-form-item label="业务员" prop="salename">
                                <el-input v-model="addOrEditForm.salename"></el-input>
                            </el-form-item>
                            <el-form-item label="跟单员" prop="followname">
                                <el-input v-model="addOrEditForm.followname"></el-input>
                            </el-form-item>
                            <el-form-item label="客户经理" prop="salesmanagename">
                                <el-input v-model="addOrEditForm.salesmanagename"></el-input>
                            </el-form-item>
                            <el-form-item label="负责人" prop="dutyname">
                                <el-input v-model="addOrEditForm.dutyname"></el-input>
                            </el-form-item>

                            <el-form-item label="企业性质" prop="clientnature">
                                <el-select v-model="addOrEditForm.clientnature" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in clientnatureList"
                                        :key="index"
                                        :label="item.dicttext"
                                        :value="item.dicttext">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="客户类型" prop="clienttype"  >
                                <el-select v-model="addOrEditForm.clienttype" style="width: 100%" @change="currentSel" >
                                    <el-option
                                        v-for="(item,index) in clientTypeList"
                                        :key="index"
                                        :label="item.dictText"
                                        :value="item.dictValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="区域" prop="areaname">
                                <el-select v-model="addOrEditForm.areaname" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in areanameList"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="品牌" prop="brandIdList">
                                <el-select multiple v-model="addOrEditForm.brandIdList" @change="setBrand" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in brandList"
                                        :key="index"
                                        :label="item.fname"
                                        :value="item.fid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="电话" prop="tel">
                                <el-input v-model="addOrEditForm.mobile"></el-input>
                            </el-form-item>
                            <el-form-item label="传真" prop="fax">
                                <el-input v-model="addOrEditForm.fax"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="addOrEditForm.email"></el-input>
                            </el-form-item>
                            <el-form-item label="网站" prop="url">
                                <el-input  v-model="addOrEditForm.url"></el-input>
                            </el-form-item>
                            <el-form-item label="国家" prop="countryname">
                                <el-input  v-model="addOrEditForm.countryname"></el-input>
                            </el-form-item>
                            <el-form-item label="所属行业" prop="">
                                <el-input v-model="addOrEditForm.industry"></el-input>
                            </el-form-item>
                            <el-form-item label="出口客户" prop="isexport">
                                <el-select v-model="addOrEditForm.isexport" style="width: 100%">
                                    <el-option
                                        v-for="(item,index) in options"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <!--</el-select>-->
                            <!--</el-form-item>-->
                            <el-form-item label="经销商" prop="parentid" v-if="isHasEnterprise">
                                <!--<el-select  v-model="addOrEditForm.parentid"  ref="changeR" :disabled="readonly">-->
                                <!--<el-option-->
                                <!--v-for="(item,index) in changeparent"-->
                                <!--:key="index"-->
                                <!--:label="item.aliasName"-->
                                <!--:value="item.fid"-->
                                <!--&gt;-->
                                <!--</el-option>-->
                                <!--</el-select>-->
                                <el-select
                                    clearable
                                    filterable
                                    remote
                                    :disabled="changeD"
                                    :remote-method="getChangeparentList"
                                    v-model.trim="addOrEditForm.parentid"
                                    style="width: 100%"
                                >
                                    <el-option
                                        v-for="(item,index) in changeparent"
                                        :key="index"
                                        :label="item.fcode"
                                        :value="item.fid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <br>
                            <el-form-item label="详细地址" prop="address" class="foramAddress">
                                <el-input  v-model="addOrEditForm.address" type="textarea" rows="2" style="width: 287%"  ></el-input>
                            </el-form-item>
                        </el-form>
                    </template>
                </CommonAdd>
            </transition>
            <!--企业列表-->
            <transition name="popup" v-if="isShowEnterprise">
                <div class="common-right-wrap right-wrap-add" >
                    <slot name="header">&nbsp;</slot>
                    <div class="common-right-content">
                        <div class="content-head" :style="{height:'120px'}">
                            <div class="head-form-title">
                                <span>企业列表</span>
                            </div>
                            <i class="icon-cancel" @click="closeEnterprise"></i>
                        </div>
                        <div class="content-detail">
                            <div class="content-read-form">
                                <span>根据工商注册信息查找公司</span>
                                <br>
                                <br>
                                <el-input
                                    class="long-search-input"
                                    placeholder="请输入内容"
                                    prefix-icon="el-icon-search"
                                    @keyup.enter.native="LoginInput"
                                    v-model="searchName"
                                >
                                </el-input>
                                <div :style="{height: $store.state.screenHei*0.60 + 'px'}" style="overflow:auto">
                                    <el-row v-for="(item,index) in searchList" :key="index" @click.native="jumpToAddClient(item)"  style="cursor: pointer">
                                        <el-col :span="3">
                                            <img src="../../../../assets/images/lou.png" alt="" style="width: 101px; margin-top: 15px;">
                                        </el-col>
                                        <el-col :span="8">
                                            <p>{{item.name}}</p>
                                            <p>法人代表人: {{item.operName}}</p>
                                            <p>成立时间: <span v-if="item.startDate">{{ item.startDate.substring(0,11) }}</span></p>
                                            <p>注册资本: {{item.registCapi}}</p>
                                            <p>地址:{{item.address}}</p>
                                        </el-col>
                                        <el-col :span="7">
                                            <span style=" display: block;padding: 11px 9px;width: 44px;border: 1px solid #00CC99;color: #00CC99; font-size: 12px;margin-top: 36px;">在业</span>
                                        </el-col>
                                    </el-row>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>

            <!--新增企业公司列表-->
            <transition name="popup" v-if="isShowEnterpriseList" >
                <div class="common-right-wrap right-wrap-add" >
                    <slot name="header">&nbsp;</slot>
                    <div class="common-right-content inline-form-add">
                        <div class="content-head" :style="{height:'120px'}">
                            <div class="head-form-title">
                                <span>新增企业</span>
                            </div>
                            <i class="icon-cancel" @click="closeEnterpriseList"></i>
                            <i class="icon-confirm" @click="saveEnterpriseList"></i>
                        </div>
                        <div class="content-detail">
                            <div class="content-read-form">
                                <el-form ref="SaveOrEditForm" :rules="mainRulesII" :model="enterpriseDetail" :inline="otherVariable.isInlineForm" label-width="120px" class="inline-form-add">
                                    <el-form-item label="代码" prop="fcode">
                                        <el-input v-model="enterpriseDetail.fcode"></el-input>
                                    </el-form-item>
                                    <el-form-item label="名称" prop="name" >
                                        <el-input v-model="enterpriseDetail.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="别名" prop="aliasname">
                                        <el-input v-model="enterpriseDetail.aliasname"></el-input>
                                    </el-form-item>

                                    <el-form-item label="企业性质" prop="clientnature" >
                                        <el-select v-model="enterpriseDetail.clientnature" style="width: 90%">
                                            <el-option
                                                v-for="(item,index) in clientnatureList"
                                                :key="index"
                                                :label="item.dicttext"
                                                :value="item.dicttext">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="客户类型" prop="clienttype"  >
                                        <el-select v-model="enterpriseDetail.clienttype" style="width: 90%" @change="_currentSel">
                                            <el-option
                                                v-for="(item,index) in clientTypeList"
                                                :key="index"
                                                :label="item.dictText"
                                                :value="item.dictValue">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="业务员" prop="salename">
                                        <el-input v-model="enterpriseDetail.salename"></el-input>
                                    </el-form-item>
                                    <el-form-item label="跟单员" prop="followname">
                                        <el-input v-model="enterpriseDetail.followname"></el-input>
                                    </el-form-item>
                                    <el-form-item label="客户经理" prop="salesmanagename">
                                        <el-input v-model="enterpriseDetail.salesmanagename"></el-input>
                                    </el-form-item>
                                    <el-form-item label="负责人" prop="dutyname">
                                        <el-input v-model="enterpriseDetail.dutyname"></el-input>
                                    </el-form-item>
                                    <el-form-item label="联系人" prop="linkman">
                                        <el-input v-model="enterpriseDetail.linkman"></el-input>
                                    </el-form-item>
                                    <el-form-item label="品牌" prop="brandIdList">
                                        <el-select multiple v-model="enterpriseDetail.brandIdList" @change="_setBrand" style="width: 100%">
                                            <el-option
                                                v-for="(item,index) in brandList"
                                                :key="index"
                                                :label="item.fname"
                                                :value="item.fid">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="所属行业" prop="industry">
                                        <el-input v-model="enterpriseDetail.industryObject.industrys"></el-input>
                                    </el-form-item>

                                    <el-form-item label="电话" prop="mobile">
                                        <el-input v-model="enterpriseDetail.contactInfoObject.phoneNumber"></el-input>
                                    </el-form-item>
                                    <el-form-item label="传真" prop="fax">
                                        <el-input v-model="enterpriseDetail.fax"></el-input>
                                    </el-form-item>

                                    <el-form-item label="邮箱" prop="email">
                                        <el-input v-model="enterpriseDetail.contactInfoObject.email"></el-input>
                                    </el-form-item>
                                    <el-form-item label="网站" prop="url">
                                        <el-input  v-model="enterpriseDetail.url" ></el-input>
                                    </el-form-item>
                                    <el-form-item label="国家" prop="countryname">
                                        <el-input  v-model="enterpriseDetail.countryname"></el-input>
                                    </el-form-item>
                                    <el-form-item label="区域" prop="areaname">
                                        <el-select v-model="enterpriseDetail.areaname">
                                            <el-option
                                                v-for="(item,index) in areanameList"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.label">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="经销商" prop="parentid">
                                        <el-select
                                            clearable
                                            filterable
                                            remote
                                            :disabled="changeNew"
                                            :remote-method="getChangeparentList"
                                            v-model.trim="enterpriseDetail.parentid"
                                            style="width: 100%"
                                        >
                                            <el-option
                                                v-for="(item,index) in changeparent"
                                                :key="index"
                                                :label="item.fcode"
                                                :value="item.fid">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <br>
                                    <el-form-item label="详细地址" prop="address"  >
                                        <el-input v-model="enterpriseDetail.address" style="width: 293%;" type="textarea" rows="2"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <el-dialog
                :close-on-click-modal="false"
                class="dialogDiv dialogDivII"
                :show-close="false"
                :top="dialog_top"
                :visible.sync="proxyClientVisible"
                @close="">
                <div class="slideContent">
                    <div class="leftDiv aloneDiv common-dialog-btn">
                        <el-button class="icon-close icon-dialogII" @click="closeProxy"></el-button>
                    </div>
                    <div class="slideTop" v-drag1>新增代理客户资料</div>
                    <div class="slideMid">
                        <div class="child-table-search">
                            <div class="child-table-form inline-form-add">
                                <el-form :model="searchProxyForm" :inline="true" label-width="100px" @submit.native.prevent @keyup.enter.native="searchProxyTable">
                                    <el-form-item label="经销商">
                                        <el-input v-model="searchProxyForm.clientCode2"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button @click="searchProxyTable">查询</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button class="btn-cyan add-btnIII" @click="openAllProxy">一键开通经销商代理</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div>
                            <el-table :data="proxyData" border :height="$store.state.screenHei*0.46">
                                <el-table-column prop="clientCode" label="客户代码"></el-table-column>
                                <el-table-column prop="clientName" label="客户名称"></el-table-column>
                                <el-table-column prop="" label="客户状态"></el-table-column>
                                <el-table-column prop="clientCode2" label="经销商"></el-table-column>
                                <el-table-column prop="" label="录入人名称"></el-table-column>
                                <el-table-column prop="" label="录入时间"></el-table-column>
                                <el-table-column prop="" label="代理状态"></el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template slot-scope="scope">
                                        <el-button
                                            :type="scope.row.status > 0 ? 'danger' : ''"
                                            @click="isConfirmProxy(scope.row,scope.$index)"
                                        >{{scope.row.status > 0 ? '取消代理' : '确认代理'}}</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </el-dialog>
            <!--获取公共数据-->
            <CommonData :valueObj="valueObj" ref="commondata"></CommonData>
        </div>
    </div>
</template>

<script>
    import CommonSearch from '$src/components/CommonSearch'
    import CommonTable from '$src/components/CommonTable'
    import CommonPagination from '$src/components/CommonPagination'
    import CommonDetailX from '$src/components/CommonDetailX'
    import CommonAdd from '$src/components/CommonAdd'
    import CommonData from '$src/components/CommonData'
    import SelectEnter from '$src/components/SelectEnter'
    import CommonDetail from '$src/components/CommonDetail'
    export default {
        components: {
            CommonSearch,
            CommonTable,
            CommonPagination,
            CommonDetailX,
            CommonAdd,
            CommonData,
            SelectEnter,
            CommonDetail,
        },
        props: {
            'isHasEnterprise': {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                operateType: 'add',
                readonly:true,
                radio:1,
                changeD:true,
                changeNew:true,
                chanageInput:true,
                isShowNotAllowed: false,
                areanameList:[
                    {value:1,label:'华南区'},
                    {value:2,label:'华北区'},
                    {value:3,label:'东北区'},
                    {value:4,label:'华中区'},
                    {value:5,label:'西南区'},
                    {value:6,label:'西北区'},
                ],
                options:[
                    {value:0,label:'否'},
                    {value:1,label:'是'},
                ],
                detail: {
                    countryname:'中国'
                },
                isShowStatus: {
                    isMore: false,
                    isRead: true,
                    isPopUp: false
                },
                otherVariable: {
                    isSpread: false,
                    contentWidth: 70,
                    detailTitle: '客户信息',
                    addTitle: '新增客户信息',
                    popupTitle: '',
                    isInlineForm: true,
                    isEdit: false,
                    isChildEdit: false,
                    isHeadComplex: true,
                    isFormComplex: true,
                    loading: false,
                    $isCustom: true,
                    isSaving: false
                },
                tempWidth: null,
                tableData: [],
                mainRules: {
                    fname: [
                        { required: true, message: '请输入客户名称', trigger: 'blur' }
                    ],
                    fcode: [
                        { required: true, message: '请输入客户代码', trigger: 'blur' }
                    ],
                    clientnature: [
                        { required: true, message: '请输入企业性质', trigger: 'blur' }
                    ],
                    clienttype: [
                        { required: true, message: '请选择客户类型', trigger: 'blur' }
                    ],
                    areaname:[
                        { required: true, message: '请选择区域', trigger: 'blur' }
                    ],
                    brandname:[
                        { required: true, message: '请选择品牌', trigger: 'blur' }
                    ],
                    address:[
                        { required: true, message: '请输入详细地址', trigger: 'blur' }
                    ],
                    parentid:[
                        { required:true , message: '请输入经销商', trigger: 'blur' }
                    ]
                },
                mainRulesII: {
                    fname: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    fcode: [
                        { required: true, message: '请输入客户代码', trigger: 'blur' }
                    ],
                    clientnature: [
                        { required: true, message: '请输入企业性质', trigger: 'blur' }
                    ],
                    clienttype: [
                        { required: true, message: '请选择客户类型', trigger: 'blur' }
                    ],
                    areaname:[
                        { required: true, message: '请选择区域', trigger: 'blur' }
                    ],
                    brandname:[
                        { required: true, message: '请选择品牌', trigger: 'blur' }
                    ],
                    address:[
                        { required: true, message: '请输入详细地址', trigger: 'blur' }
                    ],
                    parentid:[
                        { required:true , message: '请输入经销商', trigger: 'blur' }
                    ]
                },
                //搜索映射表
                searchProp: [
                    {
                        name:'客户名称',
                        prop:'fname',
                        type:'normal',
                        isMainSearch:true,
                        isMain:false,
                        placeholder:'请输入客户名称'
                    },
                    {
                        name:'客户代码',
                        prop:'fcode',
                        type:'normal',
                        isMainSearch:false,
                        isMain:false,

                    }
                ],
                //详情映射列表
                formProp: [
                    {name:'fid',prop:'fid',type:'normal',isMainSearch:false,isMain:true,placeholder:'请输入名称/类型'},
                    {name:'代码',prop:'fcode',type:'normal',isMainSearch:false,isMain:false},
                    {name:'名称',prop:'fname',type:'normal',isMainSearch:false,isMain:false},
                    {name:'别名',prop:'aliasname',type:'normal',isMainSearch:false,isMain:false},
                    {name:'企业性质',prop:'clientnature',type:'select',isMainSearch:false,isMain:false,selectList:[]},
                    {name:'客户类型',prop:'clienttypename',type:'select',isMainSearch:false,isMain:false,selectList:[]},
                    {name:'所属行业',prop:'industry',type:'normal',isMainSearch:false,isMain:false},
                    {name:'联系人',prop:'linkman',type:'normal',isMainSearch:false,isMain:false},
                    {name:'业务员',prop:'salename',type:'normal',isMainSearch:false,isMain:false},
                    {name:'客户经理',prop:'salesmanagename',type:'normal',isMainSearch:false,isMain:false},
                    {name:'负责人',prop:'dutyname',type:'normal',isMainSearch:false,isMain:false},
                    {name:'跟单员',prop:'followname',type:'normal',isMainSearch:false,isMain:false},
                    {name:'品牌',prop:'brandIdList',type:'selectMultiple',isMainSearch:false,isMain:false,selectList:[{label:'',value:''}]},
                    {name:'电话',prop:'mobile',type:'normal',isMainSearch:false,isMain:false},
                    {name:'传真',prop:'fax',type:'normal',isMainSearch:false,isMain:false},
                    {name:'邮箱',prop:'email',type:'normal',isMainSearch:false,isMain:false},
                    {name:'网站',prop:'url',type:'normal',isMainSearch:false,isMain:false},
                    {name:'国家',prop:'countryname',type:'normal',isMainSearch:false,isMain:false},
                    {name:'区域',prop:'areaname',type:'normal',isMainSearch:false,isMain:false},
                    {name:'详细地址',prop:'address',type:'textarea',isMainSearch:false,isMain:false},
                ],
                //表格映射列表
                tableProp: [
                    {
                        name:'fid',
                        prop:'fid',
                        type:'normal',
                        isMain:true
                    },

                    {
                        name:'状态',
                        prop:'clientStatusName',
                        type:'normal',
                        width: '80'
                    },
                    {
                        name1:'代码/',
                        prop1:'fcode',
                        name2:'名称',
                        prop2:'fname',
                        type:'mixin',
                        width: '130',
                        tooltip: true
                    },
                    {
                        name1:'企业性质/',
                        prop1:'clientNature',
                        name2:'客户类型',
                        prop2:'clientTypeName',
                        type:'mixin'
                    },
                    {
                        name1:'录入人员/',
                        prop1:'enterName',
                        name2:'录入时间',
                        prop2:'enterTime',
                        type:'mixin'
                    },

                ],
                searchForm: {},
                addOrEditForm: {
                    brandIdList: []
                },
                detailForm: {},
                copyForm: {},
                tempForm: {},
                submitRow: {},
                getIndex:0,
                searchList:[],
                detailId: null,
                docCode: null,
                isShowEnterpriseList:false,
                searchName:'',
                //企业客户信息
                enterpriseDetail: {},
                //商机类型
                pageObj: {
                    commonPage: 1,
                    commonSize: 10,
                    commonSizes: [10, 20, 30, 40, 50, 100],
                    commonTotal: 0
                },
                //代理客户
                proxyClientVisible: false,
                dialog_top: "80px",
                searchProxyForm: {},
                proxyData: [],
                //详情表格内容
                tabLeft: '100px',
                activeName: 'first',
                childDetailRow: {},
                focusTimes: 1,
                editIndex: 0,
                //订单明细数据
                tabDataI: [],
                copyDataI: [],
                getfcode:'',
                loadingI: false,
                //品牌列表
                brandList: [],
                //企业
                isShowEnterprise: false,
                //客户类型
                clientTypeList: [],
                //企业性质
                clientnatureList:[],
                //经销商
                changeparent:[],
                valueObj: {
                    //客户
                    clientName: null,
                    clientList: [],
                    clientTHs: [
                        {label:'代码',prop:'fcode'},
                        {label:'名称',prop:'fname'}
                    ],
                }
            }
        },
        mounted() {
            this.getData();
            this.getClientType();
            this.getClientnatureList();
            this.getBrandList();
            this.tempWidth = this.otherVariable.contentWidth;
            //客户新增客户
            if(!this.isHasEnterprise) {
                this.mainRules.fcode = [];
                this.mainRules.parentid = [];
            }
        },
        methods: {
            //获取主表数据
            getData(isFirst = true) {
                this.tableData = [];
                this.fetch(`/oms/BasedataController/getOrgClientCompany?pageNo=${this.pageObj.commonPage}&pageSize=${this.pageObj.commonSize}`,this.searchForm)
                    .then(result => {
                        if(result.data && result.data.list) {
                            this.tableData = result.data.list;
                            this.pageObj.commonTotal = result.data.total;
                            if(isFirst){
                                this.$nextTick(() => {
                                    this.$refs.commontable.renderRow(this.tableData[this.getIndex].fid);
                                })
                            }
                        }else {
                            this.pageObj.commonTotal = 0;
                        }
                    })
            },
            //点击主表行
            handleDetail(row) {
                this.getIndex = row.index;
                this.isShowStatus.isPopUp = false;
                this.isShowEnterpriseList = false;
                this.isShowEnterprise = false;
                this.searchList = [];
                this.searchName = "";
                this.otherVariable.isChildEdit = false;
                this.tabDataI = [];
                this.copyDataI = [];
                this.isShowStatus.isRead = true;
                this.detailForm = {
                    brandIdList: []
                };
                this.fetch(`crm/pc/Org/ClientCompany/getClientCompanyByPrimaryKey?clientPrimaryKey=${row.fid}`,{})
                    .then(result => {
                        if(result.status === 200) {
                            this.detailForm = result.data;
                            this.copyForm = this.$lodash.cloneDeep(result.data);
                            //企业性质
                            this.formProp[4].selectList = this.formatArray(this.clientnatureList,'dicttext','dictvalue',true);
                            //客户类型
                            this.formProp[5].selectList = this.formatArray(this.clientTypeList,'dictText','dictValue',true);
                            //品牌列表
                            this.formProp[12].selectList = this.formatArray(this.brandList,'fName','fCode',true);
                        }else {
                            this.$message({
                                message: '请求失败',
                                type: 'warning'
                            });
                            this.detailForm = {};
                            this.copyForm = {};
                        }
                    });
                this.detailId = row.fid;
                this.docCode = row.docCode;
            },
            //禁止点击表格提醒
            handleNotAllowed() {
                if(this.isShowStatus.isPopUp) {
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.isShowNotAllowed = false;
                        this.isShowEnterpriseList = false;
                        this.isShowEnterprise = false;
                        this.handleCancel(this.operateType,true);


                    }).catch(() => {
                        console.log('cnacel')
                    })
                }
                if(this.otherVariable.isChildEdit) {
                    this.$confirm('此操作将清空已填写的数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.isShowNotAllowed = false;
                        this.isShowStatus.isPopUp = false;
                        this.isShowEnterpriseList = false;
                        this.isShowEnterprise = false;
                        this.handleCancelChild();

                    }).catch(() => {
                        console.log('cnacel')
                    })
                }
            },
            handleCancelChild() {
                //this.getChildTable(this.detailId);
                this.scrollHeight = 0;
                this.otherVariable.isChildEdit = false;
                this.isAddDetail = false;

            },

            //获取品牌列表
            getBrandList() {
                this.brandList = [];
                this.fetch('/oms/mdm/branControl/selectBranByCltOrg', {})
                    .then(result => {
                        if(result.status === 200 && result.data && result.data.list) {
                            this.brandList = result.data.list;
                        }
                    })
            },
            setBrand(val) {
                /*let item;
                item = this.brandList.find(item => item.fName === val);
                if(JSON.stringify(item) !== {} && JSON.stringify(item)) {
                    this.addOrEditForm.brandIdList = [item.fId]
                }*/
            },
            _setBrand(val) {
                /*let item;
                item = this.brandList.find(item => item.fName === val);
                if(JSON.stringify(item) !== {} && JSON.stringify(item)) {
                    this.enterpriseDetail.brandIdList = [item.fId]
                }*/
            },

            //获取企业类型的值
            currentSel(val){
                let item;
                item = this.clientTypeList.find(item => item.dictValue === val);
                if(JSON.stringify(item) !== {}) {
                    this.addOrEditForm.clienttypename = item.dictText
                }
                if(val == 0 || val == 1) {
                    this.changeD = false;
                    this.readonly = false;
                    this.mainRules.parentid=[{required:true, message:'请输入经销商', trigger: 'blur'}];
                }else if(val == 2) {
                    this.changeD = true;
                    this.readonly = true;
                    this.mainRules.parentid = [];
                }
            },
            _currentSel(val){
                let item;
                item = this.clientTypeList.find(item => item.dictValue === val);
                if(JSON.stringify(item) !== {}) {
                    this.enterpriseDetail.clienttypename = item.dictText
                }
                if(val == 0 || val == 1) {
                    this.changeNew = false;
                    this.readonly = false;
                    this.mainRulesII.parentid=[{required:true, message:'请输入经销商', trigger: 'blur'}];
                }else if(val == 2) {
                    this.changeNew = true;
                    this.readonly = true;
                    this.mainRulesII.parentid = [];
                }
            },

            //企业列表
            openEnterprise(){
                this.isShowStatus.isPopUp = false;
                this.isShowEnterpriseList = false;
                this.isShowEnterprise = false;
                this.searchName= "";
                this.searchList = [];
                this.isShowEnterprise = true;
            },
            closeEnterprise() {
                this.isShowEnterprise = false;
            },
            closeEnterpriseList(){
                     this.isShowNotAllowed = false;
                    this.isShowEnterpriseList = false;
                    this.handleNotAllowed();

            },
            saveEnterpriseList(){
                this.detail.aliasname = this.enterpriseDetail.aliasname;//别名
                this.detail.salename=this.enterpriseDetail.salename;//业务员
                this.detail.salesmanagename=this.enterpriseDetail.salesmanagename;//客户经理
                this.detail.dutyname=this.enterpriseDetail.dutyname;//负责人
                this.detail.brandIdList=this.enterpriseDetail.brandIdList;//品牌
                this.detail.followname=this.enterpriseDetail.followname;//跟单员
                this.detail.linkman=this.enterpriseDetail.linkman;//联系人
                this.detail.fax=this.enterpriseDetail.fax;//邮箱
                this.detail.fcode = this.enterpriseDetail.fcode;
                this.detail.fname = this.enterpriseDetail.name;
                this.detail.clienttype = this.enterpriseDetail.clienttype;
                this.detail.clienttypename = this.enterpriseDetail.clienttypename;
                this.detail.areaname = this.enterpriseDetail.areaname;
                this.detail.clientnature = this.enterpriseDetail.clientnature;
                this.detail.industry = this.enterpriseDetail.industryObject.industrys;
                this.detail.areacode = this.enterpriseDetail.district;
                this.detail.mobile = this.enterpriseDetail.contactInfoObject.phoneNumber;
                this.detail.email = this.enterpriseDetail.contactInfoObject.email;
                this.detail.url = this.enterpriseDetail.url;

                console.log(this.detail.url);
                this.detail.address = this.enterpriseDetail.address;
                this.detail.operName = this.enterpriseDetail.operName;
                this.$refs.SaveOrEditForm.validate((valid)=>{
                    if(valid){
                        this.fetch('/crm/pc/Org/ClientCompany/insert',{clientCompany:this.detail,getApi:this.enterpriseDetail})
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    this.isShowEnterpriseList = false;
                                    this.isShowNotAllowed = false;
                                    this.isShowStatus.isPopUp = false;
                                    this.detail = {};
                                    this.enterpriseDetail = {};
                                    this.searchForm = {};
                                    this.getData();
                                }else {
                                    var message =(result.error).substring(((result.error).indexOf(":"))+1,(result.error).indexOf(","));
                                    this.$message({
                                        message: message,
                                        type: 'warning'
                                    });
                                }
                            })
                    }else{
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            //主表添加行
            handleAdd() {
                this.isShowNotAllowed = true;
                this.operateType = 'add';
                this.isShowStatus.isPopUp = true;
                this.otherVariable.popupTitle = '新增私人客户';
                this.otherVariable.isEdit = false;
                this.addOrEditForm = {
                    brandIdList: []
                };
                this.getAjax(`crm/pc/Org/ClientCompany/getAddClientCode`)
                    .then(result => {
                        if(this.$route.path =='/master/private_client_add'){
                            this.getfcode = result.data;
                            this.addOrEditForm.fcode = result.data;

                        }
                    });
                this.$set(this.addOrEditForm,'fcode',this.getfcode);
                this.$set(this.addOrEditForm,'isexport',0);
                this.$set(this.addOrEditForm,'clientnature',this.clientnatureList[1].dicttext);
                this.isShowEnterprise = false;
                this.isShowEnterpriseList = false;
                this.$refs.addOrEditForm.resetFields();

            },
            //主表编辑行
            handleEdit() {
                this.operateType = 'edit';
                this.otherVariable.popupTitle = this.otherVariable.detailTitle;
                this.otherVariable.isEdit = true;
                this.otherVariable.isChildEdit = true;
                this.isShowNotAllowed = true;
                this.addOrEditForm = this.detailForm;
                if(this.addOrEditForm.clienttypename === '经销商') {
                    this.mainRules.parentid = [];
                    this.mainRulesII.parentid = [];
                }
                if(this.detailForm.fid) {
                    this.isShowStatus.isPopUp = true;
                    this.$set(this.addOrEditForm,'cltcompanyname',this.detailForm.cltcompanyname);
                    this.$set(this.valueObj,'clientName',this.detailForm.cltcompanyname);
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            getSearchList(){
                this.pageObj.commonPage=1;
                this.pageObj.commonSize=10;
                this.getData();
            },
            //主表保存行
            handleSave(type) {
                this.$refs.addOrEditForm.validate((valid)=>{
                    if(valid){
                        let api;
                        this.otherVariable.isSaving = true;

                        if(type === 'add') {
                            api = '/crm/pc/Org/ClientCompany/insert';
                            this.fetch(api,{clientCompany:this.addOrEditForm})
                                .then(result=>{
                                    if(result.status ===200){
                                        this.$message({
                                            message: '新增成功',
                                            type: 'success'
                                        });
                                        this.isShowNotAllowed = false;
                                        this.isShowStatus.isPopUp = false;
                                        this.detailForm = {};
                                        this.addOrEditForm = {};
                                        this.searchForm = {};
                                        this.getData();
                                    }else{
                                        this.$message({
                                            message: result.error || '新增失败',
                                            type: 'error'
                                        });

                                    }
                                })
                                .then(() => {
                                    this.otherVariable.isSaving = false;
                                })
                        }else {
                            api = '/crm/pc/Org/ClientCompany/updateClientCompany';
                            this.fetch(api,this.addOrEditForm)
                                .then(result => {
                                    if(result.status === 200) {
                                        this.$message({
                                            message: '保存成功',
                                            type: 'success'
                                        });
                                        this.isShowNotAllowed = false;
                                        this.isShowStatus.isPopUp = false;
                                        this.detailForm = {};
                                        this.addOrEditForm = {};
                                        this.searchForm = {};
                                        this.getData();
                                    }else {
                                        this.$message({
                                            message: (result && result.error) || '保存失败',
                                            type: 'error'
                                        });
                                    }
                                })
                                .then(() => {
                                    this.otherVariable.isSaving = false;
                                })
                        }
                    }else{
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            handleRefresh() {
                this.searchForm = {};
                this.getData();
                this.otherVariable.isChildEdit = false;
            },
            //主表取消操作
            handleCancel(type) {
                this.isShowNotAllowed = false;
                this.isShowStatus.isPopUp = false;
                this.isShowEnterpriseList = false;
                this.isShowEnterprise = false;
                this.isShowStatus.isPopUp = false;
                if(type === 'add') {
                    this.addOrEditForm = {};
                }else {
                    this.detailForm = this.$lodash.cloneDeep(this.copyForm);
                    this.addOrEditForm = this.$lodash.cloneDeep(this.copyForm);
                }
            },
            //主表删除行
            handleDelete() {
                if(this.detailForm.fid) {
                    if(confirm('确定删除？') === true) {
                        this.getAjax(`/oms/sls/SalesOrderMaster/deleteOrder?orderId=${this.detailForm.fid}`)
                            .then(result => {
                                if(result.status === 200) {
                                    this.$message({
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    this.searchForm = {};
                                    this.detailForm = {};
                                    this.getData();
                                }else {
                                    this.$message({
                                        message: '删除失败',
                                        type: 'error'
                                    });
                                }
                            })
                    }
                }else {
                    this.$message({
                        message: '请选择其中一项',
                        type: 'warning'
                    });
                }
            },
            //打开新增代理客户的弹框
            openProxy() {
                this.proxyClientVisible = true;
            },
            searchProxyTable() {
                this.proxyData = [];
            },
            //一键开通经销商代理
            openAllProxy() {

            },
            //是否确认代理
            isConfirmProxy(row) {

            },
            closeProxy() {
                this.proxyClientVisible = false;
            },
            //搜索客户
            LoginInput(){
                this.getAjax('/crm/GetYJApiControl/selectYJClientMessage?name='+this.searchName)
                    .then(result => {
                        if(result.status===200) {
                            this.searchList = result.data;
                            console.log(this.searchList)
                        }else {
                            this.searchList = [];
                        }
                    })
            },
            jumpToAddClient(item){
                this.isShowStatus.isPopUp =true;
                this.enterpriseDetail = {};
                this.getAjax('/crm/GetYJApiControl/selectYJClientDetial?name='+item.name)
                    .then(result => {
                        if(result.status===200) {
                            this.enterpriseDetail = result.data;
                            if(!this.enterpriseDetail.contactInfoObject.webSiteList.length){
                                this.enterpriseDetail.url =="";
                            }else{
                                if(!this.enterpriseDetail.contactInfoObject.webSiteList[0].webUrl){
                                    this.enterpriseDetail.url[0].webUrl =="";
                                }else{
                                    this.enterpriseDetail.url = this.enterpriseDetail.contactInfoObject.webSiteList[0].webUrl;
                                }

                            }

                            this.isShowEnterprise = false;
                            this.isShowEnterpriseList = true;
                            this.isShowNotAllowed =true;
                        }
                        this.$set(this.enterpriseDetail,'clientnature',this.clientnatureList[1].dicttext);
                    })
            },
            //切换布局
            toggleSpread() {
                this.otherVariable.isSpread = !this.otherVariable.isSpread;
                if(this.otherVariable.isSpread) {
                    this.otherVariable.contentWidth = 100;
                }else {
                    this.otherVariable.contentWidth = this.tempWidth;
                }
            },
            //获取企业性质
            getClientnatureList() {
                this.clientnatureList = [];
                this.getAjax('/crm/Org/ClientCompany/getCompanyProperty?pageSize=10000')
                    .then(result => {
                        if(result.data) {
                            result.data.forEach(item => {
                                item.dictvalue = Number(item.dictvalue)
                            });
                            this.clientnatureList = result.data;
                        }else {
                            this.clientnatureList = [];
                        }
                    })
            },

            //获取经销商
            getChangeparentList(val) {
                this.changeparent = [];
                if(val) {
                    this.fetch('/oms/BasedataController/getDistributor?pageSize=10',{fcode:val})
                        .then(result=>{
                            if(result.data && result.data.list) {
                                this.changeparent = result.data.list
                            }else{
                                this.changeparent = [];
                            }
                        })
                }
            },

            //获取客户类型
            getClientType() {
                this.clientTypeList = [];
                this.getAjax(`/basedata/sys/DataDictionary/getDataDictionary?docCode=30103`)
                    .then(result => {
                        if(result.data) {
                            this.clientTypeList = result.data;
                        }else {
                            this.clientTypeList = [];
                        }
                    })
            },

            //客户
            getClient(val) {
                this.$refs.commondata.getClient(val);
            },
            setClient(item) {
                //客户
                this.$set(this.valueObj,'clientName',item.fname);
                this.$set(this.addOrEditForm,'cltcompanyname',item.fname);
                this.$set(this.addOrEditForm,'cltcompanycode',item.fcode);
            }
        }
    }
</script>

<style lang="less" scoped>
    .popup-enter-active, .popup-leave-active {
        transition: left 0.1s;
        left: 0;
    }
    .popup-enter, .popup-leave-to {
        left: 100%;
    }
</style>
