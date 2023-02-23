import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Publisher, Heroe } from '../../interfaces/heroe.interface';

import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-hero-page',
  templateUrl: './new-hero-page.component.html',
  styles: [
  ]
})
export class NewHeroPageComponent implements OnInit{

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    
    if ( !this.router.url.includes('edit')) return

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ) )
      ).subscribe( hero => {

        if ( !hero ) {
          return this.router.navigateByUrl('/')
        }

        this.heroForm.reset( hero )
        return
      })

  }

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  })

  public publishers = [
    { id: 'DC Comics', desc:'DC - Comics' },
    { id: 'Marvel Comics', desc:'Marvel - Comics' }
    
  ]

  get currentHero(): Heroe {
    const hero = this.heroForm.value as Heroe
    return hero
  }

  onSubmit():void {
    
    if ( this.heroForm.invalid ) return

    if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.superhero } actualizado!`  )
        })
    }

    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id ])
        this.showSnackbar(`${ hero.superhero } creado!`)
      })
    
  }

  onDeleteHero() {
    if ( !this.currentHero.id ) throw Error('Se requiere id')

    const dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: this.heroForm.value
    })

    dialogRef.afterClosed().subscribe(result => {
      if ( !result ) return

      this.heroesService.deleteHeroById( this.currentHero.id )
        .subscribe( wasDeleted => {
          if (wasDeleted )
            this.router.navigate(['/heroes/list'])
        })
    })

  }

  showSnackbar( message: string ){
    this.snackbar.open( message, 'cerrar', {
      duration: 2500,
    })
  }

}
