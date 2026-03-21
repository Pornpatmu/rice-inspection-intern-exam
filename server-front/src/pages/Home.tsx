import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/create">
        <button>Create</button>
      </Link>
    </div>
  );
}

export default Home;