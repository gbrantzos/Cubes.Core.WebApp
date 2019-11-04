import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  // Helpers
  private isNumber(value: string | number): boolean {
    return ((value != null) && !isNaN(Number(value.toString())));
 }

 private isPositive(value: string | number): boolean {
   return this.isNumber(value) && Number(value) > 0;
 }

  // Make calendars start on Monday!
  getFirstDayOfWeek(): number {
    return 1;
  }

  // Support other date format
  format(date: Date, format: string): string {
    const year:  number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day:   number = date.getDate();

    let toReturn = '';
    toReturn = `${day}/${month}/${year}`;

    return toReturn;
  }

  parse(value: any): Date | null {
    const today = new Date();
    let year:  number = today.getFullYear();
    let month: number = today.getMonth();
    let day:   number = today.getDate();

    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length >= 1 && this.isPositive(dateParts[0])) { day   = Number(dateParts[0]); }
      if (dateParts.length >= 2 && this.isPositive(dateParts[1])) { month = Number(dateParts[1]) - 1; }
      if (dateParts.length >= 3 && this.isPositive(dateParts[2])) { year  = Number(dateParts[2]); }
    }
    return new Date(year, month, day);
  }
}
