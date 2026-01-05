import type {
  CoursePart,
  CoursePartBackground,
  CoursePartBasic,
  CoursePartGroup,
  CoursePartSpecial,
} from "../types";

interface ContentProps {
  parts: CoursePart[];
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Content = ({ parts }: ContentProps) => {
  return (
    <div>
      {parts.map((part) => {
        switch (part.kind) {
          case "basic":
            return <BasicPart key={part.name} part={part} />;
          case "group":
            return <GroupPart key={part.name} part={part} />;
          case "background":
            return <BackgroundPart key={part.name} part={part} />;
          case "special":
            return <SpecialPart key={part.name} part={part} />;
          default:
            return assertNever(part);
        }
      })}
    </div>
  );
};

interface BasicPartProps {
  part: CoursePartBasic;
}
const BasicPart = ({ part }: BasicPartProps) => {
  return (
    <p>
      <div>
        <b>
          {part.name} {part.exerciseCount}
        </b>
      </div>
      <div>
        <i>{part.description}</i>
      </div>
    </p>
  );
};

interface GroupPartProps {
  part: CoursePartGroup;
}
const GroupPart = ({ part }: GroupPartProps) => {
  return (
    <p>
      <div>
        <b>
          {part.name} {part.exerciseCount}
        </b>
      </div>
      <div>project exercises: {part.groupProjectCount}</div>
    </p>
  );
};

interface BackgroundPartProps {
  part: CoursePartBackground;
}
const BackgroundPart = ({ part }: BackgroundPartProps) => {
  return (
    <p>
      <div>
        <b>
          {part.name} {part.exerciseCount}
        </b>
      </div>
      <div>
        <i>{part.description}</i>
      </div>
      <div>background material: {part.backgroundMaterial}</div>
    </p>
  );
};

interface SpecialPartProps {
  part: CoursePartSpecial;
}
const SpecialPart = ({ part }: SpecialPartProps) => {
  return (
    <p>
      <div>
        <b>
          {part.name} {part.exerciseCount}
        </b>
      </div>
      <div>
        <i>{part.description}</i>
      </div>
      <div>required skills: {part.requirements.join(", ")}</div>
    </p>
  );
};

export default Content;
