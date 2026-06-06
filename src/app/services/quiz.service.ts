import { Injectable, signal, computed } from '@angular/core';
import { Question, Answer } from '../models/question.model';

const TOTAL_QUESTIONS = 10;
const MIN_FACTOR = 2;
const MAX_FACTOR = 10;

@Injectable({ providedIn: 'root' })
export class QuizService {
  readonly questions = signal<Question[]>([]);
  readonly currentIndex = signal<number>(0);
  readonly answers = signal<Answer[]>([]);
  readonly isFinished = computed(() => this.answers().length === TOTAL_QUESTIONS);
  readonly score = computed(() => this.answers().filter(a => a.correct).length);
  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()]);

  generateQuestions(): void {
    const qs: Question[] = [];
    const used = new Set<string>();

    while (qs.length < TOTAL_QUESTIONS) {
      const a = this.rand(MIN_FACTOR, MAX_FACTOR);
      const b = this.rand(MIN_FACTOR, MAX_FACTOR);
      const key = `${a}x${b}`;
      if (!used.has(key)) {
        used.add(key);
        qs.push({ a, b, answer: a * b });
      }
    }

    this.questions.set(qs);
    this.currentIndex.set(0);
    this.answers.set([]);
  }

  submitAnswer(userAnswer: number | null, hintUsed: boolean): void {
    const q = this.currentQuestion();
    if (!q) return;

    const correct = userAnswer === q.answer;
    this.answers.update(prev => [...prev, { question: q, userAnswer, correct, hintUsed }]);
    this.currentIndex.update(i => i + 1);
  }

  reset(): void {
    this.questions.set([]);
    this.currentIndex.set(0);
    this.answers.set([]);
  }

  private rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
