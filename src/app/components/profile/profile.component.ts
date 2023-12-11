import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileService} from "../../services/profile.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  username: string | null | undefined;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
      if (!this.username) {
        this.router.navigate(['/']); // Replace '/' with your main page route
        return;
      }
      this.userService.getPublicUserData(this.username).subscribe(
        (userData) => {

        },
        (error) => {

        }
      );

    });
  }
}
