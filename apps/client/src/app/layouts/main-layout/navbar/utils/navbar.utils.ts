const studentNavbarItems = [
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

const teacherNavbarItems = [
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
const adminNavbarItems = [
  {
    label: 'Start',
    icon: 'pi pi-home',
    routerLink: '/',
  },
];

const parentNavbarItems = [
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
const navbarItems = {
  student: studentNavbarItems,
  teacher: teacherNavbarItems,
  admin: adminNavbarItems,
  parent: parentNavbarItems,
};

export { navbarItems };
