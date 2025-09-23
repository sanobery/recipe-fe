type GreetingProps = {
  name: string;
};

export default function Greetings({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}
