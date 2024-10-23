import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import auth from '../middleware/auth';
import permission from '../middleware/permission';
import check_account from '../middleware/check_account';


const router = createRouter({
    history: createWebHistory(),
    // history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    component: () => import('@/views/supplier.vue'),
                    meta: {
                        middleware: [auth, check_account],
                    },
                },
                {
                    path: '/buyer',
                    name: 'buyer',
                    component: () => import('@/views/buyer.vue'),
                    meta: {
                        middleware: [auth],
                    },

                },
                {
                    path: 'supplier',
                    name: 'supplier',
                    component: () => import('@/views/supplier.vue'),
                    meta: {
                        middleware: [auth],
                    },
                },
                {
                    path: 'supplier-catalog',
                    name: 'supplier-catalog',
                    component: () => import('@/views/business/SupplierCatalog.vue'),
                    meta: {
                        middleware: [auth, permission],
                    },
                    
                },
                {
                    path: 'organizational-structure',
                    name: 'organizational-structure',
                    component: () => import('@/views/business/BusinessConfig.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'items-group',
                    name: 'items-group',
                    component: () => import('@/views/business/ItemsGroup.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'biddingform',
                    name: 'biddingform',
                    component: () => import('@/views/business/BiddingForm.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'organizational-level',
                    name: 'organizationallevel',
                    component: () => import('@/views/business/organizationallevel.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'vendor-group',
                    name: 'VendorGroup',
                    component: () => import('@/views/business/VendorGroup.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'ItemMasterData',
                    name: 'ItemMasterData',
                    component: () => import('@/views/business/ItemMasterData.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'ListUnits',
                    name: 'ListUnits',
                    component: () => import('@/views/business/ListUnits.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: '/UnitsGroup',
                    name: 'GroupUnits',
                    component: () => import('@/views/business/UnitsGroup.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: '/contracting-management',
                    name: 'ContractingManagement',
                    component: () => import('@/views/business/ContractingManagement.vue'),
                    meta: {
                        middleware: [auth, permission],
                    },
                },
                {
                    path: '/contracting-management/detail-cma/:id',
                    name: 'DetailCma',
                    component: () => import('@/views/business/components/detailCMA.vue'),
                    meta: {
                        middleware: [auth],
                    },
                },
                {
                    path: '/summary-of-purchasing-requests',
                    name: 'summary-of-purchasing-requests',
                    component: () => import('@/views/business/summary-of-purchasing-requests.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'ProfessionsAndFields',
                    name: 'ProfessionsAndFields',
                    component: () => import('@/views/business/ProfessionsAndFields.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'AssessmentCriteria',
                    name: 'TieuChiDanhGia',
                    component: () => import('@/views/business/supplier_scoring/TieuChiDanhGia.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'BidDocStatus',
                    name: 'BidDocStatus',
                    component: () => import('@/views/business/BidDocStatus.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'system-permision',
                    name: 'system-permision',
                    component: () => import('@/views/business/SystemPermissions.vue'),
                    meta: {
                        middleware: [auth, permission],
                    },
                },
                {
                    path: 'purchasing-plan',
                    name: 'PurchasingPlans',
                    component: () => import('@/views/business/PurchasingPlans.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'manage-procurement-requests',
                    name: 'manage-procurement-requests',
                    component: () => import('@/views/business/ManageProcurementRequests.vue')
                },
                {
                    path: 'user-management',
                    name: 'user-management',
                    component: () => import('@/views/business/UserManagement.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'user-group',
                    name: 'user-group',
                    component: () => import('@/views/business/UserGroup.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'list-template-browser',
                    name: 'ListTemplateBrowser',
                    component: () => import('@/views/business/ListTemplateBrowser.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'grant-approval',
                    name: 'GrantApproval',
                    component: () => import('@/views/business/GrantApproval.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'approval-status-report',
                    name: 'ApprovalStatusReport',
                    component: () => import('@/views/business/ApprovalStatusReport.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'report-approval-decision',
                    name: 'ReportApprovalDecision',
                    component: () => import('@/views/business/ReportApprovalDecision.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'set-criteria',
                    name: 'set-criteria',
                    component: () => import('@/views/business/set-criteria.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'set-weights',
                    name: 'set-weights',
                    component: () => import('@/views/business/SetWeight.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'scoring-list',
                    name: 'ScoringList',
                    component: () => import('@/views/business/scoring_bidding/ScoringList.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: '/scoring-list/:id',
                    // sensitive: true ,
                    name: 'chitietchamdiem',
                    component: () => import('@/views/business/scoring_bidding/Detail.vue'),
                    meta: {
                        middleware: [auth],
                    }
                },
                {
                    path: '/scoring-list/mark/:id',
                    // sensitive: true ,
                    name: 'chamdiem',
                    component: () => import('@/views/business/scoring_bidding/ChamDiem.vue'),
                    meta: {
                        middleware: [auth],
                    }
                },
                {
                    path: '/scoring-list/award/:id',
                    // sensitive: true ,
                    name: 'luachonncxccc',
                    component: () => import('@/views/business/scoring_bidding/LuaChonNCC.vue'),
                    meta: {
                        middleware: [auth],
                    }
                },
                {
                    path: 'tender-package-report',
                    name: 'TenderPackageReport',
                    component: () => import('@/views/business/TenderPackageReport.vue'),
                    meta: {
                        middleware: [auth, permission],
                    }
                },
                {
                    path: 'currency',
                    name: 'Currency',
                    component: () => import('@/views/business/Currency.vue'),
                    // meta: {
                    //     middleware: [auth, permission],
                    // }
                },
                {
                    path: 'report',
                    name: 'Report',
                    component: () => import('@/views/report/Report.vue'),
                    // meta: {
                    //     middleware: [auth, permission],
                    // }
                   
                },
                {
                    path: 'purchase-order',
                    name: 'purchase-order',
                    component: () => import('@/views/business/PurchaseOrder.vue'),
                    // meta: {
                    //     middleware: [auth, permission],
                    // }
                },
                {
                    path: 'purchase-receipt',
                    name: 'purchase-receipt',
                    component: () => import('@/views/business/PurchaseReceipt.vue'),
                    // meta: {
                    //     middleware: [auth, permission],
                    // }
                },
                {
                    path: 'evaluation-criteria',
                    name: 'EvaluationCriteria',
                    component: () => import('@/views/business/EvaluationCriteria.vue'),
                    meta: {
                        middleware: [auth],
                    }
                },
                {
                    path: 'sup-scoring',
                    name: 'Suppler Score',
                    component: () => import('@/views/business/supplier_scoring/KyDanhGiaNhaCungCap.vue'),
                    meta: {
                        middleware: [auth],
                    }
                },
                {
                    path: 'sup-scoring/:id',
                    name: 'evaluation-criteria-detail',
                    component: () => import('@/views/business/supplier_scoring/ChiTietDanhGia.vue'),
                    meta: {
                        middleware: [auth],
                    }
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: () => import('@/views/business/profile_manage/index.vue'),
                    meta: {
                        middleware: [auth],
                    }
                },
                // ---------------------- Supplier --------------------------
                {
                    path: 'company-information',
                    name: 'company-information',
                    component: () => import('@/views/supplier/CompanyInformation.vue'),
                    // meta:{
                    //     middleware: [auth,permission],
                    // }
                },
                {
                    path: 'manage-supplier-bidding-packages',
                    name: 'manage-supplier-bidding-packages',
                    component: () => import('@/views/supplier/MSBP.vue'),
                    // meta:{
                    //     middleware: [auth,permission],
                    // }
                },
                {
                    path: 'config-notification',
                    name: 'configNotication',
                    component: () => import('@/views/supplier/configNotication.vue'),
                    // meta:{
                    //     middleware: [auth,permission],
                    // }
                },
                {
                    path: '/no-permission',
                    name: 'NoPermission',
                    component: () => import('@/views/pages/Unauthorization.vue'),
                },
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
        },
        {
            path: '/auth/access',
            name: 'Access',
            component: () => import('@/views/pages/auth/Access.vue'),
        },
        {
            path: '/auth/forgot-password',
            name: 'forgotpassword',
            component: () => import('@/views/pages/auth/forgotPassword.vue'),
        },
        {
            path: '/create-pasword',
            name: 'create-pasword',
            component: () => import('@/views/supplier/create-pasword.vue'),
            meta:{
                middleware: [auth,permission],
            }
            
        },
        
        {
            path: "/:pathMatch(.*)*",
            name: 'NotFound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    if (!subsequentMiddleware) return context.next;
    return (...parameters) => {
        context.next(...parameters);

        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({ ...context, next: nextMiddleware });
    };
}

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];

        const context = {
            from,
            next,
            router,
            to,
        };
        const nextMiddleware = nextFactory(context, middleware, 1);

        return middleware[0]({ ...context, next: nextMiddleware });
    }
    return next();
});



export default router;
