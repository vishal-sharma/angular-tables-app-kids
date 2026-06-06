export interface Question {
  a: number;
  b: number;
  answer: number;
}

export interface Answer {
  question: Question;
  userAnswer: number | null;
  correct: boolean;
  hintUsed: boolean;
}
