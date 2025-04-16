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
];

const teacherNavbarItems = [
  {
    label: 'Start',
    icon: 'pi pi-home',
    routerLink: '/',
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
];

const navbarItems = {
  'student': studentNavbarItems,
  'teacher': teacherNavbarItems,
  'admin': adminNavbarItems,
  'parent': parentNavbarItems,
};

export { navbarItems };
