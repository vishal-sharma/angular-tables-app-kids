import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  private router = inject(Router);
  private quizService = inject(QuizService);

  readonly bubbles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 20 + Math.random() * 60,
    left: Math.random() * 100,
    delay: Math.random() * 6,
    duration: 6 + Math.random() * 8,
    color: ['var(--purple-light)', 'var(--pink-light)', 'var(--blue-light)', 'var(--aqua-light)'][Math.floor(Math.random() * 4)]
  }));

  startPractice(): void {
    this.quizService.generateQuestions();
    this.router.navigate(['/quiz']);
  }
}
