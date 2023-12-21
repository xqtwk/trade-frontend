import {Component, OnInit} from '@angular/core';
import {GameDetailsDto} from "../../../models/catalog/game-details-dto";
import {AdminService} from "../../../services/admin/admin.service";
import {GameCreationDto} from "../../../models/catalog/game-creation-dto";
import {CatalogService} from "../../../services/catalog/catalog.service";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
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


  openUpdateForm(game: GameDetailsDto): void {
    this.isUpdating = true;
    this.updatingGameId = game.id;
    this.updateGameForm.setValue({name: game.name});
  }
  closeUpdateForm(): void {
    this.isUpdating = false;
    this.updatingGameId = null;
  }

  onUpdateSubmit(): void {
    if (this.updateGameForm.valid && this.updatingGameId !== null) {
      this.adminService.updateGame(this.updatingGameId, this.updateGameForm.value)
        .subscribe(updatedGame => {
          const index = this.games.findIndex(g => g.id === updatedGame.id);
          this.games[index] = updatedGame;
          this.closeUpdateForm();
          // Handle success
        }, error => {
          console.error('Error updating game:', error);
          // Handle error
        });
    }
  }
  loadGames(): void {
    console.log("fires")
    this.catalogService.getAllGames().subscribe({
      next: (data) =>{ this.games = data; console.log("no games?")},
      error: (error) => console.error("erroro")
    });
  }

  onSubmit(): void {
    if (this.gameForm.valid) {
      const newGameDto: GameCreationDto = this.gameForm.value;
      this.createGame(newGameDto).subscribe(
        (createdGame: GameDetailsDto) => {
          console.log('Game created successfully', createdGame);
          // Handle the response here, like updating the UI or redirecting
        },
        (error) => {
          console.error('Error creating game:', error);
          // Handle the error here
        }
      );
    } else {
      console.log('Form is not valid');
      // Handle form validation errors
    }
  }


  private createGame(dto: GameCreationDto): Observable<GameDetailsDto> {
    return this.adminService.createGame(dto);
  }
  deleteGame(id: number): void {
    if (confirm('Are you sure you want to delete this game?')) {
      this.adminService.deleteGame(id).subscribe(() => {
        this.games = this.games.filter(game => game.id !== id);
        console.log('Game deleted successfully');
        // Optionally, add more UI feedback here
      }, error => {
        console.error('Error deleting the game:', error);
        // Handle errors here
      });
    }
  }
}
