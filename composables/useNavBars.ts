export const useSettingsNavbar: NavItem[] = [
    {
        name: 'Général',
        component: defineAsyncComponent(
            () => import('@/components/settings/General.vue')
        )
    },
    {
        name: 'Sécurité',
        component: defineAsyncComponent(
            () => import('@/components/settings/Security.vue')
        )
    }
];
