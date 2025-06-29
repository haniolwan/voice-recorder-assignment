import HomeLayout from "../components/HomeLayout";
import RecordingsList from "../components/RecordingsList";

const Recordings = () => {
  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center p-4 sm:ml-64">
        <h1 className="text-3xl text-gray-900 font-semibold mb-8">
          Recordings
        </h1>
        <RecordingsList />
      </div>
    </HomeLayout>
  );
};
export default Recordings;
