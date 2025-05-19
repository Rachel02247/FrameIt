import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-side-bar',
  imports: [MatIcon],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {

  constructor(private authService: AuthService) { }

  userName: string | null = null;

  ngOnInit = () => {
    if (this.authService.isLoggedIn) {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.name;
      }

      return null;
    }


  }
}
