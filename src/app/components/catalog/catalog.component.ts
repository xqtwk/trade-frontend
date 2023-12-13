import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameDetailsDto} from "../../models/catalog/game-details-dto";
import {AdminService} from "../../services/admin/admin.service";
import {CatalogService} from "../../services/catalog/catalog.service";
import {GameCreationDto} from "../../models/catalog/game-creation-dto";
import {Observable} from "rxjs";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  games: GameDetailsDto[] = [];
  gameForm: FormGroup;
  updateGameForm: FormGroup;
  isUpdating: boolean = false;
  updatingGameId: number | null = null;
  constructor(private adminService: AdminService,
              private catalogService: CatalogService,
              private fb: FormBuilder) {
    this.gameForm = this.fb.group({
      name: ['', Validators.required], // Assuming 'name' is a required field
      // Add other form controls here as needed
    });
    this.updateGameForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    console.log("fires")
    this.catalogService.getAllGames().subscribe({
      next: (data) =>{ this.games = data; console.log("no games?")},
      error: (error) => console.error("erroro")
    });
  }


}
