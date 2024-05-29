interface Option{
  optionName:string,
  isCorrect:boolean
}

export interface QuestionData{
    questionName: string;
    difficultyId: number;
    options: Option[];
}