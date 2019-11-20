import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { AuthService, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    socialUser: SocialUser;
    loggedIn: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private authService: AuthService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.authService.authState.subscribe((user) => {
            this.socialUser = user;
            this.loggedIn = (user != null);
            //this.socialUser.firstName = 'tan';
            console.log(this.socialUser);
            if(this.socialUser != null){
                this.socialUser.firstName = 'tan';
                this.authenticationService.login(this.socialUser.firstName, this.socialUser.firstName)
                .pipe(first())
                .subscribe(
                    data => {
                        this.router.navigate([this.returnUrl]);                        
                    },
                    error => {
                        this.error = error;
                        this.loading = false;
                    });
            }
            
        });

        // get return url from route parameters or default to '/'
        


    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    signInWithFB(): void {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
