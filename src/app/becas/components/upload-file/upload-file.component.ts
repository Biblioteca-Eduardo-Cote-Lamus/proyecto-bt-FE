import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-upload-file',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `
        <!-- general container -->
        <div class=" w-full min-h-full flex align-items-center justify-content-center relative ">
            <div class="w-full absolute">
                <div class="relative mx-auto grid min-h-full " style="grid-template-columns: repeat(1, minmax(0,1fr)); place-content: center;">
                    <!-- hero -->
                    <div class="relative ">
                        <section class="drop-hero__landing"> 
                            <!-- drop hero media -->
                            <div class="drop-hero__media">
                                <!-- dragzone container -->
                                <div class="dropzone-container">
                                    <!-- Dropzone container -->
                                    <div class="dropzone bg-black-alpha-90 border-circle grid h-15rem w-15rem  m-0  text-white" style="place-content: center; transition: transform .3s ease-out">
                                        <div class="text-center" style="transition: opacity .2 ease;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="69" height="51" viewBox="0 0 69 51" class="dropzone-content__image tw-mx-auto tw-mb-2"><defs><linearGradient id="icon-drop-folder_svg__a" x1="34.5" x2="34.5" y1="48.67" y2="0.19" gradientUnits="userSpaceOnUse"><stop offset="0.67" stop-color="#112caf"></stop><stop offset="0.77" stop-color="#2250f4"></stop></linearGradient></defs><path fill="url(#icon-drop-folder_svg__a)" d="M62.93 6.8H37.11L29.84.19H6.07a3.53 3.53 0 0 0-3.53 3.53v41.42a3.53 3.53 0 0 0 3.53 3.53h56.86a3.53 3.53 0 0 0 3.53-3.53V10.33a3.53 3.53 0 0 0-3.53-3.53"></path><path fill="#ffdd73" d="M6.83 12.56h53.01V35.1H6.83z"></path><path fill="#fff6d0" d="M10.27 9.83h53.01v22.54H10.27z"></path><path fill="#a6bffd" d="M63.17 50.81H5.83a3.46 3.46 0 0 1-3.5-3.06l-2.07-29a3.25 3.25 0 0 1 3.29-3.51h61.9a3.25 3.25 0 0 1 3.29 3.51l-2.07 29a3.46 3.46 0 0 1-3.5 3.06"></path></svg>
                                            <p>Arrasta y suelta el reporte en excel</p>
                                            <p>o busca el documento</p>
                                        </div>
                                    </div>
                                    <span class="drop-ring"></span>
                                    <span class="drop-ring"></span>
                                    <span class="drop-ring"></span>
                                </div>
                            </div>
                            <!-- Container text -->
                            <!-- <div> 
                                <h1> Suelta el reporte. </h1>
                                <p> Arrastra y suelta el reporte de becastrabajo para empezar el proceso. </p>
                            </div> -->
                        </section>
                    </div>    
                </div>
            </div>
        </div>
    `,
    styleUrl: './upload-file.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent { }
