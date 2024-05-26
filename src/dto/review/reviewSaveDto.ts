export class ReviewSaveDto {
  text?: string;
  book_id?: string;

  constructor(data: Partial<ReviewSaveDto>) {
    this.text = data.text;
    this.book_id = data.book_id;
  }
}
