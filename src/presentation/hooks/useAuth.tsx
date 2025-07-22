import { create } from "zustand";
import { User } from "../../domain/entities/user.entity";
import { StorageAdapter } from "../../data/sources/local/storage-adapter";
import { BackendUseCaseImpl } from "../../domain/useCase/implements/backendUseCaseImpl";
import { StatusUser } from "../../data/sources/remote/interfaces/backend.interface";

export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export interface AuthState{
    status: AuthStatus;    
    token?: string;
    user?: User;

    login: (email: string, password: string) => Promise<any>;
    checkStatus: () => Promise<any>;
    logout: () => Promise<any>;
}


export const useAuth = create<AuthState>()((set,get) => ({
    status: 'checking',
    token: undefined,
    user: undefined,

    login: async (email: string, password: string) => {

        const { LoginUserUseCase } = new BackendUseCaseImpl();
        const token = await LoginUserUseCase(email, password);
        if(!token){
            set({
                status: 'unauthenticated',
                token: undefined,
                user: undefined           
            });
        }
        await StorageAdapter.setItem('token', token);
        await StorageAdapter.setItem('email', email);
        return token;
    },

    checkStatus: async () =>{

        const { CheckStatusUseCase } = new BackendUseCaseImpl();

        const token = await StorageAdapter.getItem('token') ?? '';
        const email = await StorageAdapter.getItem('email') ?? '';

        if(token == '' || email == ''){
            set({
                status: 'unauthenticated',
                token: undefined,
                user: undefined           
            });
           return null;
        }

        const resp: StatusUser = await CheckStatusUseCase(email, token);
        if(!resp) {
            await StorageAdapter.removeItem('token');
            await StorageAdapter.removeItem('email');
            set({
                status: 'unauthenticated',
                token: undefined,
                user: undefined           
            });
            return resp;
        }

        set({
            status: 'authenticated',
            token: undefined,
            user: undefined           
        });
        return resp;
    },

    logout: async () =>  {
        await StorageAdapter.removeItem('token');
        await StorageAdapter.removeItem('email');
        set({
            status: 'unauthenticated',
            token: undefined,
            user: undefined           
        });
    }
}));
