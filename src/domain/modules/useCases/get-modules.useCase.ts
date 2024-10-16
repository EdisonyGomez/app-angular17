import { Injectable } from "@angular/core";
import { ModuleRepository } from "../repositories/module.repository";
import { Observable } from "rxjs";
import { Module } from "../models/module.model";



@Injectable({
    providedIn: 'root'
})

export class GetModulesUseCase{

    constructor(private moduleRepository: ModuleRepository){}


    execute(): Observable<Module[]>{
        return this.moduleRepository.getModules();
    }
}