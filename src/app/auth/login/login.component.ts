import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        PasswordModule,
        CheckboxModule,
        ButtonModule,
        RouterLink,
        ReactiveFormsModule,
    ],
})
export class LoginComponent {
    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    constructor(
        private fb: FormBuilder, 
        private loginServie: LoginService,
        private router: Router
    ) {}

    public doLogin() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.form.markAsDirty();
            return;
        };
        this.loginServie.login({
            email: this.form.get('email').value,
            password: this.form.get('password').value,
        
        }).subscribe({
            next: (response:any) => {
                localStorage.setItem('token', JSON.stringify(response.data.token));
                this.router.navigate(['/backoffice']);
            },
            error: (error) => {console.error(error)}
        })
    }

    public validateInput(input: string) {
        return this.form.get(input).invalid && this.form.get(input).touched;
    }
}
