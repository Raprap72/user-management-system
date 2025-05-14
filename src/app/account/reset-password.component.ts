import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../_services';

enum TokenStatus {
    Validating,
    Valid,
    Invalid
}

interface ResetPasswordForm {
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
}

@Component({ templateUrl: 'reset-password.component.html' })
export class ResetPasswordComponent implements OnInit {
    TokenStatus = TokenStatus;
    tokenStatus = TokenStatus.Validating;
    token: string | null = null;
    form: FormGroup<ResetPasswordForm>;
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
        this.form = this.formBuilder.group<ResetPasswordForm>({
            password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true }),
            confirmPassword: new FormControl('', { validators: [Validators.required], nonNullable: true })
        }, {
            validators: this.mustMatch('password', 'confirmPassword')
        });
      
        const token = this.route.snapshot.queryParams['token'];
      
        // remove token from url to prevent http referer leakage
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
      
        this.accountService.validateResetToken(token)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.token = token;
                    this.tokenStatus = TokenStatus.Valid;
                },
                error: () => {
                    this.tokenStatus = TokenStatus.Invalid;
                }
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
        if (this.form.invalid || !this.token) {
            return;
        }
      
        this.loading = true;
        this.accountService.resetPassword(this.token, this.f.password.value, this.f.confirmPassword.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Password reset successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: (error: string) => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}