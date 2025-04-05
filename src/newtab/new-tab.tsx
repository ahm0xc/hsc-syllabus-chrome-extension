import React from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { SYLLABUS } from "~/data/syllabus";

export default function NewTab() {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <div>
        <Accordion type="single" collapsible className="w-full grid grid-cols-3 gap-x-8 gap-y-2">
          {Object.keys(SYLLABUS).map(subject => (
            <SubjectCard
              key={subject}
              subject={subject}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
}: {
  subject: string;
}) {
  return (
    <AccordionItem
      value={subject}
      key={subject}
      className="py-2"
    >
      <AccordionTrigger className="w-[300px] flex items-center justify-between">
        <h2 className="">{subject}</h2>
      </AccordionTrigger>
      <AccordionContent>
        {Object.keys(SYLLABUS[subject as keyof typeof SYLLABUS]).map(chapter => (
          <div key={chapter}>{chapter}</div>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
