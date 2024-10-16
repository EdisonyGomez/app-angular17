import { Injectable } from "@angular/core";
import { UserRepository } from "../reposirories/user.repository";
import { Observable } from "rxjs";
import { UserModel } from "../models/user.model";

@Injectable({
    providedIn:'root'
})

export class GetUserUseCase{
    constructor(private userRepository: UserRepository){

    }


    execute():Observable<UserModel[]>{
        return this.userRepository.getUser();
    }
}