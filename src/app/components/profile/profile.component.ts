import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userProfile: any;

  constructor(private profileService: ProfileService) {
  }

  ngOnInit() {
    const userId = '52'; // Replace with the actual user ID
    this.profileService.getProfileInfo(userId).subscribe(
      data => {
        this.userProfile = data;
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
}
