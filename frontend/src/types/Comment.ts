
export default interface Comment {
  id: string;
  contents: string;
  line_number: string;
  file_path: string;
  author_pseudonym: string;
  parent_id: string;
}