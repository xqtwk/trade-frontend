import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../services/admin/admin.service";
import {GameComponent} from "./game/game.component";
import {AssetTypeComponent} from "./asset-type/asset-type.component";
import {AssetComponent} from "./asset/asset.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    GameComponent,
    AssetTypeComponent,
    AssetComponent,
    RouterLink
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  constructor(private adminService: AdminService) {}

  ngOnInit() {

  }
}
