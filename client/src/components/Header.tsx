import { Badge, Container, Image, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IUser } from "../types";

interface HeaderProps {
  loading: boolean;
  user: IUser | undefined;
}

export default function Header(props: HeaderProps) {
  const { loading, user } = props;
  return (
    <header className="header">
      <Navbar bg="dark" variant="dark">
        {/* vertically centered */}
        <Container>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Navbar.Brand>
              <img
                alt=""
                src="/logo.png"
                width="40"
                height="40"
                className="d-inline-block align-top"
              />{" "}
              <Badge className="align-middle">Predictions Contest</Badge>
            </Navbar.Brand>
          </Link>
          <Nav className="me-auto">
            {user?.admin && (
              <Nav.Link as={Link} to="/admin">
                Admin
              </Nav.Link>
            )}
            <Nav.Link href="https://github.com/NicholasBottone/PredictionsContest">
              GitHub
            </Nav.Link>
          </Nav>
          <Nav className="mr-auto">
            {loading ? (
              <Navbar.Text>Loading...</Navbar.Text>
            ) : (
              <Profile user={user} />
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}

function Profile({ user }: { user?: IUser }) {
  if (user) {
    return <Image src={user?.avatar} roundedCircle width="40" height="40" />;
  }
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return <Nav.Link href={`${apiUrl}/auth/login`}>Login</Nav.Link>;
}
