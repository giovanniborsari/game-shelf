import ConsoleRow from "../components/ConsoleRow";
import TopBar from "../components/TopBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
        <TopBar/>
        <ConsoleRow/>
    </div>

  );
}