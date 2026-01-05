export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Family Tree Maker",
  description: "Create, visualize, and share your family history with our interactive family tree maker.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Features",
      href: "/#features",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
  links: {
    github: "https://github.com/donatso/family-chart",
  },
};
