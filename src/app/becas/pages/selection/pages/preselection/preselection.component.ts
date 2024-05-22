import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-preselection',
    standalone: true,
    imports: [                
        TabMenuModule,
        RouterOutlet
    ],
    template: `
      <main class="">

      <div class="card">
        <p-tabMenu [model]="items" [activeItem]="activeItem" ></p-tabMenu>
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

  ngOnInit() {
    this.items = [
        { label: 'Listado por ubicación', icon: 'pi pi-fw pi-home', routerLink: ['./'] },
    ];
    this.activeItem = this.items[0]
  }
 }
