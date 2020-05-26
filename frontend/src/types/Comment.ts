
export default interface Comment {
  id: string;
  contents: string;
  line_number: number;
  author_pseudonym: string;
  parent_id: string;
  is_author: boolean;
}