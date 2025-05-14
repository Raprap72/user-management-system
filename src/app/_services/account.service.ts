import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<User | null>;
    public account: Observable<User | null>;

    constructor(private http: HttpClient) {
        this.accountSubject = new BehaviorSubject<User | null>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): User | null {
        return this.accountSubject.value;
    }
}
