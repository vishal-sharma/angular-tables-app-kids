import {
  Component, inject, signal, computed, effect, ElementRef, viewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { SoundService } from '../../services/sound.service';
import { HintPanelComponent } from './hint-panel/hint-panel.component';

type HintState = 'answering' | 'hint-partial' | 'hint-full' | 'ready';

@Component({
  selector: 'app-quiz',
  imports: [FormsModule, HintPanelComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent {
  private router  = inject(Router);
  readonly quiz   = inject(QuizService);
  private sound   = inject(SoundService);

  readonly hintState  = signal<HintState>('answering');
  readonly userInput  = signal<string>('');
  readonly flashClass = signal<string>('');
  readonly hintUsed   = signal<boolean>(false);

  readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('answerInput');

  readonly question   = this.quiz.currentQuestion;
  readonly totalQ     = computed(() => this.quiz.questions().length);
  readonly answered   = computed(() => this.quiz.answers().length);
  readonly progress   = computed(() => (this.answered() / this.totalQ()) * 100);
  readonly liveScore  = computed(() => this.quiz.score());
  readonly showHint   = computed(() =>
    this.hintState() === 'hint-partial' || this.hintState() === 'hint-full'
  );
  readonly showQuestion = computed(() => this.hintState() !== 'hint-full');
  readonly hideAnswerRow = computed(() =>
    this.hintState() === 'hint-partial' ? (this.question()?.b ?? -1) : -1
  );

  constructor() {
    // If no questions generated, redirect home
    effect(() => {
      if (this.quiz.questions().length === 0) {
        this.router.navigate(['/']);
      }
    });
    // When all answers submitted, navigate to results
    effect(() => {
      if (this.quiz.isFinished()) {
        this.router.navigate(['/results']);
      }
    });
  }

  submit(): void {
    const val = this.userInput().trim();
    const parsed = parseInt(val, 10);
    const answer = isNaN(parsed) ? null : parsed;
    const correct = answer === this.question()?.answer;

    if (correct) {
      this.sound.playCorrect();
      this.flashClass.set('flash-correct');
    } else {
      this.sound.playWrong();
      this.flashClass.set('flash-wrong');
    }

    setTimeout(() => {
      this.quiz.submitAnswer(answer, this.hintUsed());
      this.userInput.set('');
      this.hintState.set('answering');
      this.hintUsed.set(false);
      this.flashClass.set('');
      setTimeout(() => this.focusInput(), 50);
    }, 700);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submit();
  }

  showPartialHint(): void {
    this.hintUsed.set(true);
    this.hintState.set('hint-partial');
  }

  showFullHint(): void {
    this.hintState.set('hint-full');
  }

  gotIt(): void {
    this.hintState.set('answering');
    setTimeout(() => this.focusInput(), 50);
  }

  private focusInput(): void {
    this.inputRef()?.nativeElement.focus();
  }
}
