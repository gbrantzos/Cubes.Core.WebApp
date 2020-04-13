import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'cubes-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  @Input() isHidden = false;

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
