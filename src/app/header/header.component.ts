import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // isCollapsed:boolean=false;
  // menu_icon :string ='bi bi-list';
  // openMenu(){
  //    this.isCollapsed =! this.isCollapsed ;
  //    this.menu_icon = this.isCollapsed ? 'bi bi-x' : 'bi bi-list';
  //  }
  //   closeMenu() {
  //    this.isCollapsed = false;
  //    this.menu_icon = 'bi bi-list';
  //  }
}
