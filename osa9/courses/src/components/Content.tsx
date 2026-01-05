interface CoursePartProps {
  name: string;
  exerciseCount: number;
}

interface ContentProps {
  parts: CoursePartProps[];
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

const Part = ({ name, exerciseCount }: CoursePartProps) => {
  return (
    <p>
      {name} {exerciseCount}
    </p>
  );
};

export default Content;
