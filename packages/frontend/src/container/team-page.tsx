import { TeamForm, TeamList } from "../components";

export const TeamPage = () => {
  return (
    <div className="h-full bg-gray-800 flex items-center overflow-hidden flex-col">
      <TeamForm />
      <TeamList />
    </div>
  );
};
