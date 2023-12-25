import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogClose,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {
    if (data.message) {
      this.data.message = this.data.message.replace(/"/g, '');
    }
  }

}
