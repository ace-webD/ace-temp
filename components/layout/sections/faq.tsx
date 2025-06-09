import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Who can join the Association of Computing Engineers?",
    answer: "ACE is open to 1st,2nd and 3rd year students enrolled in the School of Computing.",
    value: "item-1",
  },
  {
    question: "Do I need to have prior experience in computing to join ACE?",
    answer:
      "Not at all! ACE welcomes members from all levels of expertise, from beginners to advanced users. Our events and activities are designed to accommodate a diverse range of backgrounds and interests in computing.",
    value: "item-2",
  },
  {
    question:
      "What are the benefits of joining ACE?",
    answer:
      "By joining ACE, you will have access to a supportive community of peers who share your passion for computing. You will also have opportunities to network with industry professionals, enhance your skills and participate in hands-on learning experiences.",
    value: "item-3",
  },
  {
    question: "Can I be a part of more than one cluster?",
    answer: "Yes. If your eligibility proves that you can be a part of multiple clusters at a time then you are very much welcome. Make sure your work is spontaneous and on-time.",
    value: "item-4",
  },
  {
    question:
      "How often do ACE members meet?",
    answer: "Regular meetings are held, either weekly or once in 2 weeks. In case of upcoming events being planned, meetings become more often than usual. It can be both online and offline and all members are expected to attend the meeting without fail.",
    value: "item-5",
  },
  {
    question:
      "What activities will I be involved in as a member of the Technical Cluster?",
    answer: "Members organise and lead workshops and seminars, plan and execute hackathons, coding contests, contribute to ACE’s official website and research and provide content on any technical trends or developments for social media.",
    value: "item-6",
  },
  {
    question:
      "Are there opportunities for leadership within the clusters?",
    answer: "Certainly! The leaderships roles are assigned based on the members’ experience, contribution and interest. This can mark an outstanding place in your resume in future.",
    value: "item-7",
  },
  {
    question:
      "Can I suggest ideas for events or initiatives to ACE?",
    answer: "Yes. ACE values input from its members and welcomes suggestions. If you have an idea on organizing an event, the clusters will collaborate and work together for progress",
    value: "item-8",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          FAQS
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Common Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
