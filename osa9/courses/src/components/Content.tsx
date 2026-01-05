import type { CoursePart } from "../types";

interface ContentProps {
  parts: CoursePart[];
}

const Content = ({ parts }: ContentProps) => {
  return (
    <div>
      {parts.map((part) => (
        <Part
          key={part.name}
          name={part.name}
          exerciseCount={part.exerciseCount}
        />
      ))}
    </div>
  );
};

const Part = ({ name, exerciseCount }: CoursePart) => {
  return (
    <p>
      {name} {exerciseCount}
    </p>
  );
};

export default Content;
