const Header = ({ name }) => <h2>{name}</h2>

const Total = ({ exercises }) => {
  const totalExcercises = exercises.reduce(
    (accumulator, currentvalue) => accumulator + currentvalue.exercises,
    0
  );
  return (
    <p>total of {totalExcercises} excercises</p>
  )
}

const Part = ({ part }) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part => {
        return (
          <Part key={part.id} part={part} />
        )
      })
      }
    </>
  )
}

const Course = ({ course }) => 
  <>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total exercises={course.parts} />
  </>

export default Course