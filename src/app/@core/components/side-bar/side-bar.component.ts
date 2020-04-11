import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cubes-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  public navItems = [
    {
      label: 'Scheduler',
      icon: 'fa-calendar',
      link: '/scheduler'
    }, {
      label: 'Data Access',
      icon: 'fa-database',
      link: '/data'
    }, {
      label: 'Settings',
      icon: 'fa-cogs',
      link: '/settings'
    }, {
      label: 'About',
      icon: 'fa-question-circle',
      link: '/about'
    },
  ];

  constructor() { }
  ngOnInit(): void { }
}
