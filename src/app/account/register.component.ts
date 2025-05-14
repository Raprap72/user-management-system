import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';
import { Role } from '../_models';

interface RegisterForm {
    title: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    acceptTerms: FormControl<boolean>;
}

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form: FormGroup<RegisterForm>;
    loading = false;
    submitted = false;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly accountService: AccountService,
        private readonly alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group<RegisterForm>({
            title: new FormControl('', { validators: [Validators.required], nonNullable: true }),
            firstName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
            lastName: new FormControl('', { validators: [Validators.required], nonNullable: true }),
            email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true }),
            password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true }),
            confirmPassword: new FormControl('', { validators: [Validators.required], nonNullable: true }),
            acceptTerms: new FormControl(false, { validators: [Validators.requiredTrue], nonNullable: true })
        }, {
            validators: this.mustMatch('password', 'confirmPassword')
        });
    }

    private mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const control = formGroup.get(controlName);
            const matchingControl = formGroup.get(matchingControlName);

            if (!control || !matchingControl) {
                return null;
            }

            if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
                return null;
            }

            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
                return { mustMatch: true };
            } else {
                matchingControl.setErrors(null);
                return null;
            }
        };
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
    
        // reset alerts on submit
        this.alertService.clear();
    
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
    
        this.loading = true;
        const { title, firstName, lastName, email, password } = this.form.value as {
            title: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
        };
        const params = {
            title,
            firstName,
            lastName,
            email,
            password,
            role: Role.User,
            isVerified: false
        };
        this.accountService.register(params)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}