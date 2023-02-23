import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Heroe } from '../interfaces/heroe.interface';
import { environments } from 'src/environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

    private baseUrl: string = environments.baseUrl

    constructor(private http: HttpClient) { }


    getHeroes(): Observable<Heroe[]> {
        return this.http.get<Heroe[]>(`${ this.baseUrl }/heroes`)
    }

    getHeroById( id: string ): Observable<Heroe | undefined> {
        return this.http.get<Heroe>(`${ this.baseUrl }/heroes/${ id }`)
            .pipe(
                catchError(error =>  of(undefined) )
            )
    }

    getSuggestions( query: string ): Observable<Heroe[]> {
        return this.http.get<Heroe[]>(`${ this.baseUrl }/heroes?q=${query}&_limit=6`)
    }

    //TODO: CRUD -> Petición Post 1
    addHero( hero: Heroe ): Observable<Heroe> {
        return this.http.post<Heroe>(`${ this.baseUrl }/heroes/`, hero)
    }

    //TODO: CRUD -> Petición Patch 1
    updateHero( hero: Heroe ): Observable<Heroe> {
        if ( !hero.id ) throw Error(' Hero id is required ')
        return this.http.patch<Heroe>(`${ this.baseUrl }/heroes/${ hero.id }`, hero)
    }

    //TODO: CRUD -> Petición Patch 1
    deleteHeroById( id: string ): Observable<boolean> {

        return this.http.delete(`${ this.baseUrl }/heroes/${ id }`)
            .pipe(
                catchError( err => of(false) ),
                map( resp => true )
            )
    }
    
}