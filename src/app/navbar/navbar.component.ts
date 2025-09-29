import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,
    RouterLink,
    MatButtonModule,
    MatMenuModule,
    MatIconModule, MatToolbarModule, RouterLinkActive, MatSidenavModule, MatListModule,],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

}
