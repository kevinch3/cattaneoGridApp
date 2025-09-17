import { Routes } from '@angular/router';
import { EpisodesGridComponent } from './components/episodes-grid/episodes-grid.component'

export const routes: Routes = [
    {
        path: '',
        component: EpisodesGridComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
