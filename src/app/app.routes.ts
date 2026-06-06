import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'quiz',
    loadComponent: () =>
      import('./components/quiz/quiz.component').then(m => m.QuizComponent)
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./components/results/results.component').then(m => m.ResultsComponent)
  },
  { path: '**', redirectTo: '' }
];
