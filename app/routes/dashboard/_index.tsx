import { redirect } from "react-router"

export function loader() {
  const user = undefined;

  if (!user) {
    return redirect("/auth")
  }
  return null;
}

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home