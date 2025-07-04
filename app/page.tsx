import AudioRecorder from "./components/AudioRecorder";
import HomeLayout from "./components/HomeLayout";

const Home = () => {
  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center p-4 sm:ml-64">
        <h1 className="text-3xl text-gray-900 font-semibold mb-8">
          Media Recorder
        </h1>
        <AudioRecorder />
      </div>
    </HomeLayout>
  );
};
export default Home;
