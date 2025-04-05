import React from "react";
import useLocalStorage from "use-local-storage";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Checkbox } from "~/components/ui/checkbox";
import { CircularProgress } from "~/components/ui/circular-progress";
import { SYLLABUS } from "~/data/syllabus";

export default function NewTab() {
  const [checkedSubjects, setCheckedSubjects] = useLocalStorage<Record<string, boolean>>(
    "hsc-checked-subjects",
    {},
  );
  const [checkedChapters, setCheckedChapters] = useLocalStorage<Record<string, Record<string, boolean>>>(
    "hsc-checked-chapters",
    {},
  );

  const handleSubjectCheck = (subject: string) => {
    const newCheckedState = !checkedSubjects[subject];
    setCheckedSubjects({
      ...checkedSubjects,
      [subject]: newCheckedState,
    });

    // Update all chapters for this subject
    const chapters = Object.keys(SYLLABUS[subject as keyof typeof SYLLABUS]);
    setCheckedChapters({
      ...checkedChapters,
      [subject]: chapters.reduce((acc, chapter) => ({
        ...acc,
        [chapter]: newCheckedState,
      }), {}),
    });
  };

  const handleChapterCheck = (subject: string, chapter: string) => {
    const newChapters = {
      ...checkedChapters,
      [subject]: {
        ...checkedChapters[subject],
        [chapter]: !checkedChapters[subject]?.[chapter],
      },
    };

    setCheckedChapters(newChapters);

    // Update subject state based on chapter states
    const chapters = Object.keys(SYLLABUS[subject as keyof typeof SYLLABUS]);
    const checkedChaptersCount = chapters.filter(ch => newChapters[subject]?.[ch]).length;

    setCheckedSubjects({
      ...checkedSubjects,
      [subject]: checkedChaptersCount === chapters.length,
    });
  };

  const getSubjectState = (subject: string) => {
    const chapters = Object.keys(SYLLABUS[subject as keyof typeof SYLLABUS]);
    const checkedChaptersCount = chapters.filter(ch => checkedChapters[subject]?.[ch]).length;

    if (checkedChaptersCount === 0)
      return false;
    if (checkedChaptersCount === chapters.length)
      return true;
    return "indeterminate";
  };

  const getSubjectProgress = (subject: string) => {
    const chapters = Object.keys(SYLLABUS[subject as keyof typeof SYLLABUS]);
    const checkedChaptersCount = chapters.filter(ch => checkedChapters[subject]?.[ch]).length;
    return Math.round((checkedChaptersCount / chapters.length) * 100);
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <div>
        <Accordion type="multiple" className="w-full grid grid-cols-3 gap-x-8 gap-y-2">
          {Object.keys(SYLLABUS).map(subject => (
            <SubjectCard
              key={subject}
              subject={subject}
              isChecked={getSubjectState(subject)}
              onCheck={() => handleSubjectCheck(subject)}
              checkedChapters={checkedChapters[subject] || {}}
              onChapterCheck={chapter => handleChapterCheck(subject, chapter)}
              progress={getSubjectProgress(subject)}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  isChecked,
  onCheck,
  checkedChapters,
  onChapterCheck,
  progress,
}: {
  subject: string;
  isChecked: boolean | "indeterminate";
  onCheck: () => void;
  checkedChapters: Record<string, boolean>;
  onChapterCheck: (chapter: string) => void;
  progress: number;
}) {
  return (
    <AccordionItem
      value={subject}
      key={subject}
      className="py-2"
    >
      <AccordionTrigger className="w-[300px] flex items-center">
        <div className="flex items-center gap-4 flex-1">
          <Checkbox
            checked={isChecked === true}
            onCheckedChange={onCheck}
            ref={(node: HTMLButtonElement | null) => {
              if (node) {
                (node as any).indeterminate = isChecked === "indeterminate";
              }
            }}
          />
          <h2>{subject}</h2>
        </div>
        <div className="flex items-center gap-2 mr-2">
          <CircularProgress value={progress} />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {Object.keys(SYLLABUS[subject as keyof typeof SYLLABUS]).map(chapter => (
          <div key={chapter} className="flex items-center gap-2 py-1">
            <Checkbox
              checked={checkedChapters[chapter]}
              onCheckedChange={() => onChapterCheck(chapter)}
            />
            <span>{chapter}</span>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
