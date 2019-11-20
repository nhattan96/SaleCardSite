import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
import { User, Role } from 'src/app/_models';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.sass']
})
export class MainNavComponent  {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
}

get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.User;
}

logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}
}
