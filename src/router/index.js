import Vue from 'vue'
import Router from 'vue-router'
//  一级页面
import admin from '../page/erp_pc/admin'
import login from '../page/erp_pc/login'

//  master  二级页面
import reports from '../page/erp_pc/reports.vue'
import iframe from '../page/erp_pc/iframe.vue'
import wfw_xitong from '../page/erp_pc/erp_sys'
import NotFoundComponent from '../page/NotFoundComponent.vue'

Vue.use(Router);

export const _routes = [

    {
        path: '/',
        //name: 'index',
        redirect: 'login'
        // component: index,
        // meta: {}
    },
    {
        path: '/login',
        name: 'login',
        component: login,
        meta: {}
    },
    {
        path: '/master',
        component: admin,
        children: [

            /* --------------------------------------------------------------- */
            /**
             * erp_product
             * @desc 产品管理
             */

            /* ------------------------------------------- */
            /**
             * @desc 产品管理 - 物料管理 - 物料类型
             */
            {
                path: 'material_type',
                name: 'product_material_type',
                component: resolve => require(['../page/erp_pc/erp_product/material_mana/material_type.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 物料管理 - 胶条类型
             */
            {
                path: 'strip_type',
                name: 'product_strip_type',
                component: resolve => require(['../page/erp_pc/erp_product/material_mana/strip_type.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 物料管理 - 胶条型号
             */
            {
                path: 'strip_model',
                name: 'product_strip_model',
                component: resolve => require(['../page/erp_pc/erp_product/material_mana/strip_model.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 产品管理 - 型号管理 - 录入型号
             */
            {
                path: 'model_input',
                name: 'product_model_input',
                component: resolve => require(['../page/erp_pc/erp_product/model_mana/model_input.vue'], resolve),
            },
            /**
             * @desc 库存管理--成品出库单
             */
            {
                path: 'export_list',
                name: 'product_export_list',
                component: resolve => require(['../page/erp_pc/erp_inventory/export_list.vue'], resolve),
            },
            /**
             * @desc 库存管理--产品库存查询
             */
            {
                path: 'product_inventory',
                name: 'product_inventory_search',
                component: resolve => require(['../page/erp_pc/erp_inventory/product_inventory.vue'], resolve),
            },
            /**
             * @desc 库存管理--订单库存查询
             */
            {
                path: 'order_inventory',
                name: 'order_inventory_search',
                component: resolve => require(['../page/erp_pc/erp_inventory/order_inventory.vue'], resolve),
            },
            /**
             * @desc 库存管理--客户库存查询
             */
            {
                path: 'client_inventory',
                name: 'client_inventory_search',
                component: resolve => require(['../page/erp_pc/erp_inventory/client_inventory.vue'], resolve),
            },
            /*
            *  @desc 库存管理--产品产库库存
            * */
            {
                path: 'order_waseHouse',
                name: 'order_waseHouse_search',
                component: resolve => require(['../page/erp_pc/erp_inventory/order_waseHouse.vue'], resolve),
            },
            /*
           *  @desc 库存管理--产品料框库存
           * */
            {
                path: 'order_waseHouseBox',
                name: 'order_waseHouseBox_search',
                component: resolve => require(['../page/erp_pc/erp_inventory/order_waseHouseBox.vue'], resolve),
            },
            /*
          *  @desc 库存管理--客户料框库存查询
          * */
            {
                path: 'client_waseHouse',
                name: 'client_waseHouse_search',
                component: resolve => require(['../page/erp_pc/erp_inventory/client_waseHouse.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 型号管理 - 上传型号附件
             */
            {
                path: 'model_attach',
                name: 'product_model_attach',
                component: resolve => require(['../page/erp_pc/erp_product/model_mana/model_attach.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 型号管理 - 型材系列
             */
            {
                path: 'profile_series',
                name: 'product_profile_series',
                component: resolve => require(['../page/erp_pc/erp_product/model_mana/profile_series.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 产品管理 - 属性管理 - 膜厚资料
             */
            {
                path: 'filmthickness_info',
                name: 'product_filmthickness_info',
                component: resolve => require(['../page/erp_pc/erp_product/attr_mana/filmthickness_info.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 属性管理 - 机台棒径
             */
            {
                path: 'cabinet_roddiameter',
                name: 'product_cabinet_roddiameter',
                component: resolve => require(['../page/erp_pc/erp_product/attr_mana/cabinet_roddiameter.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 属性管理 - 机台级别
             */
            {
                path: 'cabinet_level',
                name: 'product_cabinet_level',
                component: resolve => require(['../page/erp_pc/erp_product/attr_mana/cabinet_level.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 属性管理 - 材质资料
             */
            {
                path: 'texture_info',
                name: 'product_texture_info',
                component: resolve => require(['../page/erp_pc/erp_product/attr_mana/texture_info.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 属性管理 - 涂层信息
             */
            {
                path: 'coating_info',
                name: 'product_coating_info',
                component: resolve => require(['../page/erp_pc/erp_product/attr_mana/coating_info.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 产品管理 - 颜色管理 - 色号资料
             */
            {
                path: 'color_info',
                name: 'product_color_info',
                component: resolve => require(['../page/erp_pc/erp_product/color_mana/color_info.vue'], resolve),
            },
            //表面描述
            {
                path: 'surface',
                name: 'product_base_surface',
                component: resolve => require(['../page/erp_pc/erp_product/color_mana/surface.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 颜色管理 - 颜色分组
             */
            {
                path: 'color_group',
                name: 'product_color_group',
                component: resolve => require(['../page/erp_pc/erp_product/color_mana/color_group.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 颜色管理 - 颜色大类
             */
            {
                path: 'color_categories',
                name: 'product_color_categories',
                component: resolve => require(['../page/erp_pc/erp_product/color_mana/color_categories.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 产品管理 - 工艺管理 - 工艺路线组
             */
            {
                path: 'craft_linegroup',
                name: 'product_craft_linegroup',
                component: resolve => require(['../page/erp_pc/erp_product/craft_mana/craft_linegroup.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 工艺管理 - 工艺路线
             */
            {
                path: 'craft_line',
                name: 'product_craft_line',
                component: resolve => require(['../page/erp_pc/erp_product/craft_mana/craft_line.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 产品管理 - 技术标准 - 包装方式
             */
            {
                path: 'packing_way',
                name: 'product_packing_way',
                component: resolve => require(['../page/erp_pc/erp_product/tech_standards/packing_way.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 技术标准 - 贴膜要求
             */
            {
                path: 'padpasting_require',
                name: 'product_padpasting_require',
                component: resolve => require(['../page/erp_pc/erp_product/tech_standards/padpasting_require.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 技术标准 - 喷码要求
             */
            {
                path: 'spraycode_require',
                name: 'product_spraycode_require',
                component: resolve => require(['../page/erp_pc/erp_product/tech_standards/spraycode_require.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 技术标准 - 公差要求
             */
            {
                path: 'tolerance_require',
                name: 'product_tolerance_require',
                component: resolve => require(['../page/erp_pc/erp_product/tech_standards/tolerance_require.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 技术标准 - 质量要求
             */
            {
                path: 'quality_require',
                name: 'product_quality_require',
                component: resolve => require(['../page/erp_pc/erp_product/tech_standards/quality_require.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 技术标准 - 标签类型
             */
            {
                path: 'tag_type',
                name: 'product_tag_type',
                component: resolve => require(['../page/erp_pc/erp_product/tech_standards/tag_type.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 产品管理 - 报关管理 - 海关编码
             */
            {
                path: 'customs_code',
                name: 'product_customs_code',
                component: resolve => require(['../page/erp_pc/erp_product/customs_mana/customs_code.vue'], resolve),
            },
            /**
             * @desc 产品管理 - 报关管理 - 报关资料
             */
            {
                path: 'customs_info',
                name: 'product_customs_info',
                component: resolve => require(['../page/erp_pc/erp_product/customs_mana/customs_info.vue'], resolve),
            },
            /* ------------------------------------------- */
            /* --------------------------------------------------------------- */

            /* --------------------------------------------------------------- */
            /**
             * erp_base
             * @desc 基础数据
             */

            /* ------------------------------------------- */
            /**
             * @desc 基础数据 - 基础信息 - 提货方式
             */
            {
                path: 'pickup_way',
                name: 'base_pickup_way',
                component: resolve => require(['../page/erp_pc/erp_base/base_info/pickup_way.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 基础信息 - 装车方式
             */
            {
                path: 'truckload_way',
                name: 'base_truckload_way',
                component: resolve => require(['../page/erp_pc/erp_base/base_info/truckload_way.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 基础信息 - 计量单位
             */
            {
                path: 'measure_unit',
                name: 'base_measure_unit',
                component: resolve => require(['../page/erp_pc/erp_base/base_info/measure_unit.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 基础信息 - 国家信息
             */
            {
                path: 'country_info',
                name: 'base_country_info',
                component: resolve => require(['../page/erp_pc/erp_base/base_info/country_info.vue'], resolve),
            },

            /**
             * @desc 基础数据 - 基础信息 - 地区资料
             */
            {
                path: 'area_info',
                name: 'base_area_info',
                component: resolve => require(['../page/erp_pc/erp_base/base_info/area_info.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 基础信息 - 结算方式
             */
            {
                path: 'settlement_way',
                name: 'base_settlement_way',
                component: resolve => require(['../page/erp_pc/erp_base/base_info/settlement_way.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 基础数据 - 会计管理 - 会计组织
             */
            {
                path: 'accounting_orga',
                name: 'base_accounting_orga',
                component: resolve => require(['../page/erp_pc/erp_base/accounting_mana/accounting_orga.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 会计管理 - 会计类型
             */
            {
                path: 'accounting_type',
                name: 'base_accounting_type',
                component: resolve => require(['../page/erp_pc/erp_base/accounting_mana/accounting_type.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 会计管理 - 会计科目
             */
            {
                path: 'accounting_subject',
                name: 'base_accounting_subject',
                component: resolve => require(['../page/erp_pc/erp_base/accounting_mana/accounting_subject.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 基础数据 - 组织管理 - 公司信息
             */
            {
                path: 'company_info',
                name: 'base_company_info',
                component: resolve => require(['../page/erp_pc/erp_base/orga_mana/company_info.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 组织管理 - 仓库资料
             */
            {
                path: 'warehouse_info',
                name: 'base_warehouse_info',
                component: resolve => require(['../page/erp_pc/erp_base/orga_mana/warehouse_info.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 组织管理 - 销售分组
             */
            {
                path: 'sales_group',
                name: 'base_sales_group',
                component: resolve => require(['../page/erp_pc/erp_base/orga_mana/sales_group.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 组织管理 - 银行资料
             */
            {
                path: 'bank_info',
                name: 'base_bank_info',
                component: resolve => require(['../page/erp_pc/erp_base/orga_mana/bank_info.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 基础数据 - 人员管理 - 业务员资料
             */
            {
                path: 'salesman_info',
                name: 'base_salesman_info',
                component: resolve => require(['../page/erp_pc/erp_base/person_mana/salesman_info.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 人员管理 - 业务员授权
             */
            {
                path: 'salesman_auth',
                name: 'base_salesman_auth',
                component: resolve => require(['../page/erp_pc/erp_base/person_mana/salesman_auth.vue'], resolve),
            },
            /**
             * @desc 基础数据 - 人员管理 - 联系人资料
             */
            {
                path: 'linkman_info',
                name: 'base_linkman_info',
                component: resolve => require(['../page/erp_pc/erp_base/person_mana/linkman_info.vue'], resolve),
            },
            /* ------------------------------------------- */
            /* --------------------------------------------------------------- */

            /* --------------------------------------------------------------- */
            /**
             * erp_client
             * @desc 客户管理
             */

            /* ------------------------------------------- */
            /**
             * @desc 客户管理 - 商机管理 - 商机登记
             */
            {
                path: 'business_register',
                name: 'client_business_register',
                component: resolve => require(['../page/erp_pc/erp_client/business_mana/business_register.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 客户管理 - 客户信息 - 新增客户
             */
            {
                path: 'client_add',
                name: 'client_client_add',
                component: resolve => require(['../page/erp_pc/erp_client/client_info/client_add.vue'], resolve),
            },
            {
                path: 'private_client_add',
                name: 'private_client_add',
                component: resolve => require(['../page/erp_pc/erp_client/client_info/private_client_add.vue'], resolve),
            },
            /**
             * @desc 客户管理 - 客户信息 - 审核客户
             */
            {
                path: 'client_audit',
                name: 'client_client_audit',
                component: resolve => require(['../page/erp_pc/erp_client/client_info/client_audit.vue'], resolve),
            },
            /**
             * @desc 客户管理 - 客户信息 - 客户资信
             */
            {
                path: 'client_credit',
                name: 'client_client_credit',
                component: resolve => require(['../page/erp_pc/erp_client/client_info/client_credit.vue'], resolve),
            },
            /**
             * @desc 客户管理 - 客户信息 - 客户投诉
             */
            {
                path: 'client_complaint',
                name: 'client_client_complaint',
                component: resolve => require(['../page/erp_pc/erp_client/client_info/client_complaint.vue'], resolve),
            },
            /**
             * @desc 客户管理 - 客户信息 - 客户信用
             */
            {
                path: 'client_truthworthiness',
                name: 'client_client_truthworthiness',
                component: resolve => require(['../page/erp_pc/erp_client/client_info/client_truthworthiness.vue'], resolve),
            },
            /**
             * @desc 客户管理 - 客户信息 - 客户查询
             */
            {
                path: 'client_query',
                name: 'client_client_query',
                component: resolve => require(['../page/erp_pc/erp_client/client_info/client_query.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 客户管理 - 客户联系 - 客户拜访
             */
            {
                path: 'client_visit',
                name: 'client_client_visit',
                component: resolve => require(['../page/erp_pc/erp_client/client_link/client_visit.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 客户管理 - 客户数据 - 客户色号
             */
            {
                path: 'client_colornumber',
                name: 'client_client_colornumber',
                component: resolve => require(['../page/erp_pc/erp_client/client_data/client_colornumber.vue'], resolve),
            },
            /**
             * @desc 客户管理 - 客户数据 - 客户型号
             */
            {
                path: 'client_model',
                name: 'client_client_model',
                component: resolve => require(['../page/erp_pc/erp_client/client_data/client_model.vue'], resolve),
            },
            /**
             * @desc 客户管理 - 客户门户 - 客户门户账号
             */
            {
                path: 'client_account',
                name: 'client_gateway_account',
                component: resolve => require(['../page/erp_pc/erp_client/client_gateway/client_account.vue'], resolve),
            },
            /* ------------------------------------------- */
            /* --------------------------------------------------------------- */

            /* --------------------------------------------------------------- */
            /**
             * erp_price
             * @desc 价格管理
             */

            /* ------------------------------------------- */
            /**
             * @desc 合同管理 - 基础设置 - 合同附加条款
             */
            {
                path: 'contract_tack',
                name: 'price_contract_tack',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/contract_tack.vue'], resolve),
            },
            /**
             * @desc 合同管理 - 服务报价 - 新增报价
             */
            {
                path: 'quotedPrice_add',
                name: 'price_quotedPrice_add',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/quotedPrice_add.vue'], resolve),
            },
            /**
             * @desc 合同管理 - 服务报价- 审核报价
             */
            {
                path: 'quotedPrice_review',
                name: 'price_quotedPrice_review',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/quotedPrice_review.vue'], resolve),
            },
            /**
             * @desc 合同管理 - 服务合同 - 签批报价
             */
            {
                path: 'quotedPrice_sign',
                name: 'price_quotedPrice_sign',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/quotedPrice_sign.vue'], resolve),
            },
            /**
             * @desc 合同管理 - 服务合同 - 新建合同
             */
            {
                path: 'contract_add',
                name: 'price_contract_add',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/contract_add.vue'], resolve),
            },
            /**
             * @desc 合同管理 - 服务合同 - 审核合同
             */
            {
                path: 'contract_review',
                name: 'price_contract_review',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/contract_review.vue'], resolve),
            },
            /**
             * @desc 合同管理 - 服务合同 - 变更合同
             */
            {
                path: 'contract_change',
                name: 'price_contract_change',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/contract_change.vue'], resolve),
            },
            /**
             * @desc 合同管理 - 服务合同 - 审核变更合同
             */
            {
                path: 'changeContract_review',
                name: 'price_changeContract_review',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/changeContract_review.vue'], resolve),
            },
            /**
             * @desc 合同管理 - 查询管理 - 报价查询
             */
            {
                path: 'price_search',
                name: 'price_price_search',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/price_search.vue'], resolve),
            },
            /**
             * @desc 合同管理 - 查询管理 - 合同查询
             */
            {
                path: 'contract_search',
                name: 'price_contract_search',
                component: resolve => require(['../page/erp_pc/erp_price/contract_mana/contract_search.vue'], resolve),
            },

            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 价格管理 - 价目管理 - 价目表
             */
            {
                path: 'price_list',
                name: 'price_price_list',
                component: resolve => require(['../page/erp_pc/erp_price/price_mana/price_list.vue'], resolve),
            },
            /**
             * @desc 价格管理 - 价目管理 - 铝锭价目
             */
            {
                path: 'price_alu',
                name: 'price_price_alu',
                component: resolve => require(['../page/erp_pc/erp_price/price_mana/price_alu.vue'], resolve),
            },
            /**
             * @desc 价格管理 - 价目管理 - 胶条价目
             */
            {
                path: 'price_pvc',
                name: 'price_price_pvc',
                component: resolve => require(['../page/erp_pc/erp_price/price_mana/price_pvc.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 价格管理 - 策略管理 - 价格区域
             */
            {
                path: 'price_area',
                name: 'price_price_area',
                component: resolve => require(['../page/erp_pc/erp_price/strategy_mana/price_area.vue'], resolve),
            },
            /**
             * @desc 价格管理 - 策略管理 - 颜色组区域差价
             */
            {
                path: 'colorgroup_price_differ',
                name: 'price_colorgroup_price_differ',
                component: resolve => require(['../page/erp_pc/erp_price/strategy_mana/colorgroup_price_differ.vue'], resolve),
            },
            /**
             * @desc 价格管理 - 策略管理 - 型号组区域差价
             */
            {
                path: 'matcodegroup_price_differ',
                name: 'price_matcodegroup_price_differ',
                component: resolve => require(['../page/erp_pc/erp_price/strategy_mana/matcodegroup_price_differ.vue'], resolve),
            },
            /**
             * @desc 价格管理 - 策略管理 - 销售组-价格区域
             */
            {
                path: 'sale_price_area',
                name: 'price_sale_price_area',
                component: resolve => require(['../page/erp_pc/erp_price/strategy_mana/sale_price_area.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 价格管理 - 价格分组 - 颜色价格组
             */
            {
                path: 'color_pricegroup',
                name: 'color_price_group',
                component: resolve => require(['../page/erp_pc/erp_price/price_group/color_price_group.vue'], resolve),
            },
            /**
             * @desc 价格管理 - 价格分组 - 型号价格组
             */
            {
                path: 'matcode_pricegroup',
                name: 'matcode_price_group',
                component: resolve => require(['../page/erp_pc/erp_price/price_group/matcode_price_group.vue'], resolve),
            },
            /* ------------------------------------------- */
            /* --------------------------------------------------------------- */

            /* --------------------------------------------------------------- */
            /**
             * erp_sale
             * @desc 销售管理
             */

            /* ------------------------------------------- */
            /**
             * @desc 销售管理 - 工程项目 - 新建工程
             */
            {
                path: 'engineering_add',
                name: 'sale_engineering_add',
                component: resolve => require(['../page/erp_pc/erp_sale/engineering_project/engineering_add.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 工程项目 - 审核工程
             */
            {
                path: 'engineering_audit',
                name: 'sale_engineering_audit',
                component: resolve => require(['../page/erp_pc/erp_sale/engineering_project/engineering_audit.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 销售管理 - 订单管理 - 新建订单
             */
            {
                path: 'order_add',
                name: 'sale_order_add',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/order_add.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 订单管理 - 审核单价
             */
            {
                path: 'order_audit',
                name: 'sale_order_audit',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/order_audit.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 订单管理 - 签批网单
             */
            {
                path: 'order_import',
                name: 'sale_order_import',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/order_import.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 订单管理 - 受理网单
             */
            {
                path: 'order_accept',
                name: 'sale_order_accept',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/order_accept.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 订单管理 - 变更订单
             */
            {
                path: 'order_change',
                name: 'sale_order_change',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/order_change.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 订单管理 - 审核变更
             */
            {
                path: 'audit_change',
                name: 'sale_audit_change',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/audit_change.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 订单管理 - 维护单价
             */
            {
                path: 'unitprice_guarantee',
                name: 'sale_unitprice_guarantee',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/unitprice_guarantee.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 订单管理 - 审核单价
             */
            {
                path: 'unitprice_audit',
                name: 'sale_unitprice_audit',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/unitprice_audit.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 销售管理 - 装车管理 - 预约装车
             */
            {
                path: 'truckload_appoint',
                name: 'sale_truckload_appoint',
                component: resolve => require(['../page/erp_pc/erp_sale/truckload_mana/truckload_appoint.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 装车管理 - 装车单
             */
            {
                path: 'truckload_order',
                name: 'sale_truckload_order',
                component: resolve => require(['../page/erp_pc/erp_sale/truckload_mana/truckload_order.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 装车管理 - 审核装车单
             */
            {
                path: 'truckload_audit',
                name: 'sale_truckload_audit',
                component: resolve => require(['../page/erp_pc/erp_sale/truckload_mana/truckload_audit.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 装车管理 - 维护装车价格
             */
            {
                path: 'truckload_priceguarantee',
                name: 'sale_truckload_priceguarantee',
                component: resolve => require(['../page/erp_pc/erp_sale/truckload_mana/truckload_priceguarantee.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 装车管理 - 审核装车价格
             */
            {
                path: 'truckload_priceaudit',
                name: 'sale_truckload_priceaudit',
                component: resolve => require(['../page/erp_pc/erp_sale/truckload_mana/truckload_priceaudit.vue'], resolve),
            },
            /**
             * @desc 我的订单 - 经典下单
             */
            {
                path: 'order_classical_add',
                name: 'sale_order_classical_add',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/order_classical_add.vue'], resolve),
            },
            /**
             * @desc 我的订单 - 在线下单
             */
            {
                path: 'online_order',
                name: 'sale_online_order',
                component: resolve => require(['../page/erp_pc/erp_sale/order_mana/online_order.vue'], resolve),
            },
            /**
             * @desc 预约装车
             */
            {
                path: 'truckload_classical_add',
                name: 'truckload_classical_add',
                component: resolve => require(['../page/erp_pc/erp_sale/truckload_mana/truckload_classical_add.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 销售管理 - 订单进度 - 订单进度
             */
            {
                path: 'order_progress',
                name: 'sale_order_progress',
                component: resolve => require(['../page/erp_pc/erp_sale/order_progress/order_progress.vue'], resolve),
            },
            /**
             * @desc 销售管理 - 订单变更 - 订单变更
             */
            {
                path: 'order_progress_change',
                name: 'sale_order_progress_change',
                component: resolve => require(['../page/erp_pc/erp_sale/order_progress_change/order_progress_change.vue'], resolve),
            },
            /* ------------------------------------------- */
            /* --------------------------------------------------------------- */


            /* --------------------------------------------------------------- */
            /**
             * erp_check
             * @desc 核算管理
             */

            /* ------------------------------------------- */
            /**
             * @desc 核算管理 - 结算管理 - 出仓码单
             */
            {
                path: 'weightnote_takeout',
                name: 'check_weightnote_takeout',
                component: resolve => require(['../page/erp_pc/erp_check/settlement_mana/weightnote_takeout.vue'], resolve),
            },
            /**
             * @desc 核算管理 - 结算管理 - 码单核算
             */
            {
                path: 'weightnote_check',
                name: 'check_weightnote_check',
                component: resolve => require(['../page/erp_pc/erp_check/settlement_mana/weightnote_check.vue'], resolve),
            },
            /**
             * @desc 核算管理 - 结算管理 - 客户奖罚
             */
            {
                path: 'client_rewards',
                name: 'check_client_rewards',
                component: resolve => require(['../page/erp_pc/erp_check/settlement_mana/client_rewards.vue'], resolve),
            },
            /* ------------------------------------------- */
            /* --------------------------------------------------------------- */

            /* --------------------------------------------------------------- */
            /**
             * erp_finance
             * @desc 财务会计
             */

            /* ------------------------------------------- */
            /**
             * @desc 财务会计 - 应收管理 - 总帐凭证
             */
            {
                path: 'general_ledger',
                name: 'general_ledger_voucher',
                component: resolve => require(['../page/erp_pc/erp_finance/pay_mana/general_ledger.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 应付款项
             */
            {
                path: 'pay_item',
                name: 'finance_pay_item',
                component: resolve => require(['../page/erp_pc/erp_finance/pay_mana/pay_item.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 客户结余
             */
            {
                path: 'client_balance',
                name: 'finance_client_balance',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/client_balance.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 应收账款查询
             */
            {
                path: 'receive_balance',
                name: 'finance_receive_balance',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/receive_balance.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 应收凭证
             */
            {
                path: 'receive_voucher',
                name: 'finance_receive_voucher',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/receive_voucher.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 应收凭证审核
             */
            {
                path: 'receive_voucher_audit',
                name: 'finance_receive_voucher_audit',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/receive_voucher_audit.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 应收计划
             */
            {
                path: 'receive_plan',
                name: 'finance_receive_plan',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/receive_plan.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 应收计划审核
             */
            {
                path: 'receive_plan_audit',
                name: 'finance_receive_plan_audit',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/receive_plan_audit.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 费用单
             */
            {
                path: 'cost_bill',
                name: 'finance_cost_bill',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/cost_bill.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 在途款
             */
            {
                path: 'onroad_fund',
                name: 'finance_onroad_fund',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/onroad_fund.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 收款凭证
             */
            {
                path: 'proceeds_voucher',
                name: 'finance_proceeds_voucher',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/proceeds_voucher.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 收款审核
             */
            {
                path: 'proceeds_audit',
                name: 'finance_proceeds_audit',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/proceeds_audit.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应收管理 - 应收发票
             */
            {
                path: 'receive_invoice',
                name: 'finance_receive_invoice',
                component: resolve => require(['../page/erp_pc/erp_finance/receive_mana/receive_invoice.vue'], resolve),
            },
            /* ------------------------------------------- */

            /* ------------------------------------------- */
            /**
             * @desc 财务会计 - 应付管理 - 供应商结余
             */
            {
                path: 'supplier_balance',
                name: 'finance_supplier_balance',
                component: resolve => require(['../page/erp_pc/erp_finance/pay_mana/supplier_balance.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应付管理 - 应付凭证
             */
            {
                path: 'pay_voucher',
                name: 'finance_pay_voucher',
                component: resolve => require(['../page/erp_pc/erp_finance/pay_mana/pay_voucher.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应付管理 - 应付凭证审核
             */
            {
                path: 'pay_voucher_audit',
                name: 'finance_pay_voucher_audit',
                component: resolve => require(['../page/erp_pc/erp_finance/pay_mana/pay_voucher_audit.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应付管理 - 应付计划
             */
            {
                path: 'pay_plan',
                name: 'finance_pay_plan',
                component: resolve => require(['../page/erp_pc/erp_finance/pay_mana/pay_plan.vue'], resolve),
            },
            /**
             * @desc 财务会计 - 应付管理 - 应付计划审核
             */
            {
                path: 'pay_plan_audit',
                name: 'finance_pay_plan_audit',
                component: resolve => require(['../page/erp_pc/erp_finance/pay_mana/pay_plan_audit.vue'], resolve),
            },
            /* ------------------------------------------- */
            /* --------------------------------------------------------------- */

            /* --------------------------------------------------------------- */
            /**
             * erp_logistics
             * @desc 物流管理
             */

            /* ------------------------------------------- */
            /**
             * @desc 物流管理 - 物流管理 - 货车信息
             */
            {
                path: 'trucks_info',
                name: 'logistics_trucks_info',
                component: resolve => require(['../page/erp_pc/erp_logistics/logistics_mana/trucks_info.vue'], resolve),
            },
            /* ------------------------------------------- */
            /* --------------------------------------------------------------- */

            {
                path: 'iframe',
                name: 'iframe',
                component: iframe,
                meta: {}
            },
            {
                path: 'reports/:id',
                name: 'reports',
                component: reports,
                meta: {}
            },

            /**订单，送货单报表 */
            //送货单明细表
            {
                path: 'delivery_detail',
                name: 'delivery_detail',
                component: resolve => require(['../page/erp_pc/erp_report/delivery_detail'], resolve),
            },
            //送货单明细表(财务)
            {
                path: 'fm_delivery_detail',
                name: 'fm_delivery_detail',
                component: resolve => require(['../page/erp_pc/erp_report/fm_delivery_detail'], resolve),
            },
            //订单明细表(财务)
            {
                path: 'fm_order_detail',
                name: 'fm_order_detail',
                component: resolve => require(['../page/erp_pc/erp_report/fm_order_detail'], resolve),
            },
            //区域销售汇总
            {
                path: 'regional_sales',
                name: 'regional_sales',
                component: resolve => require(['../page/erp_pc/erp_report/regional_sales'], resolve),
            },
            /* wfw_xitong  sm*/
            /**================================================系统管理================================================*/

            /**系统运行参数*/
            {
                path: 'operationallimits',
                name: 'msm_operationallimits',
                component: resolve => require(['../page/erp_pc/erp_sys/operationallimits'], resolve),
                children: [
                    {
                        path: '/',
                        name: 'msm_operationallimits_list',
                        component: resolve => require(['../page/erp_pc/erp_sys/operationallimits-list'], resolve),
                        meta: {
                            firstnavstatus: 'msm_operationallimits_list',
                            secondnavstatus: 'msm_operationallimits_list'
                        }
                    },
                    {
                        path: '',
                        name: 'msm_operationallimits_list',
                        //component: wfw_xitong.operationallimitsList,
                        component: resolve => require(['../page/erp_pc/erp_sys/operationallimits-list'], resolve),
                        meta: {
                            firstnavstatus: 'msm_operationallimits_list',
                            secondnavstatus: 'msm_operationallimits_list'
                        }
                    },
                    {
                        path: 'add',
                        name: 'msm_operationallimits_add',
                        //component: wfw_xitong.operationallimitsAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/operationallimits-add'], resolve),
                        meta: {
                            pageType: 'add',
                            firstnavstatus: 'msm_operationallimits_list',
                            secondnavstatus: 'msm_operationallimits_list'
                        }
                    },
                    {
                        path: 'detail/:id',
                        name: 'msm_operationallimits_detail',
                        //component: wfw_xitong.operationallimitsDetail,
                        component: resolve => require(['../page/erp_pc/erp_sys/operationallimits-detail'], resolve),
                        meta: {
                            firstnavstatus: 'msm_operationallimits_list',
                            secondnavstatus: 'msm_operationallimits_list'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'msm_operationallimits_edit',
                        //component: wfw_xitong.operationallimitsAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/operationallimits-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_operationallimits',
                            pageType: 'edit',
                            secondnavstatus: 'msm_operationallimits_list'
                        }
                    },
                ]
            },
            /**账号管理*/
            {
                path: 'account',
                name: 'msm_account',
                //component: wfw_xitong.account,
                component: resolve => require(['../page/erp_pc/erp_sys/account'], resolve),
                meta: {firstnavstatus: 'msm_account',}
            },
            {
                path: 'accountDetail/:id',
                name: 'msm_account_detail',
                //component: wfw_xitong.accountDetail,
                component: resolve => require(['../page/erp_pc/erp_sys/account-detail'], resolve),
                meta: {firstnavstatus: 'msm_account', secondnavstatus: 'msm_account'}
            },
            {
                path: 'accountAdd',
                name: 'msm_account_add',
                //component: wfw_xitong.accountAdd,
                component: resolve => require(['../page/erp_pc/erp_sys/account-add'], resolve),
                meta: {firstnavstatus: 'msm_account', pageType: 'add', secondnavstatus: 'msm_account'}
            },
            {
                path: 'accountEdit/:id',
                name: 'msm_account_edit',
                //component: wfw_xitong.accountAdd,
                component: resolve => require(['../page/erp_pc/erp_sys/account-add'], resolve),
                meta: {firstnavstatus: 'msm_account', pageType: 'edit', secondnavstatus: 'msm_account'}
            },
            /**代码管理*/
            {
                path: 'code/:cid/',
                name: 'msm_code_list',
                //component: wfw_xitong.code,
                component: resolve => require(['../page/erp_pc/erp_sys/code'], resolve),
                children: [
                    {
                        path: '',
                        name: 'msm_code_list',
                        //component: wfw_xitong.codeList,
                        component: resolve => require(['../page/erp_pc/erp_sys/code-list'], resolve),
                        meta: {firstnavstatus: 'msm_code_list', secondnavstatus: 'msm_code_list'}
                    },
                    {
                        path: 'add',
                        name: 'msm_code_add',
                        //component: wfw_xitong.codeAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/code-add'], resolve),
                        meta: {pageType: 'add', firstnavstatus: 'msm_code_list', secondnavstatus: 'msm_code_list'}
                    },
                    {
                        path: 'detail/:id',
                        name: 'msm_code_detail',
                        //component: wfw_xitong.codeDetail,
                        component: resolve => require(['../page/erp_pc/erp_sys/code-detail'], resolve),
                        meta: {pageType: 'detail', firstnavstatus: 'msm_code_list', secondnavstatus: 'msm_code_list'}
                    },
                    {
                        path: 'edit/:id',
                        name: 'msm_code_edit',
                        //component: wfw_xitong.codeAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/code-add'], resolve),
                        meta: {
                            pageType: 'edit',
                            firstnavstatus: 'msm_code_list',
                            pageType: 'edit',
                            secondnavstatus: 'msm_code_list'
                        }
                    },
                ]
            },
            /**流水号*/
            {
                path: 'serialnumber',
                name: 'msm_serialnumber',
                //component: wfw_xitong.serialnumber,
                component: resolve => require(['../page/erp_pc/erp_sys/serialnumber'], resolve),
                meta: {firstnavstatus: 'msm_serialnumber',}
            },
            {
                path: 'serialnumberDetail/:id',
                name: 'msm_serialnumber_detail',
                //component: wfw_xitong.serialnumberDetail,
                component: resolve => require(['../page/erp_pc/erp_sys/serialnumber-detail'], resolve),
                meta: {firstnavstatus: 'msm_serialnumber', secondnavstatus: 'msm_serialnumber'}
            },
            {
                path: 'serialnumberEdit/:id',
                name: 'msm_serialnumber_edit',
                //component: wfw_xitong.serialnumberAdd,
                component: resolve => require(['../page/erp_pc/erp_sys/serialnumber-add'], resolve),
                meta: {
                    firstnavstatus: 'msm_serialnumber',
                    pageType: 'edit',
                    secondnavstatus: 'msm_serialnumber'
                }
            },
            {
                path: 'serialnumberAdd',
                name: 'msm_serialnumber_add',
                //component: wfw_xitong.serialnumberAdd,
                component: resolve => require(['../page/erp_pc/erp_sys/serialnumber-add'], resolve),
                meta: {firstnavstatus: 'msm_serialnumber', pageType: 'add', secondnavstatus: 'msm_serialnumber'}
            },
            /**角色管理*/
            {
                path: 'role',
                name: 'msm_role',
                //component: wfw_xitong.role,
                component: resolve => require(['../page/erp_pc/erp_sys/role'], resolve),
                meta: {firstnavstatus: 'msm_role',}
            },
            {
                path: 'roleDetail/:id',
                name: 'msm_role_detail',
                //component: wfw_xitong.roleDetail,
                component: resolve => require(['../page/erp_pc/erp_sys/role-detail'], resolve),
                meta: {pageType: 'detail', firstnavstatus: 'msm_role', secondnavstatus: 'msm_role'}
            },
            {
                path: 'roleEdit/:id',
                name: 'msm_role_edit',
                //component: wfw_xitong.roleAdd,
                component: resolve => require(['../page/erp_pc/erp_sys/role-add'], resolve),
                meta: {pageType: 'edit', firstnavstatus: 'msm_role', secondnavstatus: 'msm_role'}
            },
            {
                path: 'roleAdd',
                name: 'msm_role_add',
                //component: wfw_xitong.roleAdd,
                component: resolve => require(['../page/erp_pc/erp_sys/role-add'], resolve),
                meta: {pageType: 'add', firstnavstatus: 'msm_role', secondnavstatus: 'msm_role'}
            },
            /**权限管理*/
            {
                path: 'permission',
                name: 'msm_permission',
                //component: wfw_xitong.permission,
                component: resolve => require(['../page/erp_pc/erp_sys/permission'], resolve),
                children: [
                    {
                        path: '',
                        name: 'msm_permission',
                        //component: wfw_xitong.permission,
                        component: resolve => require(['../page/erp_pc/erp_sys/permission'], resolve),
                        meta: {firstnavstatus: 'msm_permission', secondnavstatus: 'msm_permission'}
                    },
                    {
                        path: 'detail/:id',
                        name: 'msm_permission_detail',
                        //component: wfw_xitong.permission,
                        component: resolve => require(['../page/erp_pc/erp_sys/permission'], resolve),
                        meta: {
                            pageType: 'detail',
                            firstnavstatus: 'msm_permission',
                            secondnavstatus: 'msm_permission'
                        }
                    },
                    {
                        path: 'detail/:id/:resid',
                        name: 'msm_permission_detail_a',
                        //component: wfw_xitong.permission,
                        component: resolve => require(['../page/erp_pc/erp_sys/permission'], resolve),
                        meta: {
                            pageType: 'detail',
                            firstnavstatus: 'msm_permission',
                            secondnavstatus: 'msm_permission'
                        }
                    },
                    {
                        path: 'add',
                        name: 'msm_permission_add',
                        //component: wfw_xitong.permissionAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/permission-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_permission',
                            pageType: 'add',
                            secondnavstatus: 'msm_permission'
                        }
                    },
                    {
                        path: 'edit/:id',
                        name: 'msm_permission_edit',
                        //component: wfw_xitong.permissionAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/permission-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_permission',
                            pageType: 'edit',
                            secondnavstatus: 'msm_permission'
                        }
                    },
                ]
            },
            {
                path: 'permissionAdd',
                name: 'msm_permission_add',
                //component: wfw_xitong.permissionAdd,
                component: resolve => require(['../page/erp_pc/erp_sys/permission-add'], resolve),
                meta: {firstnavstatus: 'msm_permission', pageType: 'add', secondnavstatus: 'msm_permission'}
            },
            {
                path: 'permissionEdit/:id',
                name: 'msm_permission_edit',
                //component: wfw_xitong.permissionAdd,
                component: resolve => require(['../page/erp_pc/erp_sys/permission-add'], resolve),
                meta: {firstnavstatus: 'msm_permission', pageType: 'edit', secondnavstatus: 'msm_permission'}
            },
            /**模块管理*/

            {
                path: 'module',
                name: 'msm_module',
                //component: wfw_xitong.module,
                component: resolve => require(['../page/erp_pc/erp_sys/module'], resolve),
                children: [
                    {
                        path: '/',
                        name: 'msm_module_list',
                        //component: wfw_xitong.moduleDetail,
                        component: resolve => require(['../page/erp_pc/erp_sys/module-detail'], resolve),
                        meta: {firstnavstatus: 'msm_module', secondnavstatus: 'msm_module_list'}
                    },
                    {
                        path: 'add',
                        name: 'msm_module_add',
                        //component: wfw_xitong.moduleAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/module-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_module',
                            pageType: 'add',
                            secondnavstatus: 'msm_module_list'
                        }
                    },
                    {
                        path: 'detail/:id',
                        name: 'msm_module_detail',
                        //component: wfw_xitong.moduleDetail,
                        component: resolve => require(['../page/erp_pc/erp_sys/module-detail'], resolve),
                        meta: {firstnavstatus: 'msm_module', secondnavstatus: 'msm_module_list'}
                    },
                    {
                        path: 'edit/:id',
                        name: 'msm_module_edit',
                        //component: wfw_xitong.moduleAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/module-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_module',
                            pageType: 'edit',
                            secondnavstatus: 'msm_module_list'
                        }
                    },
                ]
            },
            /**岗位管理*/
            {
                path: 'station',
                name: 'msm_station',
                //component: wfw_xitong.station,
                component: resolve => require(['../page/erp_pc/erp_sys/station'], resolve),
                meta: {firstnavstatus: 'msm_station', secondnavstatus: 'msm_station_list'},
                children: [
                    {
                        path: '',
                        name: 'msm_station_list',
                        //component: wfw_xitong.stationList,
                        component: resolve => require(['../page/erp_pc/erp_sys/station-list'], resolve),
                        meta: {firstnavstatus: 'msm_station_list', secondnavstatus: 'msm_station'}
                    },
                    {
                        path: 'detail/:id',
                        name: 'msm_station_detail',
                        //component: wfw_xitong.stationList,
                        component: resolve => require(['../page/erp_pc/erp_sys/station-list'], resolve),
                        meta: {
                            pageType: 'detail',
                            firstnavstatus: 'msm_station',
                            secondnavstatus: 'msm_station'
                        }
                    },
                    {
                        path: 'add',
                        name: 'msm_station_add',
                        //component: wfw_xitong.stationAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/station-add'], resolve),
                        meta: {firstnavstatus: 'msm_station', pageType: 'add', secondnavstatus: 'msm_station'}
                    },
                    {
                        path: 'edit/:id',
                        name: 'msm_station_edit',
                        //component: wfw_xitong.stationAdd,
                        component: resolve => require(['../page/erp_pc/erp_sys/station-add'], resolve),
                        meta: {firstnavstatus: 'msm_station', pageType: 'edit', secondnavstatus: 'msm_station'}
                    },
                ]
            },
            /**设置*/
            {
                path: 'setting',
                name: 'msm_setting',
                component: wfw_xitong.setting,
                // component: resolve => require(['../page/erp_pc/erp_sys/setting'], resolve),
                meta: {firstnavstatus: 'msm_setting', secondnavstatus: 'msm_setting_subsystem'},
                children: [
                    {
                        path: '/',
                        name: 'msm_setting_subsystem',
                        component: wfw_xitong.settingSubSystem,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-subSystem'], resolve),
                        meta: {firstnavstatus: 'msm_setting', secondnavstatus: 'msm_setting_subsystem'}
                    },
                    {
                        path: '',
                        name: 'msm_setting_subsystem',
                        component: wfw_xitong.settingSubSystem,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-subSystem'], resolve),
                        meta: {firstnavstatus: 'msm_setting', secondnavstatus: 'msm_setting_subsystem'}
                    },
                    {
                        path: 'systemLog',
                        name: 'msm_setting_system_log',
                        component: wfw_xitong.sysLog,
                        // component: resolve => require(['../page/erp_pc/erp_sys/sys-log'], resolve),
                        meta: {firstnavstatus: 'msm_setting', secondnavstatus: 'msm_setting_system_log'}
                    },
                    {
                        path: 'systemLogAdd',
                        name: 'msm_setting_system_log_add',
                        component: wfw_xitong.sysLogAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/sys-log-add'], resolve),
                        meta: {firstnavstatus: 'msm_setting', secondnavstatus: 'msm_setting_system_log'}
                    },
                    {
                        path: 'systemLogEdit/:id',
                        name: 'msm_setting_system_log_edit',
                        component: wfw_xitong.sysLogAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/sys-log-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'edit',
                            secondnavstatus: 'msm_setting_system_log'
                        }
                    },
                    {
                        path: 'subsystemDetail/:id',
                        name: 'msm_setting_subsystem_detail',
                        component: wfw_xitong.settingSubSystemAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-subSystem-add'], resolve),
                        meta: {
                            pageType: 'detail',
                            firstnavstatus: 'msm_setting',
                            secondnavstatus: 'msm_setting_subsystem'
                        }
                    },
                    {
                        path: 'subsystemEdit/:id',
                        name: 'msm_setting_subsystem_edit',
                        component: wfw_xitong.settingSubSystemAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-subSystem-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'edit',
                            secondnavstatus: 'msm_setting_subsystem'
                        }
                    },
                    {
                        path: 'subsystemAdd',
                        name: 'msm_setting_subsystem_add',
                        component: wfw_xitong.settingSubSystemAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-subSystem-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'add',
                            secondnavstatus: 'msm_setting_subsystem'
                        }
                    },
                    {
                        path: 'typeKey',
                        name: 'msm_setting_typekey',
                        component: wfw_xitong.settingTypeKey,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-typeKey'], resolve),
                        meta: {firstnavstatus: 'msm_setting', secondnavstatus: 'msm_setting_typekey'}
                    },
                    {
                        path: 'typeKeyAdd',
                        name: 'msm_setting_typekey_add',
                        component: wfw_xitong.settingTypeKeyAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-typeKey'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'add',
                            secondnavstatus: 'msm_setting_typekey'
                        }
                    },
                    {
                        path: 'typeKeyEdit/:id',
                        name: 'msm_setting_typekey_edit',
                        component: wfw_xitong.settingTypeKeyAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-typeKey-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'edit',
                            secondnavstatus: 'msm_setting_typekey'
                        }
                    },
                    {
                        path: 'GLType',
                        name: 'msm_setting_gltype',
                        component: wfw_xitong.settingGLType,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-GLtypee'], resolve),
                        //meta: {firstnavstatus: 'msm_setting',secondnavstatus:'msm_setting_gltype'},
                        children: [
                            // {
                            //   path: '/',
                            //   name: 'msm_setting_gltype_detail',
                            //   component: wfw_xitong.settingGLTypeDetail,
                            //   meta: {firstnavstatus: 'msm_setting',secondnavstatus:'msm_setting_gltype'}
                            // },
                            // {
                            //   path: '',
                            //   name: 'msm_setting_gltype_detail',
                            //   component: wfw_xitong.settingGLTypeDetail,
                            //   meta: {firstnavstatus: 'msm_setting',secondnavstatus:'msm_setting_gltype'}
                            // },
                            {
                                path: 'detail/:id',
                                name: 'msm_setting_gltype_detail',
                                component: wfw_xitong.settingGLTypeDetail,
                                // component: resolve => require(['../page/erp_pc/erp_sys/setting-GLtypee-detail'], resolve),
                                meta: {firstnavstatus: 'msm_setting', secondnavstatus: 'msm_setting_gltype'}
                            },
                            {
                                path: 'add',
                                name: 'msm_setting_gltype_add',
                                component: wfw_xitong.settingGLTypeAdd,
                                // component: resolve => require(['../page/erp_pc/erp_sys/setting-GLtypee-add'], resolve),
                                meta: {
                                    firstnavstatus: 'msm_setting',
                                    pageType: 'add',
                                    secondnavstatus: 'msm_setting_gltype'
                                }
                            },
                            {
                                path: 'edit/:id',
                                name: 'msm_setting_gltype_edit',
                                component: wfw_xitong.settingGLTypeAdd,
                                // component: resolve => require(['../page/erp_pc/erp_sys/setting-GLtypee-add'], resolve),
                                meta: {
                                    firstnavstatus: 'msm_setting',
                                    pageType: 'edit',
                                    secondnavstatus: 'msm_setting_gltype'
                                }
                            },
                        ]
                    },
                    {
                        path: 'demensionOrg',
                        name: 'msm_setting_demension_org',
                        component: wfw_xitong.settingDemensionOrg,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-demensionOrg'], resolve),
                    },
                    {
                        path: 'demensionOrgAdd',
                        name: 'msm_setting_demension_org_add',//?parentid&depth&catkey
                        component: wfw_xitong.settingDemensionOrgAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-demensionOrg-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'add',
                            secondnavstatus: 'msm_setting_demension_org'
                        }
                    },
                    {
                        path: 'demensionOrgEdit/:id',
                        name: 'msm_setting_demension_org_edit',
                        component: wfw_xitong.settingDemensionOrgAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-demensionOrg-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'edit',
                            secondnavstatus: 'msm_setting_demension_org'
                        }
                    },
                    {
                        path: 'demensionEdit/:id',
                        name: 'msm_setting_demension_edit',
                        component: wfw_xitong.settingDemensionAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-demensionOrg-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'edit',
                            secondnavstatus: 'msm_setting_demension_detail'
                        }
                    },
                    /**邮件*/
                    {
                        path: 'settingEmail',
                        name: 'msm_setting_email',
                        component: wfw_xitong.settingEmail,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-email'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            secondnavstatus: 'msm_setting_email'
                        }
                    },
                    {
                        path: 'settingEmailDetail/:id',
                        name: 'msm_setting_email_detail',
                        component: wfw_xitong.settingEmailAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-email-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'detail',
                            secondnavstatus: 'msm_setting_email_detail'
                        }
                    },
                    {
                        path: 'settingEmailEdit/:id',
                        name: 'msm_setting_email_edit',
                        component: wfw_xitong.settingEmailAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-email-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'edit',
                            secondnavstatus: 'msm_setting_email_edit'
                        }
                    },
                    {
                        path: 'settingEmailAdd',
                        name: 'msm_setting_email_add',
                        component: wfw_xitong.settingEmailAdd,
                        // component: resolve => require(['../page/erp_pc/erp_sys/setting-email-add'], resolve),
                        meta: {
                            firstnavstatus: 'msm_setting',
                            pageType: 'add',
                            secondnavstatus: 'msm_setting_email_add'
                        }
                    },
                ]
            },
            /**生成代码**/
            {
                path: 'createcode',
                name: 'msm_createcode',
                component: resolve => require(['../page/erp_pc/erp_sys/create-code'], resolve)
            },


            /*wfw_zhuye Personal Homepage*/
            /**========个人主页========*/
            {
                path: 'personal_homepage',
                    name: 'personal_homepage',
                component: resolve => require(['../page/erp_pc/erp_ph/personal_homepage'], resolve),
            },
            /*wfw_xinxi Message center*/

            /**================================================人力资源================================================*/
            {
                path: 'staff',
                name: 'hr_staff',
                component: resolve => require(['../page/erp_pc/erp_hr/staff'], resolve),
                meta: {firstnavstatus: 'hr_staff'}
            },

            /**================================================消息中心================================================*/

            /**系统公告 */
            {
                path: 'announcement',
                name: 'mc_announcement',
                component: resolve => require(['../page/erp_pc/erp_mc/announcement'], resolve),
                meta: {}
            },
            {
                path: 'announcementView/:id',
                name: 'mc_announcement_view',
                component: resolve => require(['../page/erp_pc/erp_mc/announcement_view'], resolve),
                meta: {pageType: 'view'}
            },
            {
                path: 'announcementEdit',
                name: 'mc_announcement_edit',
                component: resolve => require(['../page/erp_pc/erp_mc/announcement_edit'], resolve),
                meta: {pageType: 'edit'}
            },
            /**任务信息 */
            {
                path: 'task_message',
                name: 'mc_task_message',
                component: resolve => require(['../page/erp_pc/erp_mc/task_message'], resolve),
                meta: {}
            },
            /**信息提醒 */
            {
                path: 'information_remind',
                name: 'mc_information_remind',
                component: resolve => require(['../page/erp_pc/erp_mc/information_remind'], resolve),
                meta: {}
            },
            /**消息模板类型 */
            {
                path: 'information_type',
                name: 'mc_information_type',
                component: resolve => require(['../page/erp_pc/erp_mc/information_type'], resolve),
                meta: {}
            },
            /**消息模板设置 */
            {
                path: 'information_setting',
                name: 'mc_information_setting',
                component: resolve => require(['../page/erp_pc/erp_mc/information_setting'], resolve),
                meta: {}
            },
            {
                path: 'informationSettingAdd',
                name: 'mc_information_setting_add',
                component: resolve => require(['../page/erp_pc/erp_mc/information_setting_edit'], resolve),
                meta: {pageType: 'add'}
            },
            {
                path: 'informationSettingEdit/:id',
                name: 'mc_information_setting_edit',
                component: resolve => require(['../page/erp_pc/erp_mc/information_setting_edit'], resolve),
                meta: {pageType: 'edit'}
            },
            /**消息订阅查看 */
            {
                path: 'information_view',
                name: 'mc_information_view',
                component: resolve => require(['../page/erp_pc/erp_mc/information_view'], resolve),
                meta: {}
            },

        ]
    },
    { path: '*', component: NotFoundComponent }
];

export default new Router({
    mode: 'history',
    routes: _routes
})
