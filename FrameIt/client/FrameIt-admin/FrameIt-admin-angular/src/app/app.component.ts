import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from "../components/side-bar/side-bar.component";
import { FooterComponent } from "../components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrameIt-admin-angular';
}
