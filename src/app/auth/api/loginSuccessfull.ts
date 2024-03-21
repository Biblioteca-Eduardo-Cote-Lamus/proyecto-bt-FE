import { User } from './User';

export interface LoginResponse { 
    data: {
        message: string;
        user: User
        token: {
            access: string;
            refresh: string;
        };
    }
} 