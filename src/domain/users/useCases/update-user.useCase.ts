import { Injectable } from "@angular/core"; 
import { Observable } from "rxjs"; 
import { UserRepository } from "../reposirories/user.repository"; 
import { UserModel } from "../models/user.model"; 

@Injectable({
    providedIn: 'root'  
})
export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository) {}  

   
    execute(params: UserModel): Observable<UserModel> {
        return this.userRepository.updateUser(params); 
    }
}
