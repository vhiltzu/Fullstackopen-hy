import Header from "../Header";
import Content from "./Course/Content";
import Total from "./Course/Total";

const Course = (props) => {
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total parts={props.course.parts} />
    </div>
  );
};

export default Course;

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => (
        <Part key={part.id} part={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Total = (props) => {
  // Calculate the total number of exercises
  const sum = (sum, part) => {
    return sum + part.exercises;
  };

  const total = props.parts.reduce(sum, 0);

  return (
    <p>
      <b>total of {total} exercises</b>
    </p>
  );
};

export { Header, Content, Part, Total };
