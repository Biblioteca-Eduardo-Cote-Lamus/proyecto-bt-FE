import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-preselection',
    standalone: true,
    imports: [                
        TabMenuModule,
        RouterOutlet,
        NgIf,
    ],
    template: `
      <main class="">

      <div class="card">
        <p-tabMenu [model]="items" [activeItem]="activeItem" (activeItemChange)="onActiveItemChange($event)"  >
          <ng-template pTemplate="item" let-item>
              <ng-container *ngIf="item.route; ">
                  <a [routerLink]="item.route" class="p-menuitem-link">
                      <span [class]="item.icon"></span>
                      <span class="ml-2">
                          {{ item.label }}
                      </span>
                  </a>
              </ng-container>
              <ng-template #elseBlock>
                  <a [href]="item.url" class="p-menuitem-link">
                      <span [class]="item.icon"></span>
                      <span class="ml-2">
                          {{ item.label }}
                      </span>
                  </a>
              </ng-template>
            </ng-template>
        </p-tabMenu>
      </div>

        <section >
          <router-outlet />
        </section>

      </main>
    `,
    styles: `
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreselectionComponent {
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
  router = inject(Router);

  ngOnInit() {
    this.items = [
        { label: 'Listado por ubicación', icon: 'pi pi-fw pi-home', route: ['./'],  },
        { label: 'Notificar becas', icon: 'pi pi-fw pi-envelope', route: ['./notificar'],  },
    ];
    this.activeItem = this.items[1]
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
}
 }
