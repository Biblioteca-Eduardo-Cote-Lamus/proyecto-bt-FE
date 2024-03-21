import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { distinctUntilChanged, map, Subscription, tap } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';

// type allowedRoles = {
//   allowed: string[],
//   itemRol: string
// } 

@Directive({
  selector: '[showForRol]',
  standalone: true,
})
export class ShowForRolDirective {

  @Input({required: true, alias: 'showForRol'}) allowedRoles: string[] = [];

  rolSub$ = new Subscription();

  constructor(
    private templateRef: TemplateRef<any>, 
    private ViewContainerRef: ViewContainerRef,
    private authService: LoginService
  ){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.rolSub$ = this.authService.user$
    .pipe(
      map(user => {
        return user && this.allowedRoles.includes(user.rol.rol);
      }),
      distinctUntilChanged(),
      tap((hasRol) => {
        hasRol ? this.ViewContainerRef.createEmbeddedView(this.templateRef) : this.ViewContainerRef.clear();
      })
    )
    .subscribe();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.rolSub$.unsubscribe();   
  }
 
}
