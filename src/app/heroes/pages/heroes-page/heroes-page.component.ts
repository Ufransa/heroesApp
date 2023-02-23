import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { HeroesService } from '../../services/heroes.service';
import { Heroe } from '../../interfaces/heroe.interface';

@Component({
  selector: 'app-heroes-page',
  templateUrl: './heroes-page.component.html'
})
export class HeroesPageComponent implements OnInit {

  public hero?: Heroe

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }
  
  
  
  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroById( id )),
      ).subscribe( heroe => { 
          if ( !heroe ) return this.router.navigate([ '/heroes/list' ])

          this.hero = heroe
          return

      })
  }

  goBack(): void {
    this.router.navigateByUrl('heroes/list')
  }

}
