import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';
import { AppMenuitemComponent } from '../../app.menuitem.component';
import { NgFor, NgIf } from '@angular/common';
import { ShowForRolDirective } from './directives/showForRol.directive';

// Interface example 
/*
   type items = {
        label: string;
        items: items[];
        icon: string;
        routerLink: string[];
   }
*/


@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [NgFor, NgIf, AppMenuitemComponent, ShowForRolDirective]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ],
                rol: ['Administrador']
            },
            {
                label: 'Becastrabajo',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Becas',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Seleccion',
                                icon: 'pi pi-fw pi-plus',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Horario',
                                icon: 'pi pi-fw pi-calendar',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Listado',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/auth/access']
                            },
                            {
                                label: 'Documentos',
                                icon: 'pi pi-fw pi-file',
                                routerLink: ['/auth/notfound']
                            }
                        ]
                    }
                ],
                rol: ['Administrador']
            },
            {
                label: 'Biblioteca',
                items: [
                    {
                        label: 'Ubicaciones',
                        icon: 'pi pi-fw pi-map-marker',
                        items: [
                            {
                                label: 'Listado',
                                icon: 'pi pi-fw pi-list',
                            },
                            {
                                label: 'Encargados',
                                icon: 'pi pi-fw pi-users'
                            }
                        ]
                    }
                ],
                rol: ['Administrador']
            },
            // ========================================= Items to Becastrabajo rol =========================================
            {
                label: 'Inicio',
                items: [
                    { label: 'Horario', icon: 'pi pi-fw pi-clock', routerLink: ['/'] },
                    { label: 'Asistencia', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Historial', icon: 'pi pi-fw pi-book', routerLink: ['/'] }
                ],
                rol: ['Beca']
            },
            // ========================================= Items to Encargado rol =========================================
            { 
                label: 'Inicio',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Becas', icon: 'pi pi-fw pi-briefcase', routerLink: ['/'] },
                    { label: 'Biblioteca', icon: 'pi pi-fw pi-book', routerLink: ['/'] }
                ],
                rol: ['Encargado']
            }
        ];
    }
}
