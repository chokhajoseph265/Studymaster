export * from './form1Topics';
export * from './form1NotesPart1';
export * from './form1NotesPart2';
export * from './form1LessonsAndQuizzes';
export * from './form1Diagrams';

import { FORM_1_CHEMISTRY_NOTES_PART_1 } from './form1NotesPart1';
import { FORM_1_CHEMISTRY_NOTES_PART_2 } from './form1NotesPart2';

export const ALL_FORM_1_CHEMISTRY_NOTES = [
  ...FORM_1_CHEMISTRY_NOTES_PART_1,
  ...FORM_1_CHEMISTRY_NOTES_PART_2
];
