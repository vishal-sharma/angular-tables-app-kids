import { Component, inject, effect, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import confetti from 'canvas-confetti';
import { QuizService } from '../../services/quiz.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  private router  = inject(Router);
  readonly quiz   = inject(QuizService);
  private sound   = inject(SoundService);

  readonly answers  = this.quiz.answers;
  readonly score    = this.quiz.score;
  readonly total    = computed(() => this.quiz.questions().length);
  readonly isGreat  = computed(() => this.score() >= 8);
  readonly isGood   = computed(() => this.score() >= 5 && this.score() < 8);
  readonly grade    = computed(() => {
    const s = this.score();
    if (s === 10) return { label: '🏆 PERFECT!', color: 'gold' };
    if (s >= 8)   return { label: '🌟 Amazing!', color: 'star' };
    if (s >= 6)   return { label: '😊 Good job!', color: 'good' };
    if (s >= 4)   return { label: '💪 Keep going!', color: 'try' };
    return        { label: '📚 Keep practising!', color: 'practice' };
  });

  readonly showReview = signal(false);

  constructor() {
    // Redirect if no results yet
    effect(() => {
      if (this.quiz.answers().length === 0) {
        this.router.navigate(['/']);
      }
    });

    // Fire celebration after brief delay
    effect(() => {
      if (this.isGreat() && this.quiz.answers().length > 0) {
        setTimeout(() => {
          this.sound.playCelebration();
          this.fireConfetti();
        }, 400);
      }
    });
  }

  private fireConfetti(): void {
    const colors = ['#7c3aed', '#ec4899', '#3b82f6', '#06b6d4', '#a78bfa', '#f9a8d4'];
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.5 },
      colors
    });
    setTimeout(() => confetti({ particleCount: 80, angle: 60,  spread: 55, origin: { x: 0 }, colors }), 300);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors }), 500);
  }

  playAgain(): void {
    this.quiz.generateQuestions();
    this.router.navigate(['/quiz']);
  }

  goHome(): void {
    this.quiz.reset();
    this.router.navigate(['/']);
  }

  toggleReview(): void {
    this.showReview.update(v => !v);
  }
}
