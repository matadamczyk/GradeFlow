export enum WorkDay {
  MON = 'MON',
  TUE = 'TUE', 
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI'
}

export const WorkDayLabels: Record<WorkDay, string> = {
  [WorkDay.MON]: 'Poniedziałek',
  [WorkDay.TUE]: 'Wtorek',
  [WorkDay.WED]: 'Środa',
  [WorkDay.THU]: 'Czwartek',
  [WorkDay.FRI]: 'Piątek'
};

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  ADMIN = 'ADMIN'
} 