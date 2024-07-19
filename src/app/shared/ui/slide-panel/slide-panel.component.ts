import { Component,EventEmitter,Input,Output } from '@angular/core';
import {trigger,state,style,animate,transition} from '@angular/animations'
@Component({
  selector: 'app-slide-panel',
  standalone: true,
  imports: [],
  templateUrl: './slide-panel.component.html',
  styleUrl: './slide-panel.component.css',
  animations: [
    trigger('fadeSlidePanelInRight', [
      state('void', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('*', style({ transform: 'translateX(0)', opacity: 1 })),
      transition(':enter', [
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
  ],
})
export class SlidePanelComponent {
  @Input() isOpen=false;
  @Input() headerText="Slide Panel Header"
  @Output() OnClose = new EventEmitter();

  OnClosePanel(){
    this.OnClose.emit(false);
  }
}
