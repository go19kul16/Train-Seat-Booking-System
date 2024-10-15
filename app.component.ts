import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  totalSeats: number = 80; // Total seats
  seatsPerRow: number = 7; // Number of seats in each row (except the last)
  lastRowSeats: number = 3; // Seats in the last row

  rows: any[][] = []; // Rows representing the seat layout

  constructor() {
    this.initializeSeats(); // Initialize seat layout on load
  }

  // Initialize all seats to 'not booked'
  initializeSeats() {
    for (let i = 0; i < 11; i++) {
      const seatsInThisRow = i === 10 ? this.lastRowSeats : this.seatsPerRow;
      const row = Array(seatsInThisRow).fill({ booked: false }); // Set all seats as available
      this.rows.push(row);
    }
  }

  // Method to handle booking logic
  bookSeats(seatsToBook: number) {
    if (seatsToBook < 1 || seatsToBook > 7) {
      alert('You can only book between 1 to 7 seats at once.');
      return;
    }

    let bookedSeats: string[] = [];
    let seatsLeft = seatsToBook;

    // 1. Try to book all seats from the same row if possible
    for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
      const availableSeats = this.rows[rowIndex].filter(seat => !seat.booked);

      if (availableSeats.length >= seatsLeft) {
        // Book all required seats from this row
        this.bookFromRow(rowIndex, seatsLeft, bookedSeats);
        seatsLeft = 0;
        break;
      }
    }

    // 2. If not enough seats in a single row, book across multiple rows
    if (seatsLeft > 0) {
      for (let rowIndex = 0; rowIndex < this.rows.length && seatsLeft > 0; rowIndex++) {
        const availableSeats = this.rows[rowIndex].filter(seat => !seat.booked);
        const seatsToTake = Math.min(availableSeats.length, seatsLeft);

        if (seatsToTake > 0) {
          this.bookFromRow(rowIndex, seatsToTake, bookedSeats);
          seatsLeft -= seatsToTake;
        }
      }
    }

    // Display result to the user
    if (bookedSeats.length > 0) {
      alert(`Seats booked: ${bookedSeats.join(', ')}`);
    } else {
      alert('Not enough seats available.');
    }
  }

  // Helper method to book seats from a specific row
  private bookFromRow(rowIndex: number, count: number, bookedSeats: string[]) {
    let booked = 0;
    for (let seatIndex = 0; seatIndex < this.rows[rowIndex].length; seatIndex++) {
      if (!this.rows[rowIndex][seatIndex].booked && booked < count) {
        this.rows[rowIndex][seatIndex] = { booked: true }; // Mark seat as booked
        bookedSeats.push(\`Row \${rowIndex + 1} Seat \${seatIndex + 1}\`);
        booked++;
      }
    }
  }
}
