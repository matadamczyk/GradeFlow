import { NavbarItem } from './navbar.interfaces';

const studentNavbarItems: NavbarItem[] = [
  {
    label: 'Start',
    icon: 'pi pi-home',
    routerLink: '/',
  },
  {
    label: 'Plan zajęć',
    icon: 'pi pi-calendar',
    routerLink: '/timetable',
  },
  {
    label: 'Oceny',
    icon: 'pi pi-star',
    routerLink: '/grades',
  },
  {
    label: 'Profil ucznia',
    icon: 'pi pi-user',
    routerLink: '/account',
  },
];

const teacherNavbarItems: NavbarItem[] = [
  {
    label: 'Start',
    icon: 'pi pi-home',
    routerLink: '/',
  },
  {
    label: 'Plan zajęć',
    icon: 'pi pi-calendar',
    routerLink: '/timetable',
  },
  {
    label: 'Oceny',
    icon: 'pi pi-star',
    routerLink: '/grades',
  },
  {
    label: 'Profil nauczyciela',
    icon: 'pi pi-user',
    routerLink: '/account',
  },
];
const adminNavbarItems: NavbarItem[] = [
  {
    label: 'Start',
    icon: 'pi pi-home',
    routerLink: '/',
  },
];

const parentNavbarItems: NavbarItem[] = [
  {
    label: 'Start',
    icon: 'pi pi-home',
    routerLink: '/',
  },
  {
    label: 'Plan zajęć',
    icon: 'pi pi-calendar',
    routerLink: '/timetable',
  },
  {
    label: 'Oceny',
    icon: 'pi pi-star',
    routerLink: '/grades',
  },
  {
    label: 'Profil rodzica',
    icon: 'pi pi-user',
    routerLink: '/account',
  },
];

const notLoggedInNavbarItems: NavbarItem[] = [
  {
    label: 'Start',
    icon: 'pi pi-home',
    routerLink: '/',
  },
  {
    label: 'O Nas',
    icon: 'pi pi-info-circle',
    routerLink: '/about',
  },
  {
    label: 'Kontakt',
    icon: 'pi pi-phone',
    routerLink: '/contact',
  },
];

const navbarItems = {
  student: studentNavbarItems,
  teacher: teacherNavbarItems,
  admin: adminNavbarItems,
  parent: parentNavbarItems,
  notLoggedIn: notLoggedInNavbarItems,
};

export { navbarItems };
