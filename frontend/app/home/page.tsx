import ConsoleRow from "../components/ConsoleRow";
import GenreRow from "../components/GenreRow";
import TopBar from "../components/TopBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
        <TopBar/>
        <ConsoleRow/>
        <GenreRow/>
        <GenreRow/>
    </div>

  );
}