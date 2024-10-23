<script setup>
import { ref } from 'vue';

import AppMenuItem from './PageMenuItem.vue';

const model = ref([
    {
        label: 'Tổng Quan',
        items: [{ label: 'Trang Chủ', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    
    {
        label: 'Quản Lý Doanh Nghiệp',
        items: [
            {
                label: 'Thông Tin Doanh Nghiệp',
                icon: 'pi pi-briefcase',
                items: [
                            { label: 'Cơ Cấu Tổ Chức', icon: 'pi pi-sitemap', to:'/OrganizationalStructure'}, 
                            { label: 'Nhà Cung Cấp', icon: 'pi pi-fw pi-id-card', to:'/uikit/table'},
                            { label: 'Vật Tư Hàng Hóa', icon: 'pi pi-box' },
                            { label: 'Ngành nghề/Lĩnh vực', icon: 'pi pi-briefcase' },
                            { label: 'Hình Thức Đấu Thầu', icon: 'pi pi-chart-line' },
                            { label: 'Tiêu Chí Đánh Giá NCC', icon: 'pi pi-book' },
                            { label: 'Trạng Thái Hồ Sơ Thầu', icon: 'pi pi-check-circle' },
                            { label: 'User Hệ Thống', icon: 'pi pi-users' },
                        ]
            },
            {
                label: 'Quản Lý Mua Sắm',
                icon: 'pi pi-shopping-bag',
                items: [
                    
                            { label: 'Kế Hoạch Mua Sắm', icon: 'pi pi-caret-right' },
                            { label: 'Quản Lý Gói Thầu', icon: 'pi pi-caret-right' },
                            { label: 'Báo Cáo', icon: 'pi pi-caret-right' },
                        ]
            },
            {
                label: 'Quản Lý Nhà Cung Cấp',
                icon: 'pi pi-fw pi-id-card',
                items: [
                    
                            { label: 'Kỳ Đánh Giá Nhà Cung Cấp', icon: 'pi pi-caret-right' },
                            { label: 'Đánh Giá Nhà Cung Cấp', icon: 'pi pi-caret-right' },
                            { label: 'Báo Cáo', icon: 'pi pi-caret-right' },
                        ]
            },
            {
                label: 'Thiết Lập Hệ Thống',
                icon: 'pi pi-cog',
                items: [
                    
                            { label: 'Tiêu Chí Đánh Giá', icon: 'pi pi-caret-right' },
                            { label: 'Quy Trình Đấu Thầu', icon: 'pi pi-caret-right' },
                            { label: 'Quy Trình Phê Duyệt', icon: 'pi pi-caret-right' },
                            { label: 'Thiết Lập Thông Báo', icon: 'pi pi-caret-right' },
                            { label: 'Thiết Lập Tài Khoản', icon: 'pi pi-caret-right' },
                            { label: 'Thiết Lập Chung Hệ Thống', icon: 'pi pi-caret-right' },
                            { label: 'Phân Quyền Hệ Thống', icon: 'pi pi-caret-right' },
                        ]
            },
            
           // {
            //     label: 'Thiết Lập Hệ Thống',
            //     icon: 'pi pi-fw pi-bookmark',
            //     items: [
            //         {
            //             label: 'Submenu 2.1',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                 { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2.2',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //         }
            //     ]
            // }
        ]
    },
    {
        label:'Liên Hệ',
        
    }
    //  Quản Lý Dự Án Mua Sắm
    // {
    //     label: 'Quản Lý Dự Án Mua Sắm',
    //     items: [
    //         {
    //             label: 'Quản Lý Gói Thầu',
    //             icon: 'pi pi-fw pi-bookmark',
    //             items: [
    //                         { label: 'Khởi Tạo Gói Thầu', icon: 'pi pi-caret-right' },
    //                         { label: 'Danh Mục Nhà Cung Cấp', icon: 'pi pi-caret-right' },
    //                         { label: 'Tổng Hợp Gói Thầu', icon: 'pi pi-caret-right' },
    //                         { label: 'Chi Tiết Gói Thầu', icon: 'pi pi-caret-right' },
    //                         { label: 'Tiến Độ Thực Hiện', icon: 'pi pi-caret-right' },
    //                         // { label: 'Cảnh Báo Gói Thầu Mới', icon: 'pi pi-caret-right' },
                            
    //                     ]
    //         },
            
    //             { label: 'Khởi Tạo Thầu', icon: 'pi pi-caret-right', to: '/uikit/floatlabel' },
    //             { label: 'Vòng Đánh Giá', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
    //     ]
    // },
    
    // {
    //     label: 'Quản Lý Kế Hoạch Mua Sắm',
    //     items: [
    //         { label: 'Form Layout', icon: 'pi pi-caret-right', to: '/uikit/formlayout' },
    //         { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
    //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
    //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
    //         { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
    //         { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
    //         { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
    //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
    //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
    //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
    //         { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
    //         { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
    //         { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
    //         { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
    //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
    //         { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
    //     ]
    // },

    // {
    //     label: 'Prime Blocks',
    //     items: [
    //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
    //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://www.primefaces.org/primeblocks-vue', target: '_blank' }
    //     ]
    // },
    // {
    //     label: 'Utilities',
    //     items: [
    //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
    //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank' }
    //     ]
    // },
    // {
    //     label: 'Pages',
    //     icon: 'pi pi-fw pi-briefcase',
    //     to: '/pages',
    //     items: [
    //         {
    //             label: 'Landing',
    //             icon: 'pi pi-fw pi-globe',
    //             to: '/landing'
    //         },
    //         {
    //             label: 'Auth',
    //             icon: 'pi pi-fw pi-user',
    //             items: [
    //                 {
    //                     label: 'Login',
    //                     icon: 'pi pi-fw pi-sign-in',
    //                     to: '/auth/login'
    //                 },
    //                 {
    //                     label: 'Error',
    //                     icon: 'pi pi-fw pi-times-circle',
    //                     to: '/auth/error'
    //                 },
    //                 {
    //                     label: 'Access Denied',
    //                     icon: 'pi pi-fw pi-lock',
    //                     to: '/auth/access'
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Crud',
    //             icon: 'pi pi-fw pi-pencil',
    //             to: '/pages/crud'
    //         },
    //         {
    //             label: 'Timeline',
    //             icon: 'pi pi-fw pi-calendar',
    //             to: '/pages/timeline'
    //         },
    //         {
    //             label: 'Not Found',
    //             icon: 'pi pi-fw pi-exclamation-circle',
    //             to: '/pages/notfound'
    //         },
    //         {
    //             label: 'Empty',
    //             icon: 'pi pi-fw pi-circle-off',
    //             to: '/pages/empty'
    //         }
    //     ]
    // },
    // {
    //     label: 'Hierarchy',
    //     items: [
    //         {
    //             label: 'Submenu 1',
    //             icon: 'pi pi-fw pi-bookmark',
    //             items: [
    //                 {
    //                     label: 'Submenu 1.1',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
    //                     ]
    //                 },
    //                 {
    //                     label: 'Submenu 1.2',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Submenu 2',
    //             icon: 'pi pi-fw pi-bookmark',
    //             items: [
    //                 {
    //                     label: 'Submenu 2.1',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
    //                     ]
    //                 },
    //                 {
    //                     label: 'Submenu 2.2',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     label: 'Get Started',
    //     items: [
    //         {
    //             label: 'Documentation',
    //             icon: 'pi pi-fw pi-question',
    //             to: '/documentation'
    //         },
    //         {
    //             label: 'Figma',
    //             url: 'https://www.dropbox.com/scl/fi/bhfwymnk8wu0g5530ceas/sakai-2023.fig?rlkey=u0c8n6xgn44db9t4zkd1brr3l&dl=0',
    //             icon: 'pi pi-fw pi-pencil',
    //             target: '_blank'
    //         },
    //         {
    //             label: 'View Source',
    //             icon: 'pi pi-fw pi-search',
    //             url: 'https://github.com/primefaces/sakai-vue',
    //             target: '_blank'
    //         },
    //         {
    //             label: 'Nuxt Version',
    //             url: 'https://github.com/primefaces/sakai-nuxt',
    //             icon: 'pi pi-fw pi-star'
    //         }
    //     ]
    // }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
       
    </ul>
</template>

<style lang="scss" scoped></style>
