import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <main className=" h-screen flex ">
      <NavigationBar />
      <div>
        <Dashboard />
      </div>
    </main>
  );
}

export default App;
