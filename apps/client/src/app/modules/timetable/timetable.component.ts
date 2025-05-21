import { Component, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface ClassEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  color: EventColor;
  description?: string;
  location?: string;
  professor?: string;
  draggable: boolean;
  resizable: {
    beforeStart: boolean;
    afterEnd: boolean;
  };
}

interface EventColor {
  primary: string;
  secondary: string;
}

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ColorPickerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss',
})
export class TimetableComponent implements OnInit {
  colorOptions = [
    { primary: '#1e88e5', secondary: '#d1e8ff' }, 
    { primary: '#43a047', secondary: '#e0f2e9' }, 
    { primary: '#e53935', secondary: '#ffd1d1' }, 
    { primary: '#fb8c00', secondary: '#ffeed9' }, 
    { primary: '#8e24aa', secondary: '#ead6f3' }  
  ];
  
  events: ClassEvent[] = [];
  viewDate: Date = new Date();
  displayEventDialog = false;
  selectedEvent: ClassEvent | null = null;
  newEvent: ClassEvent = this.createEmptyEvent();
  isNewEvent = true;
  
  timeSlots = Array.from({ length: 33 }, (_, i) => {
    const hour = Math.floor((i + 32) / 4); 
    const minute = ((i + 32) % 4) * 15;
    return `${hour < 10 ? '0' + hour : hour}:${minute === 0 ? '00' : minute}`;
  });
  
  weekDays = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  Math = Math;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    const mockEvents: ClassEvent[] = [
      {
        id: 1,
        title: 'Mathematics',
        start: this.setDateAndTime(1, 10, 0),
        end: this.setDateAndTime(1, 10, 45),
        color: this.colorOptions[0],
        description: 'Advanced Calculus',
        location: 'Room 101',
        professor: 'Dr. Smith',
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      },
      {
        id: 2,
        title: 'Physics',
        start: this.setDateAndTime(2, 14, 15), 
        end: this.setDateAndTime(2, 15, 0),    
        color: this.colorOptions[1],
        description: 'Quantum Mechanics',
        location: 'Room 203',
        professor: 'Dr. Johnson',
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      },
      {
        id: 3,
        title: 'Computer Science',
        start: this.setDateAndTime(3, 9, 0),
        end: this.setDateAndTime(3, 9, 45), 
        color: this.colorOptions[2],
        description: 'Algorithms and Data Structures',
        location: 'Lab 305',
        professor: 'Prof. Williams',
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      },
      {
        id: 4,
        title: 'Statistics',
        start: this.setDateAndTime(4, 13, 30),
        end: this.setDateAndTime(4, 14, 15),
        color: this.colorOptions[3],
        description: 'Probability Theory',
        location: 'Room 102',
        professor: 'Dr. Brown',
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      },
      {
        id: 5,
        title: 'History',
        start: this.setDateAndTime(5, 11, 15),
        end: this.setDateAndTime(5, 12, 0),
        color: this.colorOptions[4],
        description: 'World War II',
        location: 'Room 405',
        professor: 'Prof. Davis',
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
    
    this.events = mockEvents;
  }

  private setDateAndTime(day: number, hour: number, minute = 0): Date {
    const date = new Date();
    const currentDay = date.getDay();
    const daysToAdd = day - (currentDay === 0 ? 7 : currentDay);
    
    date.setDate(date.getDate() + daysToAdd);
    date.setHours(hour, minute, 0, 0);
    
    return date;
  }

  private createEmptyEvent(): ClassEvent {
    return {
      id: 0,
      title: '',
      start: new Date(),
      end: new Date(),
      color: this.colorOptions[0],
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    };
  }

  openNewEventDialog(day: number, timeSlotIndex: number): void {
    this.isNewEvent = true;
    this.newEvent = this.createEmptyEvent();
    
    const hour = Math.floor((timeSlotIndex + 32) / 4);
    const minute = ((timeSlotIndex + 32) % 4) * 15;
    
    this.newEvent.start = this.setDateAndTime(day, hour, minute);
    
    const endDate = new Date(this.newEvent.start);
    endDate.setMinutes(endDate.getMinutes() + 45);
    this.newEvent.end = endDate;
    
    this.selectedEvent = this.newEvent;
    this.displayEventDialog = true;
  }

  openEditEventDialog(event: ClassEvent): void {
    this.isNewEvent = false;
    this.selectedEvent = { ...event };
    this.displayEventDialog = true;
  }

  closeEventDialog(): void {
    this.displayEventDialog = false;
    this.selectedEvent = null;
  }

  saveEvent(): void {
    if (!this.selectedEvent) return;
    
    if (!this.selectedEvent.title) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Title is required'
      });
      return;
    }

    if (this.isNewEvent) {
      this.selectedEvent.id = this.events.length ? Math.max(...this.events.map(e => e.id)) + 1 : 1;
      this.events.push({ ...this.selectedEvent });
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Class added to schedule'
      });
    } else {
      const index = this.events.findIndex(e => e.id === this.selectedEvent?.id);
      if (index !== -1) {
        this.events[index] = { ...this.selectedEvent };
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Class updated successfully'
        });
      }
    }
    
    this.closeEventDialog();
  }

  deleteEvent(): void {
    if (!this.selectedEvent) return;
    
    const index = this.events.findIndex(e => e.id === this.selectedEvent?.id);
    if (index !== -1) {
      this.events.splice(index, 1);
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Class removed from schedule'
      });
    }
    
    this.closeEventDialog();
  }

  getDayEvents(day: number): ClassEvent[] {
    return this.events.filter(event => {
      return event.start.getDay() === (day === 7 ? 0 : day);
    });
  }

  getEventsByHour(day: number, timeSlotIndex: number): ClassEvent[] {
    const quarterHours = timeSlotIndex + 32;
    
    return this.events.filter(event => {
      const eventDay = event.start.getDay();
      const eventStartQuarters = event.start.getHours() * 4 + Math.floor(event.start.getMinutes() / 15);
      const eventEndQuarters = event.end.getHours() * 4 + Math.ceil(event.end.getMinutes() / 15);
      
      return (eventDay === (day === 7 ? 0 : day)) && 
             (eventStartQuarters <= quarterHours && eventEndQuarters > quarterHours);
    });
  }
  
  getEventStyle(event: ClassEvent): { backgroundColor: string; borderLeft: string } {
    return {
      backgroundColor: event.color.secondary,
      borderLeft: `4px solid ${event.color.primary}`,
    };
  }
  
  isCurrentHour(timeSlotIndex: number): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const slotHour = Math.floor((timeSlotIndex + 32) / 4);
    const slotMinute = ((timeSlotIndex + 32) % 4) * 15;
    
    return currentHour === slotHour && 
           currentMinute >= slotMinute && 
           currentMinute < slotMinute + 15;
  }
  
  getCellPositionClass(day: number, timeSlotIndex: number): string {
    return `day-${day.toString()} hour-${timeSlotIndex.toString()}`;
  }
}
