import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BecaTrabajoByUbication } from 'src/app/shared/api';

@Component({
    selector: 'app-escarapela',
    standalone: true,
    imports: [
    ],
    template: `
    
        <div class="relative w-full bg-white border-round shadow-1">
            <!-- background de la card -->
            <div class="relative bg-photo h-10rem w-full bg-cover overflow-hidden border-round-top">
            </div>
            <!-- imagen del beca -->
            <div class="absolute photo ">
                <img [src]="beca.photo" [alt]="'imagen de perfil de '+beca.fullName" class="w-full h-full">
            </div>
            
            <!-- contenedor de los textos -->
            <div class=" card-text mx-auto ">
                <div class="w-7 mx-auto text-center mb-3">
                    <h3 class="text-xl text-center mb-2">{{beca.fullName}}</h3>
                    <p class="mb-1 font-bold"> {{beca.code}} </p>
                    <p class="mb-1 text-normal">{{beca.career}}</p>
                </div>
                <!-- estado -->
                <div class="text-center p-3 bg-orange-400 border-round-bottom text-white font-bold">
                    <span>{{beca.status}}</span>
                </div>
            </div>

        </div>
    
    `,
    styles: `

        .bg-photo{
            background: url("https://images.unsplash.com/photo-1511207538754-e8555f2bc187?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=88672068827eaeeab540f584b883cc66&auto=format&fit=crop&w=1164&q=80") no-repeat;
        }
        .photo{
            top: 90px;
            left: 50%;
            transform: translateX(-50%);
            height: 120px;
            width: 120px;
            margin: 0 auto;
            border-radius: 50%;
            border: 5px solid #fff;
            background-size: contain;
            overflow: hidden;
        }

        .card-text{
            margin-top: 80px;
        }
    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EscarapelaComponent {
    @Input({required: true}) beca: BecaTrabajoByUbication

}
